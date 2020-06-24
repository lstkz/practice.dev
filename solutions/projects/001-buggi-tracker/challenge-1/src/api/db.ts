import mongodb from 'mongodb';

export interface User {
  _id: number;
  username: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface Token {
  token: string;
  userId: number;
}

export let UserModel: mongodb.Collection<User> = null;
export let TokenModel: mongodb.Collection<Token> = null;

export function initModels(db: mongodb.Db) {
  UserModel = db.collection('User');
  TokenModel = db.collection('Token');
}
