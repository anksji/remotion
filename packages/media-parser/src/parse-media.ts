import type {BufferIterator} from './buffer-iterator';
import {getArrayBufferIterator} from './buffer-iterator';
import {emitAvailableInfo} from './emit-available-info';
import {getFieldsFromCallback} from './get-fields-from-callbacks';
import {getAvailableInfo, hasAllInfo} from './has-all-info';
import {Log} from './log';
import type {
	AllParseMediaFields,
	Options,
	ParseMedia,
	ParseMediaCallbacks,
	ParseMediaFields,
	ParseMediaOptions,
	ParseMediaResult,
} from './options';
import type {ParseResult} from './parse-result';
import {fetchReader} from './readers/from-fetch';
import {runParseIteration} from './run-parse-iteration';
import {makeParserState} from './state/parser-state';
import {throttledStateUpdate} from './throttled-progress';

export const parseMedia: ParseMedia = async function <
	F extends Options<ParseMediaFields>,
>({
	src,
	fields: _fieldsInReturnValue,
	reader: readerInterface = fetchReader,
	onAudioTrack,
	onVideoTrack,
	signal,
	logLevel = 'info',
	onParseProgress: onParseProgressDoNotCallDirectly,
	progressIntervalInMs,
	...more
}: ParseMediaOptions<F>) {
	let parseResult: ParseResult | null = null;

	const fieldsInReturnValue = _fieldsInReturnValue ?? {};

	const fields = getFieldsFromCallback({
		fields: fieldsInReturnValue,
		callbacks: more,
	});

	const {
		reader,
		contentLength,
		name,
		contentType,
		supportsContentRange: readerSupportsContentRange,
	} = await readerInterface.read(src, null, signal);
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

	const state = makeParserState({
		hasAudioTrackHandlers,
		hasVideoTrackHandlers,
		signal,
		getIterator: () => iterator,
		fields,
		onAudioTrack: onAudioTrack ?? null,
		onVideoTrack: onVideoTrack ?? null,
		supportsContentRange,
		contentLength,
		logLevel,
	});

	let currentReader = reader;

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
			parseResult,
			state,
			returnValue,
			contentLength,
			name,
			mimeType: contentType,
		});
	};

	const checkIfDone = () => {
		if (
			hasAllInfo({
				fields,
				state,
			})
		) {
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
		};

		while (iterator.bytesRemaining() < 0) {
			await fetchMoreData();
		}

		const hasBigBuffer = iterator.bytesRemaining() > 100_000;

		if (iterationWithThisOffset > 0 || !hasBigBuffer) {
			await fetchMoreData();
		}

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
		parseResult = await runParseIteration({
			iterator,
			state,
			mimeType: contentType,
			contentLength,
			name,
		});

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

			const skippingAhead = parseResult.skipTo > iterator.counter.getOffset();
			if (!skippingAhead && !supportsContentRange) {
				throw new Error(
					'Content-Range header is not supported by the reader, but was asked to seek',
				);
			}

			if (
				skippingAhead &&
				iterator.counter.getOffset() + iterator.bytesRemaining() >=
					parseResult.skipTo
			) {
				Log.verbose(
					logLevel,
					`Skipping over video data from position ${iterator.counter.getOffset()} -> ${parseResult.skipTo}. Data already fetched`,
				);
				iterator.discard(parseResult.skipTo - iterator.counter.getOffset());
			} else {
				Log.verbose(
					logLevel,
					`Skipping over video data from position ${iterator.counter.getOffset()} -> ${parseResult.skipTo}. Re-reading because this portion is not available`,
				);
				currentReader.abort();

				const {reader: newReader} = await readerInterface.read(
					src,
					parseResult.skipTo,
					signal,
				);
				currentReader = newReader;
				iterator.skipTo(parseResult.skipTo, true);
			}
		}

		const didProgress = iterator.counter.getOffset() > offsetBefore;
		if (!didProgress) {
			iterationWithThisOffset++;
		}

		iterator.removeBytesRead();
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
		parseResult,
		state,
		returnValue,
		contentLength,
		mimeType: contentType,
		name,
	});

	currentReader.abort();
	iterator?.destroy();

	state.callbacks.tracks.ensureHasTracksAtEnd();
	return returnValue as ParseMediaResult<F>;
};
