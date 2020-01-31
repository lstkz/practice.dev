import { ProjectsState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ProjectsState = {
  foo: 'bar',
};

handle.reducer(initialState);

// --- Module ---
export function useProjectsModule() {
  handle();
}
