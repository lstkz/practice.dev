import * as Rx from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

// IMPORTS
import { AuthData } from './types';
// IMPORTS END

export class APIClient {
  constructor(private baseUrl: string, private getToken: () => string) {}

  // SIGNATURES
  call(
    name: 'user.login',
    values: { email: string; password: string }
  ): Rx.Observable<AuthData>;
  call(
    name: 'user.register',
    values: { email: string; password: string; username: string }
  ): Rx.Observable<AuthData>;
  // SIGNATURES END
  call(name: string, ...params: any[]): any {
    return ajax
      .post(`${this.baseUrl}/rpc/${name}`, JSON.stringify(params), {
        'content-type': 'application/json',
      })
      .pipe(map(res => res.response));
  }
}
