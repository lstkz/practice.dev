import {
  Section,
  IsolatedHtml,
  InjectingSection,
  DefaultFrontendNotesSection,
} from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import disabledHTML from './assets/disabled.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Welcome to practice.dev! <br />
        This is a simple warmup fullstack challenge where you must implement
        frontend and API interactions.
        <br />
        In every fullstack challenge, we always give you a complete set of HTML
        and CSS files. Your task is to implement business logic without focusing
        on visual aspects. Additionally, you must create your API that interacts
        with the frontend.
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
          <li>As a user, I can save the note and load it later.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <ul>
          <li>
            <div>Initial application state</div>
            <IsolatedHtml
              height={200}
              addToggle
              css={exampleCss}
              html={exampleHTML}
            />
          </li>
          <li>
            Clicking on the <code>save-btn</code> button should save the{' '}
            <code>note</code> in the API.
          </li>
          <li>
            Clicking on the <code>load-btn</code> button should load the{' '}
            <code>note</code> from the API.
          </li>
          <li>
            Refreshing the page should display an empty note. Don't load it from
            the API automatically.
          </li>
          <li>It should be possible to save an empty note.</li>
          <li>
            You can assume that the note will have less than 100 characters.
          </li>
          <li>
            Disable <code>save-btn</code> and <code>load-btn</code> buttons
            while loading or saving the note. You can always disable both
            buttons, but it's not required.
            <IsolatedHtml
              height={200}
              addToggle
              css={exampleCss}
              html={disabledHTML}
            />
          </li>
        </ul>
      </Section>
      <DefaultFrontendNotesSection />
      <InjectingSection />
    </div>
  );
}
