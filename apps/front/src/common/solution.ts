import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ConfirmModalActions } from 'src/features/confirmModal/interface';
import { DeleteType } from 'src/types';
import { Action } from 'typeless';
import { api } from 'src/services/api';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { getErrorMessage } from './helper';

interface ConfirmDeleteSolutionOptions {
  solutionId: string;
  action$: Rx.Observable<Action>;
  getOnCloseAction?: () => any;
}

export function confirmDeleteSolution(options: ConfirmDeleteSolutionOptions) {
  const { action$, solutionId, getOnCloseAction } = options;
  return Rx.concatObs(
    Rx.of(
      ConfirmModalActions.show(
        'Confirm',
        'Are you sure to delete this solution?',
        [
          { text: 'Delete', type: 'danger', value: 'delete' as DeleteType },
          { text: 'Cancel', type: 'secondary', value: 'close' as DeleteType },
        ]
      )
    ),
    action$.pipe(
      Rx.waitForType(ConfirmModalActions.onResult),
      Rx.mergeMap(({ payload }) => {
        const result = payload.result as DeleteType;
        if (result !== 'delete') {
          return Rx.of(ConfirmModalActions.close());
        }
        return Rx.concatObs(
          Rx.of(ConfirmModalActions.setIsLoading('delete' as DeleteType)),
          api.solution_removeSolution(solutionId).pipe(
            Rx.mergeMap(() =>
              R.compact([
                ConfirmModalActions.close(),
                getOnCloseAction && getOnCloseAction(),
                GlobalSolutionsActions.removeSolution(solutionId),
              ])
            ),
            Rx.catchLog(e =>
              Rx.of(ConfirmModalActions.setError(getErrorMessage(e)))
            )
          ),
          Rx.of(ConfirmModalActions.setIsLoading(null))
        );
      })
    )
  );
}
