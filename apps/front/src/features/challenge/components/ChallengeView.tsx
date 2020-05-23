import React from 'react';
import { useChallengeModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
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
import { Container } from 'src/components/Container';
import { Tab, Tabs } from 'src/components/Tabs';
import { Stats } from './Stats';
import { TabContent } from './TabContent';
import { useActions } from 'typeless';
import { TestSuite } from './TestSuite';
import { SubmitModal } from '../../submit/components/SubmitModal';
import { MyRecentSubmissions } from './MyRecentSubmissions';
import { SolutionModal } from 'src/features/solution/components/SolutionModal';
import { FavoriteSolutions } from './FavoriteSolutions';
import { SidebarStack } from './SidebarStack';
import { useSolutionsModule, SolutionsTab } from './SolutionsTab';
import { ApiSpecTab, useApiSpecModule } from './ApiSpecTab';
import { DiscussionTab, useDiscussionModule } from './Discussion/DiscussionTab';
import { ChallengeLoader } from 'src/components/CommonChallenge/ChallengeLoader';
import { ChallengeHeader } from 'src/components/CommonChallenge/ChallengeHeader';
import { ChallengeTags } from 'src/components/ChallengeTags';
import { Button } from 'ui';
import { SubmitActions } from 'src/features/submit/interface';
import { SolutionActions } from 'src/features/solution/interface';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
`;

const Buttons = styled.div`
  width: 100%;
  ${Button} + ${Button} {
    margin-top: 10px;
  }
`;

export function ChallengeView() {
  useChallengeModule();
  useSolutionsModule();
  useApiSpecModule();
  useDiscussionModule();

  const {
    challenge,
    isLoading,
    component: Component,
    tab,
  } = getChallengeState.useState();
  const { changeTab, showSolutionsWithTag } = useActions(ChallengeActions);
  const { show: showSubmit } = useActions(SubmitActions);
  const { show: showSolution } = useActions(SolutionActions);

  return (
    <Dashboard>
      <SubmitModal />
      <SolutionModal
        visibleChallengeId={challenge?.id}
        onTagClick={showSolutionsWithTag}
      />
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
              <ChallengeHeader
                domain={challenge.domain}
                title={challenge.title}
                tags={<ChallengeTags challenge={challenge} />}
                buttons={
                  <Buttons>
                    <Button
                      testId="submit-btn"
                      block
                      type={challenge.isSolved ? 'secondary' : 'primary'}
                      onClick={showSubmit}
                      disabled={status === 'testing'}
                    >
                      SUBMIT
                    </Button>
                    {challenge.isSolved && (
                      <Button
                        testId="create-solution-btn"
                        block
                        type="primary"
                        onClick={() => showSolution('edit', null)}
                      >
                        CREATE SOLUTION
                      </Button>
                    )}
                  </Buttons>
                }
              />
              <Tabs
                selectedTab={tab}
                onIndexChange={(value: ChallengeTab) => changeTab(value)}
              >
                <Tab testId="details-tab" title="Details" name="details">
                  <TabContent
                    testId="challenge-details"
                    left={<Component />}
                    right={
                      <SidebarStack>
                        <Stats />
                        <FavoriteSolutions />
                      </SidebarStack>
                    }
                  />
                </Tab>
                {challenge.assets?.swagger ? (
                  <Tab title="API Spec" name="apiSpec">
                    <ApiSpecTab />
                  </Tab>
                ) : null}
                <Tab title="Test Suite" name="testSuite">
                  <TabContent
                    left={<TestSuite />}
                    right={<MyRecentSubmissions />}
                  />
                </Tab>
                <Tab testId="solutions-tab" title="Solutions" name="solutions">
                  <SolutionsTab />
                </Tab>
                <Tab
                  testId="discussion-tab"
                  title="Discussion"
                  name="discussion"
                >
                  <DiscussionTab />
                </Tab>
              </Tabs>
            </>
          )}
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
