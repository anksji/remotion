import type {AwsProvider} from '@remotion/lambda-client';
import {LambdaClientInternals} from '@remotion/lambda-client';
import type {RequestContext, ResponseStream} from '@remotion/serverless';
import {innerHandler, streamWriter} from '@remotion/serverless';
import type {ServerlessPayload} from '@remotion/serverless/client';
import {serverAwsImplementation} from './aws-server-implementation';
import {streamifyResponse} from './helpers/streamify-response';
import {getWebhookClient} from './http-client';

export const routine = (
	params: ServerlessPayload<AwsProvider>,
	responseStream: ResponseStream,
	context: RequestContext,
): Promise<void> => {
	const responseWriter = streamWriter(responseStream);

	return innerHandler({
		params,
		responseWriter,
		context,
		providerSpecifics: LambdaClientInternals.awsImplementation,
		insideFunctionSpecifics: serverAwsImplementation,
		webhookClient: getWebhookClient,
	});
};

export const handler = streamifyResponse(routine);
