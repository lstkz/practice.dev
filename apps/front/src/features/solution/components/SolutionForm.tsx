import React from 'react';
import {
  SolutionFormProvider,
  SolutionFormActions,
  getSolutionFormState,
} from '../solution-form';
import { getChallengeState } from 'src/features/challenge/interface';
import { getSolutionState } from '../interface';
import { useActions, useMappedState } from 'typeless';
import { Alert } from 'src/components/Alert';
import { FormInput } from 'src/components/FormInput';
import { CreatableFormSelect } from 'src/components/FormSelect';
import { Button } from 'ui';
import styled from 'styled-components';

const ShareInput = styled.input`
  &&&& {
    height: auto;
    padding: 0;
    display: block;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    border: none;
    width: auto;
    flex-grow: 1;
    margin-left: 5px;
    box-shadow: none;
    border-radius: 0;
  }
`;

const ShareWrapper = styled.div`
  display: flex;
`;

export function SolutionForm() {
  const { challenge } = getChallengeState.useState();
  const { error, isSubmitting } = getSolutionState.useState();
  const { submit } = useActions(SolutionFormActions);
  const slug = useMappedState([getSolutionFormState], x => x.values.slug || '');

  const shareUrl = slug
    ? `${document.location.origin}/challenges/${challenge.id}?s=${slug}`
    : '-';

  return (
    <SolutionFormProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        {error && <Alert type="error">{error}</Alert>}
        <FormInput
          id="url"
          name="url"
          label="Provide Github or Codesandbox URL"
          maxLength={300}
          placeholder="https://github.com/john/create-app"
        />
        <FormInput
          id="title"
          name="title"
          label="Short title"
          maxLength={50}
          placeholder="Pure vanilla javascript"
        />
        <FormInput
          id="slug"
          name="slug"
          label="Solution slug"
          maxLength={30}
          placeholder="pure-vanilla-javascript"
          description={
            <ShareWrapper>
              Share url: <ShareInput value={shareUrl} readOnly />
            </ShareWrapper>
          }
        />
        <CreatableFormSelect
          id="tags"
          name="tags"
          label="Tags"
          isMulti
          description="Type and press Enter to create a new tag."
        />
        <FormInput
          multiline
          maxLength={500}
          id="description"
          name="description"
          label="Description (optional)"
          placeholder="A very basic solution using vanilla javascript without any frameworks."
        />
        <Button type="primary" block htmlType="submit" loading={isSubmitting}>
          SUBMIT
        </Button>
      </form>
    </SolutionFormProvider>
  );
}
