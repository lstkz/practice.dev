import * as Rx from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// IMPORTS
import { AuthData, User } from './types';
// IMPORTS END

export class APIClient {
  constructor(private baseUrl: string, private getToken: () => string | null) {}

  // SIGNATURES
  user_confirmEmail(code: string): Rx.Observable<AuthData> {
    return this.call('user.confirmEmail', code);
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
    password: string;
    email: string;
    username: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.register', values);
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
    return ajax
      .post(`${this.baseUrl}/rpc/${name}`, JSON.stringify(params), headers)
      .pipe(map(res => res.response));
  }
}
