import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { AppError } from '../../common/errors';
import { UserCollection } from '../../collections/UserModel';
import { PublicUserProfile } from 'shared';

export const getPublicProfile = createContract('user.getPublicProfile')
  .params('userId', 'username')
  .schema({
    userId: S.string().optional(),
    username: S.string(),
  })
  .fn(async (userId, username) => {
    const user = await UserCollection.findOne({
      username_lowered: username.toLowerCase(),
    });
    if (!user) {
      throw new AppError('User not found');
    }
    const ret: PublicUserProfile = {
      id: user._id,
      username: user.username,
      country: user.country ?? null,
      avatarUrl: user.avatarUrl ?? null,
      name: user.name ?? '',
      url: user.url ?? '',
      bio: user.bio ?? '',
      isFollowed: false,
      submissionsCount: user.stats.submissions,
      solutionsCount: user.stats.solutions,
      likesCount: user.stats.likes,
      followersCount: user.stats.followers,
      followingCount: user.stats.following,
    };
    return ret;
  });

export const getPublicProfileRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'user.getPublicProfile',
  handler: getPublicProfile,
});
