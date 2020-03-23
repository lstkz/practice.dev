import { createDynamoStreamBinding } from '../lib';

type BindingResult = ReturnType<typeof createDynamoStreamBinding>;

interface DynamoStreamMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const dynamoStreamMapping: DynamoStreamMapping = {
  SolutionEntity: {
    challenge_updateSolutionStats_handleSolution: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['handleSolution']),
    solution_indexSolution_handleSolution: () =>
      import(
        /* webpackChunkName: "solution_indexSolution"*/ '../contracts/solution/indexSolution'
      ).then(x => x['handleSolution']),
  },
  SubmissionEntity: {
    challenge_updateSolutionStats_handleSubmission: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['handleSubmission']),
    submission_indexSubmission_handleSubmission: () =>
      import(
        /* webpackChunkName: "submission_indexSubmission"*/ '../contracts/submission/indexSubmission'
      ).then(x => x['handleSubmission']),
  },
  ChallengeSolvedEntity: {
    challenge_updateSolutionStats_handleChallengeSolved: () =>
      import(
        /* webpackChunkName: "challenge_updateSolutionStats"*/ '../contracts/challenge/updateSolutionStats'
      ).then(x => x['handleChallengeSolved']),
  },
  SolutionVoteEntity: {
    solution_indexSolutionVote_handleSolutionVote: () =>
      import(
        /* webpackChunkName: "solution_indexSolutionVote"*/ '../contracts/solution/indexSolutionVote'
      ).then(x => x['handleSolutionVote']),
  },
  Solution: {
    solutionTag_updateSolutionTagCount_handleSolution: () =>
      import(
        /* webpackChunkName: "solutionTag_updateSolutionTagCount"*/ '../contracts/solutionTag/updateSolutionTagCount'
      ).then(x => x['handleSolution']),
  },
};
