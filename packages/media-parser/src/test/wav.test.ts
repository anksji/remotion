import {exampleVideos} from '@remotion/example-videos';
import {expect, test} from 'bun:test';
import {parseMedia} from '../parse-media';
import {nodeReader} from '../readers/from-node';

test('wav', async () => {
	const {
		tracks,
		audioCodec,
		container,
		dimensions,
		durationInSeconds,
		fps,
		images,
		internalStats,
		isHdr,
		keyframes,
		location,
		metadata,
		mimeType,
		name,
		rotation,
		size,
		slowDurationInSeconds,
		slowFps,
		slowKeyframes,
		slowNumberOfFrames,
		structure,
		unrotatedDimensions,
		videoCodec,
	} = await parseMedia({
		src: exampleVideos.chirp,
		reader: nodeReader,
		fields: {
			tracks: true,
			audioCodec: true,
			container: true,
			dimensions: true,
			durationInSeconds: true,
			fps: true,
			images: true,
			internalStats: true,
			isHdr: true,
			keyframes: true,
			rotation: true,
			location: true,
			metadata: true,
			mimeType: true,
			name: true,
			size: true,
			slowDurationInSeconds: true,
			slowFps: true,
			slowKeyframes: true,
			slowNumberOfFrames: true,
			structure: true,
			unrotatedDimensions: true,
			videoCodec: true,
		},
	});
	expect(dimensions).toBe(null);
	expect(container).toBe('wav');
	expect(audioCodec).toBe('pcm-s32');
	expect(tracks.videoTracks).toEqual([]);
	expect(tracks.audioTracks).toEqual([
		{
			codec: 'pcm-s16',
			codecPrivate: null,
			codecWithoutConfig: 'pcm-s32',
			description: undefined,
			numberOfChannels: 1,
			sampleRate: 44100,
			timescale: 1000000,
			trackId: 0,
			trakBox: null,
			type: 'audio',
		},
	]);
	expect(durationInSeconds).toBe(30);
	expect(fps).toBe(null);
	expect(images).toEqual([]);
	expect(internalStats).toEqual({
		finalCursorOffset: 2646150,
		skippedBytes: 0,
	});
	expect(isHdr).toBe(false);
	expect(keyframes).toEqual(null);
	expect(location).toBe(null);
	expect(metadata).toEqual([
		{
			key: 'ISFT',
			trackId: null,
			value: 'Lavf60.16.100 (libsndfile-1.0.31)',
		},
	]);
	expect(mimeType).toBe(null);
	expect(name).toBe('chirp.wav');
	expect(rotation).toBe(0);
	expect(size).toBe(2646150);
	expect(slowDurationInSeconds).toBe(30);
	expect(slowFps).toBe(0);
	expect(slowKeyframes).toEqual([]);
	expect(slowNumberOfFrames).toBe(0);
	expect(structure).toEqual({
		boxes: [
			{
				fileSize: 2646142,
				type: 'wav-header',
			},
			{
				bitsPerSample: 16,
				blockAlign: 2,
				byteRate: 88200,
				numberOfChannels: 1,
				sampleRate: 44100,
				type: 'wav-fmt',
			},
			{
				dataSize: 2646000,
				type: 'wav-data',
			},
			{
				metadata: [
					{
						key: 'ISFT',
						trackId: null,
						value: 'Lavf60.16.100 (libsndfile-1.0.31)',
					},
				],
				type: 'wav-list',
			},
			{
				type: 'wav-id3',
			},
		],
		type: 'wav',
	});
	expect(unrotatedDimensions).toBe(null);
	expect(videoCodec).toBe(null);
});
