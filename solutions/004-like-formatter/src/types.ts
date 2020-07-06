export interface PublicUser {
  id: number;
  username: string;
}

export interface AuthData {
  token: string;
  user: PublicUser;
}
