import { DbUser } from '../types';
import { User } from 'shared';

export function mapDbUser(dbUser: DbUser): User {
  return {
    id: dbUser.userId,
    email: dbUser.email,
    username: dbUser.username,
    isVerified: dbUser.isVerified,
  };
}
