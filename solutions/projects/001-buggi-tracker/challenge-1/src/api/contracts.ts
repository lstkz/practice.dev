import { createContract } from './lib';
import { UserModel } from './db';
import { randomSalt, createPasswordHash, randomUniqString } from './helper';
import { V } from 'veni';
import { BadRequestError } from './errors';
import { AuthData } from '../types';

export const initDb = createContract('init-db')
  .params()
  .fn(async () => {
    await Promise.all([UserModel.deleteMany({})]);
    const salt = await randomSalt();
    const passwordHash = await createPasswordHash('passa1', salt);
    await Promise.all([
      UserModel.insertMany([
        {
          _id: 1,
          username: 'admin',
          passwordHash: passwordHash,
          passwordSalt: salt,
        },
        {
          _id: 2,
          username: 'owner',
          passwordHash: passwordHash,
          passwordSalt: salt,
        },
        {
          _id: 3,
          username: 'reporter',
          passwordHash: passwordHash,
          passwordSalt: salt,
        },
      ]),
    ]);
  })
  .express({
    method: 'post',
    path: '/init',
    public: true,
    async json() {
      await initDb();
      return {
        done: true,
      };
    },
  });

export const login = createContract('login')
  .params('values')
  .schema({
    values: V.object().keys({
      username: V.string(),
      password: V.string(),
    }),
  })
  .fn(async values => {
    const user = await UserModel.findOne({ username: values.username });
    if (!user) {
      throw new BadRequestError('Authentication failed');
    }
    const hash = await createPasswordHash(values.password, user.passwordSalt);
    if (user.passwordHash !== hash) {
      throw new BadRequestError('Authentication failed');
    }
    const token = randomUniqString();
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    } as AuthData;
  })
  .express({
    method: 'post',
    path: '/login',
    public: true,
    async json(req) {
      return login(req.body);
    },
  });
