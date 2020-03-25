import { createContract } from '../../lib';
import { S } from 'schema';
import * as socketConnectionReader from '../../readers/socketConnectionReader';
import * as db from '../../common/db-next';

export const deleteSocketConnection = createContract(
  'socket.deleteSocketConnection'
)
  .params('connectionId')
  .schema({
    connectionId: S.string(),
  })
  .fn(async connectionId => {
    const connection = await socketConnectionReader.getById(connectionId);
    if (connection) {
      await db.remove(connection.prepareDelete());
    }
  });
