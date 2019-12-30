import { _createUser } from '../src/contracts/user/_createUser';
import { createToken } from '../src/contracts/user/createToken';

export async function registerSampleUsers() {
  await Promise.all([
    _createUser({
      userId: '1',
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1',
      isVerified: true,
    }).then(() => createToken('1', 'user1_token')),
    _createUser({
      userId: '2',
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
      isVerified: true,
    }).then(() => createToken('2', 'user2_token')),
  ]);
}
