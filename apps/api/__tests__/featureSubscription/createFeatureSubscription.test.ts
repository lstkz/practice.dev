import { resetDb } from '../helper';
import { createFeatureSubscription } from '../../src/contracts/featureSubscription/createFeatureSubscription';
import { FeatureSubscriptionEntity } from '../../src/entities';
import { TABLE_NAME } from '../../src/config';
import { dynamodb } from '../../src/lib';

beforeEach(async () => {
  await resetDb();
});

it('should throw an error if invalid type', async () => {
  await expect(
    createFeatureSubscription('aaa' as any, 'm@example.com')
  ).rejects.toThrow("Validation error: 'type' must be an enum");
});

it('should create subscription', async () => {
  await createFeatureSubscription('contest', 'm@example.com');
  await createFeatureSubscription('contest', 'M@example.com');
  const ret = await dynamodb
    .scan(
      {
        TableName: TABLE_NAME,
        FilterExpression: `entityType = :entityType`,
        ExpressionAttributeValues: {
          ':entityType': { S: FeatureSubscriptionEntity.entityType },
        },
      },
      undefined
    )
    .promise();
  expect(ret.Items).toHaveLength(1);
});
