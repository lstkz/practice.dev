import {
  Section,
  IsolatedHtml,
  InjectingSection,
  SubSection,
  HandlesTable,
  AdditionalReq,
} from 'ui';
import stylesCss from './assets/styles.css';
import homeHtml from './assets/home.html';
import projectsHtml from './assets/projects.html';
import deleteProjectHtml from './assets/deleteProject.html';
import React from 'react';
import { ProjectFormSection } from './ProjectFormSection';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must implement issue reporting functionality.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can report an issue.</li>
          <li>As a user, I can see reported issues.</li>
        </ul>
      </Section>
      <Section title="Features">
        <SubSection title="Seed data">
          Use the same seed data from the previous iteration.
          <br />
          There should be no projects and no issues by default.
        </SubSection>
        <SubSection title="Home page">
          The home page should remain the same.
        </SubSection>
        <SubSection title="Users page">
          Users page and Add/Edit User pages should remain the same.
        </SubSection>
        <SubSection title="Projects page"></SubSection>
      </Section>
    </div>
  );
}
