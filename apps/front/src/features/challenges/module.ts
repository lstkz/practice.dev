import { ChallengesActions, ChallengesState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ChallengesState = {
  items: [
    {
      id: 1,
      title: 'Counter',
      description: 'Create a simple counter application.',
      detailsBundleS3Key: '123',
      domain: 'frontend',
      testCase: '',
      tags: [],
      isSolved: true,
      createdAt: new Date(2019, 0, 1).toISOString(),
      stats: {
        submissions: 150,
        solved: 30,
        likes: 10,
        solutions: 30,
      },
      difficulty: 'easy',
    },
  ],
};

handle.reducer(initialState);

// --- Module ---
export function useChallengesModule() {
  handle();
}
