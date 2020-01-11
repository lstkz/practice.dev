import { Section, IsolatedHtml } from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import { InjectingSection } from '../../_common/InjectingSection';
import { DefaultFrontendNotesSection } from '../../_common/DefaultFrontendNotes';
import { CommonSection } from '../../_common/CommonSection';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Create a simple counter application with two buttons using provided HTML
        and CSS. <br />
        No API integration required, all data is stored directly in the
        application. <br />
        Refreshing the page resets the counter.
      </Section>
      <Section title="Features">
        <ul>
          <li>
            <div>Initial application state</div>
            <IsolatedHtml
              height={200}
              scripts={['https://diizugqfceez9.cloudfront.net/toggle-layer.js']}
              css={exampleCss}
              html={exampleHTML}
            />
          </li>
          <li>
            Clicking on "increase-btn" should increase "count-value" by 1.
          </li>
          <li>
            Clicking on "decrease-btn" should decrease "count-value" by 1.
          </li>
        </ul>
      </Section>
      <CommonSection type="API integration is not required" />
      <DefaultFrontendNotesSection />
      <InjectingSection />
    </div>
  );
}