import React from 'react';
import { useProjectModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { Container } from 'src/components/Container';
import { ProjectsSmallIcon } from 'src/icons/ProjectsSmallIcon';
import { createUrl } from 'src/common/url';
import { getProjectState } from '../interface';
import { Breadcrumb } from 'src/components/Breadcrumb';
import styled from 'styled-components';
import { PageLoader } from 'src/components/PageLoader';
import { Title } from 'src/components/Title';
import { ProjectHeader } from './ProjectHeader';
import { MediaCard } from 'src/components/MediaCard';
import { DomainIcon } from 'src/components/DomainIcon';
import { LockIcon } from 'src/icons/LockIcon';
import { SolvedTag } from 'src/components/SolvedTag';
import { SubmissionStats } from 'src/components/SubmissionStats';
import { Theme, MOBILE } from 'src/Theme';
import { Button } from 'src/components/Button';

const Wrapper = styled.div`
  border: 1px solid ${Theme.grayLight};
  background: ${Theme.bgLightGray7};
  border-radius: 5px;
  margin-bottom: 70px;
`;

const Challenges = styled.div`
  padding: 30px 50px;
  background: white;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  ${MOBILE} {
    padding: 30px;
  }
`;

export function ProjectView() {
  useProjectModule();
  const { challenges, isLoading, project } = getProjectState.useState();
  const renderContent = () => {
    if (isLoading) {
      return <PageLoader />;
    }
    return (
      <Container>
        <Wrapper>
          <ProjectHeader />
          <Challenges>
            {challenges.map((item, i) => {
              const stats = (
                <SubmissionStats
                  submissions={project.stats[`submissions_${item.id}`] ?? 0}
                  solved={project.stats[`solved_${item.id}`] ?? 0}
                />
              );
              const icon = <DomainIcon domain={item.domain} />;
              if (item.isLocked) {
                return (
                  <MediaCard
                    key={item.id}
                    testId={`challenge_${item.id}`}
                    disabled
                    title={<Title testId="title">Locked</Title>}
                    stats={stats}
                    description="Challenge details are locked. Complete previous challenges to be able to access it."
                    icon={icon}
                    button={
                      <Button
                        testId="solve-btn"
                        icon={<LockIcon />}
                        disabled
                        type="primary"
                      >
                        Solve
                      </Button>
                    }
                  />
                );
              }
              const href = createUrl({
                name: 'project-challenge',
                id: item.id,
                projectId: project.id,
              });
              return (
                <MediaCard
                  highlighted={challenges[i + 1]?.isLocked ?? false}
                  key={item.id}
                  testId={`challenge_${item.id}`}
                  title={
                    <>
                      {item.isSolved && <SolvedTag />}
                      <Title testId="title" href={href}>
                        {item.title}
                      </Title>
                    </>
                  }
                  stats={stats}
                  description={item.description}
                  icon={icon}
                  button={
                    <Button testId="solve-btn" href={href} type="primary">
                      Solve
                    </Button>
                  }
                />
              );
            })}
          </Challenges>
        </Wrapper>
      </Container>
    );
  };
  return (
    <Dashboard>
      <Container>
        <Breadcrumb
          icon={<ProjectsSmallIcon />}
          url={createUrl({ name: 'projects' })}
          root="Projects"
          details={project?.title}
        />
      </Container>
      {renderContent()}
    </Dashboard>
  );
}
