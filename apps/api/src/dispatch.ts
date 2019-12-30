import { AppEvent } from './types';
import { sns } from './lib';
import { eventMapping } from './generated/event-mapping';

export async function dispatch(event: AppEvent) {
  if (process.env.IS_AWS) {
    await sns
      .publish({
        Message: JSON.stringify(event),
        TopicArn: process.env.TOPIC_ARN,
      })
      .promise();
  } else {
    const handlerMap = eventMapping[event.type] || {};
    const keys = Object.keys(handlerMap);
    await Promise.all(
      keys.map(async key => {
        const { options } = await handlerMap[key]();
        await options.handler(event as any);
      })
    );
  }
}
