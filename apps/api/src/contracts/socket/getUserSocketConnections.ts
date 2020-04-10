import { createContract } from '../../lib';
import { S } from 'schema';
import { SocketConnectionEntity } from '../../entities';

export const getUserSocketConnections = createContract(
  'socket.getUserSocketConnections'
)
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    return SocketConnectionEntity.getAllUserConnections(userId);
  });
