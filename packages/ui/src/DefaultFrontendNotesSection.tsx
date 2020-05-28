import React from 'react';
import { Section } from './Section';

export function DefaultFrontendNotesSection() {
  return (
    <Section title="Notes">
      <ul>
        <li>
          You don't have to write any custom HTML or CSS code. It's enough to
          reuse the provided code.
        </li>
        <li>
          You are <strong>allowed</strong> to change CSS classes, HTML tag
          names, ID attributes.
        </li>
        <li>
          You are <strong>not allowed</strong> to change data-test attributes.
          Use "Toggle layers" button to show/hide the content of data-test
          attributes. Your application should display exactly the same values.
        </li>
        <li>Your solution must work only on the latest Chrome version.</li>
      </ul>
    </Section>
  );
}
