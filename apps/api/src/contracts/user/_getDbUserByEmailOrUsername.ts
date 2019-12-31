import { createKey, getItem } from '../../common/db';
import { DbUserEmail, DbUserUsername } from '../../types';

export async function _getDbUserByEmailOrUsername(emailOrUsername: string) {
  return await getItem<DbUserEmail | DbUserUsername>(
    emailOrUsername.includes('@')
      ? createKey({ type: 'USER_EMAIL', email: emailOrUsername })
      : createKey({ type: 'USER_USERNAME', username: emailOrUsername })
  );
}
