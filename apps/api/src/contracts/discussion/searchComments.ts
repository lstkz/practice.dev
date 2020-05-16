import { createContract, createRpcBinding } from '../../lib';
import * as R from 'remeda';
import { S } from 'schema';
import { esSearch } from '../../common/elastic';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { UserEntity } from '../../entities';
import { DiscussionComment, LoadMoreResult } from 'shared';

export const searchComments = createContract('discussion.searchComments')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
      sortDesc: S.boolean(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, sortDesc } = criteria;

    const { items, lastKey } = await esSearch(DiscussionCommentEntity, {
      query: {
        bool: {
          must: {
            match: { challengeId },
          },
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
  public: true,
  signature: 'discussion.searchComments',
  handler: searchComments,
});
