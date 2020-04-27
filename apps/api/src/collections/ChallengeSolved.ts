import { createCollection } from '../db';

export interface ChallengeSolvedModel {
  userId: number;
  challengeId: number;
}

export const ChallengeSolvedCollection = createCollection<ChallengeSolvedModel>(
  'challengeSolved',
  [
    {
      key: {
        userId: 1,
      },
    },
    {
      key: {
        challengeId: 1,
      },
    },
    {
      key: {
        userId: 1,
        challengeId: 1,
      },
      unique: true,
    },
  ]
);
