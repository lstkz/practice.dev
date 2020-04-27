import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { decLastKey, encLastKey, getUsersByIds } from '../../common/helper';
import { LoadMoreResult, Submission } from 'shared';
import { UserCollection } from '../../collections/UserModel';
import { SubmissionCollection } from '../../collections/Submission';
import { mapToSubmissionMany } from '../../common/mapper';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, username, cursor, limit } = criteria;
    const user = username
      ? await UserCollection.findOne({
          username_lowered: username.toLowerCase(),
        })
      : null;

    if (username && !user) {
      return {
        items: [],
        cursor: null,
      } as LoadMoreResult<Submission>;
    }
    const mongoCriteria: any = {};
    if (challengeId) {
      mongoCriteria.challengeId = challengeId;
    }
    if (user) {
      mongoCriteria.userId = user._id;
    }
    if (cursor) {
      const lastId = decLastKey(cursor);
      mongoCriteria._id = { $lt: lastId };
    }
    const submissions = await SubmissionCollection.find(mongoCriteria)
      .limit(limit!)
      .sort({
        _id: -1,
      })
      .toArray();

    const users = await getUsersByIds(submissions.map(x => x.userId));

    const ret: LoadMoreResult<Submission> = {
      items: mapToSubmissionMany(submissions, users),
      cursor: encLastKey(R.last(submissions)?._id),
    };
    return ret;
  });

export const searchSubmissionsRpc = createRpcBinding({
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
