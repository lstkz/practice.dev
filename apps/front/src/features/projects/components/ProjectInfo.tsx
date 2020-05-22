import { Project, getProjectStats } from 'shared';
import { Button } from 'ui';
import { SolvedTag } from 'src/components/SolvedTag';
import React from 'react';
import { Title } from 'src/components/Title';
import { createUrl, createFullProjectsUrl } from 'src/common/url';
import { FileIcon } from 'src/icons/FileIcon';
import { UserIcon } from 'src/icons/UserIcon';
import { IconCounter } from 'src/components/IconCounter';
import { MediaCard } from 'src/components/MediaCard';
import { DomainIcon } from 'src/components/DomainIcon';
import { DomainTag } from 'src/components/DomainTag';

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo(props: ProjectInfoProps) {
  const { project } = props;

  const { solved, submissions } = React.useMemo(() => {
    return {
      solved: getProjectStats(project, 'solved'),
      submissions: getProjectStats(project, 'submissions'),
    };
  }, [project]);

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
      stats={
        <>
          <IconCounter
            icon={<FileIcon />}
            count={submissions}
            tooltip="Total Submissions"
            testId="submissions"
          />
          <IconCounter
            icon={<UserIcon />}
            count={solved}
            tooltip="User Solved"
            testId="solved"
          />
        </>
      }
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
