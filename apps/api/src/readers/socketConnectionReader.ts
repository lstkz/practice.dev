import * as db from '../common/db-next';
import { SocketConnectionEntity } from '../entities';
import { TABLE_NAME } from '../config';

export function getAllUserConnections(userId: string) {
  const { sk } = SocketConnectionEntity.createKey({
    connectionId: '-1',
    userId,
  });
  return db.queryAll(SocketConnectionEntity, {
    TableName: TABLE_NAME,
    IndexName: 'sk-data_n-index',
    ...db.getSkQueryParams(sk),
  });
}

export async function getById(id: string) {
  const { pk } = SocketConnectionEntity.createKey({
    connectionId: id,
    userId: '-1',
  });
  const items = await db.queryAll(SocketConnectionEntity, {
    TableName: TABLE_NAME,
    ...db.getPkQueryParams(pk),
  });
  return items[0];
}
