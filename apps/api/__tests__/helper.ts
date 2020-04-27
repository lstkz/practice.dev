import { connect } from '../src/db';
import { SeqCollection } from '../src/collections/SeqModel';
import { UserCollection } from '../src/collections/UserModel';
import { TokenCollection } from '../src/collections/TokenModel';
import { ConfirmCodeCollection } from '../src/collections/ConfirmCode';
import { ResetPasswordCollection } from '../src/collections/ResetPassword';
import { ChallengeCollection } from '../src/collections/Challenge';
import { SubmissionCollection } from '../src/collections/Submission';

const collections = [
  SeqCollection,
  UserCollection,
  TokenCollection,
  ConfirmCodeCollection,
  ResetPasswordCollection,
  ChallengeCollection,
  SubmissionCollection,
];

export async function initDb() {
  await connect();
  await Promise.all(
    collections.map((collection: any) => collection.initIndex())
  );
}

export async function resetDb() {
  await Promise.all(collections.map(collection => collection.deleteMany({})));
}

// export async function setChallengeStats(id: number, stats: ChallengeStats) {
//   await dynamodb
//     .updateItem({
//       TableName: TABLE_NAME,
//       Key: Converter.marshall(
//         ChallengeEntity.createKey({
//           challengeId: id,
//         })
//       ),
//       UpdateExpression: 'SET stats = :stats',
//       ExpressionAttributeValues: Converter.marshall({ ':stats': stats }),
//     })
//     .promise();
// }

// export function mapToTimestamps<T extends { createdAt: string }>(items: T[]) {
//   return items.map(item => new Date(item.createdAt).getTime());
// }
