import path from 'path';
import type {TRenderAsset} from 'remotion/no-react';
import type {DownloadMap} from './assets/download-map';
import type {Page} from './browser/BrowserPage';
import {collectAssets} from './collect-assets';
import type {StillImageFormat, VideoImageFormat} from './image-format';
import {provideScreenshot} from './provide-screenshot';

export const takeFrame = async ({
	freePage,
	imageFormat,
	jpegQuality,
	frame,
	width,
	height,
	output,
	scale,
	wantsBuffer,
	timeoutInMilliseconds,
	downloadMap,
}: {
	freePage: Page;
	imageFormat: VideoImageFormat | StillImageFormat;
	jpegQuality: number | undefined;
	frame: number;
	height: number;
	width: number;
	output: string | null;
	scale: number;
	wantsBuffer: boolean;
	timeoutInMilliseconds: number;
	downloadMap: DownloadMap;
}): Promise<{buffer: Buffer | null; collectedAssets: TRenderAsset[]}> => {
	const collectedAssets = await collectAssets({
		frame,
		freePage,
		timeoutInMilliseconds,
	});

	if (imageFormat === 'none') {
		return {buffer: null, collectedAssets};
	}

	const shouldMakeBuffer = wantsBuffer;

	const tmpFile = path.join(
		downloadMap.compositingDir,
		`${frame}.${imageFormat}`,
	);

	const buf = await provideScreenshot({
		page: freePage,
		imageFormat,
		jpegQuality,
		options: {
			frame,
			output: wantsBuffer ? null : (tmpFile ?? output),
		},
		height,
		width,
		timeoutInMilliseconds,
		scale,
	});

	if (shouldMakeBuffer) {
		return {buffer: buf, collectedAssets};
	}

	return {buffer: null, collectedAssets};
};
