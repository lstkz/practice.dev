import React from 'react';
import {
  SolutionFormProvider,
  SolutionFormActions,
  getSolutionFormState,
} from '../solution-form';
import { getSolutionState, SolutionActions } from '../interface';
import { useActions, useMappedState } from 'typeless';
import { Alert } from 'src/components/Alert';
import { FormInput } from 'src/components/FormInput';
import { AsyncCreatableFormSelect } from 'src/components/FormSelect';
import { Button } from 'src/components/Button';
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

interface SolutionFormProps {
  challengeId: number;
}

export function SolutionForm(props: SolutionFormProps) {
  const { challengeId } = props;
  const { error, isSubmitting } = getSolutionState.useState();
  const { submit } = useActions(SolutionFormActions);
  const { searchTags } = useActions(SolutionActions);
  const slug = useMappedState([getSolutionFormState], x => x.values.slug || '');

  const shareUrl = slug
    ? `${document.location.origin}/challenges/${challengeId}?s=${slug}`
    : '-';

  return (
    <SolutionFormProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        {error && (
          <Alert testId="solution-error" type="error">
            {error}
          </Alert>
        )}
        <FormInput
          testId="url"
          id="url"
          name="url"
          label="Provide Github or Codesandbox URL"
          maxLength={300}
          placeholder="https://github.com/john/create-app"
        />
        <FormInput
          id="title"
          testId="title"
          name="title"
          label="Short title"
          maxLength={50}
          placeholder="Pure vanilla javascript"
        />
        <FormInput
          id="slug"
          testId="slug"
          name="slug"
          label="Solution slug"
          maxLength={30}
          placeholder="pure-vanilla-javascript"
          description={
            <ShareWrapper>
              Share url:{' '}
              <ShareInput data-test="share-url" value={shareUrl} readOnly />
            </ShareWrapper>
          }
        />
        <AsyncCreatableFormSelect
          testId="tags"
          id="tags"
          name="tags"
          label="Tags"
          isMulti
          description="Type and press Enter to create a new tag."
          defaultOptions
          loadOptions={(inputValue, _, additional) => {
            return new Promise(resolve => {
              searchTags(inputValue, additional, resolve);
            });
          }}
        />
        <FormInput
          multiline
          maxLength={500}
          testId="description"
          id="description"
          name="description"
          label="Description (optional)"
          placeholder="A very basic solution using vanilla javascript without any frameworks."
        />
        <Button
          testId="submit-btn"
          type="primary"
          block
          htmlType="submit"
          loading={isSubmitting}
        >
          SUBMIT
        </Button>
      </form>
    </SolutionFormProvider>
  );
}
