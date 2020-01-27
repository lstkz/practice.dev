import { S, getValidateResult, AnySchema } from 'schema';
import * as Rx from 'src/rx';
import type { ActionLike } from 'typeless';
import { GlobalActions } from 'src/features/global/interface';

function fixErrorMessage(message: string) {
  if (message === 'is required') {
    return 'This field is required';
  }

  return message[0].toUpperCase() + message.slice(1);
}

export function validate(
  errors: any,
  values: any,
  schema: AnySchema<any, any>
) {
  getValidateResult(values, schema).errors.reduce((ret, err) => {
    ret[err.path[0]] = fixErrorMessage(err.message);
    return ret;
  }, errors as any);
}

export function getErrorMessage(e: any) {
  const message = e?.response?.error || e.message;
  return message.replace('ContractError: ', '');
}

export const catchErrorAndShowModal = () =>
  Rx.catchLog<ActionLike, ActionLike>((e: any) => {
    console.error(e); 
    return Rx.of(GlobalActions.showNotification('error', getErrorMessage(e)));
  });