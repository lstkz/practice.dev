import { createContract } from '../../lib';
import { S } from 'schema';
import { createKey, queryMainIndex, batchDelete } from '../../common/db';
import { DbSocketConnection } from '../../types';

export const deleteSocketConnection = createContract(
  'socket.deleteSocketConnection'
)
  .params('connectionId')
  .schema({
    connectionId: S.string(),
  })
  .fn(async connectionId => {
    const key = createKey({
      type: 'SOCKET_CONNECTION',
      connectionId,
      userId: '-1',
    });
    const { items } = await queryMainIndex<DbSocketConnection>({
      pk: key.pk,
    });
    await batchDelete(items);
  });
