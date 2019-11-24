import { ChallengesActions, ChallengesState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ChallengesState = {
  foo: 'bar',
};

handle.reducer(initialState);

// --- Module ---
export function useChallengesModule() {
  handle();
};
