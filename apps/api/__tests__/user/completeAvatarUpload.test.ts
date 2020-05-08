import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { s3 } from '../../src/lib';
import { completeAvatarUpload } from '../../src/contracts/user/completeAvatarUpload';
import jimp from 'jimp';
import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

it('should throw an error if wrong size', async () => {
  s3.getObject = () =>
    ({
      promise: async () => {
        const img = await jimp.create(2, 3);
        const buffer = await img.getBufferAsync('image/png');
        return {
          Body: buffer,
        };
      },
    } as any);
  await expect(completeAvatarUpload('1')).rejects.toThrow(
    'Image must be square'
  );
});

it('should throw an error if invalid image', async () => {
  s3.getObject = () =>
    ({
      promise: async () => {
        return {
          Body: Buffer.from('aaaaaaaaaaa'),
        };
      },
    } as any);
  await expect(completeAvatarUpload('1')).rejects.toThrow(
    'Uploaded file is not a valid image'
  );
});

it('should complete upload', async () => {
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
  const ret = await completeAvatarUpload('1');
  expect(ret.avatarUrl).toBeDefined();
  const profile = await getPublicProfile(undefined, 'user1');
  expect(profile.avatarUrl).toEqual(ret.avatarUrl);
});
