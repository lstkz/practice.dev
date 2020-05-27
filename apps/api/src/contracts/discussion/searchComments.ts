import { createContract, createRpcBinding } from '../../lib';
import * as R from 'remeda';
import { S } from 'schema';
import { esSearch } from '../../common/elastic';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { UserEntity } from '../../entities';
import { DiscussionComment, LoadMoreResult } from 'shared';
import { validateChallengeOrProjectChallenge } from '../../common/baseChallenge';

export const searchComments = createContract('discussion.searchComments')
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      challengeId: S.number().min(1),
      projectId: S.number().min(1).optional(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
      sortDesc: S.boolean(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { projectId, challengeId, sortDesc } = criteria;
    await validateChallengeOrProjectChallenge(userId, {
      projectId,
      challengeId,
    });

    const esCriteria: any[] = [
      { match: { challengeId } },
      { match: { type: projectId ? 'project' : 'challenge' } },
    ];
    if (projectId) {
      esCriteria.push({
        match: { projectId },
      });
    }
    const { items, lastKey } = await esSearch(DiscussionCommentEntity, {
      query: {
        bool: {
          must: esCriteria,
          must_not: {
            exists: {
              field: 'parentCommentId',
            },
          },
        },
      },
      sort: [
        {
          ['data_n']: sortDesc ? 'desc' : 'asc',
        },
        {
          _id: 'asc',
        },
      ],
      limit: criteria.limit!,
      cursor: criteria.cursor,
    });

    const childCommentMap: Record<string, DiscussionCommentEntity[]> = {};
    await Promise.all(
      items.map(async item => {
        childCommentMap[
          item.commentId
        ] = await DiscussionCommentEntity.getAllChildComments(item.commentId);
      })
    );
    const userIds = R.flatten([
      ...items,
      ...Object.values(childCommentMap),
    ]).map(x => x.userId);

    const users = await UserEntity.getByIds(userIds);

    return {
      items: DiscussionCommentEntity.toDiscussionCommentMany(
        items,
        users,
        childCommentMap
      ),
      cursor: lastKey,
    } as LoadMoreResult<DiscussionComment>;
  });

export const searchCommentsRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'discussion.searchComments',
  handler: searchComments,
});
