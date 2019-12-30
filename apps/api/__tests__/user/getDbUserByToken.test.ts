import { resetDb } from '../helper';
import { login } from '../../src/contracts/user/login';
import { registerSampleUsers } from '../seed-data';
import { getDbUserByToken } from '../../src/contracts/user/getDbUserByToken';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

it('should return null if invalid token', async () => {
  const user = await getDbUserByToken('fooadf');
  expect(user).toEqual(null);
});

it('should return user', async () => {
  const user = await getDbUserByToken('user1_token');
  expect(user?.username).toEqual('user1');
});
