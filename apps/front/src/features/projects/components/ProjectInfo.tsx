import { Project } from 'shared';
import { Button } from 'src/components/Button';
import { SolvedTag } from 'src/components/SolvedTag';
import React from 'react';
import { Title } from 'src/components/Title';
import { createUrl, createFullProjectsUrl } from 'src/common/url';
import { MediaCard } from 'src/components/MediaCard';
import { DomainIcon } from 'src/components/DomainIcon';
import { DomainTag } from 'src/components/DomainTag';
import { SubmissionStats } from 'src/components/SubmissionStats';
import { useProjectStats } from 'src/hooks/useProjectStats';

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo(props: ProjectInfoProps) {
  const { project } = props;
  const { solved, submissions } = useProjectStats(project);

  return (
    <MediaCard
      testId={`project_${project.id}`}
      icon={<DomainIcon domain={project.domain} />}
      title={
        <>
          {project.solvedPercent > 0 && (
            <SolvedTag percent={project.solvedPercent} />
          )}
          <Title
            href={createUrl({
              name: 'project',
              id: project.id,
            })}
            testId="title"
          >
            {project.title}
          </Title>
        </>
      }
      description={project.description}
      tags={
        <>
          <DomainTag
            testId="tag-domain"
            domain={project.domain}
            url={createFullProjectsUrl({
              domains: [project.domain],
            })}
          />
        </>
      }
      stats={<SubmissionStats submissions={submissions} solved={solved} />}
      button={
        <Button
          testId="view-btn"
          type="primary"
          href={createUrl({ name: 'project', id: project.id })}
        >
          VIEW
        </Button>
      }
    />
  );
}
