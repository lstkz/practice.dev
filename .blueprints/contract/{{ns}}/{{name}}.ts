import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';


export const {{name}} = createContract('{{ns}}.{{name}}')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
    })
  })
  .fn(async (userId, values) => {

  });

export const {{name}}Rpc = createRpcBinding({
  injectUser: true,
  signature: '{{ns}}.{{name}}',
  handler: {{name}},
});
