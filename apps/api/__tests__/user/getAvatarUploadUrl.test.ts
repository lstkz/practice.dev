import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { getAvatarUploadUrl } from '../../src/contracts/user/getAvatarUploadUrl';
import { s3 } from '../../src/lib';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

it('should return url', async () => {
  s3.createPresignedPost = () => ({
    url: '/foo',
    fields: {} as any,
  });
  const url = await getAvatarUploadUrl('1');
  expect(url).toEqual({
    url: '/foo',
    fields: {},
  });
});
