import * as Rx from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// IMPORTS
import {
  Challenge,
  ChallengeTag,
  PagedResult,
  Solution,
  LoadMoreResult,
  SolutionTag,
  Submission,
  AuthData,
  PresignedPost,
  User,
  PublicUserProfile,
} from './types';
// IMPORTS END

export class APIClient {
  constructor(
    private baseUrl: string,
    private getToken: () => string | null,
    private createXHR?: any
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // SIGNATURES
  challenge_getChallengeById(id: number): Rx.Observable<Challenge> {
    return this.call('challenge.getChallengeById', id);
  }
  challenge_getChallengeTags(): Rx.Observable<ChallengeTag[]> {
    return this.call('challenge.getChallengeTags');
  }
  challenge_searchChallenges(criteria: {
    tags?: string[] | undefined;
    sortBy?: 'created' | 'likes' | 'solved' | 'submissions' | undefined;
    sortOrder?: 'desc' | 'asc' | undefined;
    pageSize?: number | undefined;
    pageNumber?: number | undefined;
    domains?: string[] | undefined;
    difficulties?: string[] | undefined;
    statuses?: ('solved' | 'unsolved')[] | undefined;
  }): Rx.Observable<PagedResult<Challenge>> {
    return this.call('challenge.searchChallenges', criteria);
  }
  challenge_searchSolved(): Rx.Observable<never> {
    return this.call('challenge.searchSolved');
  }
  challenge_updateChallenge(values: {
    id: number;
    title: string;
    description: string;
    domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
    difficulty: 'easy' | 'medium' | 'hard';
    detailsBundleS3Key: string;
    testsBundleS3Key: string;
    tags: string[];
    testCase: string;
  }): Rx.Observable<number> {
    return this.call('challenge.updateChallenge', values);
  }
  solution_createSolution(values: {
    title: string;
    tags: string[];
    challengeId: number;
    url: string;
    slug: string;
    description?: string | undefined;
  }): Rx.Observable<Solution> {
    return this.call('solution.createSolution', values);
  }
  solution_getSolutionById(id: string): Rx.Observable<Solution> {
    return this.call('solution.getSolutionById', id);
  }
  solution_getSolutionBySlug(
    challengeId: number,
    slug: string
  ): Rx.Observable<Solution> {
    return this.call('solution.getSolutionBySlug', challengeId, slug);
  }
  solution_removeSolution(solutionId: string): Rx.Observable<void> {
    return this.call('solution.removeSolution', solutionId);
  }
  solution_searchLikesSolutions(criteria: {
    username: string;
    limit?: number | undefined;
    cursor?: string | null | undefined;
  }): Rx.Observable<LoadMoreResult<Solution>> {
    return this.call('solution.searchLikesSolutions', criteria);
  }
  solution_searchSolutions(criteria: {
    sortBy: 'date' | 'likes';
    sortDesc: boolean;
    tags?: string[] | undefined;
    challengeId?: number | undefined;
    username?: string | undefined;
    limit?: number | undefined;
    cursor?: string | null | undefined;
  }): Rx.Observable<LoadMoreResult<Solution>> {
    return this.call('solution.searchSolutions', criteria);
  }
  solution_updateSolution(
    solutionId: string,
    values: {
      title: string;
      tags: string[];
      url: string;
      slug: string;
      description?: string | undefined;
    }
  ): Rx.Observable<Solution> {
    return this.call('solution.updateSolution', solutionId, values);
  }
  solution_voteSolution(values: {
    solutionId: string;
    like: boolean;
  }): Rx.Observable<number> {
    return this.call('solution.voteSolution', values);
  }
  solutionTags_searchSolutionTags(criteria: {
    challengeId: number;
    limit?: number | undefined;
    cursor?: string | null | undefined;
    keyword?: string | undefined;
  }): Rx.Observable<LoadMoreResult<SolutionTag>> {
    return this.call('solutionTags.searchSolutionTags', criteria);
  }
  submission_searchSubmissions(criteria: {
    challengeId?: number | undefined;
    username?: string | undefined;
    limit?: number | undefined;
    cursor?: string | null | undefined;
  }): Rx.Observable<LoadMoreResult<Submission>> {
    return this.call('submission.searchSubmissions', criteria);
  }
  challenge_submit(values: {
    challengeId: number;
    testUrl: string;
  }): Rx.Observable<{ id: string }> {
    return this.call('challenge.submit', values);
  }
  user_authGithub(code: string): Rx.Observable<AuthData> {
    return this.call('user.authGithub', code);
  }
  user_authGoogle(accessToken: string): Rx.Observable<AuthData> {
    return this.call('user.authGoogle', accessToken);
  }
  user_changeEmail(email: string): Rx.Observable<void> {
    return this.call('user.changeEmail', email);
  }
  user_changePassword(newPassword: string): Rx.Observable<void> {
    return this.call('user.changePassword', newPassword);
  }
  user_completeAvatarUpload(): Rx.Observable<{ avatarUrl: string }> {
    return this.call('user.completeAvatarUpload');
  }
  user_confirmEmail(code: string): Rx.Observable<AuthData> {
    return this.call('user.confirmEmail', code);
  }
  user_confirmEmailChange(code: string): Rx.Observable<AuthData> {
    return this.call('user.confirmEmailChange', code);
  }
  user_confirmResetPassword(
    code: string,
    newPassword: string
  ): Rx.Observable<AuthData> {
    return this.call('user.confirmResetPassword', code, newPassword);
  }
  user_deleteAvatar(): Rx.Observable<void> {
    return this.call('user.deleteAvatar');
  }
  user_getAvatarUploadUrl(): Rx.Observable<PresignedPost> {
    return this.call('user.getAvatarUploadUrl');
  }
  user_getMe(): Rx.Observable<User> {
    return this.call('user.getMe');
  }
  user_getPublicProfile(username: string): Rx.Observable<PublicUserProfile> {
    return this.call('user.getPublicProfile', username);
  }
  user_login(values: {
    password: string;
    emailOrUsername: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.login', values);
  }
  user_register(values: {
    username: string;
    email: string;
    password: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.register', values);
  }
  user_resetPassword(emailOrUsername: string): Rx.Observable<void> {
    return this.call('user.resetPassword', emailOrUsername);
  }
  user_updatePublicProfile(values: {
    url?: string | undefined;
    country?: string | null | undefined;
    name?: string | undefined;
    bio?: string | undefined;
  }): Rx.Observable<void> {
    return this.call('user.updatePublicProfile', values);
  }
  // SIGNATURES END
  private call(name: string, ...params: any[]): any {
    const token = this.getToken();
    const headers: any = {
      'content-type': 'application/json',
    };
    if (token) {
      headers['x-token'] = token;
    }
    const options: AjaxRequest = {
      url: `${this.baseUrl}/rpc/${name}`,
      method: 'POST',
      body: JSON.stringify(params),
      headers,
    };
    if (this.createXHR) {
      options.createXHR = this.createXHR;
    }
    return ajax(options).pipe(map(res => res.response));
  }
}
