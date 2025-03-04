import {RenderInternals} from '@remotion/renderer';
import type {
	CloudProvider,
	ProviderSpecifics,
	ServerlessPayload,
} from '@remotion/serverless-client';
import {
	ServerlessRoutines,
	decompressInputProps,
	internalGetOrCreateBucket,
} from '@remotion/serverless-client';
import {} from '../get-browser-instance';
import type {InsideFunctionSpecifics} from '../provider-implementation';
import {checkVersionMismatch} from './check-version-mismatch';

type Options = {
	expectedBucketOwner: string;
};

export const compositionsHandler = async <Provider extends CloudProvider>({
	params,
	options,
	providerSpecifics,
	insideFunctionSpecifics,
}: {
	params: ServerlessPayload<Provider>;
	options: Options;
	providerSpecifics: ProviderSpecifics<Provider>;
	insideFunctionSpecifics: InsideFunctionSpecifics<Provider>;
}) => {
	if (params.type !== ServerlessRoutines.compositions) {
		throw new TypeError('Expected info compositions');
	}

	checkVersionMismatch({
		apiName: 'getCompositionsOnLambda()',
		insideFunctionSpecifics,
		params,
	});

	try {
		const region = insideFunctionSpecifics.getCurrentRegionInFunction();

		const browserInstancePromise = insideFunctionSpecifics.getBrowserInstance({
			logLevel: params.logLevel,
			indent: false,
			chromiumOptions: params.chromiumOptions,
			providerSpecifics,
			insideFunctionSpecifics,
		});
		const bucketNamePromise = params.bucketName
			? Promise.resolve(params.bucketName)
			: internalGetOrCreateBucket({
					region,
					enableFolderExpiry: null,
					customCredentials: null,
					providerSpecifics,
					forcePathStyle: params.forcePathStyle,
					skipPutAcl: false,
				}).then((b) => b.bucketName);

		const bucketName = await bucketNamePromise;
		const serializedInputPropsWithCustomSchema = await decompressInputProps({
			bucketName: await bucketNamePromise,
			expectedBucketOwner: options.expectedBucketOwner,
			region: insideFunctionSpecifics.getCurrentRegionInFunction(),
			serialized: params.inputProps,
			propsType: 'input-props',
			providerSpecifics,
			forcePathStyle: params.forcePathStyle,
		});

		const realServeUrl = providerSpecifics.convertToServeUrl({
			urlOrId: params.serveUrl,
			region,
			bucketName,
		});

		const compositions = await RenderInternals.internalGetCompositions({
			serveUrlOrWebpackUrl: realServeUrl,
			puppeteerInstance: (await browserInstancePromise).instance,
			serializedInputPropsWithCustomSchema,
			envVariables: params.envVariables ?? {},
			timeoutInMilliseconds: params.timeoutInMilliseconds,
			chromiumOptions: params.chromiumOptions,
			port: null,
			server: undefined,
			logLevel: params.logLevel,
			indent: false,
			browserExecutable: null,
			onBrowserLog: null,
			offthreadVideoCacheSizeInBytes: params.offthreadVideoCacheSizeInBytes,
			binariesDirectory: null,
			onBrowserDownload: () => {
				throw new Error('Should not download a browser in a function');
			},
			chromeMode: 'headless-shell',
		});

		return Promise.resolve({
			compositions,
			type: 'success' as const,
		});
	} finally {
		insideFunctionSpecifics.forgetBrowserEventLoop(params.logLevel);
	}
};
