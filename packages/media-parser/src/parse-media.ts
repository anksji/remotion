import type {BufferIterator} from './buffer-iterator';
import {getArrayBufferIterator} from './buffer-iterator';
import {emitAvailableInfo} from './emit-available-info';
import {getFieldsFromCallback} from './get-fields-from-callbacks';
import {getAvailableInfo, hasAllInfo} from './has-all-info';
import {Log} from './log';
import type {
	AllParseMediaFields,
	InternalParseMedia,
	InternalParseMediaOptions,
	Options,
	ParseMedia,
	ParseMediaCallbacks,
	ParseMediaFields,
	ParseMediaResult,
} from './options';
import type {ParseResult} from './parse-result';
import {performSeek} from './perform-seek';
import {fetchReader} from './readers/from-fetch';
import {runParseIteration} from './run-parse-iteration';
import {makeParserState} from './state/parser-state';
import {throttledStateUpdate} from './throttled-progress';

const internalParseMedia: InternalParseMedia = async function <
	F extends Options<ParseMediaFields>,
>({
	src,
	fields: _fieldsInReturnValue,
	reader,
	onAudioTrack,
	onVideoTrack,
	signal,
	logLevel,
	onParseProgress: onParseProgressDoNotCallDirectly,
	progressIntervalInMs,
	...more
}: InternalParseMediaOptions<F>) {
	let parseResult: ParseResult | null = null;

	const fieldsInReturnValue = _fieldsInReturnValue ?? {};

	const fields = getFieldsFromCallback({
		fields: fieldsInReturnValue,
		callbacks: more,
	});

	const {
		reader: readerInstance,
		contentLength,
		name,
		contentType,
		supportsContentRange: readerSupportsContentRange,
	} = await reader.read(src, null, signal);
	const iterator: BufferIterator = getArrayBufferIterator(
		new Uint8Array([]),
		contentLength ?? 1_000_000_000,
	);

	if (contentLength === null) {
		throw new Error(
			'Media was passed with no content length. This is currently not supported. Ensure the media has a "Content-Length" HTTP header.',
		);
	}

	const supportsContentRange =
		readerSupportsContentRange &&
		!(
			typeof process !== 'undefined' &&
			typeof process.env !== 'undefined' &&
			process.env.DISABLE_CONTENT_RANGE === 'true'
		);
	const hasAudioTrackHandlers = Boolean(onAudioTrack);
	const hasVideoTrackHandlers = Boolean(onVideoTrack);

	if (
		!hasAudioTrackHandlers &&
		!hasVideoTrackHandlers &&
		Object.values(fields).every((v) => !v)
	) {
		Log.warn(
			logLevel,
			new Error(
				'Warning - No `fields` and no `on*` callbacks were passed to `parseMedia()`. Specify the data you would like to retrieve.',
			),
		);
	}

	let timeIterating = 0;
	let timeReadingData = 0;
	let timeSeeking = 0;
	let timeCheckingIfDone = 0;
	let timeFreeingData = 0;

	const state = makeParserState({
		hasAudioTrackHandlers,
		hasVideoTrackHandlers,
		signal,
		iterator,
		fields,
		onAudioTrack: onAudioTrack ?? null,
		onVideoTrack: onVideoTrack ?? null,
		supportsContentRange,
		contentLength,
		logLevel,
	});

	let currentReader = readerInstance;

	const returnValue = {} as ParseMediaResult<AllParseMediaFields>;
	const moreFields = more as ParseMediaCallbacks;

	const throttledState = throttledStateUpdate({
		updateFn: onParseProgressDoNotCallDirectly ?? null,
		everyMilliseconds: progressIntervalInMs ?? 100,
		signal,
		totalBytes: contentLength,
	});

	const triggerInfoEmit = () => {
		const availableInfo = getAvailableInfo({
			fieldsToFetch: fields,
			state,
		});
		emitAvailableInfo({
			hasInfo: availableInfo,
			callbacks: moreFields,
			fieldsInReturnValue,
			state,
			returnValue,
			contentLength,
			name,
			mimeType: contentType,
		});
	};

	const checkIfDone = () => {
		const startCheck = Date.now();
		const hasAll = hasAllInfo({
			fields,
			state,
		});
		timeCheckingIfDone += Date.now() - startCheck;

		if (hasAll) {
			Log.verbose(logLevel, 'Got all info, skipping to the end.');
			if (contentLength !== null) {
				state.increaseSkippedBytes(
					contentLength - iterator.counter.getOffset(),
				);
			}

			return true;
		}

		if (iterator.counter.getOffset() === contentLength) {
			Log.verbose(logLevel, 'Reached end of file');
			return true;
		}

		return false;
	};

	triggerInfoEmit();

	let iterationWithThisOffset = 0;
	while (!checkIfDone()) {
		if (signal?.aborted) {
			throw new Error('Aborted');
		}

		const offsetBefore = iterator.counter.getOffset();

		const fetchMoreData = async () => {
			const result = await currentReader.reader.read();
			if (result.value) {
				iterator.addData(result.value);
			}

			return result.done;
		};

		const readStart = Date.now();
		while (iterator.bytesRemaining() < 0) {
			const done = await fetchMoreData();
			if (done) {
				break;
			}
		}

		await state.eventLoop.eventLoopBreakIfNeeded();

		const hasBigBuffer = iterator.bytesRemaining() > 100_000;

		if (iterationWithThisOffset > 0 || !hasBigBuffer) {
			await fetchMoreData();
		}

		timeReadingData += Date.now() - readStart;

		throttledState.update?.(() => ({
			bytes: iterator.counter.getOffset(),
			percentage: contentLength
				? iterator.counter.getOffset() / contentLength
				: null,
			totalBytes: contentLength,
		}));

		triggerInfoEmit();

		if (iterationWithThisOffset > 300) {
			throw new Error(
				'Infinite loop detected. The parser is not progressing. This is likely a bug in the parser.',
			);
		}

		Log.trace(
			logLevel,
			`Continuing parsing of file, currently at position ${iterator.counter.getOffset()}/${contentLength} (0x${iterator.counter.getOffset().toString(16)})`,
		);
		const start = Date.now();
		parseResult = await runParseIteration({
			state,
			mimeType: contentType,
			contentLength,
			name,
		});
		timeIterating += Date.now() - start;

		if (parseResult.skipTo !== null) {
			state.increaseSkippedBytes(
				parseResult.skipTo - iterator.counter.getOffset(),
			);
		}

		if (parseResult.skipTo !== null) {
			if (parseResult.skipTo === contentLength) {
				Log.verbose(logLevel, 'Skipped to end of file, not fetching.');
				break;
			}

			const seekStart = Date.now();
			currentReader = await performSeek({
				iterator,
				seekTo: parseResult.skipTo,
				supportsContentRange,
				currentReader,
				logLevel,
				readerInterface: reader,
				signal,
				src,
				contentLength,
			});
			timeSeeking += Date.now() - seekStart;
		}

		const didProgress = iterator.counter.getOffset() > offsetBefore;
		if (!didProgress) {
			iterationWithThisOffset++;
		}

		const timeFreeStart = Date.now();
		const bytesRemoved = iterator.removeBytesRead(false);
		if (bytesRemoved) {
			Log.verbose(logLevel, `Freed ${bytesRemoved} bytes`);
		}

		timeFreeingData += Date.now() - timeFreeStart;
	}

	Log.verbose(logLevel, 'Finished parsing file');

	// Force assign
	emitAvailableInfo({
		hasInfo: (
			Object.keys(fields) as (keyof Options<ParseMediaFields>)[]
		).reduce(
			(acc, key) => {
				if (fields?.[key]) {
					acc[key] = true;
				}

				return acc;
			},
			{} as Record<keyof Options<ParseMediaFields>, boolean>,
		),
		callbacks: moreFields,
		fieldsInReturnValue,
		state,
		returnValue,
		contentLength,
		mimeType: contentType,
		name,
	});

	Log.verbose(logLevel, `Time iterating over file: ${timeIterating}ms`);
	Log.verbose(logLevel, `Time fetching data: ${timeReadingData}ms`);
	Log.verbose(logLevel, `Time seeking: ${timeSeeking}ms`);
	Log.verbose(logLevel, `Time checking if done: ${timeCheckingIfDone}ms`);
	Log.verbose(logLevel, `Time freeing data: ${timeFreeingData}ms`);

	currentReader.abort();
	iterator?.destroy();

	state.callbacks.tracks.ensureHasTracksAtEnd(fields);
	return returnValue as ParseMediaResult<F>;
};

