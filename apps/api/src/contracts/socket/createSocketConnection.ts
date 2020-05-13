import * as R from 'remeda';
import { getDuration } from '../../common/helper';
import { getUserSocketConnections } from './getUserSocketConnections';
import { S } from 'schema';
import { createContract } from '../../lib';
import { SocketConnectionEntity } from '../../entities';

const LIMIT = 5;
const EXPIRATION = getDuration(1, 'h');

export function _getInvalidOrExpiredConnection(
  connections: SocketConnectionEntity[],
  limit: number
) {
  const valid: Array<{ createdAt: number; item: SocketConnectionEntity }> = [];
  const expired: SocketConnectionEntity[] = [];

  connections.forEach(item => {
    const createdAt = item.createdAt || 0;
    if (createdAt + EXPIRATION < Date.now()) {
      expired.push(item);
    } else {
      valid.push({ createdAt, item });
    }
  });
  if (valid.length > limit) {
    valid.sort((a, b) => a.createdAt - b.createdAt);
    expired.push(...R.take(valid, valid.length - limit).map(x => x.item));
  }
  return expired;
}

export const createSocketConnection = createContract(
  'socket.createSocketConnection'
)
  .params('userId', 'connectionId')
  .schema({
    userId: S.string(),
    connectionId: S.string(),
  })
  .fn(async (userId, connectionId) => {
    const currentConnections = await getUserSocketConnections(userId);
    const expired = await _getInvalidOrExpiredConnection(
      currentConnections,
      LIMIT - 1
    );
    if (expired.length) {
      await Promise.all(expired.map(item => item.delete()));
    }
    const connection = new SocketConnectionEntity({
      createdAt: Date.now(),
      userId,
      connectionId,
    });
    await connection.insert();
  });
