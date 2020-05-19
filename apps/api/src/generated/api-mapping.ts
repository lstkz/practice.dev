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
  'contact.sendContact': () =>
    import(
      /* webpackChunkName: "contact.sendContact"*/ '../contracts/contact/sendContact'
    ).then(x => x['sendContactRpc']),
  'discussion.createComment': () =>
    import(
      /* webpackChunkName: "discussion.createComment"*/ '../contracts/discussion/createComment'
    ).then(x => x['loginRpc']),
  'discussion.deleteComment': () =>
    import(
      /* webpackChunkName: "discussion.deleteComment"*/ '../contracts/discussion/deleteComment'
    ).then(x => x['deleteCommentRpc']),
  'discussion.markAnswer': () =>
    import(
      /* webpackChunkName: "discussion.markAnswer"*/ '../contracts/discussion/markAnswer'
    ).then(x => x['markAnswerRpc']),
  'discussion.searchComments': () =>
    import(
      /* webpackChunkName: "discussion.searchComments"*/ '../contracts/discussion/searchComments'
    ).then(x => x['searchCommentsRpc']),
  'errorReporting.reportFrontendError': () =>
    import(
      /* webpackChunkName: "errorReporting.reportFrontendError"*/ '../contracts/errorReporting/reportFrontendError'
    ).then(x => x['reportFrontendErrorRpc']),
  'featureSubscription.createFeatureSubscription': () =>
    import(
      /* webpackChunkName: "featureSubscription.createFeatureSubscription"*/ '../contracts/featureSubscription/createFeatureSubscription'
    ).then(x => x['confirmEmailRpc']),
  'project.updateProject': () =>
    import(
      /* webpackChunkName: "project.updateProject"*/ '../contracts/project/updateProject'
    ).then(x => x['updateProjectRpc']),
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
  'submission.submitProject': () =>
    import(
      /* webpackChunkName: "submission.submitProject"*/ '../contracts/submission/submitProject'
    ).then(x => x['submitProjectRpc']),
  'user.authGithub': () =>
    import(
      /* webpackChunkName: "user.authGithub"*/ '../contracts/user/authGithub'
    ).then(x => x['authGithubRpc']),
  'user.authGoogle': () =>
    import(
      /* webpackChunkName: "user.authGoogle"*/ '../contracts/user/authGoogle'
    ).then(x => x['authGoogleRpc']),
  'user.changeEmail': () =>
    import(
      /* webpackChunkName: "user.changeEmail"*/ '../contracts/user/changeEmail'
    ).then(x => x['changeEmailRpc']),
  'user.changePassword': () =>
    import(
      /* webpackChunkName: "user.changePassword"*/ '../contracts/user/changePassword'
    ).then(x => x['changePasswordRpc']),
  'user.completeAvatarUpload': () =>
    import(
      /* webpackChunkName: "user.completeAvatarUpload"*/ '../contracts/user/completeAvatarUpload'
    ).then(x => x['completeAvatarUploadRpc']),
  'user.confirmEmail': () =>
    import(
      /* webpackChunkName: "user.confirmEmail"*/ '../contracts/user/confirmEmail'
    ).then(x => x['confirmEmailRpc']),
  'user.confirmEmailChange': () =>
    import(
      /* webpackChunkName: "user.confirmEmailChange"*/ '../contracts/user/confirmEmailChange'
    ).then(x => x['confirmEmailChangeRpc']),
  'user.confirmResetPassword': () =>
    import(
      /* webpackChunkName: "user.confirmResetPassword"*/ '../contracts/user/confirmResetPassword'
    ).then(x => x['confirmResetPasswordRpc']),
  'user.deleteAvatar': () =>
    import(
      /* webpackChunkName: "user.deleteAvatar"*/ '../contracts/user/deleteAvatar'
    ).then(x => x['deleteAvatarRpc']),
  'user.getAvatarUploadUrl': () =>
    import(
      /* webpackChunkName: "user.getAvatarUploadUrl"*/ '../contracts/user/getAvatarUploadUrl'
    ).then(x => x['getAvatarUploadUrlRpc']),
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
  'user.updatePublicProfile': () =>
    import(
      /* webpackChunkName: "user.updatePublicProfile"*/ '../contracts/user/updatePublicProfile'
    ).then(x => x['updatePublicProfileRpc']),
};
