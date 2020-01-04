import { resetDb } from '../helper';
import { registerSampleUsers, addSampleTasks } from '../seed-data';
import { DbUser } from '../../src/types';
import { getDbUserByToken } from '../../src/contracts/user/getDbUserByToken';
import { submit } from '../../src/contracts/submission/submit';
import { runWithContext, sns } from '../../src/lib';

let user: DbUser | null;

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleTasks()]);
  user = await getDbUserByToken('user1_token');
});

describe('validation', () => {
  test.each([
    [
      {
        challengeId: 1,
        testUrl: 'aqw',
      },
      "Validation error: 'values.testUrl' must match regex",
    ],
    [
      {
        challengeId: 3422,
        testUrl: 'http://example.com',
      },
      'Challenge "3422" does not exist',
    ],
  ])('.submit(%p) should throw `%s`', async (input: any, errorMessage: any) => {
    await runWithContext(
      {
        user,
      },
      async () => {
        await expect(submit(input)).rejects.toThrow(errorMessage);
      }
    );
  });
});

it('submit successfully', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const spy = jest.spyOn(sns, 'publish');
      spy.mockImplementation(
        () =>
          ({
            promise: () => Promise.resolve(),
          } as any)
      );
      await submit({
        challengeId: 1,
        testUrl: 'http://example.com',
      });

      expect(spy).toHaveBeenCalled();
    }
  );
});
