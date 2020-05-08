import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { s3 } from '../../src/lib';
import { completeAvatarUpload } from '../../src/contracts/user/completeAvatarUpload';
import jimp from 'jimp';
import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';
import { deleteAvatar } from '../../src/contracts/user/deleteAvatar';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

it('should delete avatar', async () => {
  s3.getObject = () =>
    ({
      promise: async () => {
        const img = await jimp.create(10, 10);
        const buffer = await img.getBufferAsync('image/png');
        return {
          Body: buffer,
        };
      },
    } as any);
  s3.putObject = () =>
    ({
      promise: async () => {},
    } as any);
  await completeAvatarUpload('1');
  await deleteAvatar('1');
  const profile = await getPublicProfile(undefined, 'user1');
  expect(profile.avatarUrl).toEqual(null);
});
