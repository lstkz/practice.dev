import { resetDb, initDb } from '../helper';
import { SES } from 'aws-sdk';
import { login } from '../../src/contracts/user/login';
import { confirmResetPassword } from '../../src/contracts/user/confirmResetPassword';
import { registerSampleUsers } from '../seed-data';
import { ses } from '../../src/lib';
import { resetPassword } from '../../src/contracts/user/resetPassword';

let resetCode: string = '';

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
  const sendEmailMock: any = (params: SES.Types.SendEmailRequest) => ({
    promise: () => {
      resetCode = /reset-password\/([^"]+)/.exec(
        params.Message.Body.Html!.Data
      )![1];
      return Promise.resolve();
    },
  });
  jest.spyOn(ses, 'sendEmail').mockImplementation(sendEmailMock);
});

it('reset password by username', async () => {
  await resetPassword('user1');
  await confirmResetPassword(resetCode, 'new-pass');
  await login({ emailOrUsername: 'user1', password: 'new-pass' });

  await expect(confirmResetPassword(resetCode, 'new-pass2')).rejects.toThrow(
    'Invalid or used reset code'
  );
});

it('reset password by email', async () => {
  await resetPassword('user1@example.com');
  await confirmResetPassword(resetCode, 'new-pass');
  await login({ emailOrUsername: 'user1', password: 'new-pass' });
});

it('expired code', async () => {
  await resetPassword('user1');
  Date.now = () => new Date(3000, 1, 1).getTime();
  await expect(confirmResetPassword(resetCode, 'new-pass')).rejects.toThrow(
    'Expired code'
  );
});
