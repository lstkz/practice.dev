import { Section, IsolatedHtml, InjectingSection, Highlight } from 'ui';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import { inputData } from './assets/input-data';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        You are working in the e-commerce company, and the UX designer requested
        a new filter functionality, that will be more friendly for the users. In
        this task, you have to implement only the filter mechanism without
        displaying the list of items.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can select filter options.</li>
          <li>
            As a user, I can see the results count for the given filter option
            before selecting that option.
          </li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <ul>
          <li>
            Hard-code the following JSON data in your application, and use it as
            an input.
            <br />
            Data represents example RAM devices.
            <Highlight
              maxHeight={200}
              code={JSON.stringify(inputData, null, 2)}
              lang="js"
            />
          </li>
          <li>
            <div>Initial application state</div>
            <IsolatedHtml
              height={500}
              addToggle
              css={exampleCss}
              html={exampleHTML}
            />
          </li>
          <li>
            There are 5 sections, and each section represents a property from
            the JSON data. Properties <code>capacity</code> and{' '}
            <code>speed</code> are numeric properties, but are displayed with
            additional unit (GB, MHz).
          </li>
          <li>
            The number in parentheses represents the count of items that match
            that option.
            <br />
            For example:
            <br />
            "BESTRAM (64)" means that there are 64 items that have{' '}
            <code>vendor</code> property equal to <code>BESTRAM</code>.
          </li>
          <li>
            Selecting multiple options within the same section should act as{' '}
            <code>OR</code>. <br />
            Selecting multiple options between sections should act as{' '}
            <code>AND</code>.
            <br />
            For example:
            <br />
            Select from Vendor: BESTRAM, Rocket
            <br />
            Select from Capacity: 4 GB, 8 GB
            <br />
            is equivalent to: <br />
            <code>
              (vendor = BESTRAM OR vendor = Rocket) AND (capacity = 4 OR
              capacity = 8)
            </code>
          </li>
          <li>
            After selecting or deselecting the option, the counts from other
            sections should update immediately.
            <br />
            The other options from the same section should always remain the
            same.
          </li>
          <li>
            Disable the option if the count is <code>0</code>. Add{' '}
            <code>disable</code> attribute to{' '}
            <code>{'<input type="checkbox"/>'}</code>
            <br />
            Don't disable the checkbox if it's already selected.
          </li>
        </ul>
      </Section>
      <InjectingSection />
    </div>
  );
}
