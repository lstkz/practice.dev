import { dynamodb } from '../src/lib';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ChallengeStats } from 'shared';
import { TABLE_NAME } from '../src/config';
import { ChallengeEntity } from '../src/entities';
import { esClearIndex, exIndexBulk } from '../src/common/elastic';

export async function resetDb() {
  const deleteNext = async () => {
    const ret = await dynamodb
      .scan({
        TableName: TABLE_NAME,
      })
      .promise();

    if (!ret.Count) {
      return;
    }

    await Promise.all(
      (ret.Items || []).map(item =>
        dynamodb
          .deleteItem({
            TableName: TABLE_NAME,
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          })
          .promise()
      )
    );

    await deleteNext();
  };

  await deleteNext();
}

export async function setChallengeStats(id: number, stats: ChallengeStats) {
  await dynamodb
    .updateItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(
        ChallengeEntity.createKey({
          challengeId: id,
        })
      ),
      UpdateExpression: 'SET stats = :stats',
      ExpressionAttributeValues: Converter.marshall({ ':stats': stats }),
    })
    .promise();
}

export function mapToTimestamps<T extends { createdAt: string }>(items: T[]) {
  return items.map(item => new Date(item.createdAt).getTime());
}

export async function esReIndexFromDynamo(entityType: string) {
  const ret = await dynamodb
    .scan(
      {
        TableName: TABLE_NAME,
        FilterExpression: `entityType = :entityType`,
        ExpressionAttributeValues: {
          ':entityType': { S: entityType },
        },
      },
      undefined
    )
    .promise();
  await esClearIndex(entityType);
  await exIndexBulk(
    ret!.Items!.map(item => ({
      type: 'index',
      entity: Converter.unmarshall(item) as any,
    }))
  );
}
