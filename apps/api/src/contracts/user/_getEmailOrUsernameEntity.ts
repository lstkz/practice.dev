import { UserEmailEntity, UserUsernameEntity } from '../../entities';
import * as db from '../../common/db-next';

export async function _getEmailOrUsernameEntity(emailOrUsername: string) {
  if (emailOrUsername.includes('@')) {
    return db.getOrNull(UserEmailEntity, { email: emailOrUsername });
  } else {
    return db.getOrNull(UserUsernameEntity, { username: emailOrUsername });
  }
}
