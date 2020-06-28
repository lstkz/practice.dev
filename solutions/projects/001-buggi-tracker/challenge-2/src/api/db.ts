import mongodb from 'mongodb';
import { Role } from '../types';

export interface AppUser {
  id: number;
  username: string;
  role: Role;
}

export interface User {
  _id: number;
  username: string;
  username_lowered: string;
  passwordHash: string;
  passwordSalt: string;
  role: Role;
}

export interface Token {
  _id: string;
  userId: number;
}

export interface Seq {
  _id: string;
  count: number;
}

export let UserModel: mongodb.Collection<User> = null;
export let TokenModel: mongodb.Collection<Token> = null;
export let SeqModel: mongodb.Collection<Seq> = null;

export function initModels(db: mongodb.Db) {
  UserModel = db.collection('User');
  TokenModel = db.collection('Token');
  SeqModel = db.collection('Seq');

  db.createIndex(
    'User',
    {
      username: 1,
    },
    { unique: true }
  );
}
