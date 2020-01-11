import { resetDb } from '../helper';
import { registerSampleUsers, addSampleTasks } from '../seed-data';
import { DbUser } from '../../src/types';
import { getDbUserByToken } from '../../src/contracts/user/getDbUserByToken';
import { runWithContext } from '../../src/lib';
import { createSolution } from '../../src/contracts/solution/createSolution';
import { markSolved } from '../../src/contracts/challenge/markSolved';

let user: DbUser | null;

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleTasks()]);
  user = await getDbUserByToken('user1_token');
});

function getLongStr(n: number) {
  let ret = '';
  while (n--) {
    ret += 'x';
  }
  return ret;
}

const validChallengeId = 1;
const validUrl = 'https://github.com/abc';
const validTitle = 'example 1';
const validSlug = 'example-1';
const validDescription = 'desc example 1';
const validTags = ['react', 'simple'];

describe('validation', () => {
  test.each([
    [
      {
        challengeId: validChallengeId,
        url: 'abc',
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: validTags,
      },
      "Validation error: 'values.url' must match regex",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: getLongStr(51),
        slug: validSlug,
        description: validDescription,
        tags: validTags,
      },
      "Validation error: 'values.title' length must be less than or equal to 50 characters long.",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: '$%',
        description: validDescription,
        tags: validTags,
      },
      "Validation error: 'values.slug' must match regex",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: getLongStr(501),
        tags: validTags,
      },
      "Validation error: 'values.description' length must be less than or equal to 500 characters long.",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: [],
      },
      "Validation error: 'values.tags' must have at least 1 item.",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: ['a', 'b', 'c', 'd', 'e', 'f'],
      },
      "Validation error: 'values.tags' must have max 5 items.",
    ],
    [
      {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: [getLongStr(21)],
      },
      "Validation error: 'values.tags[0]' length must be less than or equal to 20 characters long.",
    ],
  ])(
    '.createSolution(%p) should throw `%s`',
    async (input: any, errorMessage: any) => {
      await runWithContext(
        {
          user,
        },
        async () => {
          await expect(createSolution(input)).rejects.toThrow(errorMessage);
        }
      );
    }
  );
});

it('throw an error if solution is not solved', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      await expect(
        createSolution({
          challengeId: validChallengeId,
          url: validUrl,
          title: validTitle,
          slug: validSlug,
          description: validDescription,
          tags: validTags,
        })
      ).rejects.toThrow(
        'Cannot create a solution if the challenge is not solved'
      );
    }
  );
});

it('should create a solution', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      await markSolved({
        challengeId: 1,
        solvedAt: 1,
        userId: '1',
      });

      const ret = await createSolution({
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: validTags,
      });

      expect(ret.slug).toEqual(validSlug);
    }
  );
});

it('throw an error if slug is duplicated', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      await markSolved({
        challengeId: 1,
        solvedAt: 1,
        userId: '1',
      });
      const values = {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: validTags,
      };
      await createSolution(values);

      await expect(createSolution(values)).rejects.toThrow(
        'Duplicated slug for this challenge'
      );
    }
  );
});

it('should create two solutions with different slug', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      await markSolved({
        challengeId: 1,
        solvedAt: 1,
        userId: '1',
      });
      const values = {
        challengeId: validChallengeId,
        url: validUrl,
        title: validTitle,
        slug: validSlug,
        description: validDescription,
        tags: validTags,
      };
      await createSolution(values);
      await createSolution({ ...values, slug: 'another-slug' });
    }
  );
});