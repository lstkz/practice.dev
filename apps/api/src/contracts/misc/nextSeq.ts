import { S } from 'schema';
import { createContract } from '../../lib';
import { SeqCollection } from '../../collections/SeqModel';

export const nexSeq = createContract('misc.nextSeq')
  .params('name')
  .schema({
    name: S.string(),
  })
  .fn(async name => {
    const ret = await SeqCollection.findOneAndUpdate(
      {
        _id: name,
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
    if (!ret.value) {
      throw new Error('Expected value to be defined');
    }
    return ret.value.seq;
  });
