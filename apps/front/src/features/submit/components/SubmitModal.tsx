import React from 'react';
import { Modal } from 'src/components/Modal';
import { Button } from 'ui';
import { useActions } from 'typeless';
import styled from 'styled-components';
import { VoidLink } from 'src/components/VoidLink';
import { FormInput } from 'src/components/FormInput';
import { SubmitFormActions, SubmitFormProvider } from '../submit-form';
import { Alert } from 'src/components/Alert';
import { SubmitActions, getSubmitState } from '../interface';
import { useSubmitModule } from '../module';
import { FormModalContent } from 'src/components/FormModalContent';

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export function SubmitModal() {
  useSubmitModule();
  const { close } = useActions(SubmitActions);
  const { isOpened, error, isSubmitting } = getSubmitState.useState();
  const { submit } = useActions(SubmitFormActions);
  return (
    <Modal size="sm" isOpen={isOpened} close={close}>
      <FormModalContent title="Submit">
        <SubmitFormProvider>
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
              label="Enter URL address"
              placeholder="http://example.org"
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

          <Footer>
            Not sure how to submit? Check tutorial <VoidLink>here</VoidLink>
          </Footer>
        </SubmitFormProvider>
      </FormModalContent>
    </Modal>
  );
}
