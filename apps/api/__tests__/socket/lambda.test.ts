import { socketHandler } from '../../src/lambda/socket';
import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { getUserSocketConnections } from '../../src/contracts/socket/getUserSocketConnections';
import { getUserByToken } from '../../src/contracts/user/getUserByToken';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

describe('validation', () => {
  it('should throw if no token in query in CONNECT', async () => {
    await expect(
      socketHandler({
        requestContext: {
          connectionId: 'c1',
          eventType: 'CONNECT',
        },
      } as any)
    ).rejects.toThrow('"token" is missing in query string');
  });

  it('should throw if invalid token', async () => {
    await expect(
      socketHandler({
        requestContext: {
          connectionId: 'c1',
          eventType: 'CONNECT',
        },
        queryStringParameters: {
          token: 'abc',
        },
      } as any)
    ).rejects.toThrow('invalid or expired token');
  });
});

it('CONNECT and DISCONNECT', async () => {
  await socketHandler({
    requestContext: {
      connectionId: 'c1',
      eventType: 'CONNECT',
    },
    queryStringParameters: {
      token: 'user1_token',
    },
  } as any);

  const user = await getUserByToken('user1_token');

  expect(await getUserSocketConnections(user!.id)).toHaveLength(1);

  await socketHandler({
    requestContext: {
      connectionId: 'c1',
      eventType: 'DISCONNECT',
    },
  } as any);
  expect(await getUserSocketConnections(user!.id)).toHaveLength(0);
});
