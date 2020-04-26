import { randomSalt, createPasswordHash } from '../../common/helper';
import { SeqCollection } from '../../collections/SeqModel';
import { UserModel, UserCollection } from '../../collections/UserModel';

interface CreateUserValues {
  email: string;
  password: string;
  username: string;
  isVerified: boolean;
  githubId?: number;
}

export async function getNextUserId() {
  const ret = await SeqCollection.findOneAndUpdate(
    {
      _id: 'user_id',
    },
    {
      $inc: {
        seq: 1,
      },
    },
    {
      upsert: true,
      returnOriginal: false,
    }
  );
  return ret.value!.seq;
}

export async function _createUser(values: CreateUserValues) {
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);

  const user: UserModel = {
    _id: await getNextUserId(),
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
