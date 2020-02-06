import { createForm } from 'typeless-form';
import { S } from 'schema';
import { validate } from '../../common/helper';
import { SubmitFormSymbol } from './symbol';

export interface SubmitFormValues {
  url: string;
}

export const [
  useSubmitForm,
  SubmitFormActions,
  getSubmitFormState,
  SubmitFormProvider,
] = createForm<SubmitFormValues>({
  symbol: SubmitFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        url: S.string().regex(
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/
        ),
      })
    );
    if (errors.url?.includes('Must match regex')) {
      errors.url = 'Invalid URL';
    }
  },
});
