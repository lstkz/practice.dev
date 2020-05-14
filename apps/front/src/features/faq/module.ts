import { FaqState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: FaqState = {};

handle.reducer(initialState);

// --- Module ---
export function useFaqModule() {
  handle();
}
