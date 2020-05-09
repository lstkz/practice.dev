import * as Rx from 'src/rx';
import { api } from 'src/services/api';
import { SettingsActions, SettingsState, handle } from './interface';
import { handleAppError } from 'src/common/helper';
import { getGlobalState, GlobalActions } from '../global/interface';
import { RouterActions } from 'typeless-router';
import { createUrl } from 'src/common/url';

// --- Epic ---
handle
  .epic()
  .on(SettingsActions.$mounted, () =>
    api.user_getPublicProfile(getGlobalState().user!.username).pipe(
      Rx.mergeMap(ret => [SettingsActions.profileLoaded(ret)]),
      handleAppError()
    )
  )
  .on(SettingsActions.changeTab, ({ tab }) => {
    return RouterActions.push({
      pathname: createUrl({ name: 'settings' }),
      search: tab === 'profile' ? '' : 'tab=' + tab,
    });
  });

// --- Reducer ---
const initialState: SettingsState = {
  isLoaded: false,
  profile: null!,
};

handle
  .reducer(initialState)
  .on(SettingsActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(SettingsActions.profileLoaded, (stats, { profile }) => {
    stats.isLoaded = true;
    stats.profile = profile;
  })
  .on(GlobalActions.avatarUpdated, (state, { avatarUrl }) => {
    state.profile.avatarUrl = avatarUrl;
  });

// --- Module ---
export function useSettingsModule() {
  handle();
}
