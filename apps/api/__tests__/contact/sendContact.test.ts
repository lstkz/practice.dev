import { SES } from 'aws-sdk';
import { ses } from '../../src/lib';
import { sendContact } from '../../src/contracts/contact/sendContact';
import { registerSampleUsers } from '../seed-data';
import { resetDb } from '../helper';

let body = '';
beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
  const sendEmailMock: any = (params: SES.Types.SendEmailRequest) => ({
    promise: () => {
      body = params.Message.Body.Html!.Data;
      return Promise.resolve();
    },
  });
  jest.spyOn(ses, 'sendEmail').mockImplementation(sendEmailMock);
});

it('should send contact email', async () => {
  await sendContact('1', {
    email: 'aa@example.com',
    category: 'Suggestion',
    message: 'aaa',
  });
  expect(body).toMatchInlineSnapshot(`
    "username: user1
    <br />
    name: -
    <br />
    email: aa@example.com
    <br />
    category: Suggestion
    <br />
    message:<br />
    aaa"
  `);
});

it('should send contact email as anonymous', async () => {
  await sendContact(undefined, {
    email: 'aa@example.com',
    category: 'Suggestion',
    message: 'aaa',
  });
  expect(body).toMatchInlineSnapshot(`
    "username: -
    <br />
    name: -
    <br />
    email: aa@example.com
    <br />
    category: Suggestion
    <br />
    message:<br />
    aaa"
  `);
});
