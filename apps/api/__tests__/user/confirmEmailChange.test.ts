import { resetDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { confirmEmailChange } from '../../src/contracts/user/confirmEmailChange';
import { ChangeEmailRequestEntity } from '../../src/entities/ChangeEmailRequestEntity';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers()]);
});

it('should throw error if invalid code', async () => {
  await expect(confirmEmailChange('123')).rejects.toThrow(
    'Invalid or used reset code'
  );
});

it('should throw error if expired code', async () => {
  const changeEmail = new ChangeEmailRequestEntity({
    code: '123',
    email: 'new@example.com',
    expireAt: 1,
    userId: '1',
  });
  await changeEmail.insert();
  await expect(confirmEmailChange('123')).rejects.toThrow(
    'Expired code. Please request email change again.'
  );
});

it('should throw error if email taken by another user', async () => {
  const changeEmail = new ChangeEmailRequestEntity({
    code: '123',
    email: 'user2@example.com',
    expireAt: Date.now() * 2,
    userId: '1',
  });
  await changeEmail.insert();
  await expect(confirmEmailChange('123')).rejects.toThrow(
    'Email is already registered'
  );
});
