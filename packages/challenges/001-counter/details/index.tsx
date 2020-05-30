import {
  Section,
  IsolatedHtml,
  InjectingSection,
  DefaultFrontendNotesSection,
} from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Welcome to practice.dev! <br />
        This is a simple warmup challenge where you must implement minimal
        interactions.
        <br />
        In every frontend challenge, we always give you a complete set of HTML
        and CSS files. Your task is to implement business logic without focusing
        on visual aspects.
        <br />
        Testing is based on <code>data-test</code> attributes on HTML elements.
        Pay attention to them, and do not remove them from the provided HTML
        files.
        <br />
        After you solve the challenge, you can upload a solution and share it
        with other developers.
        <br />
        Good luck!
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can increase or decrease the counter value.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <ul>
          <li>
            <div>Initial application state</div>
            <IsolatedHtml
              height={200}
              scripts={['https://practice.dev/assets/toggle-layer.js']}
              css={exampleCss}
              html={exampleHTML}
            />
          </li>
          <li>
            Clicking on <code>increase-btn</code> should increase{' '}
            <code>count-value</code> by 1.
          </li>
          <li>
            Clicking on <code>decrease-btn</code> should decrease{' '}
            <code>count-value</code> by 1.
          </li>
        </ul>
      </Section>
      <DefaultFrontendNotesSection />
      <InjectingSection />
    </div>
  );
}
