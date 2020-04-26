import { createCollection } from '../db';

export interface ResetPasswordModel {
  _id: string;
  userId: number;
  expireAt: Date;
}

export const ResetPasswordCollection = createCollection<ResetPasswordModel>(
  'confirmCode'
);
