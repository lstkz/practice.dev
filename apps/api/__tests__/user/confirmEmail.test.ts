import { confirmEmail } from '../../src/contracts/user/confirmEmail';

it('throw error if invalid code', async () => {
  const promise = confirmEmail('sadkjansfj');
  expect(promise).rejects.toThrow('Invalid code');
});
