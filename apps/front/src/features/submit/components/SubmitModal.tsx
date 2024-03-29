import React from 'react';
import { Modal } from 'src/components/Modal';
import { Button } from 'src/components/Button';
import { useActions } from 'typeless';
import styled from 'styled-components';
import { FormInput } from 'src/components/FormInput';
import { SubmitFormActions, SubmitFormProvider } from '../submit-form';
import { Alert } from 'src/components/Alert';
import { SubmitActions, getSubmitState } from '../interface';
import { useSubmitModule } from '../module';
import { FormModalContent } from 'src/components/FormModalContent';
import { Link } from 'src/components/Link';

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
    <Modal testId="submit-modal" size="sm" isOpen={isOpened} close={close}>
      <FormModalContent title="Submit">
        <SubmitFormProvider>
          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            {error && (
              <Alert testId="submit-error" type="error">
                {error}
              </Alert>
            )}
            <FormInput
              testId="url-input"
              id="url"
              name="url"
              label="Enter URL address"
              placeholder="http://example.org"
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

          <Footer>
            Not sure how to submit? Check tutorial{' '}
            <Link href="/faq/solving-counter-on-codesandbox">here</Link>
          </Footer>
        </SubmitFormProvider>
      </FormModalContent>
    </Modal>
  );
}
