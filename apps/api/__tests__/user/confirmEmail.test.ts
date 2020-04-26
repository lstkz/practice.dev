import { confirmEmail } from '../../src/contracts/user/confirmEmail';
import { resetDb, initDb } from '../helper';

beforeAll(async () => {
  await initDb();
});

beforeEach(resetDb);

it('throw error if invalid code', async () => {
  const promise = confirmEmail('sadkjansfj');
  expect(promise).rejects.toThrow('Invalid code');
});
