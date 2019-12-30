import { createKey, getItem } from '../../common/db';
import { DbUserUsername } from '../../types';

export async function _getNextUsername(
  username: string,
  count: number = 1
): Promise<string> {
  if (count > 50) {
    throw new Error('Cannot generate username. Exceeded limit.');
  }
  const nextUsername = count > 1 ? `${username}-${count}` : username;

  const usernameKey = createKey({
    type: 'USER_USERNAME',
    username: nextUsername,
  });
  const item = await getItem<DbUserUsername>(usernameKey);
  if (!item) {
    return nextUsername;
  }
  return await _getNextUsername(username, count + 1);
}
