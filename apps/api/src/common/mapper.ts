import * as R from 'remeda';
import { UserModel } from '../collections/UserModel';
import { PublicUser, User, Submission } from 'shared';
import { SubmissionModel } from '../collections/Submission';

export function mapToUser(item: UserModel): User {
  return {
    id: item._id,
    email: item.email,
    username: item.username,
    isVerified: item.isVerified,
    isAdmin: item.isAdmin,
  };
}

export function mapToPublicUser(item: UserModel): PublicUser {
  return {
    id: item._id,
    username: item.username,
  };
}

export function mapToSubmission(
  item: SubmissionModel,
  user: UserModel
): Submission {
  return {
    id: item._id,
    challengeId: item.challengeId,
    user: mapToPublicUser(user),
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  };
}

export function mapToSubmissionMany(
  items: SubmissionModel[],
  users: UserModel[]
) {
  const userMap = R.indexBy(users, x => x._id);
  return items.map(item => mapToSubmission(item, userMap[item.userId]));
}
