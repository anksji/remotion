import {emitAvailableInfo} from './emit-available-info';
import {getFieldsFromCallback} from './get-fields-from-callbacks';
import {getAvailableInfo, hasAllInfo} from './has-all-info';
import {Log} from './log';
import type {
	AllParseMediaFields,
	InternalParseMedia,
	InternalParseMediaOptions,
	Options,
	ParseMediaCallbacks,
	ParseMediaFields,
	ParseMediaResult,
} from './options';
import {performSeek} from './perform-seek';
import {runParseIteration} from './run-parse-iteration';
import {makeParserState} from './state/parser-state';
import {throttledStateUpdate} from './throttled-progress';

export const internalParseMedia: InternalParseMedia = async function <
	F extends Options<ParseMediaFields>,
>({
	src,
	fields: _fieldsInReturnValue,
	reader: readerInterface,
	onAudioTrack,
	onVideoTrack,
	signal,
	logLevel,
	onParseProgress: onParseProgressDoNotCallDirectly,
	progressIntervalInMs,
	mode,
	onDiscardedData,
	...more
}: InternalParseMediaOptions<F>) {
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
		supportsContentRange: assetSupportsContentRange,
	} = await readerInterface.read({src, range: null, signal});

	if (contentLength === null) {
		throw new Error(
			'Media was passed with no content length. This is currently not supported. Ensure the media has a "Content-Length" HTTP header.',
		);
	}

	const supportsContentRange =
		assetSupportsContentRange &&
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
		Object.values(fields).every((v) => !v) &&
		mode === 'query'
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
		fields,
		onAudioTrack: onAudioTrack ?? null,
		onVideoTrack: onVideoTrack ?? null,
		supportsContentRange,
		contentLength,
		logLevel,
		mode,
		readerInterface,
		src,
		onDiscardedData,
	});
	const {iterator} = state;

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
			name,
			mimeType: contentType,
		});
	};

	const checkIfDone = async () => {
		const startCheck = Date.now();
		const hasAll = hasAllInfo({
			fields,
			state,
		});
		timeCheckingIfDone += Date.now() - startCheck;

		if (hasAll && mode === 'query') {
			Log.verbose(logLevel, 'Got all info, skipping to the end.');
			if (contentLength !== null) {
				state.increaseSkippedBytes(
					contentLength - state.iterator.counter.getOffset(),
				);
			}

			return true;
		}

		if (state.iterator.counter.getOffset() === contentLength) {
			Log.verbose(logLevel, 'Reached end of file');
			await state.discardReadBytes(true);

			return true;
		}

		return false;
	};

	triggerInfoEmit();

	let iterationWithThisOffset = 0;
	while (!(await checkIfDone())) {
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

		const hasBigBuffer = iterator.bytesRemaining() > 100_000;

		if (iterationWithThisOffset > 0 || !hasBigBuffer) {
			await fetchMoreData();
		}

		await state.eventLoop.eventLoopBreakIfNeeded();

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
		const skip = await runParseIteration({
			state,
			mimeType: contentType,
			contentLength,
			name,
		});
		timeIterating += Date.now() - start;

		if (skip !== null) {
			state.increaseSkippedBytes(skip.skipTo - iterator.counter.getOffset());
			if (skip.skipTo === contentLength) {
				Log.verbose(logLevel, 'Skipped to end of file, not fetching.');
				break;
			}

			const seekStart = Date.now();
			currentReader = await performSeek({
				seekTo: skip.skipTo,
				currentReader,
				readerInterface,
				src,
				state,
			});
			timeSeeking += Date.now() - seekStart;
		}

		const didProgress = iterator.counter.getOffset() > offsetBefore;
		if (!didProgress) {
			iterationWithThisOffset++;
		}

		const timeFreeStart = Date.now();
		await state.discardReadBytes(false);

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
