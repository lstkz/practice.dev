import util from 'util';
import { APIGatewayProxyEvent } from '../types';
import { handler as rpcHandler } from '../handler';

const baseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

export async function handler(event: APIGatewayProxyEvent) {
  try {
    console.log('processing RPC', event.path);
    const exec = /\/rpc\/(.+)/.exec(event.path);
    if (!exec) {
      throw new Error('Invalid url');
    }
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: baseHeaders,
      };
    }
    if (event.httpMethod !== 'POST') {
      throw new Error('Method must be POST');
    }
    let params: any[];
    if (!event.body) {
      throw new Error('Body required');
    }
    try {
      params = JSON.parse(event.body);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
    if (!Array.isArray(params)) {
      throw new Error('Request body must be an array');
    }
    const ret = await rpcHandler(exec[1], params, event.headers['x-token']);
    return {
      statusCode: 200,
      body: JSON.stringify(ret),
      headers: baseHeaders,
    };
  } catch (e) {
    const serialized = util.inspect(e, { depth: null });
    console.error(event.requestContext.requestId, serialized);
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({
        error: e.message,
        requestId: event.requestContext.requestId,
      }),
    };
  }
}
