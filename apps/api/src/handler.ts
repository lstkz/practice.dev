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
  if (authToken) {
    const user = await getDbUserByToken(authToken);
    if (!user) {
      throw new AppError('Invalid or expired token');
    }
    return runWithContext({ user }, () => options.handler(...rpcParams));
  }

  return options.handler(...rpcParams);
}
