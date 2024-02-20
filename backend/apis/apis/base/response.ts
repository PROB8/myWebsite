import {
  APIGatewayProxyResult,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';

export default function response(
  body: unknown,
  statusCode: number,
  err: Error = undefined,
  headers: APIGatewayProxyStructuredResultV2['headers'] = {},
  multiValueHeaders = {}
): Promise<APIGatewayProxyResult> {
  const headerOjb = {
    ...(statusCode >= 200 && statusCode < 300
      ? {
          'Access-Control-Allow-Origins': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'POST',
        }
      : {}),
    ...headers,
  };
  const bodyObj = err
    ? {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      }
    : body;
  return Promise.resolve({
    body: JSON.stringify(bodyObj),
    headers: headerOjb,
    isBase64Encoded: false,
    statusCode,
    multiValueHeaders,
  });
}