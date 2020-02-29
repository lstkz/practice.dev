import { createDynamoStreamBinding } from '../lib';

type BindingResult = ReturnType<typeof createDynamoStreamBinding>;

interface DynamoStreamMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const dynamoStreamMapping: DynamoStreamMapping = {
  Solution: {
    incSolutionStats: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['incSolutionStats']),
  },
  Submission: {
    incSubmissionStats: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['incSubmissionStats']),
  },
  ChallengeSolved: {
    incSolvedStats: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['incSolvedStats']),
  },
};
