import React from 'react';
import { useContactUsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { getContactUsState } from '../interface';
import { useActions } from 'typeless';
import { createUrl } from 'src/common/url';
import { Box } from 'src/components/Box';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';
import { Button } from 'src/components/Button';
import { ContactUsFormActions, ContactUsFormProvider } from '../contactUs-form';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { Alert } from 'src/components/Alert';
import { ContactUsIcon } from 'src/icons/ContactUsIcon';
import { FormInput } from 'src/components/FormInput';
import { FormSelect } from 'src/components/FormSelect';
import styled from 'styled-components';
import { Title } from 'src/components/Title';

const Wrapper = styled(Box)`
  width: 460px;
  padding: 20px 55px 20px;
  margin-bottom: 40px;
  textarea {
    max-width: 100%;
    min-width: 100%;
  }
`;

const Desc = styled.div`
  text-align: center;
  margin-top: 5px;
  margin-bottom: 40px;
`;

const Bottom = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export function ContactUsView() {
  useContactUsModule();
  const { submit } = useActions(ContactUsFormActions);
  const { isSubmitted, isSubmitting } = getContactUsState.useState();

  return (
    <Dashboard>
      <Container data-test="contact-us-page">
        <ContactUsFormProvider>
          <form
            onSubmit={e => {
              submit();
              e.preventDefault();
            }}
          >
            <Breadcrumb
              icon={<ContactUsIcon />}
              url={createUrl({ name: 'contact-us' })}
              root="Contact Us"
            />
            <Wrapper>
              <Title center>Contact Us</Title>
              <Desc>We are always here to help you!</Desc>
              <FormInput
                testId="email-input"
                id="email"
                name="email"
                label="Email Address"
                placeholder="name@example.com"
              />
              <FormSelect
                id="category"
                testId="category"
                label="Category"
                name="category"
                options={[
                  {
                    label: 'Bug Report',
                    value: 'Bug Report',
                  },
                  {
                    label: 'Feature Request',
                    value: 'Feature Request',
                  },
                  {
                    label: 'Other',
                    value: 'Other',
                  },
                ]}
              />
              <FormInput
                testId="message-input"
                id="message"
                name="message"
                label="Message"
                multiline
              />
              {isSubmitted && (
                <Alert type="success" testId="send-success">
                  <SuccessFilledIcon />
                  Sent successfully!
                </Alert>
              )}
              <Button
                testId="submit-btn"
                loading={isSubmitting}
                disabled={isSubmitted}
                type="primary"
                htmlType="submit"
                block
              >
                SEND MESSAGE
              </Button>
              <Bottom>
                You can also send a message directly at{' '}
                <a target="_blank" href="mailto:contact@practice.dev">
                  contact@practice.dev
                </a>{' '}
                <br />
                or
                <br />
                create an issue on GitHub{' '}
                <a
                  target="_blank"
                  href="https://github.com/practice-dev/practice-dev/issues/new"
                >
                  here
                </a>
                .
              </Bottom>
            </Wrapper>
          </form>
        </ContactUsFormProvider>
      </Container>
    </Dashboard>
  );
}
