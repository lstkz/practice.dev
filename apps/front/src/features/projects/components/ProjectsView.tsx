import React from 'react';
import { useProjectsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { Container } from 'src/components/Container';
import { getProjectsState } from '../interface';
import { ProjectInfo } from './ProjectInfo';
import { Loader } from 'src/components/Loader';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { FilterLayout } from 'src/components/FilterLayout';
import { createUrl } from 'src/common/url';
import styled from 'styled-components';
import { ProjectsSmallIcon } from 'src/icons/ProjectsSmallIcon';
import { ProjectsFilter } from './ProjectsFilter';

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export function ProjectsView() {
  useProjectsModule();
  const { items, isLoading } = getProjectsState.useState();

  return (
    <Dashboard>
      <Container data-test="projects-page">
        <Breadcrumb
          icon={<ProjectsSmallIcon />}
          url={createUrl({ name: 'projects' })}
          root="Projects"
        />
        <FilterLayout
          content={
            <>
              {isLoading ? (
                <Loader center />
              ) : items.length === 0 ? (
                <NoData data-test="no-projects">No Projects</NoData>
              ) : (
                items.map(item => <ProjectInfo key={item.id} project={item} />)
              )}
            </>
          }
          filter={<ProjectsFilter />}
        />
      </Container>
    </Dashboard>
  );
}
