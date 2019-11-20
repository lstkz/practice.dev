import { GlobalActions, GlobalState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
};

handle.reducer(initialState);

// --- Module ---
export function useGlobalModule() {
  handle();
}
