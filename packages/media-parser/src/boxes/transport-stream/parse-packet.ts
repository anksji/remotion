import type {BufferIterator} from '../../buffer-iterator';
import type {TransportStreamStructure} from '../../parse-result';
import type {ParserContext} from '../../parser-context';
import type {TransportStreamBox} from './boxes';
import {parsePat} from './parse-pat';
import {parsePes} from './parse-pes';
import {parsePmt} from './parse-pmt';
import {doesPesPacketFollow, parseStream} from './parse-stream-packet';
import {
	processStreamBuffer,
	type StreamBufferMap,
} from './process-stream-buffers';
import {getProgramForId, getStreamForId} from './traversal';

export const parsePacket = async ({
	iterator,
	structure,
	streamBuffers,
	parserContext,
}: {
	iterator: BufferIterator;
	structure: TransportStreamStructure;
	streamBuffers: StreamBufferMap;
	parserContext: ParserContext;
}): Promise<TransportStreamBox | null> => {
	const syncByte = iterator.getUint8();
	if (syncByte !== 0x47) {
		throw new Error('Invalid sync byte');
	}

	iterator.startReadingBits();
	iterator.getBits(1); // transport error indicator
	const payloadUnitStartIndicator = iterator.getBits(1);
	iterator.getBits(1); // transport priority
	const programId = iterator.getBits(13);
	iterator.getBits(2); // transport scrambling control
	const adaptationFieldControl1 = iterator.getBits(1); // adaptation field control 1
	iterator.getBits(1); // adaptation field control 2
	iterator.getBits(4); // continuity counter
	iterator.stopReadingBits();
	if (adaptationFieldControl1 === 1) {
		iterator.startReadingBits();
		const adaptationFieldLength = iterator.getBits(8);
		const offset = iterator.counter.getOffset();
		iterator.getBits(1); // discontinuity indicator
		iterator.getBits(1); // random access indicator
		iterator.getBits(1); // elementary stream priority indicator
		iterator.getBits(1); // PCR flag
		iterator.getBits(1); // OPCR flag
		iterator.getBits(1); // splicing point flag
		iterator.getBits(1); // transport private data flag
		iterator.getBits(1); // adaptation field extension flag
		const remaining =
			adaptationFieldLength - (iterator.counter.getOffset() - offset);
		iterator.stopReadingBits();
		iterator.discard(Math.max(0, remaining));
	}

	const isPes = doesPesPacketFollow(iterator);
	if (isPes && payloadUnitStartIndicator === 1) {
		const previousStreamBuffer = streamBuffers.get(programId);
		if (previousStreamBuffer) {
			await processStreamBuffer({
				options: parserContext,
				streamBuffer: previousStreamBuffer,
				programId,
				structure,
			});
		}

		const packetPes = parsePes(iterator);
		streamBuffers.set(programId, {
			pesHeader: packetPes,
			buffer: new Uint8Array([]),
		});
	} else if (payloadUnitStartIndicator === 1) {
		iterator.getUint8(); // pointerField
	}

	if (programId === 0) {
		return Promise.resolve(parsePat(iterator));
	}

	const program = getProgramForId(structure, programId);
	if (program) {
		const pmt = parsePmt(iterator);
		return Promise.resolve(pmt);
	}

	const stream = getStreamForId(structure, programId);
	if (stream) {
		parseStream({iterator, transportStreamEntry: stream, streamBuffers});
		return Promise.resolve(null);
	}

	throw new Error('Unknown packet identifier');
};
