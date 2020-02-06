import React from 'react';
import { Modal } from 'src/components/Modal';
import { Button } from 'ui';
import { useActions } from 'typeless';
import { FormInput } from 'src/components/FormInput';
import { SolutionFormActions, SolutionFormProvider } from '../solution-form';
import { Alert } from 'src/components/Alert';
import { SolutionActions, getSolutionState } from '../interface';
import { useSolutionModule } from '../module';
import { FormModalContent } from 'src/components/FormModalContent';
import { CreatableFormSelect } from 'src/components/FormSelect';

export function SolutionModal() {
  useSolutionModule();
  const { close } = useActions(SolutionActions);
  const { isOpened, error, isSubmitting } = getSolutionState.useState();
  const { submit } = useActions(SolutionFormActions);
  return (
    <Modal size="sm" isOpen={isOpened} close={close}>
      <FormModalContent title="Create Solution">
        <SolutionFormProvider>
          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            {error && <Alert type="error">{error}</Alert>}
            <FormInput
              autoFocus
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
            />
            <CreatableFormSelect id="tags" name="tags" label="Tags" isMulti />
            <FormInput
              multiline
              maxLength={500}
              id="description"
              name="description"
              label="Description (optional)"
              placeholder="A very basic solution using vanilla javascript without any frameworks."
            />
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={isSubmitting}
            >
              SUBMIT
            </Button>
          </form>
        </SolutionFormProvider>
      </FormModalContent>
    </Modal>
  );
}
