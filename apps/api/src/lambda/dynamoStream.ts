import { DynamoDBStreamEvent } from '../types';
import { dynamoStreamMapping } from '../generated/dynamoStream-mapping';
import { decodeStreamEntity } from '../common/db';

export async function handler(event: DynamoDBStreamEvent) {
  await Promise.all(
    event.Records.map(async record => {
      try {
        const result = decodeStreamEntity(record);
        if (!result) {
          return;
        }
        if (!record.eventID) {
          throw new Error('eventID is null');
        }
        const { type, newItem, oldItem } = result;
        const handlerMap = dynamoStreamMapping[type] || {};
        const keys = Object.keys(handlerMap);
        await Promise.all(
          keys.map(async key => {
            const handler = await handlerMap[key]();
            const isAllowed =
              (record.eventName === 'INSERT' && handler.options.insert) ||
              (record.eventName === 'MODIFY' && handler.options.modify) ||
              (record.eventName === 'REMOVE' && handler.options.remove);
            if (!isAllowed) {
              return;
            }
            await handler.options.handler(
              `${type}:${key}:${record.eventID}`,
              record.eventName!,
              newItem,
              oldItem
            );
          })
        );
      } catch (e) {
        console.error('Failed to handle dynamo stream record', e, record);
        throw e;
      }
    })
  );
}
