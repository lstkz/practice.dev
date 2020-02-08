import React from 'react';
import { useChallengeModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { ConfirmEmailWarning } from 'src/components/ConfirmEmailWarning';
import { createUrl } from 'src/common/url';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { ChallengesIcon } from 'src/icons/ChallengesIcon';
import {
  getChallengeState,
  ChallengeActions,
  ChallengeTab,
} from '../interface';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { ChallengeHeader } from './ChallengeHeader';
import { Container } from 'src/components/Container';
import { Tab, Tabs } from 'src/components/Tabs';
import { ChallengeLoader } from './ChallengeLoader';
import { Stats } from './Stats';
import { TabContent } from './TabContent';
import { useActions } from 'typeless';
import { TestSuite } from './TestSuite';
import { SubmitModal } from '../../submit/components/SubmitModal';
import { MyRecentSubmissions } from './MyRecentSubmissions';
import { SolutionModal } from 'src/features/solution/components/SolutionModal';
import { FavoriteSolutions } from './FavoriteSolutions';
import { SidebarStack } from './SidebarStack';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
`;

export function ChallengeView() {
  useChallengeModule();
  const {
    challenge,
    isLoading,
    component: Component,
    tab,
  } = getChallengeState.useState();
  const { changeTab } = useActions(ChallengeActions);

  return (
    <Dashboard>
      <SubmitModal />
      <SolutionModal />
      <ConfirmEmailWarning />
      <Container>
        <Breadcrumb
          icon={<ChallengesIcon />}
          url={createUrl({ name: 'challenges' })}
          root="Challenges"
          details={challenge?.title}
        />
        <Wrapper>
          {isLoading ? (
            <ChallengeLoader />
          ) : (
            <>
              <ChallengeHeader />
              <Tabs
                selectedTab={tab}
                onIndexChange={(value: ChallengeTab) => changeTab(value)}
              >
                <Tab title="Details" name="details">
                  <TabContent
                    left={<Component />}
                    right={
                      <SidebarStack>
                        <Stats />
                        <FavoriteSolutions />
                      </SidebarStack>
                    }
                  />
                </Tab>
                <Tab title="Test Suite" name="testSuite">
                  <TabContent
                    left={<TestSuite />}
                    right={<MyRecentSubmissions />}
                  />
                </Tab>
                <Tab title="Solutions" name="solutions">
                  Solutions content
                </Tab>
                <Tab title="Discussion" name="discussion">
                  Discussion content
                </Tab>
              </Tabs>
            </>
          )}
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
