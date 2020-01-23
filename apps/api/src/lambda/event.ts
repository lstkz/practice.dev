import { SNSEvent, AppEvent } from '../types';
import { eventMapping } from '../generated/event-mapping';

function getAppEvent(event: SNSEvent): AppEvent {
  const record = event.Records[0];
  if ('Sns' in record) {
    return JSON.parse(record.Sns.Message);
  }
  throw new Error('Not supported event type');
}

export async function handler(event: SNSEvent) {
  const appEvent = getAppEvent(event);

  const handlerMap = eventMapping[appEvent.type] || {};
  const keys = Object.keys(handlerMap);
  if (!keys.length) {
    return;
  }

  if (keys.length > 1) {
    throw new Error('Not implemented');
  }
  const { options } = await handlerMap[keys[0]]();
  await options.handler(appEvent as any);
}
