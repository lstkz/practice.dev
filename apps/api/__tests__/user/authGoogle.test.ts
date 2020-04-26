import { mocked } from 'ts-jest/utils';
import { getEmail } from '../../src/common/google';
import { _createUser } from '../../src/contracts/user/_createUser';
import { authGoogle } from '../../src/contracts/user/authGoogle';
import { resetDb, initDb } from '../helper';

jest.mock('../../src/common/google');

const mockedGetEmail = mocked(getEmail);

beforeAll(async () => {
  await initDb();
});

beforeEach(resetDb);

it('return auth data for connected user', async () => {
  await _createUser({
    email: 'user1@example.com',
    password: 'pass',
    username: 'user1',
    isVerified: true,
  });

  mockedGetEmail.mockImplementation(async () => 'user1@example.com');

  const ret = await authGoogle('abc');
  expect(ret.user.id).toEqual(1);
});

it('register a new user', async () => {
  mockedGetEmail.mockImplementation(async () => 'user1@example.com');

  const ret = await authGoogle('abc');
  expect(ret.user.username).toEqual('user1');
});

it('register a new user (duplicated username)', async () => {
  await _createUser({
    email: 'user2@example.com',
    password: 'pass',
    username: 'foo',
    isVerified: true,
  });

  mockedGetEmail.mockImplementation(async () => 'foo@example.com');

  const ret = await authGoogle('abc');
  expect(ret.user.username).toEqual('foo-2');
});
