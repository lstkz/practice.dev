import * as Rx from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// IMPORTS
import { AuthData } from './types';
// IMPORTS END

export class APIClient {
  constructor(private baseUrl: string, private getToken: () => string) {}

  // SIGNATURES
  user_login(values: {
    email: string;
    password: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.login', values);
  }
  user_register(values: {
    email: string;
    password: string;
    username: string;
  }): Rx.Observable<AuthData> {
    return this.call('user.register', values);
  }
  // SIGNATURES END
  private call(name: string, ...params: any[]): any {
    return ajax
      .post(`${this.baseUrl}/rpc/${name}`, JSON.stringify(params), {
        'content-type': 'application/json',
      })
      .pipe(map(res => res.response));
  }
}
