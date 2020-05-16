import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { UserEntity } from './UserEntity';
import { DiscussionComment } from 'shared';

export interface DiscussionCommentKey {
  commentId: string;
  parentCommentId?: string | null;
}

export interface DiscussionCommentProps extends DiscussionCommentKey {
  userId: string;
  challengeId: number;
  text: string;
  isAnswered?: boolean;
  isAnswer?: boolean;
  isDeleted?: boolean;
  createdAt: number;
}

const BaseEntity = createBaseEntity('DiscussionComment')
  .props<DiscussionCommentProps>()
  .key<DiscussionCommentKey>(key => {
    if (key.parentCommentId) {
      return {
        pk: `DISCUSSION_COMMENT:${key.commentId}`,
        sk: `CHILD_DISCUSSION_COMMENT:${key.parentCommentId}`,
      };
    }
    return `DISCUSSION_COMMENT:${key.commentId}`;
  })
  .mapping({
    createdAt: 'data_n',
  })
  .build();

export class DiscussionCommentEntity extends BaseEntity {
  static getByIdOrNull(id: string) {
    const [parentCommentId, commentId] = id.split('_');
    if (commentId) {
      return this.getByKeyOrNull({ commentId: id, parentCommentId });
    }
    return this.getByKeyOrNull({ commentId: id });
  }
  static async getById(id: string) {
    const ret = await this.getByIdOrNull(id);
    if (!ret) {
      throw new Error('Comment not found with id: ' + id);
    }
    return ret;
  }

  static getAllChildComments(parentCommentId: string) {
    return this.queryAll({
      key: {
        sk: this.createKey({ parentCommentId, commentId: '-1' }).sk,
        data_n: null,
      },
      sort: 'asc',
    });
  }

  toDiscussionComment(
    user: UserEntity,
    children: DiscussionComment[] = []
  ): DiscussionComment {
    return {
      id: this.commentId,
      parentCommentId: this.parentCommentId,
      user: user.toPublicUser(),
      challengeId: this.challengeId,
      text: this.text,
      isAnswered: this.isAnswered ?? false,
      isAnswer: this.isAnswer ?? false,
      isDeleted: this.isDeleted ?? false,
      children,
    };
  }

  static toDiscussionCommentMany(
    comments: DiscussionCommentEntity[],
    users: UserEntity[],
    childCommentMap: Record<string, DiscussionCommentEntity[]>
  ) {
    const userMap = R.indexBy(users, x => x.userId);
    return comments.map(item => {
      const children = childCommentMap[item.commentId] ?? [];
      const mapped = item.toDiscussionComment(
        userMap[item.userId],
        children.map(item => item.toDiscussionComment(userMap[item.userId]))
      );
      return mapped;
    });
  }
}
