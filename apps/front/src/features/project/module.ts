import * as Rx from 'src/rx';
import { ProjectActions, ProjectState, handle } from './interface';
import { api } from 'src/services/api';
import { getRouteParams } from 'src/common/url';
import { handleAppError } from 'src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(ProjectActions.$mounted, () => {
    return ProjectActions.load();
  })
  .on(ProjectActions.load, () => {
    const { id } = getRouteParams('project');

    return api.project_getProjectById(id).pipe(
      Rx.map(({ project, challenges }) =>
        ProjectActions.loaded(project, challenges)
      ),
      handleAppError()
    );
  });

// --- Reducer ---
const initialState: ProjectState = {
  isLoading: true,
  project: null!,
  challenges: [],
};

handle
  .reducer(initialState)
  .on(ProjectActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ProjectActions.loaded, (state, { challenges, project }) => {
    state.isLoading = false;
    state.project = project;
    state.challenges = challenges;
  });

// --- Module ---
export function useProjectModule() {
  handle();
}