export const parseMedia: ParseMedia = (options) => {
	return internalParseMedia({
		fields: options.fields ?? null,
		logLevel: options.logLevel ?? 'info',
		onAudioCodec: options.onAudioCodec ?? null,
		onAudioTrack: options.onAudioTrack ?? null,
		onContainer: options.onContainer ?? null,
		onDimensions: options.onDimensions ?? null,
		onDurationInSeconds: options.onDurationInSeconds ?? null,
		onFps: options.onFps ?? null,
		onImages: options.onImages ?? null,
		onInternalStats: options.onInternalStats ?? null,
		onIsHdr: options.onIsHdr ?? null,
		onKeyframes: options.onKeyframes ?? null,
		onLocation: options.onLocation ?? null,
		onMetadata: options.onMetadata ?? null,
		onMimeType: options.onMimeType ?? null,
		onName: options.onName ?? null,
		onNumberOfAudioChannels: options.onNumberOfAudioChannels ?? null,
		onParseProgress: options.onParseProgress ?? null,
		onRotation: options.onRotation ?? null,
		onSampleRate: options.onSampleRate ?? null,
		onSize: options.onSize ?? null,
		onSlowAudioBitrate: options.onSlowAudioBitrate ?? null,
		onSlowDurationInSeconds: options.onSlowDurationInSeconds ?? null,
		onSlowFps: options.onSlowFps ?? null,
		onSlowKeyframes: options.onSlowKeyframes ?? null,
		onSlowNumberOfFrames: options.onSlowNumberOfFrames ?? null,
		onSlowVideoBitrate: options.onSlowVideoBitrate ?? null,
		onStructure: options.onStructure ?? null,
		onTracks: options.onTracks ?? null,
		onUnrotatedDimensions: options.onUnrotatedDimensions ?? null,
		onVideoCodec: options.onVideoCodec ?? null,
		onVideoTrack: options.onVideoTrack ?? null,
		progressIntervalInMs: options.progressIntervalInMs ?? null,
		reader: options.reader ?? fetchReader,
		signal: options.signal ?? undefined,
		src: options.src,
	});
};
