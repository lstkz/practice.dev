import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { createContract, dynamodb } from '../../lib';
import { TABLE_NAME } from '../../config';
import { SequenceEntity } from '../../entities';

export const nexSeq = createContract('misc.nextSeq')
  .params('name')
  .schema({
    name: S.string(),
  })
  .fn(async name => {
    const ret = await dynamodb
      .updateItem({
        ReturnValues: 'UPDATED_NEW',
        Key: Converter.marshall(
          SequenceEntity.createKey({
            name,
          })
        ),
        TableName: TABLE_NAME,
        UpdateExpression: 'SET #value = if_not_exists(#value, :zero) + :incr',
        ExpressionAttributeValues: Converter.marshall({
          ':incr': 1,
          ':zero': 0,
        }),
        ExpressionAttributeNames: {
          '#value': 'value',
        },
      })
      .promise();
    return Converter.unmarshall(ret.Attributes!).value as number;
  });
