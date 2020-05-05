import { DynamoDBStreamEvent } from '../types';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { exIndexBulk, IndexBulkItem } from '../common/elastic';

export async function handler(event: DynamoDBStreamEvent) {
  const bulkItems = event.Records.map(record => {
    if (record.eventName === 'REMOVE') {
      return {
        type: 'delete',
        entity: Converter.unmarshall(record.dynamodb!.OldImage!),
      } as IndexBulkItem;
    } else {
      return {
        type: 'index',
        entity: Converter.unmarshall(record.dynamodb!.NewImage!),
      } as IndexBulkItem;
    }
  });
  await exIndexBulk(bulkItems);
}
