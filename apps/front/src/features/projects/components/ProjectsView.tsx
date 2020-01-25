import React from 'react';
import { useProjectsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { Container } from 'src/components/Container';

export function ProjectsView() {
  useProjectsModule();

  return (
    <Dashboard>
      <Container>Feature projects</Container>
    </Dashboard>
  );
}
