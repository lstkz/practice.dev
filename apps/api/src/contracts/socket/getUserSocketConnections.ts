import { createContract } from '../../lib';
import { S } from 'schema';
import * as socketConnectionReader from '../../readers/socketConnectionReader';

export const getUserSocketConnections = createContract(
  'socket.getUserSocketConnections'
)
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    return socketConnectionReader.getAllUserConnections(userId);
  });
