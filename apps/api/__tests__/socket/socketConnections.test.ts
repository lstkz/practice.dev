import { resetDb } from '../helper';
import { createSocketConnection } from '../../src/contracts/socket/createSocketConnection';
import { getUserSocketConnections } from '../../src/contracts/socket/getUserSocketConnections';
import { deleteSocketConnection } from '../../src/contracts/socket/deleteSocketConnection';

beforeEach(async () => {
  await resetDb();
});

async function getConnectionIds(userId: string) {
  const connections = await getUserSocketConnections(userId);
  return connections
    .map(item => item.connectionId)
    .sort((a, b) => a.localeCompare(b));
}

it('create, get and delete connections', async () => {
  const user1Id = 'user1-123';
  const user2Id = 'user-145';
  await createSocketConnection(user1Id, 'c1');
  await createSocketConnection(user2Id, 'c2');
  await createSocketConnection(user1Id, 'c3');
  expect(await getConnectionIds(user1Id)).toEqual(['c1', 'c3']);
  expect(await getConnectionIds(user2Id)).toEqual(['c2']);
  await deleteSocketConnection('c1');
  expect(await getConnectionIds(user1Id)).toEqual(['c3']);
});

it('create many connections over limit', async () => {
  const userId = 'user1-123';
  await createSocketConnection(userId, 'c1');
  await createSocketConnection(userId, 'c2');
  await createSocketConnection(userId, 'c3');
  await createSocketConnection(userId, 'c4');
  await createSocketConnection(userId, 'c5');
  await createSocketConnection(userId, 'c6');
  await createSocketConnection(userId, 'c7');
  expect(await getConnectionIds(userId)).toEqual([
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
  ]);
});

it('should not throw if deleting non existing connection', async () => {
  await deleteSocketConnection('c1');
});
