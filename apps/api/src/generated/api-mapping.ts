import { createRpcBinding } from '../lib';

type BindingResult = ReturnType<typeof createRpcBinding>;

interface ApiMapping {
  [x: string]: () => Promise<BindingResult>;
}
export const apiMapping: ApiMapping = {
  'challenge.updateChallenge': () =>
    import(
      /* webpackChunkName: "challenge.updateChallenge"*/ '../contracts/challenge/updateChallenge'
    ).then(x => x['updateChallengeRpc']),
  'user.authGithub': () =>
    import(
      /* webpackChunkName: "user.authGithub"*/ '../contracts/user/authGithub'
    ).then(x => x['authGithubRpc']),
  'user.authGoogle': () =>
    import(
      /* webpackChunkName: "user.authGoogle"*/ '../contracts/user/authGoogle'
    ).then(x => x['authGoogleRpc']),
  'user.confirmEmail': () =>
    import(
      /* webpackChunkName: "user.confirmEmail"*/ '../contracts/user/confirmEmail'
    ).then(x => x['confirmEmailRpc']),
  'user.confirmResetPassword': () =>
    import(
      /* webpackChunkName: "user.confirmResetPassword"*/ '../contracts/user/confirmResetPassword'
    ).then(x => x['confirmResetPasswordRpc']),
  'user.getMe': () =>
    import(/* webpackChunkName: "user.getMe"*/ '../contracts/user/getMe').then(
      x => x['getMeRpc']
    ),
  'user.login': () =>
    import(/* webpackChunkName: "user.login"*/ '../contracts/user/login').then(
      x => x['loginRpc']
    ),
  'user.register': () =>
    import(
      /* webpackChunkName: "user.register"*/ '../contracts/user/register'
    ).then(x => x['registerRpc']),
  'user.resetPassword': () =>
    import(
      /* webpackChunkName: "user.resetPassword"*/ '../contracts/user/resetPassword'
    ).then(x => x['resetPasswordRpc']),
};