import { createRpcBinding } from '../lib';

type BindingResult = ReturnType<typeof createRpcBinding>;

interface ApiMapping {
  [x: string]: () => Promise<BindingResult>;
}
export const apiMapping: ApiMapping = {
  'challenge.getChallengeById': () =>
    import(
      /* webpackChunkName: "challenge.getChallengeById"*/ '../contracts/challenge/getChallengeById'
    ).then(x => x['getChallengeByIdRpc']),
  'challenge.getChallengeTags': () =>
    import(
      /* webpackChunkName: "challenge.getChallengeTags"*/ '../contracts/challenge/getChallengeTags'
    ).then(x => x['getChallengeTagsRpc']),
  'challenge.searchChallenges': () =>
    import(
      /* webpackChunkName: "challenge.searchChallenges"*/ '../contracts/challenge/searchChallenges'
    ).then(x => x['searchChallengesRpc']),
  'challenge.searchSolved': () =>
    import(
      /* webpackChunkName: "challenge.searchSolved"*/ '../contracts/challenge/searchSolved'
    ).then(x => x['searchSolvedRpc']),
  'challenge.updateChallenge': () =>
    import(
      /* webpackChunkName: "challenge.updateChallenge"*/ '../contracts/challenge/updateChallenge'
    ).then(x => x['updateChallengeRpc']),
  'solution.createSolution': () =>
    import(
      /* webpackChunkName: "solution.createSolution"*/ '../contracts/solution/createSolution'
    ).then(x => x['createSolutionRpc']),
  'solution.getSolutionById': () =>
    import(
      /* webpackChunkName: "solution.getSolutionById"*/ '../contracts/solution/getSolutionById'
    ).then(x => x['getSolutionByIdRpc']),
  'solution.getSolutionBySlug': () =>
    import(
      /* webpackChunkName: "solution.getSolutionBySlug"*/ '../contracts/solution/getSolutionBySlug'
    ).then(x => x['getSolutionBySlugRpc']),
  'solution.removeSolution': () =>
    import(
      /* webpackChunkName: "solution.removeSolution"*/ '../contracts/solution/removeSolution'
    ).then(x => x['removeSolutionRpc']),
  'solution.searchLikesSolutions': () =>
    import(
      /* webpackChunkName: "solution.searchLikesSolutions"*/ '../contracts/solution/searchLikesSolutions'
    ).then(x => x['searchSolutionsRpc']),
  'solution.searchSolutions': () =>
    import(
      /* webpackChunkName: "solution.searchSolutions"*/ '../contracts/solution/searchSolutions'
    ).then(x => x['searchSolutionsRpc']),
  'solution.updateSolution': () =>
    import(
      /* webpackChunkName: "solution.updateSolution"*/ '../contracts/solution/updateSolution'
    ).then(x => x['updateSolutionRpc']),
  'solution.voteSolution': () =>
    import(
      /* webpackChunkName: "solution.voteSolution"*/ '../contracts/solution/voteSolution'
    ).then(x => x['voteSolutionRpc']),
  'solutionTags.searchSolutionTags': () =>
    import(
      /* webpackChunkName: "solutionTags.searchSolutionTags"*/ '../contracts/solutionTag/searchSolutionTags'
    ).then(x => x['searchSolutionsRpc']),
  'submission.searchSubmissions': () =>
    import(
      /* webpackChunkName: "submission.searchSubmissions"*/ '../contracts/submission/searchSubmissions'
    ).then(x => x['searchSubmissionsRpc']),
  'challenge.submit': () =>
    import(
      /* webpackChunkName: "challenge.submit"*/ '../contracts/submission/submit'
    ).then(x => x['submitRpc']),
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
  'user.getPublicProfile': () =>
    import(
      /* webpackChunkName: "user.getPublicProfile"*/ '../contracts/user/getPublicProfile'
    ).then(x => x['getPublicProfileRpc']),
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
