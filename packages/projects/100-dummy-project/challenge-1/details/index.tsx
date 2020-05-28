import {
  Section,
  IsolatedHtml,
  DefaultFrontendNotesSection,
  InjectingSection,
} from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">Just display "foo" as static text!</Section>
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
