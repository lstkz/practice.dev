import util from 'util';
import { APIGatewayProxyEvent, SNSEvent, AppEvent } from './types';
import { handler as rpcHandler } from './handler';
// import { eventMapping } from './event-mapping';

function getAppEvent(event: SNSEvent): AppEvent {
  const record = event.Records[0];
  if ('Sns' in record) {
    return JSON.parse(record.Sns.Message);
  }
  throw new Error('Not supported event type');
}

export async function handler(event: APIGatewayProxyEvent | SNSEvent) {
  if ('Records' in event) {
    const appEvent = getAppEvent(event);

    // const fns = eventMapping[appEvent.type];
    const fns = [] as any[];
    if (!fns.length) {
      return;
    }

    if (fns.length > 1) {
      throw new Error('Not implemented');
    }
    const fn = await fns[0]();
    await fn.eventOptions!.handler(appEvent as any);

    return;
  }

  try {
    const exec = /\/rpc\/(.+)/.exec(event.path);
    if (!exec) {
      throw new Error('Invalid url');
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
    };
  } catch (e) {
    const serialized = util.inspect(e, { depth: null });
    console.error(event.requestContext.requestId, serialized);
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        error: e.message,
        requestId: event.requestContext.requestId,
      }),
    };
  }
}
