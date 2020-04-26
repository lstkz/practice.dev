import { createCollection } from '../db';

export interface TokenModel {
  _id: string;
  userId: number;
}

export const TokenCollection = createCollection<TokenModel>('token');
