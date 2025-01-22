/**
 * Copyright (c) 2025 Remotion AG
 * For licensing, see: https://remotion.dev/docs/webcodecs#license
 */

import type {
	AudioTrack,
	LogLevel,
	OnAudioTrack,
	Options,
	ParseMediaFields,
	ParseMediaOptions,
	VideoTrack,
	WriterInterface,
} from '@remotion/media-parser';
import {parseMedia, type OnVideoTrack} from '@remotion/media-parser';

import type {ParseMediaCallbacks} from '@remotion/media-parser';
import {autoSelectWriter} from './auto-select-writer';
import {calculateProgress} from './calculate-progress';
import {makeProgressTracker} from './create/progress-tracker';
import {withResolversAndWaitForReturn} from './create/with-resolvers';
import Error from './error-cause';
import {generateOutputFilename} from './generate-output-filename';
import type {ConvertMediaAudioCodec} from './get-available-audio-codecs';
import {
	availableContainers,
	type ConvertMediaContainer,
} from './get-available-containers';
import {
	availableVideoCodecs,
	type ConvertMediaVideoCodec,
} from './get-available-video-codecs';
import {Log} from './log';
import {makeAudioTrackHandler} from './on-audio-track';
import {type ConvertMediaOnAudioTrackHandler} from './on-audio-track-handler';
import {makeVideoTrackHandler} from './on-video-track';
import {type ConvertMediaOnVideoTrackHandler} from './on-video-track-handler';
import type {ResizeOperation} from './resizing/mode';
import {selectContainerCreator} from './select-container-creator';
import {sendUsageEvent} from './send-telemetry-event';
import {throttledStateUpdate} from './throttled-state-update';

export type ConvertMediaProgress = {
	decodedVideoFrames: number;
	decodedAudioFrames: number;
	encodedVideoFrames: number;
	encodedAudioFrames: number;
	bytesWritten: number;
	millisecondsWritten: number;
	expectedOutputDurationInMs: number | null;
	overallProgress: number | null;
};

export type ConvertMediaResult = {
	save: () => Promise<Blob>;
	remove: () => Promise<void>;
	finalState: ConvertMediaProgress;
};

export type ConvertMediaOnProgress = (state: ConvertMediaProgress) => void;
export type ConvertMediaOnVideoFrame = (options: {
	frame: VideoFrame;
	track: VideoTrack;
}) => Promise<VideoFrame> | VideoFrame;
export type ConvertMediaOnAudioData = (options: {
	audioData: AudioData;
	track: AudioTrack;
}) => Promise<AudioData> | AudioData;

export const convertMedia = async function <
	F extends Options<ParseMediaFields>,
