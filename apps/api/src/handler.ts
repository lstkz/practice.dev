import { apiMapping } from './generated/api-mapping';
import { AppError } from './common/errors';
import { getUserByToken } from './contracts/user/getUserByToken';

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
    const user = await getUserByToken(authToken);
    if (!user) {
      throw new AppError('Invalid or expired token');
    }
    if (options.admin && !user.isAdmin) {
      throw new AppError('Admin only');
    }
    return user;
  };
  const user = await getUser();
  const params = [...rpcParams];
  if (options.injectUser) {
    params.unshift(user?.id);
  }
  return options.handler(...params);
}
