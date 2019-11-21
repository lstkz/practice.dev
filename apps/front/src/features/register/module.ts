import { RegisterActions, RegisterState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: RegisterState = {
  foo: 'bar',
};

handle.reducer(initialState);

// --- Module ---
export function useRegisterModule() {
  handle();
};
