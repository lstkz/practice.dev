import { createRpcBinding } from '../lib';

type BindingResult = ReturnType<typeof createRpcBinding>;

interface ApiMapping {
  [x: string]: () => Promise<BindingResult>;
}
export const apiMapping: ApiMapping = {
  'user.login': () =>
    import(/* webpackChunkName: "user.login"*/ '../contracts/user/login').then(
      x => x['loginRpc']
    ),
  'user.register': () =>
    import(
      /* webpackChunkName: "user.register"*/ '../contracts/user/register'
    ).then(x => x['registerRpc']),
};
