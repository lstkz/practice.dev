import * as Rx from 'src/rx';
import { PublicProfileActions, PublicProfileState, handle } from './interface';
import { getRouteParams } from 'src/common/url';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';

// --- Epic ---
handle.epic().on(PublicProfileActions.$mounted, () => {
  const { username } = getRouteParams('profile');

  return api.user_getPublicProfile(username).pipe(
    Rx.map(ret => PublicProfileActions.profileLoaded(ret)),
    handleAppError()
  );
});

// --- Reducer ---
const initialState: PublicProfileState = {
  isLoaded: false,
  profile: null!,
  tab: 'overview',
};

handle
  .reducer(initialState)
  .on(PublicProfileActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(PublicProfileActions.profileLoaded, (stats, { profile }) => {
    stats.isLoaded = true;
    stats.profile = profile;
  })
  .on(PublicProfileActions.changeTab, (stats, { tab }) => {
    stats.tab = tab;
  });

// --- Module ---
export function usePublicProfileModule() {
  handle();
}
