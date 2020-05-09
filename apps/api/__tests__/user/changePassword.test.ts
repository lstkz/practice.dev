import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { changePassword } from '../../src/contracts/user/changePassword';
import { login } from '../../src/contracts/user/login';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers()]);
});

it('should change password and log in', async () => {
  await changePassword('1', 'newPassword');
  const ret = await login({
    emailOrUsername: 'user1',
    password: 'newPassword',
  });
  expect(ret.user.id).toEqual('1');
});
