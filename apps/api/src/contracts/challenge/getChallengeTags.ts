import { createContract, createRpcBinding } from '../../lib';
import { ChallengeTag } from 'shared';
import * as challengeReader from '../../readers/challengeReader';

export const getChallengeTags = createContract('challenge.getChallengeTags')
  .params()
  .schema({})
  .fn(async () => {
    const challenges = await challengeReader.getChallengesAll();
    const tagMap: { [x: string]: number } = {};
    challenges.forEach(challenge => {
      challenge.tags.forEach(tag => {
        if (!tagMap[tag]) {
          tagMap[tag] = 0;
        }
        tagMap[tag]++;
      });
    });
    const tags: ChallengeTag[] = [];
    Object.keys(tagMap).map(tag => {
      tags.push({
        name: tag,
        count: tagMap[tag],
      });
    });
    return tags;
  });

export const getChallengeTagsRpc = createRpcBinding({
  public: true,
  signature: 'challenge.getChallengeTags',
  handler: getChallengeTags,
});
