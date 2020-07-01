import {
  Section,
  IsolatedHtml,
  InjectingSection,
  SubSection,
  HandlesTable,
  AdditionalReq,
} from 'ui';
import React from 'react';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must implement project management pages.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an admin user, I can create, edit or delete any project.</li>
          <li>
            As an owner user, I can view and edit projects that I am assigned
            to.
          </li>
          <li>
            As a reporter user, I can view projects that I am assigned to.
          </li>
        </ul>
      </Section>
      <Section title="Features">
        <SubSection title="Seed data">
          Use the same seed data from the previous iteration.
          <br />
          There should be not projects by default.
        </SubSection>
      </Section>
      <SubSection title="Home page">a</SubSection>
    </div>
  );
}
