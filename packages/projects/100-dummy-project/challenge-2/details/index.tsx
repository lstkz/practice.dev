import { Section, IsolatedHtml } from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import { InjectingSection } from '../../../_common/InjectingSection';
import { DefaultFrontendNotesSection } from '../../../_common/DefaultFrontendNotes';

export function Details() {
  return (
    <div>
      <Section title="Overview">Just display "bar" as static text!</Section>
      <Section title="Features">
        <ul>
          <li>
            <div>Required Content</div>
            <IsolatedHtml
              height={200}
              scripts={['https://practice.dev/assets/toggle-layer.js']}
              css={exampleCss}
              html={exampleHTML}
            />
          </li>
        </ul>
      </Section>
      <DefaultFrontendNotesSection />
      <InjectingSection />
    </div>
  );
}
