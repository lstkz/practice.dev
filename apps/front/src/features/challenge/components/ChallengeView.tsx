import React from 'react';
import { useChallengeModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { ConfirmEmailWarning } from 'src/components/ConfirmEmailWarning';
import { createUrl } from 'src/common/url';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { ChallengesIcon } from 'src/icons/ChallengesIcon';
import { getChallengeState } from '../interface';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { ChallengeHeader } from './ChallengeHeader';
import { Container } from 'src/components/Container';
import { Tab, Tabs } from 'src/components/Tabs';
import { DetailsTab } from './DetailsTab';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
`;

export function ChallengeView() {
  useChallengeModule();
  const [tab, setTab] = React.useState('details');
  const { challenge, isLoading } = getChallengeState.useState();

  return (
    <Dashboard>
      <ConfirmEmailWarning />
      <Container>
        <Breadcrumb
          icon={<ChallengesIcon />}
          url={createUrl({ name: 'challenges' })}
          root="Challenges"
          details={challenge?.title}
        />
        {isLoading ? (
          'loading...'
        ) : (
          <Wrapper>
            <ChallengeHeader />
            <Tabs
              selectedTab={tab}
              onIndexChange={(value: string) => setTab(value)}
            >
              <Tab title="Details" name="details">
                <DetailsTab />
              </Tab>
              <Tab title="Test Suite" name="testSuite">
                Test Suite content
              </Tab>
              <Tab title="Solutions" name="solutions">
                Solutions content
              </Tab>
              <Tab title="Discussion" name="discussion">
                Discussion content
              </Tab>
            </Tabs>
          </Wrapper>
        )}
      </Container>
    </Dashboard>
  );
}
