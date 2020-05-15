import util from 'util';
import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';

export const reportFrontendError = createContract(
  'errorReporting.reportFrontendError'
)
  .params('userId', 'content')
  .schema({
    userId: S.string().optional(),
    content: S.object().unknown(),
  })
  .fn(async (userId, content) => {
    console.error(
      'frontend error',
      { userId },
      util.inspect(content, { depth: null })
    );
  });

export const reportFrontendErrorRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'errorReporting.reportFrontendError',
  handler: reportFrontendError,
});
