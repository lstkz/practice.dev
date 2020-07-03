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

export interface Project {
  _id: number;
  name: string;
  ownerId: number;
  memberIds: number[];
}

export interface Issue {
  _id: string;
  projectId: number;
  issueId: number;
  authorId: number;
  title: string;
  description: string;
}

export let UserModel: mongodb.Collection<User> = null;
export let TokenModel: mongodb.Collection<Token> = null;
export let SeqModel: mongodb.Collection<Seq> = null;
export let ProjectModel: mongodb.Collection<Project> = null;
export let IssueModel: mongodb.Collection<Issue> = null;

export function initModels(db: mongodb.Db) {
  UserModel = db.collection('User');
  TokenModel = db.collection('Token');
  SeqModel = db.collection('Seq');
  ProjectModel = db.collection('Project');
  IssueModel = db.collection('Issue');

  db.createIndex(
    'User',
    {
      username_lowered: 1,
    },
    { unique: true }
  );

  db.createIndex(
    'Issue',
    {
      projectId: 1,
      issueId: 1,
    },
    { unique: true }
  );
}
