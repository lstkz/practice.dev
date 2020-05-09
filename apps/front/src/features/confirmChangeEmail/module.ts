import * as Rx from 'src/rx';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';
import { RouterActions } from 'typeless-router';
import { getRouteParams, createUrl } from 'src/common/url';
import { ConfirmChangeEmailActions, handle } from './interface';
import { GlobalActions } from '../global/interface';

// --- Epic ---
handle.epic().on(ConfirmChangeEmailActions.$mounted, () => {
  const { code } = getRouteParams('confirm-change-email');
  return api.user_confirmEmailChange(code).pipe(
    Rx.map(auth => GlobalActions.auth(auth, true)),
    handleAppError(),
    Rx.concat(
      Rx.of(
        RouterActions.push({
          pathname: createUrl({ name: 'settings' }),
          search: 'tab=account',
        })
      )
    )
  );
});

// --- Module ---
export function useConfirmChangeEmailModule() {
  handle();
}
