import * as Rx from 'src/rx';
import React from 'react';
import { PublicProfileSectionSymbol, PublicProfileFormSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import { S } from 'schema';
import { SettingsSection } from './SettingsSection';
import { createForm } from 'typeless-form';
import {
  validate,
  handleAppError,
  countryListItemToOption,
} from 'src/common/helper';
import { SelectOption } from 'src/types';
import { FormInput } from 'src/components/FormInput';
import { FormSelect } from 'src/components/FormSelect';
import { countryList, urlRegex } from 'shared';
import { Button } from 'ui';
import { api } from 'src/services/api';
import { Alert } from 'src/components/Alert';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';

export const [
  handle,
  PublicProfileSectionActions,
  getPublicProfileSectionState,
] = createModule(PublicProfileSectionSymbol)
  .withActions({
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setIsDone: (isDone: boolean) => ({ payload: { isDone } }),
  })
  .withState<PublicProfileSectionState>();

interface PublicProfileSectionState {
  isDone: boolean;
  isSubmitting: boolean;
}

const initialState: PublicProfileSectionState = {
  isDone: false,
  isSubmitting: false,
};

export interface PublicProfileFormValues {
  name: string;
  bio: string;
  url: string;
  country: SelectOption | null;
}

export const [
  usePublicProfileForm,
  PublicProfileFormActions,
  getPublicProfileFormState,
  PublicProfileFormProvider,
] = createForm<PublicProfileFormValues>({
  symbol: PublicProfileFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        name: S.string().optional(),
        bio: S.string().optional(),
        url: S.string().regex(urlRegex).optional(),
        country: S.any().optional(),
      })
    );
    if (errors.url?.includes('Must match regex')) {
      errors.url = 'Invalid URL';
    }
  },
});

handle.epic().on(PublicProfileFormActions.setSubmitSucceeded, () => {
  const { values } = getPublicProfileFormState();
  return Rx.concatObs(
    Rx.of(PublicProfileSectionActions.setIsSubmitting(true)),
    api
      .user_updatePublicProfile({
        bio: values.bio ?? null,
        name: values.name ?? null,
        url: values.url ?? null,
        country: values.country?.value ?? null,
      })
      .pipe(
        Rx.map(() => PublicProfileSectionActions.setIsDone(true)),
        handleAppError()
      ),
    Rx.of(PublicProfileSectionActions.setIsSubmitting(false))
  );
});

handle
  .reducer(initialState)
  .on(PublicProfileFormActions.setSubmitSucceeded, state => {
    state.isDone = false;
  })
  .on(PublicProfileSectionActions.setIsDone, (state, { isDone }) => {
    state.isDone = isDone;
  })
  .on(
    PublicProfileSectionActions.setIsSubmitting,
    (state, { isSubmitting }) => {
      state.isSubmitting = isSubmitting;
    }
  );

export function PublicProfileSection() {
  usePublicProfileForm();
  handle();
  const { isSubmitting, isDone } = getPublicProfileSectionState.useState();
  const { submit } = useActions(PublicProfileFormActions);

  const countryOptions = React.useMemo(() => {
    return countryList.map(countryListItemToOption);
  }, [countryList]);
  return (
    <SettingsSection title="Public Profile">
      <PublicProfileFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <FormInput
            maxLength={40}
            testId="name-input"
            id="name"
            name="name"
            label="Name"
          />
          <FormSelect label="Country" name="country" options={countryOptions} />
          <FormInput
            maxLength={200}
            testId="bio-input"
            id="bio"
            name="bio"
            label="Bio"
          />
          <FormInput
            maxLength={60}
            testId="url-input"
            id="url"
            name="url"
            label="URL"
          />

          {isDone && (
            <Alert type="success">
              <SuccessFilledIcon />
              Updated Successfully
            </Alert>
          )}
          <Button
            testId="profile-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
          >
            UPDATE
          </Button>
        </form>
      </PublicProfileFormProvider>
    </SettingsSection>
  );
}
