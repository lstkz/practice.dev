import { S } from 'schema';
import { MAX_SLUG_LENGTH } from 'shared';

const urlReg = /^https\:\/\/((codesandbox\.io)|(github\.com))/;

export const solutionUserInput = {
  url: S.string().max(300).regex(urlReg),
  title: S.string().max(50),
  slug: S.string()
    .max(MAX_SLUG_LENGTH)
    .regex(/^[a-z0-9\-]+$/),
  description: S.string().max(500).optional().nullable().nullEmpty(),
  tags: S.array().items(S.string().trim().min(1).max(20)).min(1).max(5),
};
