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
            const eventId = `${type}:${key}:${record.eventID}`;
            if (record.eventName === 'INSERT' && handler.options.insert) {
              await handler.options.insert(eventId, newItem);
            }
            if (record.eventName === 'MODIFY' && handler.options.modify) {
              await handler.options.modify(eventId, newItem, oldItem);
            }
            if (record.eventName === 'REMOVE' && handler.options.remove) {
              await handler.options.remove(eventId, oldItem);
            }
          })
        );
      } catch (e) {
        console.error('Failed to handle dynamo stream record', e, record);
        throw e;
      }
    })
  );
}
