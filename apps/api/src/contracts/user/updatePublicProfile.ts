import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { UserEntity } from '../../entities';
import { safeAssign, safeKeys } from '../../common/helper';
import { countryList, urlRegex } from 'shared';

export const updatePublicProfile = createContract('user.updatePublicProfile')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      name: S.string().optional().nullEmpty().max(40),
      bio: S.string().optional().nullEmpty().max(200),
      country: S.enum()
        .optional()
        .literal(...countryList.map(x => x.code)),
      url: S.string().regex(urlRegex).optional().nullEmpty().max(60),
    }),
  })
  .fn(async (userId, values) => {
    if (!Object.keys(values).length) {
      return;
    }
    const user = await UserEntity.getById(userId);
    safeAssign(user, values);
    await user.update(safeKeys(values));
  });

export const updatePublicProfileRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.updatePublicProfile',
  handler: updatePublicProfile,
});
