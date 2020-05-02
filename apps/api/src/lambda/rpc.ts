import util from 'util';
import uuid from 'uuid';
import { APIGatewayProxyEvent, ALBEvent, APIHttpEvent } from '../types';
import { handler as rpcHandler } from '../handler';

const baseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

function _isAPIHttpEvent(
  event: APIGatewayProxyEvent | ALBEvent | APIHttpEvent
): event is APIHttpEvent {
  return 'http' in event.requestContext;
}

function _getHttpParams(event: APIGatewayProxyEvent | ALBEvent | APIHttpEvent) {
  if (_isAPIHttpEvent(event)) {
    return {
      httpMethod: event.requestContext.http.method,
      path: event.requestContext.http.path,
    };
  }
  return {
    httpMethod: event.httpMethod,
    path: event.path,
  };
}

export async function handler(
  event: APIGatewayProxyEvent | ALBEvent | APIHttpEvent
) {
  try {
    const { path, httpMethod } = _getHttpParams(event);
    const exec = /\/rpc\/(.+)/.exec(path);
    if (!exec) {
      throw new Error('Invalid url');
    }
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: baseHeaders,
      };
    }
    if (httpMethod !== 'POST') {
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
    const headers = event.headers || {};
    const ret = await rpcHandler(exec[1], params, headers['x-token']);
    return {
      statusCode: 200,
      body: JSON.stringify(ret),
      headers: baseHeaders,
    };
  } catch (e) {
    const serialized = util.inspect(e, { depth: null });
    const requestId = event.requestContext?.requestId || uuid();
    console.error(requestId, serialized);
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({
        error: e.message,
        requestId,
      }),
    };
  }
}
