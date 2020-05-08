import * as Rx from 'src/rx';
import { api } from 'src/services/api';
import { SettingsActions, SettingsState, handle } from './interface';
import { handleAppError } from 'src/common/helper';
import { getGlobalState, GlobalActions } from '../global/interface';

// --- Epic ---
handle.epic().on(SettingsActions.$mounted, () =>
  api.user_getPublicProfile(getGlobalState().user!.username).pipe(
    Rx.map(ret => SettingsActions.profileLoaded(ret)),
    handleAppError()
  )
);

// --- Reducer ---
const initialState: SettingsState = {
  isLoaded: false,
  tab: 'profile',
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
  .on(SettingsActions.changeTab, (state, { tab }) => {
    state.tab = tab;
  })
  .on(GlobalActions.avatarUpdated, (state, { avatarUrl }) => {
    state.profile.avatarUrl = avatarUrl;
  });

// --- Module ---
export function useSettingsModule() {
  handle();
}
