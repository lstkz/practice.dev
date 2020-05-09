import { S } from 'schema';
import { createRpcBinding, createContract, s3 } from '../../lib';
import { S3_BUCKET_NAME } from '../../config';
import {
  getUserAvatarUploadKey,
  randomString,
  doFn,
} from '../../common/helper';
import jimp from 'jimp';
import { AppError } from '../../common/errors';
import { UserEntity } from '../../entities';

export const completeAvatarUpload = createContract('user.completeAvatarUpload')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const s3Object = await s3
      .getObject({
        Bucket: S3_BUCKET_NAME,
        Key: getUserAvatarUploadKey(userId),
      })
      .promise()
      .catch(err => {
        if (err.code === 'NotFound') {
          throw new AppError('File is not uploaded');
        }
        throw err;
      });
    if (!(s3Object.Body instanceof Buffer)) {
      throw new Error('Expected buffer');
    }
    const img = await jimp.read(s3Object.Body).catch(() => {
      throw new AppError('Uploaded file is not a valid image');
    });
    if (img.bitmap.width !== img.bitmap.height) {
      throw new AppError('Image must be square');
    }
    const getPath = (size: string) => `avatars/${id}-${size}.png`;
    const id = randomString(20);
    await Promise.all([
      doFn(async () => {
        await s3
          .upload({
            Bucket: S3_BUCKET_NAME,
            Key: getPath('org'),
            Body: await img.clone().getBufferAsync('image/png'),
          })
          .promise();
      }),
      doFn(async () => {
        await s3
          .upload({
            Bucket: S3_BUCKET_NAME,
            Key: getPath('140x140'),
            Body: await img
              .clone()
              .resize(140, 140)
              .getBufferAsync('image/png'),
          })
          .promise();
      }),
      doFn(async () => {
        await s3
          .upload({
            Bucket: S3_BUCKET_NAME,
            Key: getPath('40x40'),
            Body: await img.clone().resize(40, 40).getBufferAsync('image/png'),
          })
          .promise();
      }),
    ]);
    const user = await UserEntity.getById(userId);
    user.avatarUrl = id;
    await user.update(['avatarUrl']);
    return {
      avatarUrl: id,
    };
  });

export const completeAvatarUploadRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.completeAvatarUpload',
  handler: completeAvatarUpload,
});
