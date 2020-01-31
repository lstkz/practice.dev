import React from 'react';
import { Modal } from 'src/components/Modal';
import { Button } from 'ui';
import { useActions } from 'typeless';
import styled from 'styled-components';
import { VoidLink } from 'src/components/VoidLink';
import { FormInput } from 'src/components/FormInput';
import {
  SubmitFormActions,
  SubmitFormProvider,
  useSubmitForm,
} from '../submit-form';
import { Alert } from 'src/components/Alert';
import { SubmitActions, getSubmitState } from '../interface';

const Content = styled.div`
  padding: 40px 50px 30px;
  ${Button} {
    margin-bottom: 20px;
  }
`;

const Footer = styled.div`
  text-align: center;
`;

const Title = styled.div`
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
`;

export function SubmitModal() {
  useSubmitForm();
  const { close } = useActions(SubmitActions);
  const { isOpened, error, isSubmitting } = getSubmitState.useState();
  const { submit } = useActions(SubmitFormActions);
  return (
    <Modal size="sm" isOpen={isOpened} close={close}>
      <Content>
        <Title>Submit</Title>
        <SubmitFormProvider>
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
      </Content>
    </Modal>
  );
}
