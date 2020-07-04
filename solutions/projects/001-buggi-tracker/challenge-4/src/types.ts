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

export interface Project {
  id: number;
  name: string;
  owner: PublicUser;
  members: PublicUser[];
  issueCount: number;
}

export interface Issue {
  projectId: number;
  issueId: number;
  title: string;
  description: string;
  author: PublicUser;
  status: string;
}
