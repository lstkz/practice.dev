import { UserUsernameEntity } from '../../entities';
import * as db from '../../common/db-next';

export async function _getNextUsername(
  username: string,
  count: number = 1
): Promise<string> {
  if (count > 50) {
    throw new Error('Cannot generate username. Exceeded limit.');
  }
  const nextUsername = count > 1 ? `${username}-${count}` : username;
  const item = await db.getOrNull(UserUsernameEntity, {
    username: nextUsername,
  });
  if (!item) {
    return nextUsername;
  }
  return await _getNextUsername(username, count + 1);
}
