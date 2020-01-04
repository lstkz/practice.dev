import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { createContract, dynamodb, TABLE_NAME } from '../../lib';
import { createKey } from '../../common/db';

export const nexSeq = createContract('misc.nextSeq')
  .params('key')
  .schema({
    key: S.string(),
  })
  .fn(async key => {
    const ret = await dynamodb
      .updateItem({
        ReturnValues: 'UPDATED_NEW',
        Key: Converter.marshall(
          createKey({
            type: 'SEQUENCE',
            key,
          })
        ),
        TableName: TABLE_NAME,
        UpdateExpression: 'SET val = if_not_exists(val, :zero) + :incr',
        ExpressionAttributeValues: Converter.marshall({
          ':incr': 1,
          ':zero': 0,
        }),
      })
      .promise();
    return Converter.unmarshall(ret.Attributes!).val as number;
  });
