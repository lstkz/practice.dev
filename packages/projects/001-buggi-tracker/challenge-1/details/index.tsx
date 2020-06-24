import { Section, IsolatedHtml, InjectingSection } from 'ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import loginHtml from './assets/login.html';
import loginWithErrorsHtml from './assets/login-with-errors.html';
import homepageHtml from './assets/homepage.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must initiate the project and implement
        functionality related to authorization.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an unauthorized user, I can log in to the application.</li>
          <li>As a user, I can log out.</li>
        </ul>
      </Section>
      <Section title="Features">
        <ol>
          <li>
            <strong>Seed data</strong>
            <br />
            It won't possible to register to the application. <br /> Generate
            the following users: <code>admin</code>, <code>owner1</code>,{' '}
            <code>owner2</code>, <code>reporter1</code>, <code>reporter2</code>.
            <br />
            Set <code>passa1</code> password for all users.
          </li>
          <li>
            <strong>Login page</strong>
            <ul>
              <li>
                If the user is not authentication show the login page.
                <IsolatedHtml
                  height={320}
                  addToggle
                  css={stylesCss}
                  html={loginHtml}
                />
              </li>
              <li>
                Clicking on <code>login-btn</code> should validate the form and
                log in the user.
                <br />
                If the <code>username</code> input is empty display{' '}
                <code>Username is required</code> error under the input.
                <br />
                If the <code>password</code> input is empty display{' '}
                <code>Password is required</code> error under the input.
                <br />
                If the form data is valid, but username or password is invalid
                display <code>Authentication failed</code> in{' '}
                <code>login-error</code>.
                <br />
                <IsolatedHtml
                  height={420}
                  addToggle
                  css={stylesCss}
                  html={loginWithErrorsHtml}
                />
              </li>
            </ul>
          </li>
          <li>
            <strong>Home page</strong>
            <br />
            If the user is logged in, display the home page.
            <IsolatedHtml
              height={320}
              addToggle
              css={stylesCss}
              html={homepageHtml}
            />
            <ul>
              <li>
                Display <code>Hello {'{username}'}</code> in{' '}
                <code>header-username</code>.
              </li>
              <li>
                Display <code>home page placeholder</code> in{' '}
                <code>placeholder</code>.
              </li>
              <li>
                Clicking on <code>logout-btn</code> should log out the user and
                show the login form.
              </li>
            </ul>
          </li>
          <li>
            User should be still logged in after refreshing the page. <br />
            Session expiration is not required to implement.
          </li>
        </ol>
      </Section>
      <InjectingSection />
    </div>
  );
}
