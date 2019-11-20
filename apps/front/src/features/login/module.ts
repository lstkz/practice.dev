import { LoginActions, LoginState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: LoginState = {
  foo: 'bar',
};

handle.reducer(initialState);

// --- Module ---
export function useLoginModule() {
  handle();
}
