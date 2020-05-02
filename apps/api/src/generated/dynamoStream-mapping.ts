import { createDynamoStreamBinding } from '../lib';

type BindingResult = ReturnType<typeof createDynamoStreamBinding>;

interface DynamoStreamMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const dynamoStreamMapping: DynamoStreamMapping = {
  SolutionEntity: {
    solutionTag_updateSolutionTagCount_handleSolution: () =>
      import(
        /* webpackChunkName: "solutionTag_updateSolutionTagCount"*/ '../contracts/solutionTag/updateSolutionTagCount'
      ).then(x => x['handleSolution']),
    user_updateUserStats_handleSolution: () =>
      import(
        /* webpackChunkName: "user_updateUserStats"*/ '../contracts/user/updateUserStats'
      ).then(x => x['handleSolution']),
  },
  SubmissionEntity: {
    submission_indexSubmission_handleSubmission: () =>
      import(
        /* webpackChunkName: "submission_indexSubmission"*/ '../contracts/submission/indexSubmission'
      ).then(x => x['handleSubmission']),
    user_updateUserStats_handleSubmission: () =>
      import(
        /* webpackChunkName: "user_updateUserStats"*/ '../contracts/user/updateUserStats'
      ).then(x => x['handleSubmission']),
  },
  SolutionVoteEntity: {
    user_updateUserStats_handleSolutionVote: () =>
      import(
        /* webpackChunkName: "user_updateUserStats"*/ '../contracts/user/updateUserStats'
      ).then(x => x['handleSolutionVote']),
  },
};
