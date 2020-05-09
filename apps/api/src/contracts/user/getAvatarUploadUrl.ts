import { S } from 'schema';
import { createRpcBinding, createContract, s3 } from '../../lib';
import { S3_BUCKET_NAME } from '../../config';
import { getUserAvatarUploadKey } from '../../common/helper';
import { PresignedPost } from 'shared';

export const getAvatarUploadUrl = createContract('user.getAvatarUploadUrl')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const uploadUrl = await s3.createPresignedPost({
      Bucket: S3_BUCKET_NAME,
      Conditions: [['content-length-range', 0, 3 * 1024 * 1024]],
      Fields: {
        key: getUserAvatarUploadKey(userId),
      },
    });

    return uploadUrl as PresignedPost;
  });

export const getAvatarUploadUrlRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getAvatarUploadUrl',
  handler: getAvatarUploadUrl,
});
