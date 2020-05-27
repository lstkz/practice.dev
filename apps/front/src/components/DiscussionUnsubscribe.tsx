import React from 'react';
import { getRouterState } from 'typeless-router';
import { parseQueryString } from 'src/common/url';
import { api } from 'src/services/api';
import { useActions } from 'typeless';
import { GlobalActions } from 'src/features/global/interface';

export function DiscussionUnsubscribe() {
  const { location } = getRouterState.useState();
  const { showAppSuccess, showAppError } = useActions(GlobalActions);
  React.useEffect(() => {
    const qs = parseQueryString(location?.search);
    if (qs.unsubscribe) {
      api
        .discussion_unsubscribe(qs.unsubscribe)
        .toPromise()
        .then(() => {
          showAppSuccess('Unsubscribed successfully');
        })
        .catch(e => {
          console.error(e);
          showAppError('Cannot unsubscribe');
        });
    }
  }, []);
  return null;
}