>({
	src,
	onVideoFrame,
	onAudioData,
	onProgress: onProgressDoNotCallDirectly,
	audioCodec,
	container,
	videoCodec,
	signal: userPassedAbortSignal,
	onAudioTrack: userAudioResolver,
	onVideoTrack: userVideoResolver,
	reader,
	fields,
	logLevel = 'info',
	writer,
	progressIntervalInMs,
	rotate,
	apiKey,
	resize,
	...more
}: {
	src: ParseMediaOptions<F>['src'];
	container: ConvertMediaContainer;
	onVideoFrame?: ConvertMediaOnVideoFrame;
	onAudioData?: ConvertMediaOnAudioData;
	onProgress?: ConvertMediaOnProgress;
	videoCodec?: ConvertMediaVideoCodec;
	audioCodec?: ConvertMediaAudioCodec;
	signal?: AbortSignal;
	onAudioTrack?: ConvertMediaOnAudioTrackHandler;
	onVideoTrack?: ConvertMediaOnVideoTrackHandler;
	reader?: ParseMediaOptions<F>['reader'];
	logLevel?: LogLevel;
	writer?: WriterInterface;
	progressIntervalInMs?: number;
	rotate?: number;
	resize?: ResizeOperation;
	apiKey?: string | null;
	fields?: F;
} & ParseMediaCallbacks): Promise<ConvertMediaResult> {
	if (userPassedAbortSignal?.aborted) {
		return Promise.reject(new Error('Aborted'));
	}

	if (container !== 'webm' && availableContainers.indexOf(container) === -1) {
		return Promise.reject(
			new TypeError(
				`Only the following values for "container" are supported currently: ${JSON.stringify(availableContainers)}`,
			),
		);
	}

	if (videoCodec && availableVideoCodecs.indexOf(videoCodec) === -1) {
		return Promise.reject(
			new TypeError(
				`Only the following values for "videoCodec" are supported currently: ${JSON.stringify(availableVideoCodecs)}`,
			),
		);
	}

	const {resolve, reject, getPromiseToImmediatelyReturn} =
		withResolversAndWaitForReturn<ConvertMediaResult>();
	const controller = new AbortController();

	const abortConversion = (errCause: Error) => {
		reject(errCause);

		if (!controller.signal.aborted) {
			controller.abort();
		}
	};

	const onUserAbort = () => {
		abortConversion(new Error('Conversion aborted by user'));
	};

	userPassedAbortSignal?.addEventListener('abort', onUserAbort);

	const creator = selectContainerCreator(container);

	const throttledState = throttledStateUpdate({
		updateFn: onProgressDoNotCallDirectly ?? null,
		everyMilliseconds: progressIntervalInMs ?? 100,
		signal: controller.signal,
	});

	const progressTracker = makeProgressTracker();

	const state = await creator({
		filename: generateOutputFilename(src, container),
		writer: await autoSelectWriter(writer, logLevel),
		onBytesProgress: (bytesWritten) => {
			throttledState.update?.((prevState) => {
				return {
					...prevState,
					bytesWritten,
				};
			});
		},
		onMillisecondsProgress: (millisecondsWritten) => {
			throttledState.update?.((prevState) => {
				if (millisecondsWritten > prevState.millisecondsWritten) {
					return {
						...prevState,
						millisecondsWritten,
						overallProgress: calculateProgress({
							millisecondsWritten: prevState.millisecondsWritten,
							expectedOutputDurationInMs: prevState.expectedOutputDurationInMs,
						}),
					};
				}

				return prevState;
			});
		},
		logLevel,
		progressTracker,
	});

	const onVideoTrack: OnVideoTrack = makeVideoTrackHandler({
		state,
		onVideoFrame: onVideoFrame ?? null,
		onMediaStateUpdate: throttledState.update ?? null,
		abortConversion,
		controller,
		defaultVideoCodec: videoCodec ?? null,
		onVideoTrack: userVideoResolver ?? null,
		logLevel,
		outputContainer: container,
		rotate: rotate ?? 0,
		progress: progressTracker,
		resizeOperation: resize ?? null,
	});

	const onAudioTrack: OnAudioTrack = makeAudioTrackHandler({
		abortConversion,
		defaultAudioCodec: audioCodec ?? null,
		controller,
		onMediaStateUpdate: throttledState.update ?? null,
		state,
		onAudioTrack: userAudioResolver ?? null,
		logLevel,
		outputContainer: container,
		progressTracker,
		onAudioData: onAudioData ?? null,
	});

	parseMedia({
		logLevel,
		src,
		onVideoTrack,
		onAudioTrack,
		signal: controller.signal,
		fields: {
			...fields,
			durationInSeconds: true,
		},
		reader,
		...more,
		onDurationInSeconds: (durationInSeconds) => {
			if (durationInSeconds === null) {
				return null;
			}

			const casted = more as ParseMediaOptions<{
				durationInSeconds: true;
			}>;
			if (casted.onDurationInSeconds) {
				casted.onDurationInSeconds(durationInSeconds);
			}

			const expectedOutputDurationInMs = durationInSeconds * 1000;
			throttledState.update?.((prevState) => {
				return {
					...prevState,
					expectedOutputDurationInMs,
					overallProgress: calculateProgress({
						millisecondsWritten: prevState.millisecondsWritten,
						expectedOutputDurationInMs,
					}),
				};
			});
		},
	})
		.then(() => {
			return state.waitForFinish();
		})
		.then(() => {
			resolve({
				save: state.getBlob,
				remove: state.remove,
				finalState: throttledState.get(),
			});
		})
		.then(() => {
			sendUsageEvent({succeeded: true, apiKey: apiKey ?? null}).catch((err) => {
				Log.error('Failed to send usage event', err);
			});
		})
		.catch((err) => {
			sendUsageEvent({succeeded: false, apiKey: apiKey ?? null}).catch(
				(err2) => {
					Log.error('Failed to send usage event', err2);
				},
			);
			reject(err);
		})
		.finally(() => {
			throttledState.stopAndGetLastProgress();
		});

	return getPromiseToImmediatelyReturn().finally(() => {
		userPassedAbortSignal?.removeEventListener('abort', onUserAbort);
	});
};
