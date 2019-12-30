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
      bundle: '123',
      tags: ['frontend'],
      isSolved: true,
      createdAt: new Date(2019, 0, 1).toISOString(),
      stats: {
        submissions: 150,
        solved: 30,
      },
      difficulty: 100,
    },
    {
      id: 2,
      title: 'Counter Part 2 - API',
      description: 'Add API integration to the Counter app.',
      bundle: '123',
      tags: ['frontend', 'backend'],
      isSolved: false,
      createdAt: new Date(2019, 0, 1).toISOString(),
      stats: {
        submissions: 100,
        solved: 70,
      },
      difficulty: 200,
    },
    {
      id: 3,
      title: 'Counter Part 3 - sockets',
      description: 'Add socket integration to the Counter app.',
      bundle: '123',
      tags: ['frontend', 'backend', 'sockets'],
      isSolved: false,
      createdAt: new Date(2019, 0, 1).toISOString(),
      stats: {
        submissions: 50,
        solved: 21,
      },
      difficulty: 400,
    },
  ],
};

handle.reducer(initialState);

// --- Module ---
export function useChallengesModule() {
  handle();
}
