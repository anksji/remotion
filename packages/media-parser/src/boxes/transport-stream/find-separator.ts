import type {TransportStreamEntry} from './parse-pmt';

function findSubarrayIndex(array: Uint8Array, subarray: Uint8Array) {
	const subarrayLength = subarray.length;
	const arrayLength = array.length;

	for (let i = 0; i <= arrayLength - subarrayLength; i++) {
		let match = true;
		for (let j = 0; j < subarrayLength; j++) {
			if (array[i + j] !== subarray[j]) {
				match = false;
				break;
			}
		}

		if (match) {
			return i; // Return the starting index of the subarray
		}
	}

	return -1; // Return -1 if subarray is not found
}

function findADTSsyncword(uint8Array: Uint8Array) {
	for (let i = 0; i < uint8Array.length - 2; i++) {
		// Check if the current and next two bytes match the syncword pattern
		if (uint8Array[i] === 0xff && (uint8Array[i + 1] & 0xf0) === 0xf0) {
			// Optionally, you can add further checks for other header fields here
			return i; // Return the index where the syncword starts
		}
	}

	return -1; // Return -1 if syncword is not found
}

export const findNextSeparator = (
	restOfPacket: Uint8Array,
	transportStreamEntry: TransportStreamEntry,
) => {
	if (transportStreamEntry.streamType === 27) {
		return findSubarrayIndex(restOfPacket, new Uint8Array([0, 0, 1, 9]));
	}

	if (transportStreamEntry.streamType === 15) {
		return findADTSsyncword(restOfPacket);
	}

	throw new Error(`Unsupported stream ID ${transportStreamEntry.streamType}`);
};
