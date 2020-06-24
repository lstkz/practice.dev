import { AuthData, PublicUser } from '../types';

interface CallApiOptions {
  method: 'get' | 'post' | 'put' | 'patch';
  url: string;
  auth?: boolean;
  body?: any;
}

async function _callApi<T>(options: CallApiOptions): Promise<T> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (options.auth ?? true) {
    headers['Authorization'] = 'Bearer ' + localStorage.token;
  }
  const ret = await fetch(options.url, {
    method: options.method,
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await ret.json().catch(() => null);
  if (ret.status >= 300 || ret.status < 200) {
    throw new Error(body?.error ?? 'Cannot connect to API');
  }
  return body;
}

export const ApiClient = {
  login(username: string, password: string) {
    return _callApi<AuthData>({
      url: '/api/login',
      method: 'post',
      body: { username, password },
      auth: false,
    });
  },
  getMe() {
    return _callApi<PublicUser>({
      url: '/api/me',
      method: 'get',
    });
  },
};
