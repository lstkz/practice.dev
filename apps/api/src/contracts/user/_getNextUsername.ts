import { UserUsernameEntity } from '../../entities2';

export async function _getNextUsername(
  username: string,
  count: number = 1
): Promise<string> {
  if (count > 50) {
    throw new Error('Cannot generate username. Exceeded limit.');
  }
  const nextUsername = count > 1 ? `${username}-${count}` : username;
  const existing = await UserUsernameEntity.getByKeyOrNull({
    username: nextUsername,
  });
  if (!existing) {
    return nextUsername;
  }
  return await _getNextUsername(username, count + 1);
}
