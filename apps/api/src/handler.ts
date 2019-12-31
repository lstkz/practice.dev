import { apiMapping } from './generated/api-mapping';
import { getDbUserByToken } from './contracts/user/getDbUserByToken';
import { AppError } from './common/errors';
import { runWithContext } from './lib';

export async function handler(
  rpcMethod: string,
  rpcParams: any[],
  authToken: string | null | undefined
) {
  const getFn = apiMapping[rpcMethod];
  if (!getFn) {
    throw new AppError('RPC Method not found');
  }
  const { options } = await getFn();

  if (!options.public && !authToken) {
    throw new AppError('authToken required');
  }

  const getUser = async () => {
    if (!authToken) {
      return null;
    }
    const user = await getDbUserByToken(authToken);
    if (!user) {
      throw new AppError('Invalid or expired token');
    }
    if (options.admin && !user.isAdmin) {
      throw new AppError('Admin only');
    }
    return user;
  };
  const user = await getUser();
  return runWithContext({ user: user! }, () => options.handler(...rpcParams));
}
