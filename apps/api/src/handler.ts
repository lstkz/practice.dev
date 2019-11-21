import { apiMapping } from './api-mapping';

export async function handler(
  rpcMethod: string,
  rpcParams: any[],
  authToken: string | null | undefined
) {
  const getFn = apiMapping[rpcMethod];
  if (!getFn) {
    throw new Error('RPC Method not found');
  }
  const { options } = await getFn();

  if (!options.public && !authToken) {
    throw new Error('authToken required');
  }

  return await options.handler(...rpcParams);
}
