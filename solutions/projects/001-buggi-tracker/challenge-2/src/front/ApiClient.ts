import { AuthData, PublicUser, User } from '../types';

interface CallApiOptions {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
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
  getUsers() {
    return _callApi<User[]>({
      url: '/api/users',
      method: 'get',
    });
  },
  deleteUser(id: number) {
    return _callApi<void>({
      url: '/api/users/' + id,
      method: 'delete',
    });
  },
  getUser(id: number) {
    return _callApi<User>({
      url: '/api/users/' + id,
      method: 'get',
    });
  },
  createUser(values: any) {
    return _callApi<User>({
      url: '/api/users',
      method: 'post',
      body: values,
    });
  },
  updateUser(id: number, values: any) {
    return _callApi<User>({
      url: '/api/users/' + id,
      method: 'post',
      body: values,
    });
  },
};
