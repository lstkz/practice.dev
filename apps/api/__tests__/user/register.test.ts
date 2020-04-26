import { register } from '../../src/contracts/user/register';
import { resetDb, initDb } from '../helper';

jest.mock('../../src/dispatch');

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await resetDb();
});

describe('validation', () => {
  const validEmail = 'user@example.com';
  const validUsername = 'user1';
  const validPassword = 'password';

  test.each([
    [
      {
        email: 'a',
        username: validUsername,
        password: validPassword,
      },
      "Validation error: 'values.email' must a valid email.",
    ],
    [
      {
        email: validEmail,
        username: 'a',
        password: validPassword,
      },
      "Validation error: 'values.username' length must be at least 3 characters long.",
    ],
    [
      {
        email: validEmail,
        username: '@aff$',
        password: validPassword,
      },
      "Validation error: 'values.username' must match regex /^[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}$/i.",
    ],
    [
      {
        email: validEmail,
        username: validUsername,
        password: 'a',
      },
      "Validation error: 'values.password' length must be at least 5 characters long.",
    ],
  ] as const)(
    '.register(%p) should throw `%s`',
    async (input, errorMessage) => {
      await expect(register(input)).rejects.toThrow(errorMessage);
    }
  );
});

it('register user successfully', async () => {
  const { user, token } = await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });

  expect(token).toBeDefined();
  expect(user.id).toEqual(1);
  expect(user.email).toEqual('user1@example.com');
  expect(user.username).toEqual('user1');

  const { user: user2, token: token2 } = await register({
    email: 'user2@example.com',
    username: 'user2',
    password: 'password',
  });
  expect(token2).toBeDefined();
  expect(user2.id).toEqual(2);
  expect(user2.email).toEqual('user2@example.com');
  expect(user2.username).toEqual('user2');
});

it('throw error if username is taken', async () => {
  await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  const promise = register({
    email: 'user12345@example.com',
    username: 'user1',
    password: 'password',
  });
  await expect(promise).rejects.toThrow('Username is already taken');
});

it('throw error if email is taken', async () => {
  await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  const promise = register({
    email: 'useR1@example.com',
    username: 'user123456',
    password: 'password',
  });
  await expect(promise).rejects.toThrow('Email is already registered');
});
