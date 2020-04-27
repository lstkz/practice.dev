import * as R from 'remeda';
import { MONGO_URL, MONGO_DB_NAME } from './config';
import {
  MongoClient,
  Collection,
  CollectionAggregationOptions,
  AggregationCursor,
  MongoCallback,
  FilterQuery,
  MongoCountPreferences,
  FindOneOptions,
  FindOneAndDeleteOption,
  FindOneAndUpdateOption,
  UpdateQuery,
  FindOneAndReplaceOption,
  CollectionInsertOneOptions,
  InsertOneWriteOpResult,
  ObjectId,
  Cursor,
  FindAndModifyWriteOpResultObject,
  IndexSpecification,
  DeleteWriteOpResultObject,
  CommonOptions,
  InsertWriteOpResult,
  CollectionInsertManyOptions,
} from 'mongodb';

let client: MongoClient | null = null;

export async function connect() {
  if (!client || !client.isConnected()) {
    client = new MongoClient(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  await client.connect();

  return client;
}

function getClient() {
  if (!client) {
    throw new Error('client is not set');
  }
  return client;
}

// export function getCollection(name: 'users'): Collection<UserModel>;
// export function getCollection(name: string): Collection<any> {
//   const client = getClient();
//   const db = client.db(MONGO_DB_NAME);
//   return db.collection(name);
// }

// export async function createdIndexes() {
//   const usersCollection =
// }

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// TypeScript Omit (Exclude to be specific) does not work for objects with an "any" indexed type
type EnhancedOmit<T, K> = string | number extends keyof T
  ? T // T has indexed type e.g. { _id: string; [k: string]: any; } or it is "any"
  : Omit<T, K>;

type ExtractIdType<TSchema> = TSchema extends { _id: infer U } // user has defined a type for _id
  ? {} extends U
    ? Exclude<U, {}>
    : unknown extends U
    ? ObjectId
    : U
  : ObjectId; // user has not defined _id on schema

type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & {
  _id: ExtractIdType<TSchema>;
};

// this makes _id optional
type OptionalId<TSchema extends { _id?: any }> = ObjectId extends TSchema['_id'] // a Schema with ObjectId _id type or "any" or "indexed type" provided
  ? EnhancedOmit<TSchema, '_id'> & { _id?: ExtractIdType<TSchema> } // a Schema provided but _id type is not ObjectId
  : WithId<TSchema>;

interface DbCollection<T> {
  aggregate<T>(
    pipeline?: object[],
    options?: CollectionAggregationOptions,
    callback?: MongoCallback<AggregationCursor<T>>
  ): AggregationCursor<T>;
  insertOne(
    docs: OptionalId<T>,
    options?: CollectionInsertOneOptions
  ): Promise<InsertOneWriteOpResult<WithId<T>>>;
  insertMany(
    docs: Array<OptionalId<T>>,
    options?: CollectionInsertManyOptions
  ): Promise<InsertWriteOpResult<WithId<T>>>;
  countDocuments(
    query?: FilterQuery<T>,
    options?: MongoCountPreferences
  ): Promise<number>;
  find(query: FilterQuery<T>, options?: FindOneOptions): Cursor<T>;
  findOne(filter: FilterQuery<T>, options?: FindOneOptions): Promise<T | null>;
  findOneOrThrow(filter: FilterQuery<T>, options?: FindOneOptions): Promise<T>;
  findOneAndDelete(
    filter: FilterQuery<T>,
    options?: FindOneAndDeleteOption
  ): Promise<FindAndModifyWriteOpResultObject<T>>;
  findOneAndReplace(
    filter: FilterQuery<T>,
    replacement: object,
    options?: FindOneAndReplaceOption
  ): Promise<FindAndModifyWriteOpResultObject<T>>;
  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T> | T,
    options?: FindOneAndUpdateOption
  ): Promise<FindAndModifyWriteOpResultObject<T>>;
  deleteMany(
    filter: FilterQuery<T>,
    options?: CommonOptions
  ): Promise<DeleteWriteOpResultObject>;
  deleteOne(
    filter: FilterQuery<T>,
    options?: CommonOptions
  ): Promise<DeleteWriteOpResultObject>;
  update(model: T, fields: Array<keyof T>): Promise<void>;
}

export function createCollection<T>(
  collectionName: string,
  indexes?: IndexSpecification[]
): DbCollection<T> {
  const _getCollection = () => {
    const client = getClient();
    const db = client.db(
      process.env.JEST_WORKER_ID
        ? `jest-${process.env.JEST_WORKER_ID}`
        : MONGO_DB_NAME
    );
    return db.collection<T>(collectionName);
  };

  const ret: DbCollection<T> = {
    aggregate(...args) {
      return _getCollection().aggregate(...args);
    },
    insertOne(...args) {
      return _getCollection().insertOne(...args);
    },
    insertMany(...args) {
      return _getCollection().insertMany(...args);
    },
    countDocuments(...args) {
      return _getCollection().countDocuments(...args);
    },
    find(...args) {
      return _getCollection().find(...args);
    },
    findOne(...args) {
      return _getCollection().findOne(...args);
    },
    async findOneOrThrow(...args) {
      const ret = await _getCollection().findOne(...args);
      if (!ret) {
        throw new Error(
          `Entity ${JSON.stringify(args[0])} not found in ${collectionName}`
        );
      }
      return ret;
    },
    findOneAndDelete(...args) {
      return _getCollection().findOneAndDelete(...args);
    },
    findOneAndReplace(...args) {
      return _getCollection().findOneAndReplace(...args);
    },
    findOneAndUpdate(...args) {
      return _getCollection().findOneAndUpdate(...args);
    },
    deleteMany(...args) {
      return _getCollection().deleteMany(...args);
    },
    deleteOne(...args) {
      return _getCollection().deleteOne(...args);
    },
    async update(model: any, fields) {
      if (model._id == null) {
        throw new Error('_id not defined');
      }
      await this.findOneAndUpdate(
        {
          _id: model._id,
        },
        {
          $set: R.pick(model, fields),
        }
      );
    },
  };

  (ret as any).initIndex = () => {
    if (!indexes || indexes.length === 0) {
      return;
    }
    return _getCollection().createIndexes(indexes);
  };

  return ret;
}
