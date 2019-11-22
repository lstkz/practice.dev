export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface AuthData {
  user: User;
  token: string;
}
