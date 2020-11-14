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
import { Theme } from 'src/Theme';
import { Container } from 'src/components/Container';
import { Tab, Tabs } from 'src/components/Tabs';
import { useActions } from 'typeless';
import { SubmitModal } from '../../submit/components/SubmitModal';
import { SolutionModal } from 'src/features/solution/components/SolutionModal';
import { FavoriteSolutions } from './FavoriteSolutions';
import { useSolutionsModule, SolutionsTab } from './SolutionsTab';
import { ChallengeLoader } from 'src/components/CommonChallenge/ChallengeLoader';
import { ChallengeHeader } from 'src/components/CommonChallenge/ChallengeHeader';
import { ChallengeTags } from 'src/components/ChallengeTags';
import { Button } from 'src/components/Button';
import { SubmitActions } from 'src/features/submit/interface';
import { SolutionActions } from 'src/features/solution/interface';
import {
  createDetailsTab,
  createSwaggerTab,
  createTestSuiteTab,
  createDiscussionTab,
} from 'src/components/CommonChallenge/createChallengeTabs';
import {
  ChallengeStats,
  ChallengeStatsRow,
} from 'src/components/CommonChallenge/ChallengeStats';
import { VoidLink } from 'src/components/VoidLink';
import { SidebarStack } from 'src/components/CommonChallenge/SidebarStack';
import { useApiSpecModule } from 'src/components/CommonChallenge/ApiSpecTab';
import { useDiscussionModule } from 'src/components/CommonChallenge/Discussion/DiscussionTab';
import { DiscussionUnsubscribe } from 'src/components/DiscussionUnsubscribe';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
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
    testCase,
    recentSubmissions,
  } = getChallengeState.useState();
  const { changeTab, showSolutionsWithTag } = useActions(ChallengeActions);
  const { show: showSubmit } = useActions(SubmitActions);
  const { show: showSolution } = useActions(SolutionActions);

  return (
    <Dashboard>
      <DiscussionUnsubscribe />
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
              <SubmitModal target={{ challengeId: challenge.id }} />
              <ChallengeHeader
                domain={challenge.domain}
                title={challenge.title}
                tags={<ChallengeTags challenge={challenge} />}
                buttons={
                  <>
                    <Button
                      testId="submit-btn"
                      block
                      type={challenge.isSolved ? 'secondary' : 'primary'}
                      onClick={showSubmit}
                      disabled={status === 'testing'}
                    >
                      SUBMIT
                    </Button>
                    {/* {challenge.isSolved && (
                      <Button
                        testId="create-solution-btn"
                        block
                        type="primary"
                        onClick={() => showSolution('edit', null)}
                      >
                        CREATE SOLUTION
                      </Button>
                    )} */}
                  </>
                }
              />
              <Tabs
                selectedTab={tab}
                onIndexChange={(value: ChallengeTab) => changeTab(value)}
              >
                {createDetailsTab(
                  <Component />,
                  <SidebarStack>
                    <ChallengeStats>
                      <ChallengeStatsRow>
                        Submissions{' '}
                        <VoidLink data-test="submissions">
                          {challenge.stats.submissions}
                        </VoidLink>
                      </ChallengeStatsRow>
                      <ChallengeStatsRow>
                        Solved{' '}
                        <VoidLink data-test="solved">
                          {challenge.stats.solved}
                        </VoidLink>
                      </ChallengeStatsRow>
                      {/* <ChallengeStatsRow>
                        Solutions{' '}
                        <VoidLink data-test="solutions">
                          {challenge.stats.solutions}
                        </VoidLink>
                      </ChallengeStatsRow> */}
                    </ChallengeStats>
                    {/* <FavoriteSolutions /> */}
                  </SidebarStack>
                )}
                {createSwaggerTab(challenge.assets)}
                {createTestSuiteTab(testCase, recentSubmissions)}
                {/* <Tab testId="solutions-tab" title="Solutions" name="solutions">
                  <SolutionsTab />
                </Tab>
                {createDiscussionTab({
                  challengeId: challenge.id,
                })} */}
              </Tabs>
            </>
          )}
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
