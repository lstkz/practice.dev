import React from 'react';
import { useContestsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { ContestsFormProvider, ContestsFormActions } from '../contests-form';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { ContestsIcon } from 'src/icons/ContestsIcon';
import { createUrl } from 'src/common/url';
import styled from 'styled-components';
import { Theme, Button } from 'ui';
import { TrophyIcon } from 'src/icons/TrophyIcon';
import { FormInput } from 'src/components/FormInput';
import { useActions } from 'typeless';
import { getContestsState } from '../interface';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';
import { Alert } from 'src/components/Alert';
import { Box } from 'src/components/Box';

const TrophyWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.div`
  margin-top: 35px;
  font-size: 24px;
  text-align: center;
  color: ${Theme.textDark};
  line-height: 1.5;
`;
const Desc = styled.div`
  margin-top: 10px;
  text-align: center;
  margin-bottom: 40px;
`;

export function ContestsView() {
  useContestsModule();
  const { submit } = useActions(ContestsFormActions);
  const { isSubmitted, isSubmitting } = getContestsState.useState();

  return (
    <Dashboard>
      <Container data-test="contests-page">
        <ContestsFormProvider>
          <form
            onSubmit={e => {
              submit();
              e.preventDefault();
            }}
          >
            <Breadcrumb
              icon={<ContestsIcon />}
              url={createUrl({ name: 'contests' })}
              root="Contests"
            />
            <Box>
              <TrophyWrapper>
                <TrophyIcon gray scale={1.2} />
              </TrophyWrapper>
              <Title>We are launching soon!</Title>
              <Desc>
                Compete against other developers <br /> in short contests.
              </Desc>
              <FormInput
                testId="email-input"
                id="email"
                name="email"
                label="Email Address"
                placeholder="name@example.com"
              />

              {isSubmitted && (
                <Alert type="success" testId="subscribe-success">
                  <SuccessFilledIcon />
                  Subscribed successfully!
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
                SUBSCRIBE
              </Button>
            </Box>
          </form>
        </ContestsFormProvider>
      </Container>
    </Dashboard>
  );
}
