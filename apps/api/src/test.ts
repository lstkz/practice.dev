// import * as R from 'remeda';
// import zlib, { gzipSync } from 'zlib';
// import { dynamodb, dynamoStream } from './lib';
// // import { TABLE_NAME } from './config';
// import { batchRawWriteItemWithRetry, batchDelete } from './common/db';
// import AWS from 'aws-sdk';

// const TABLE_NAME = 'test';

// // R.ra

// // dynamodb.

// async function insert() {
//   const ids = R.range(1, 50001);

//   const parts = R.chunk(ids, 100);

//   await Promise.all(
//     parts.map(async part => {
//       const chunks = R.chunk(part, 25);
//       for (const chunk of chunks) {
//         await batchRawWriteItemWithRetry({
//           [TABLE_NAME]: chunk.map(id => ({
//             PutRequest: {
//               Item: {
//                 pk: {
//                   S: 'xtest:' + id,
//                 },
//                 sk: {
//                   S: 'xtest',
//                 },
//                 data_n: {
//                   N: String(id),
//                 },
//                 name: {
//                   S: 'name' + id,
//                 },
//               },
//             },
//           })),
//         });
//       }
//     })
//   );
// }

// // insert();

// async function query() {
//   console.time('query');
//   const ret = await dynamodb
//     .query({
//       TableName: TABLE_NAME,
//       IndexName: 'sk-data_n-index',
//       KeyConditionExpression: 'sk = :sk',
//       // Limit: 1000,
//       ExpressionAttributeValues: {
//         ':sk': {
//           S: 'xtest',
//         },
//         // ':name': {
//         //   S: 'xxxx',
//         // },
//       },
//       // ExpressionAttributeNames: {
//       //   '#name': 'name',
//       // },
//       // FilterExpression: 'contains(#name, :name)',
//       ReturnConsumedCapacity: 'TOTAL',
//       // ProjectionExpression: ''
//       // Select: 'COUNT',
//       // AttributesToGet: ['sk', 'pk'],
//     })
//     .promise();
//   console.timeEnd('query');
//   // console.log(ret.ScannedCount, ret.ConsumedCapacity);
//   // console.log(ret);
//   // const items = ret.Items!.map(x => ({
//   //   name: x.name.S,
//   //   count: Number(x.data_n.N),
//   // }));
//   // console.log(JSON.stringify(items).length);

//   // console.log(gzipSync(Buffer.from(JSON.stringify(items))).length);
// }

// async function clear() {
//   const ret = await dynamodb
//     .query({
//       TableName: TABLE_NAME,
//       IndexName: 'sk-data_n-index',
//       KeyConditionExpression: 'sk = :sk',
//       Limit: 100,
//       ExpressionAttributeValues: {
//         ':sk': {
//           S: 'xtest',
//         },
//         // ':name': {
//         //   S: 'xxxx',
//         // },
//       },
//       // ExpressionAttributeNames: {
//       //   '#name': 'name',
//       // },
//       // FilterExpression: 'contains(#name, :name)',
//       // ReturnConsumedCapacity: 'TOTAL',
//     })
//     .promise();
//   if (!ret.Items?.length) {
//     return;
//   }

//   const chunks = R.chunk(ret.Items!, 25);
//   await Promise.all(
//     chunks.map(async chunk => {
//       await batchRawWriteItemWithRetry({
//         [TABLE_NAME]: chunk.map(item => ({
//           DeleteRequest: {
//             Key: R.pick(item, ['sk', 'pk']),
//           },
//         })),
//       });
//     })
//   );
//   await clear();
// }

// async function stream() {
//   const table = await dynamodb
//     .describeTable({
//       TableName: TABLE_NAME,
//     })
//     .promise()
//     .then(x => x.Table!);
//   // console.log(table);
//   // const arn =
//   //   'arn:aws:dynamodb:eu-central-1:702602850703:table/pd-dev-main29F6D6A38-1V854BBK683M0/stream/2020-02-29T11:44:44.101';
//   const arn = table.LatestStreamArn!;
//   const ret = await dynamoStream
//     .describeStream({
//       StreamArn: arn,
//     })
//     .promise();
//   console.log(ret.StreamDescription?.Shards?.length);
//   let total = 0;

//   ret.StreamDescription!.Shards!.forEach(async shard => {
//     const iterator = await dynamoStream
//       .getShardIterator({
//         ShardId: shard.ShardId!,
//         StreamArn: arn,
//         // ShardIteratorType: 'TRIM_HORIZON',
//         ShardIteratorType: 'LATEST',
//       })
//       .promise();

//     const check = async (shardIterator: string) => {
//       // console.log('check', ++total);
//       const result = await dynamoStream
//         .getRecords({
//           ShardIterator: shardIterator,
//         })
//         .promise();
//       if (result.Records?.length) {
//         // console.log(result.Records.map(x => x.dynamodb));
//         console.log(result.Records.map(x => x.eventID));
//       }
//       if (result.NextShardIterator) {
//         setTimeout(() => check(result.NextShardIterator!), 100);
//       }
//     };
//     check(iterator.ShardIterator!);
//   });

//   // await Promise.all(
//   //   ret.StreamDescription!.Shards!.map(async shard => {
//   //     const iterator = await stream
//   //       .getShardIterator({
//   //         ShardId: shard.ShardId!,
//   //         StreamArn: arn,
//   //         ShardIteratorType: 'TRIM_HORIZON',
//   //       })
//   //       .promise();
//   //     const record = await stream
//   //       .getRecords({
//   //         ShardIterator: iterator.ShardIterator!,
//   //       })
//   //       .promise();
//   //     if (record.Records?.length) {
//   //       console.log(record.Records);
//   //     }
//   //   })
//   // );
// }

// // stream();
// // clear();

// // insert();

// query();

class BaseEntity {
  // pk!: string;
  // sk!: string
}

export function safeAssign<T extends V, V>(target: T, values: V) {
  Object.assign(target, values);
  return target;
}

// type NonMethods<T extends object, K extends keyof T> = ((
//   ...args: any[]
// ) => any) extends T[K]
//   ? never
//   : K;

// type PropsOnly<T> = {
//   [x in keyof T]: T[x] extends (...args: any[]) => any ? never : T[x];
// };

// type PropsOnly2<T extends object> = Pick<T, NonMethods<T, keyof T>>;

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// type A = NonMethods<DbUser, keyof DbUser>;

// type B = FunctionPropertyNames<DbUser  >;

type PropsOnly<T> = Omit<T, FunctionPropertyNames<T>>;

interface BaseEntity {
  serialize(): void;
  getKey(): { pk: string; sk: string };
}

class DbUser implements BaseEntity {
  userId!: string;
  email!: string;
  username!: string;
  salt!: string;
  password!: string;
  isVerified!: boolean;
  githubId?: number;
  isAdmin?: boolean;

  constructor(values: PropsOnly<DbUser>) {
    safeAssign(this, values);
  }

  static calcKey({ userId }: { userId: string }) {
    const pk = `USER:${userId}`;
    return {
      pk,
      sk: pk,
    };
  }

  getKey() {
    return DbUser.calcKey(this);
  }

  serialize() {}
}

const user = new DbUser({
  email: 'a',
  userId: 'b',
  username: 'b',
  salt: 'b',
  password: 'b',
  isVerified: false,
});
