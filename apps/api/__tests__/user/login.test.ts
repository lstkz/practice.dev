import { resetDb, initDb } from '../helper';
import { login } from '../../src/contracts/user/login';
import { registerSampleUsers } from '../seed-data';

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

describe('with email', () => {
  it('email not found', async () => {
    await expect(
      login({
        emailOrUsername: 'unknown@example.com',
        password: 'password1',
      })
    ).rejects.toThrowError('Invalid credentials or user not found');
  });

  it('password invalid', async () => {
    const promise = login({
      emailOrUsername: 'user1@example.com',
      password: '12345qwe',
    });
    await expect(promise).rejects.toThrowError(
      'Invalid credentials or user not found'
    );
  });

  it('login successfully', async () => {
    const { user, token } = await login({
      emailOrUsername: 'user1@example.com',
      password: 'password1',
    });
    expect(token).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toEqual('user1@example.com');
    expect(user.username).toEqual('user1');
  });
});

describe('with username', () => {
  it('username not found', async () => {
    const promise = login({
      emailOrUsername: 'unknown',
      password: 'password2',
    });
    await expect(promise).rejects.toThrowError(
      'Invalid credentials or user not found'
    );
  });

  it('password invalid', async () => {
    const promise = login({
      emailOrUsername: 'user2',
      password: '12345qwe',
    });
    await expect(promise).rejects.toThrowError(
      'Invalid credentials or user not found'
    );
  });

  it('login successfully', async () => {
    const { user, token } = await login({
      emailOrUsername: 'user2',
      password: 'password2',
    });
    expect(token).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toEqual('user2@example.com');
    expect(user.username).toEqual('user2');
  });
});
