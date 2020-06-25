export type Role = 'admin' | 'owner' | 'reporter';

export interface PublicUser {
  id: number;
  username: string;
  role: Role;
}

export interface AuthData {
  token: string;
  user: PublicUser;
}

export interface User {
  id: number;
  username: string;
  role: Role;
}
