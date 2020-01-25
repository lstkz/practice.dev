import * as Rx from 'rxjs';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// IMPORTS
import {
  PagedResult,
  Challenge,
  ChallengeSolved,
  Solution,
  SearchResult,
  Submission,
  AuthData,
  User,
} from './types';
// IMPORTS END

export class APIClient {
  constructor(
    private baseUrl: string,
    private getToken: () => string | null,
    private createXHR?: any
  ) {}

  // SIGNATURES
  challenge_searchChallenges(criteria: {
    sortBy?: 'created' | 'likes' | undefined;
    sortOrder?: 'desc' | 'asc' | undefined;
    pageSize?: number | undefined;
    pageNumber?: number | undefined;
    tags?: string[] | undefined;
    domain?: string | undefined;
    difficulty?: string | undefined;
  }): Rx.Observable<PagedResult<Challenge>> {
    return this.call('challenge.searchChallenges', criteria);
  }
  challenge_searchSolved(criteria: {
    challengeId?: number | undefined;
    username?: string | undefined;
    limit?: number | undefined;
    lastKey?: string | undefined;
  }): Rx.Observable<
    | { items: never[]; lastKey: null }
    | { items: ChallengeSolved[]; lastKey: string | undefined }
  > {
    return this.call('challenge.searchSolved', criteria);
  }
  challenge_updateChallenge(values: {
    tags: string[];
    domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
    difficulty: 'easy' | 'medium' | 'hard';
    id: number;
    title: string;
    description: string;
    detailsBundleS3Key: string;
    testsBundleS3Key: string;
    testCase: string;
  }): Rx.Observable<number> {
    return this.call('challenge.updateChallenge', values);
  }
  solution_createSolution(values: {
    tags: string[];
    challengeId: number;
    title: string;
    url: string;
    slug: string;
    description?: string | undefined;
  }): Rx.Observable<Solution> {
    return this.call('solution.createSolution', values);
  }
  submission_searchSubmissions(criteria: {
    challengeId?: number | undefined;
    username?: string | undefined;
    limit?: number | undefined;
    cursor?: string | null | undefined;
  }): Rx.Observable<
    | SearchResult<Submission>
    | { items: Submission[]; cursor: string | undefined }
  > {
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
  user_confirmEmail(code: string): Rx.Observable<AuthData> {
    return this.call('user.confirmEmail', code);
  }
  user_confirmResetPassword(
    code: string,
    newPassword: string
  ): Rx.Observable<AuthData> {
    return this.call('user.confirmResetPassword', code, newPassword);
  }
  user_getMe(): Rx.Observable<User> {
    return this.call('user.getMe');
  }
  user_login(values: {
    emailOrUsername: string;
    password: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.login', values);
  }
  user_register(values: {
    username: string;
    password: string;
    email: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.register', values);
  }
  user_resetPassword(emailOrUsername: string): Rx.Observable<void> {
    return this.call('user.resetPassword', emailOrUsername);
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
