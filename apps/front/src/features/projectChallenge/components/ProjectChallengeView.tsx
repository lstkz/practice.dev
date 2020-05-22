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
import { Theme } from 'ui';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { ProjectsSmallIcon } from 'src/icons/ProjectsSmallIcon';
import { createUrl } from 'src/common/url';
import { ChallengeLoader } from 'src/features/challenge/components/ChallengeLoader';
import { Tabs, Tab } from 'src/components/Tabs';
import { TabContent } from 'src/features/challenge/components/TabContent';

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
  } = getProjectChallengeState.useState();
  const { changeTab } = useActions(ProjectChallengeActions);

  return (
    <Dashboard>
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
              <Tabs
                selectedTab={tab}
                onIndexChange={(value: ProjectChallengeTab) => changeTab(value)}
              >
                <Tab testId="details-tab" title="Details" name="details">
                  <TabContent
                    testId="challenge-details"
                    left={<Component />}
                    right={<div />}
                  />
                </Tab>
              </Tabs>
            </>
          )}
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
