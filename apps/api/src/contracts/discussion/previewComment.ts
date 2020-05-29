import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { markdown } from '../../common/markdown';

export const previewComment = createContract('discussion.previewComment')
  .params('text')
  .schema({
    text: S.string(),
  })
  .fn(async text => {
    return markdown(text);
  });

export const previewCommentRpc = createRpcBinding({
  public: true,
  signature: 'discussion.previewComment',
  handler: previewComment,
});
