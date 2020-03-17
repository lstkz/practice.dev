// import { createContract, dynamodb } from '../../lib';
// import { S } from 'schema';
// import * as R from 'remeda';
// import { Converter } from 'aws-sdk/clients/dynamodb';
// import { createKey } from '../../common/db';
// import { DbUser } from '../../types';
// import { TABLE_NAME } from '../../config';

// export const getUsersByIds = createContract('user.getUsersByIds')
//   .params('ids')
//   .schema({
//     ids: S.array().items(S.string()),
//   })
//   .fn(async ids => {
//     if (!ids.length) {
//       return [];
//     }
//     const keys = R.pipe(
//       ids,
//       R.uniq(),
//       R.map(id => createKey({ type: 'USER', userId: id })),
//       R.map(key => Converter.marshall(key))
//     );

//     const result = await dynamodb
//       .batchGetItem({
//         RequestItems: {
//           [TABLE_NAME]: {
//             Keys: keys,
//           },
//         },
//       })
//       .promise();
//     if (Object.keys(result.UnprocessedKeys || {}).length) {
//       throw new Error('Cannot populate all users');
//     }
//     return result.Responses![TABLE_NAME].map(
//       item => Converter.unmarshall(item) as DbUser
//     );
//   });
