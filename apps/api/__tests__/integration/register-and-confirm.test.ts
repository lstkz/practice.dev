import { SES } from 'aws-sdk';
import { ses } from '../../src/lib';
import { register } from '../../src/contracts/user/register';
import { confirmEmail } from '../../src/contracts/user/confirmEmail';
import { login } from '../../src/contracts/user/login';
import { resetDb } from '../helper';

beforeEach(async () => {
  await resetDb();
});

it('register and confirm email', async () => {
  let code: string = '';

  const sendEmailMock: any = (params: SES.Types.SendEmailRequest) => ({
    promise: () => {
      code = /confirm\/([^"]+)/.exec(params.Message.Body.Html!.Data)![1];
      return Promise.resolve();
    },
  });
  jest.spyOn(ses, 'sendEmail').mockImplementation(sendEmailMock);
  await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });

  const confirmResult = await confirmEmail(code);
  expect(confirmResult.user.isVerified).toEqual(true);
  const loginResult = await login({
    emailOrUsername: 'user1',
    password: 'password',
  });
  expect(loginResult.user.isVerified).toEqual(true);
});
