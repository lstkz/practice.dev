import { SES } from 'aws-sdk';
import { resetDb } from '../helper';
import { ses } from '../../src/lib';
import { registerSampleUsers } from '../seed-data';
import { changeEmail } from '../../src/contracts/user/changeEmail';
import { confirmEmailChange } from '../../src/contracts/user/confirmEmailChange';
import { login } from '../../src/contracts/user/login';

let code: string = '';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(false)]);
  const sendEmailMock: any = (params: SES.Types.SendEmailRequest) => ({
    promise: () => {
      code = /confirm-email\/([^"]+)/.exec(params.Message.Body.Html!.Data)![1];
      return Promise.resolve();
    },
  });
  jest.spyOn(ses, 'sendEmail').mockImplementation(sendEmailMock);
});

it('should throw error if email taken', async () => {
  await expect(changeEmail('1', 'USER2@example.com')).rejects.toThrow(
    'Email is already taken'
  );
});

it('should change email and confirm it', async () => {
  await changeEmail('1', 'new@example.com');
  expect(code).toBeDefined();
  const ret = await confirmEmailChange(code);
  expect(ret.user.email).toEqual('new@example.com');
  expect(ret.user.isVerified).toEqual(true);
  const loginRet = await login({
    emailOrUsername: 'new@example.com',
    password: 'password1',
  });
  expect(loginRet.user.email).toEqual('new@example.com');
  await expect(changeEmail('1', 'new@example.com')).rejects.toThrow(
    'Email is already taken'
  );
});

it('change email and change back to original', async () => {
  await changeEmail('1', 'new@example.com');
  await confirmEmailChange(code);
  await changeEmail('1', 'user1@example.com');
  await confirmEmailChange(code);
  await login({
    emailOrUsername: 'user1@example.com',
    password: 'password1',
  });
});
