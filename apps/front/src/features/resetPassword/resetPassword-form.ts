import { createForm } from 'typeless-form';
import { S } from 'schema';
import { ResetPasswordFormSymbol } from './symbol';
import { validate } from '../../common/helper';

export interface ResetPasswordFormValues {
  email: string;
}

export const [
  useResetPasswordForm,
  ResetPasswordFormActions,
  getResetPasswordFormState,
  ResetPasswordFormProvider,
] = createForm<ResetPasswordFormValues>({
  symbol: ResetPasswordFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        email: S.string().email(),
      })
    );
  },
});
