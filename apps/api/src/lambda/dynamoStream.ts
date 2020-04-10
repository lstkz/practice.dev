import { DynamoDBStreamEvent, EntityType, DynamoDBRecord } from '../types';
import { dynamoStreamMapping } from '../generated/dynamoStream-mapping';
import {
  SubmissionEntity,
  ChallengeSolvedEntity,
  SolutionEntity,
  SolutionVoteEntity,
} from '../entities';
import { Converter } from 'aws-sdk/clients/dynamodb';

const Entities = [
  SolutionEntity,
  SolutionVoteEntity,
  SubmissionEntity,
  ChallengeSolvedEntity,
];

export function decodeStreamEntity(
  record: DynamoDBRecord
): {
  type: EntityType;
  oldItem: any | null;
  newItem: any | null;
} | null {
  if (!record.eventName) {
    throw new Error('eventName required');
  }
  const newItem = record.dynamodb?.NewImage
    ? Converter.unmarshall(record.dynamodb.NewImage)
    : null;
  const oldItem = record.dynamodb?.OldImage
    ? Converter.unmarshall(record.dynamodb.OldImage)
    : null;
  const item = newItem || oldItem;
  if (!item) {
    return null;
  }
  const Entity = Entities.find(entity => entity.isEntityKey(item as any));
  if (!Entity) {
    return null;
  }
  return {
    type: Entity.name as any,
    newItem: newItem && (Entity as any).fromDynamo(record.dynamodb?.NewImage),
    oldItem: oldItem && (Entity as any).fromDynamo(record.dynamodb?.OldImage),
  };
}

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
