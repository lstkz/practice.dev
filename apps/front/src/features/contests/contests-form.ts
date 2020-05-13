import { createForm } from 'typeless-form';
import { S } from 'schema';
import { ContestsFormSymbol } from './symbol';
import { validate } from '../../common/helper';

export interface ContestsFormValues {
  email: string;
}

export const [
  useContestsForm,
  ContestsFormActions,
  getContestsFormState,
  ContestsFormProvider,
] = createForm<ContestsFormValues>({
  symbol: ContestsFormSymbol,
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
