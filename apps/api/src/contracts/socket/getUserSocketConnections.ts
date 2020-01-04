import { createContract } from '../../lib';
import { S } from 'schema';
import { createKey, queryIndex } from '../../common/db';
import { DbSocketConnection } from '../../types';

export const getUserSocketConnections = createContract(
  'socket.getUserSocketConnections'
)
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const key = createKey({
      type: 'SOCKET_CONNECTION',
      connectionId: '-1',
      userId,
    });
    const { items } = await queryIndex<DbSocketConnection>({
      index: 'sk-data_n-index',
      sk: key.sk,
    });
    return items;
  });
