import { Section, IsolatedHtml, InjectingSection } from 'ui';
import React from 'react';
import stylesCss from './assets/styles.css';
import nonAdminHomeHtml from './assets/nonAdminHome.html';
import adminHomeHtml from './assets/adminHome.html';
import usersHtml from './assets/users.html';
import deleteUserHtml from './assets/deleteUser.html';
import addUserHtml from './assets/addUser.html';
import addUserErrorsHtml from './assets/addUserErrors.html';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must implement user management pages.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an admin user, I can create, edit or delete other users.</li>
        </ul>
      </Section>
      <Section title="Features">
        <ol>
          <li>
            <strong>Seed data</strong>
            <br />
            Modify the seed data from the previous iteration, add a new field
            <code>role</code>.<table></table> Generate the following users:
            <table>
              <thead>
                <tr>
                  <th>username</th>
                  <th>role</th>
                  <th>password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>admin</td>
                  <td>admin</td>
                  <td>passa1</td>
                </tr>
                <tr>
                  <td>owner1</td>
                  <td>owner</td>
                  <td>passa1</td>
                </tr>
                <tr>
                  <td>owner2</td>
                  <td>owner</td>
                  <td>passa1</td>
                </tr>
                <tr>
                  <td>reporter1</td>
                  <td>reporter</td>
                  <td>passa1</td>
                </tr>
                <tr>
                  <td>reporter2</td>
                  <td>reporter</td>
                  <td>passa1</td>
                </tr>
              </tbody>
            </table>
          </li>
          <li>
            <strong>Home page (non-admin)</strong>
            <br />
            Display a placeholder for <code>owner</code> and{' '}
            <code>reporter</code> roles.
            <br />
            <IsolatedHtml
              height={320}
              addToggle
              css={stylesCss}
              html={nonAdminHomeHtml}
            />
            <ul>
              <li>
                Display <code>home page placeholder</code> in{' '}
                <code>placeholder</code>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Home page (admin)</strong>
            <br />
            <IsolatedHtml
              height={320}
              addToggle
              css={stylesCss}
              html={adminHomeHtml}
            />
            <ul>
              <li>
                Display a Users card in <code>home-card-1</code>. <br />
                Clicking on this card should open a Users page. <br />
                Recommended url is <code>/users</code>, but it's not required.
              </li>
            </ul>
          </li>
          <li>
            <strong>Users page</strong>
            <IsolatedHtml
              height={430}
              addToggle
              css={stylesCss}
              html={usersHtml}
            />
            <ul>
              <li>
                Display a list of all users sorted alphabetically by username.
                <br />
                Pagination is not required. You can assume there will be less
                than 20 users during testing.
              </li>
              <li>
                It should be a separate route. Refreshing the page should load
                the users page again.
              </li>
              <li>
                Display a proper breadcrumb in <code>breadcrumb</code>.<br />
                <code>item-1</code> should link to home page and display{' '}
                <code>Home</code> text. <br />
                <code>item-2</code> should be a static <code>Users</code> text.
              </li>
              <li>
                Clicking on <code>add-user-btn</code> should open an Add User
                page.
              </li>
              <li>
                A users table contains 3 columns.
                <br />
                Display the username in <code>username-i</code>.
                <br />
                Display the role in <code>role-i</code>.
                <br />
                Clicking on <code>delete-btn-i</code> should show a confirmation
                modal (see requirement below).
                <br />
                Clicking on <code>edit-btn-i</code> should open an Edit User
                page.
                <br />
                <code>i</code> represents the row number in the table (starting
                from 1).
              </li>
              <li>
                The current user cannot delete or edit himself. Hide action
                buttons for that row. <br />
                It should be possible to edit other admin users.
              </li>
            </ul>
          </li>
          <li>
            <strong>Users page (delete user)</strong>
            <IsolatedHtml
              height={430}
              addToggle
              css={stylesCss}
              html={deleteUserHtml}
            />
            <ul>
              <li>
                Clicking on <code>delete-btn-i</code> should show the
                confirmation dialog.
              </li>
              <li>
                Display the warning message in <code>desc</code>. <br />
                If you delete the <code>reporter1</code> user, display{' '}
                <code>Are you sure to delete "reporter1"?</code>
              </li>
              <li>
                Clicking on <code>no-btn</code> should close the modal.
              </li>
              <li>
                Clicking on <code>yes-btn</code> should delete the user, close
                the modal, and remove the row from the table.
              </li>
              <li>Loading states and confirmation alerts are not required.</li>
            </ul>
          </li>
          <li>
            <strong>Add User page</strong>
            <IsolatedHtml
              height={430}
              addToggle
              css={stylesCss}
              html={addUserHtml}
            />
            <ul>
              <li>
                Display a proper breadcrumb in <code>breadcrumb</code>.<br />
                <code>item-1</code> should link to Home page and display{' '}
                <code>Home</code> text. <br />
                <code>item-2</code> should link to Users page and display{' '}
                <code>Users</code> text. <br />
                <code>item-3</code> should be a static <code>Add User</code>{' '}
                text.
              </li>
              <li>
                {/* A form contains the following fields:
                <br />
                <code>username</code> - a textbox for the username.
                <br />
                Validation rules:
                <table>
                  <tbody>
                    <tr>
                      <th>Field</th>
                      <td colSpan={2}>username</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>text</td>
                    </tr>
                  </tbody>
                </table> */}{' '}
                A form contains the following fields:
                <br />
                <table>
                  <tbody>
                    <tr>
                      <th>Field</th>
                      <td colSpan={2}>username</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td colSpan={2}>text</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td colSpan={2}>
                        Represents the user's username used for logging in.
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={3}>Validation Rules</th>
                    </tr>
                    <tr>
                      <th>Rule</th>
                      <th>Error Message</th>
                      <th>Condition</th>
                    </tr>
                    <tr>
                      <td>Required</td>
                      <td>Username is required</td>
                      <td>The input is empty.</td>
                    </tr>
                    <tr>
                      <td>Max length</td>
                      <td>Max 10 characters</td>
                      <td>The input contains more than 10 characters.</td>
                    </tr>
                    <tr>
                      <td>Allowed characters</td>
                      <td>Username can contain only letters and numbers</td>
                      <td>
                        The input contains characters that are not letters
                        (a-z), or not numbers (0-9).
                      </td>
                    </tr>
                    <tr>
                      <td>Unique</td>
                      <td>Username is already taken</td>
                      <td>
                        The username is already taken by another user. Usernames
                        are not case sensitive. <br />
                        Example: <br />
                        If there is already a user <code>admin</code>, then it
                        should be not possible to create a new user{' '}
                        <code>AdMiN</code>.
                      </td>
                    </tr>

                    <tr>
                      <th>Field</th>
                      <td colSpan={2}>role</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td colSpan={2}>select</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td colSpan={2}>Represents the user role.</td>
                    </tr>
                    <tr>
                      <th>Options</th>
                      <td colSpan={2}>
                        Options should have the following text content:
                        <code>admin</code>, <code>owner</code>,{' '}
                        <code>reporter</code>.
                      </td>
                    </tr>
                    <tr>
                      <th>Default value</th>
                      <td colSpan={2}>
                        The select should be not selected by default.
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={3}>Validation Rules</th>
                    </tr>
                    <tr>
                      <td>Required</td>
                      <td>Role is required</td>
                      <td>The select is selected.</td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                Clicking on <code>save-btn</code> should validate the form,
                create a user and redirect to Users page.
                <br />
              </li>
            </ul>
            <br />
            <IsolatedHtml
              height={430}
              addToggle
              css={stylesCss}
              html={addUserErrorsHtml}
            />
          </li>
        </ol>
      </Section>
      {/* <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/001-1-demo.fba1cb338236eef9f3933ffeed78a1ad.mp4'
          }
          loop
          controls
        ></video>
      </Section> */}
      <InjectingSection />
    </div>
  );
}
