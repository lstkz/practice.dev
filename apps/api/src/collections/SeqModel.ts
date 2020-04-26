import { createCollection } from '../db';

export interface SeqModel {
  _id: string;
  seq: number;
}

export const SeqCollection = createCollection<SeqModel>('seq');
