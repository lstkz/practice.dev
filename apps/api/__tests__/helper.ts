import { dynamodb, TABLE_NAME } from '../src/lib';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ChallengeStats } from 'shared';
import { createKey } from '../src/common/db';

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
      Key: Converter.marshall(createKey({ type: 'CHALLENGE', id })),
      UpdateExpression: 'SET stats = :stats',
      ExpressionAttributeValues: Converter.marshall({ ':stats': stats }),
    })
    .promise();
}
