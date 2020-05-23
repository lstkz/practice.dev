import React from 'react';
import { useProjectChallengeModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import {
  getProjectChallengeState,
  ProjectChallengeActions,
  ProjectChallengeTab,
} from '../interface';
import { useActions } from 'typeless';
import styled from 'styled-components';
import { Theme, Button } from 'ui';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { ProjectsSmallIcon } from 'src/icons/ProjectsSmallIcon';
import { createUrl, createFullProjectsUrl } from 'src/common/url';
import { Tabs } from 'src/components/Tabs';
import { ChallengeLoader } from 'src/components/CommonChallenge/ChallengeLoader';
import { SubmitActions } from 'src/features/submit/interface';
import { ChallengeHeader } from 'src/components/CommonChallenge/ChallengeHeader';
import { DomainTag } from 'src/components/DomainTag';
import { SubmitModal } from 'src/features/submit/components/SubmitModal';
import {
  createDetailsTab,
  createSwaggerTab,
  createTestSuiteTab,
} from 'src/components/CommonChallenge/createChallengeTabs';
import { SidebarStack } from 'src/components/CommonChallenge/SidebarStack';
import {
  ChallengeStats,
  ChallengeStatsRow,
} from 'src/components/CommonChallenge/ChallengeStats';
import { VoidLink } from 'src/components/VoidLink';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
`;

export function ProjectChallengeView() {
  useProjectChallengeModule();

  const {
    challenge,
    isLoading,
    component: Component,
    tab,
    testCase,
    recentSubmissions,
  } = getProjectChallengeState.useState();
  const { changeTab } = useActions(ProjectChallengeActions);
  const { show: showSubmit } = useActions(SubmitActions);

  return (
    <Dashboard>
      <SubmitModal />
      <Container>
        <Breadcrumb
          icon={<ProjectsSmallIcon />}
          url={createUrl({ name: 'project', id: challenge?.project.id })}
          root={challenge?.project.title}
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
                tags={
                  <DomainTag
                    testId="tag-domain"
                    domain={challenge.domain}
                    url={createFullProjectsUrl({
                      domains: [challenge.domain],
                    })}
                  />
                }
                buttons={
                  <Button
                    testId="submit-btn"
                    block
                    type={challenge.isSolved ? 'secondary' : 'primary'}
                    onClick={showSubmit}
                    disabled={status === 'testing'}
                  >
                    SUBMIT
                  </Button>
                }
              />
              <Tabs
                selectedTab={tab}
                onIndexChange={(value: ProjectChallengeTab) => changeTab(value)}
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
                    </ChallengeStats>
                  </SidebarStack>
                )}
                {createSwaggerTab(challenge.assets)}
                {createTestSuiteTab(testCase, recentSubmissions)}
              </Tabs>
            </>
          )}
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
