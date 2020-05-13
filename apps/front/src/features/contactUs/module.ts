import { ContactUsActions, ContactUsState, handle } from './interface';
import * as Rx from 'src/rx';
import {
  ContactUsFormActions,
  useContactUsForm,
  getContactUsFormState,
} from './contactUs-form';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';
import { getGlobalState } from '../global/interface';

// --- Epic ---
handle
  .epic()
  .on(ContactUsActions.$mounted, () => {
    const { user } = getGlobalState();
    if (!user) {
      return ContactUsFormActions.reset();
    }
    return [
      ContactUsFormActions.reset(),
      ContactUsFormActions.change('email', user.email),
    ];
  })
  .on(ContactUsFormActions.setSubmitSucceeded, () => {
    const { values } = getContactUsFormState();
    return Rx.concatObs(
      Rx.of(ContactUsActions.setIsSubmitting(true)),
      api
        .contact_sendContact({
          email: values.email,
          category: values.category.value,
          message: values.message,
        })
        .pipe(
          Rx.map(() => ContactUsActions.setSubmitted()),
          handleAppError()
        ),
      Rx.of(ContactUsActions.setIsSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: ContactUsState = {
  isSubmitted: false,
  isSubmitting: false,
};

handle
  .reducer(initialState)
  .on(ContactUsActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ContactUsActions.setSubmitted, state => {
    state.isSubmitted = true;
  })
  .on(ContactUsActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  });

// --- Module ---
export function useContactUsModule() {
  useContactUsForm();
  handle();
}
