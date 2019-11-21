import { createForm } from 'typeless-form';
import { S } from 'schema';
import { RegisterFormSymbol } from './symbol';
import { validate } from '../../common/helper';

export interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export const [
  useRegisterForm,
  RegisterFormActions,
  getRegisterFormState,
  RegisterFormProvider,
] = createForm<RegisterFormValues>({
  symbol: RegisterFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        username: S.string()
          .min(3)
          .max(20),
        email: S.string()
          .max(50)
          .email(),
        password: S.string().min(4),
        confirmPassword: S.string(),
      })
    );
    if (
      !errors.password &&
      !errors.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match';
    }
  },
});
