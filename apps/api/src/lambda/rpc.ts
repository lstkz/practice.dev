import util from 'util';
import uuid from 'uuid';
import { APIGatewayProxyEvent, ALBEvent, APIHttpEvent } from '../types';
import { handler as rpcHandler } from '../handler';
import { AppError } from '../common/errors';
import { ValidationError } from 'schema';

const baseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, x-token',
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

function _isPublicError(e: any) {
  const target = e.original instanceof Error ? e.original : e;
  return target instanceof AppError || target instanceof ValidationError;
}

function _getPublicErrorMessage(e: any) {
  const target = e.original instanceof Error ? e.original : e;
  return target.message;
}

export async function handler(
  event: APIGatewayProxyEvent | ALBEvent | APIHttpEvent
) {
  try {
    const { path, httpMethod } = _getHttpParams(event);
    const exec = /\/rpc\/(.+)/.exec(path);
    if (!exec) {
      throw new AppError('Invalid url');
    }
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: baseHeaders,
      };
    }
    if (httpMethod !== 'POST') {
      throw new AppError('Method must be POST');
    }
    let params: any[];
    if (!event.body) {
      throw new AppError('Body required');
    }
    try {
      params = JSON.parse(event.body);
    } catch (e) {
      throw new AppError('Invalid JSON');
    }
    if (!Array.isArray(params)) {
      throw new AppError('Request body must be an array');
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
    if (_isPublicError(e)) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({
          error: _getPublicErrorMessage(e),
          requestId,
        }),
      };
    } else {
      console.error(requestId, serialized);
      return {
        statusCode: 500,
        headers: baseHeaders,
        body: JSON.stringify({
          error: 'Internal server error',
          requestId,
        }),
      };
    }
  }
}
