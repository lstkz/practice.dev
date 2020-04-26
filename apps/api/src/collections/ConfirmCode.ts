import { createCollection } from '../db';

export interface ConfirmCodeModel {
  _id: string;
  userId: number;
}

export const ConfirmCodeCollection = createCollection<ConfirmCodeModel>(
  'confirmCode'
);
