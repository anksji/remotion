use std::io::ErrorKind;

use ffmpeg_next::Rational;
use remotionffmpeg::{
    format::Pixel,
    frame::Video,
    media::Type,
    software::scaling::{Context, Flags},
};
extern crate ffmpeg_next as remotionffmpeg;

use crate::{
    errors::PossibleErrors,
    frame_cache::{FrameCache, FrameCacheItem},
    global_printer::_print_debug,
};

pub struct OpenedVideo {
    pub stream_index: usize,
    pub time_base: Rational,
    pub width: u32,
    pub height: u32,
    pub format: Pixel,
    pub video: remotionffmpeg::codec::decoder::Video,
    pub src: String,
    pub input: remotionffmpeg::format::context::Input,
    pub last_seek: i64,
    pub frame_cache: FrameCache,
}

impl OpenedVideo {
    pub fn get_frame(&mut self, time: f64) -> Result<Vec<u8>, PossibleErrors> {
        let frame_cache_item = self.frame_cache.get_item(time as i64);
        if frame_cache_item.is_some() {
            return scale_and_make_bitmap(
                // TODO: Clone is avoidable
                frame_cache_item.unwrap().frame.clone(),
                self.format,
                self.width,
                self.height,
            );
        }

        let position = (time as f64 * self.time_base.1 as f64 / self.time_base.0 as f64) as i64;
        let min_position =
            ((time as f64 - 1.0) * self.time_base.1 as f64 / self.time_base.0 as f64) as i64;

        if position < self.last_seek || self.last_seek < min_position {
            if (self.last_seek - position) > 0 {
                _print_debug(&format!("Seeking from {} to {}", self.last_seek, position))?;
            }
            self.input.seek(
                self.stream_index as i32,
                min_position,
                position,
                position,
                0,
            )?;
        }

        let mut frame = Video::empty();

        loop {
            let (stream, packet) = match self.input.get_next_packet() {
                None => {
                    if !is_frame_empty(&mut frame) {
                        self.frame_cache.add_item(FrameCacheItem {
                            time: self.last_seek,
                            frame: frame.clone(),
                            has_next: false,
                            next_time: 0,
                        });
                    }

                    break;
                }
                Some(packet) => packet,
            };
            if stream.parameters().medium() != Type::Video {
                continue;
            }

            let timestamp = packet.dts().unwrap();

            self.frame_cache.add_item(FrameCacheItem {
                time: self.last_seek,
                frame: frame.clone(),
                has_next: true,
                next_time: timestamp,
            });

            // -1 because uf 67 and we want to process 66.66 -> rounding error
            if (timestamp - 1) > position {
                break;
            }
            loop {
                self.video.send_packet(&packet)?;
                let res = self.video.receive_frame(&mut frame);

                match res {
                    Err(err) => {
                        if err.to_string().contains("Resource temporarily unavailable") {
                            // Need to send another packet
                        } else {
                            Err(std::io::Error::new(ErrorKind::Other, err.to_string()))?
                        }
                    }
                    Ok(_) => {
                        self.last_seek = timestamp;
                        break;
                    }
                }
            }
        }
        if is_frame_empty(&mut frame) {
            return Err(std::io::Error::new(ErrorKind::Other, "No frame was found"))?;
        }

        scale_and_make_bitmap(frame, self.format, self.width, self.height)
    }
}

pub fn scale_and_make_bitmap(
    frame: Video,
    format: Pixel,
    width: u32,
    height: u32,
) -> Result<Vec<u8>, PossibleErrors> {
    let start_time = std::time::Instant::now();
    let mut scaler = Context::get(
        format,
        width,
        height,
        Pixel::BGR24,
        width,
        height,
        Flags::BILINEAR,
    )?;

    let planes = frame.planes();
    let output_planes = Vec::new();
    for i in 0..planes {
        let mut buffer = vec![0_u8; (frame.width() * frame.height() * 3).try_into()?];
        output_planes.push(buffer.as_mut_ptr());
    }

    let output_stride = width * 3;

    unsafe {
        scaler.run(
            (*frame.as_ptr()).data.as_ptr(),
            (*frame.as_ptr()).linesize.as_ptr(),
            output_planes.as_ptr(),
            (width * 3).try_into().unwrap(),
            (height).try_into().unwrap(),
        )?;
    }

    let bmp = create_bmp_image_from_frame(
        width,
        height,
        (output_stride).try_into().unwrap(),
        &output_planes,
    );
    _print_debug(&format!(
        "Scaling and making bitmap took {} microsseconds",
        start_time.elapsed().as_micros()
    ))?;
    return Ok(bmp);
}

pub fn open_video(src: &str) -> Result<OpenedVideo, PossibleErrors> {
    let mut input = remotionffmpeg::format::input(&src)?;
    let stream_index = input
        .streams_mut()
        .find(|s| s.parameters().medium() == Type::Video)
        .unwrap()
        .index();

    let mut_stream = input.stream_mut(stream_index).unwrap();
    let time_base = mut_stream.time_base();
    let parameters = mut_stream.parameters();

    let context_decoder = remotionffmpeg::codec::context::Context::from_parameters(parameters)?;
    let video = context_decoder.decoder().video()?;

    let format = video.format();
    let width = video.width();
    let height = video.height();

    let opened_video = OpenedVideo {
        stream_index,
        time_base,
        width,
        height,
        format,
        video,
        src: src.to_string(),
        input,
        last_seek: 0,
        frame_cache: FrameCache::new(),
    };

    Ok(opened_video)
}

fn is_frame_empty(frame: &mut Video) -> bool {
    unsafe {
        if frame.is_empty() {
            return true;
        }
    }
    return false;
}

fn create_bmp_image_from_frame(width: u32, height: u32, stride: usize, data: &[u8]) -> Vec<u8> {
    let row_size = (width * 3 + 3) & !3;
    let row_padding = row_size - width * 3;
    let image_size = row_size * height;
    let header_size = 54;

    let mut bmp_data = Vec::with_capacity(header_size as usize + image_size as usize);

    bmp_data.extend_from_slice(b"BM");
    bmp_data.extend(&(header_size + image_size).to_le_bytes());
    bmp_data.extend(&0u16.to_le_bytes());
    bmp_data.extend(&0u16.to_le_bytes());
    bmp_data.extend(&header_size.to_le_bytes());

    bmp_data.extend(&40u32.to_le_bytes());
    bmp_data.extend(&width.to_le_bytes());
    bmp_data.extend(&height.to_le_bytes());
    bmp_data.extend(&1u16.to_le_bytes());
    bmp_data.extend(&24u16.to_le_bytes());
    bmp_data.extend(&0u32.to_le_bytes());
    bmp_data.extend(&image_size.to_le_bytes());
    bmp_data.extend(&2835u32.to_le_bytes());
    bmp_data.extend(&2835u32.to_le_bytes());
    bmp_data.extend(&0u32.to_le_bytes());
    bmp_data.extend(&0u32.to_le_bytes());

    for y in (0..height).rev() {
        let row_start = (y as usize) * stride;
        let row_end = row_start + (width * 3) as usize;
        bmp_data.extend_from_slice(&data[row_start..row_end]);
        for _ in 0..row_padding {
            bmp_data.push(0);
        }
    }

    bmp_data
}
