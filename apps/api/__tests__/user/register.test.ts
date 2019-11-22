import { register } from '../../src/contracts/user/register';
import { resetDb } from '../helper';

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
  expect(user.id).toBeDefined();
  expect(user.email).toEqual('user1@example.com');
  expect(user.username).toEqual('user1');
});

it('throw error if username is taken', async () => {
  await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  await expect(
    register({
      email: 'user12345@example.com',
      username: 'user1',
      password: 'password',
    })
  ).rejects.toThrow('Username is already taken');
});

it('throw error if email is taken', async () => {
  await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  await expect(
    register({
      email: 'useR1@example.com',
      username: 'user123456',
      password: 'password',
    })
  ).rejects.toThrow('Email is already registered');
});
