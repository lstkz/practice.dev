import { randomSalt, createPasswordHash } from '../../common/helper';
import { UserModel, UserCollection } from '../../collections/UserModel';
import { nexSeq } from '../misc/nextSeq';

interface CreateUserValues {
  email: string;
  password: string;
  username: string;
  isVerified: boolean;
  githubId?: number;
}

export async function _createUser(values: CreateUserValues) {
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);

  const user: UserModel = {
    _id: await nexSeq('user_id'),
    ...values,
    salt: salt,
    password: password,
    email_lowered: values.email.toLowerCase(),
    username_lowered: values.username.toLowerCase(),
    isVerified: false,
    stats: {
      followers: 0,
      following: 0,
      likes: 0,
      solutions: 0,
      submissions: 0,
    },
  };
  await UserCollection.insertOne(user);

  return user;
}
