import { createContract } from '../../lib';
import { S } from 'schema';
import { SocketConnectionEntity } from '../../entities';

export const deleteSocketConnection = createContract(
  'socket.deleteSocketConnection'
)
  .params('connectionId')
  .schema({
    connectionId: S.string(),
  })
  .fn(async connectionId => {
    const connection = await SocketConnectionEntity.getByIdOrNull(connectionId);
    if (connection) {
      await connection.delete();
    }
  });
