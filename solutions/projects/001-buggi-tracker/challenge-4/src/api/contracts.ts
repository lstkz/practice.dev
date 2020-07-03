import { createContract } from './lib';
import {
  UserModel,
  User,
  AppUser,
  TokenModel,
  SeqModel,
  ProjectModel,
  IssueModel,
} from './db';
import { randomSalt, createPasswordHash, randomUniqString } from './helper';
import { V } from 'veni';
import { BadRequestError } from './errors';
import { AuthData, PublicUser } from '../types';

const DUPLICATED_KEY_ERROR_CODE = 11000;

function mapUser(user: User) {
  return {
    id: user._id,
    username: user.username,
    role: user.role,
  };
}

async function getNextSeq(name: string) {
  const ret = await SeqModel.findOneAndUpdate(
    {
      _id: name,
    },
    {
      $inc: {
        count: 1,
      },
    },
    {
      upsert: true,
      returnOriginal: false,
    }
  );
  return ret.value.count;
}

export const initDb = createContract('init-db')
  .params()
  .fn(async () => {
    await Promise.all([
      UserModel.deleteMany({}),
      SeqModel.deleteMany({}),
      ProjectModel.deleteMany({}),
      IssueModel.deleteMany({}),
    ]);
    const salt = await randomSalt();
    const passwordHash = await createPasswordHash('passa1', salt);
    await Promise.all([
      UserModel.insertMany([
        {
          _id: 1,
          username: 'admin',
          username_lowered: 'admin',
          passwordHash: passwordHash,
          passwordSalt: salt,
          role: 'admin',
        },
        {
          _id: 2,
          username: 'owner1',
          username_lowered: 'owner1',
          passwordHash: passwordHash,
          passwordSalt: salt,
          role: 'owner',
        },
        {
          _id: 3,
          username: 'owner2',
          username_lowered: 'owner2',
          passwordHash: passwordHash,
          passwordSalt: salt,
          role: 'owner',
        },
        {
          _id: 4,
          username: 'reporter1',
          username_lowered: 'reporter1',
          passwordHash: passwordHash,
          passwordSalt: salt,
          role: 'reporter',
        },
        {
          _id: 5,
          username: 'reporter2',
          username_lowered: 'reporter2',
          passwordHash: passwordHash,
          passwordSalt: salt,
          role: 'reporter',
        },
      ]),
    ]);
    SeqModel.insertMany([
      {
        _id: 'user',
        count: 5,
      },
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
    const user = await UserModel.findOne({
      username_lowered: values.username.toLowerCase(),
    });
    if (!user) {
      throw new BadRequestError('Authentication failed');
    }
    const hash = await createPasswordHash(values.password, user.passwordSalt);
    if (user.passwordHash !== hash) {
      throw new BadRequestError('Authentication failed');
    }
    const token = randomUniqString();
    await TokenModel.insert({
      _id: token,
      userId: user._id,
    });
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
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

export const getMe = createContract('getMe')
  .params('user')
  .schema({
    user: V.object().unknown(),
  })
  .fn(async (user: AppUser) => {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  })
  .express({
    method: 'get',
    path: '/me',
    async json(req) {
      return getMe(req.user!);
    },
  });

export const getUsers = createContract('getUsers')
  .params()
  .fn(async () => {
    const users = await UserModel.find({})
      .sort({
        username_lowered: 1,
      })
      .toArray();
    return users.map(mapUser);
  })
  .express({
    method: 'get',
    path: '/users',
    async json(req) {
      return getUsers();
    },
  });

export const createUser = createContract('createUser')
  .params('values')
  .schema({
    values: V.object().keys({
      username: V.string(),
      role: V.enum().literal('admin', 'owner', 'reporter'),
    }),
  })
  .fn(async values => {
    const salt = await randomSalt();
    const passwordHash = await createPasswordHash('passa1', salt);
    const nextId = await getNextSeq('user');
    try {
      await UserModel.insert({
        _id: nextId,
        username: values.username,
        username_lowered: values.username.toLowerCase(),
        role: values.role,
        passwordHash: passwordHash,
        passwordSalt: salt,
      });
    } catch (e) {
      if (e.code === DUPLICATED_KEY_ERROR_CODE) {
        throw new BadRequestError('Username is already taken');
      }
      throw e;
    }
    return {
      id: nextId,
      username: values.username,
      role: values.role,
    };
  })
  .express({
    method: 'post',
    path: '/users',
    async json(req) {
      return createUser(req.body);
    },
  });

export const updateUser = createContract('updateUser')
  .params('id', 'values')
  .schema({
    id: V.number(),
    values: V.object().keys({
      username: V.string(),
      role: V.enum().literal('admin', 'owner', 'reporter'),
    }),
  })
  .fn(async (id, values) => {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestError('User not found');
    }
    user.username = values.username;
    user.username_lowered = values.username.toLowerCase();
    user.role = values.role;
    try {
      await UserModel.findOneAndUpdate(
        { _id: id },
        {
          $set: user,
        }
      );
    } catch (e) {
      if (e.code === DUPLICATED_KEY_ERROR_CODE) {
        throw new BadRequestError('Username is already taken');
      }
      throw e;
    }
    return {
      id: id,
      username: values.username,
      role: values.role,
    };
  })
  .express({
    method: 'post',
    path: '/users/:id',
    async json(req) {
      return updateUser(req.params.id as any, req.body);
    },
  });

export const deleteUser = createContract('deleteUser')
  .params('id')
  .schema({
    id: V.number(),
  })
  .fn(async id => {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestError('User not found');
    }
    await UserModel.findOneAndDelete({ _id: id });
  })
  .express({
    method: 'delete',
    path: '/users/:id',
    async json(req) {
      return deleteUser(req.params.id as any);
    },
  });

export const getUser = createContract('getUser')
  .params('id')
  .schema({
    id: V.number(),
  })
  .fn(async id => {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return mapUser(user);
  })
  .express({
    method: 'get',
    path: '/users/:id',
    async json(req) {
      return getUser(req.params.id as any);
    },
  });

export const getProject = createContract('getProject')
  .params('id')
  .schema({
    id: V.number(),
  })
  .fn(async id => {
    const project = await ProjectModel.findOne({ _id: id });
    if (!project) {
      throw new BadRequestError('project not found');
    }
    return {
      id: project._id,
      name: project.name,
      owner: await getUser(project.ownerId),
      members: await Promise.all(project.memberIds.map(id => getUser(id))),
    };
  })
  .express({
    method: 'get',
    path: '/projects/:id',
    async json(req) {
      return getProject(req.params.id as any);
    },
  });

export const createProject = createContract('createProject')
  .params('values')
  .schema({
    values: V.object().keys({
      name: V.string(),
      ownerId: V.number(),
      memberIds: V.array().items(V.number()),
    }),
  })
  .fn(async values => {
    const nextId = await getNextSeq('project');
    await ProjectModel.insert({
      _id: nextId,
      name: values.name,
      memberIds: values.memberIds,
      ownerId: values.ownerId,
    });
    return getProject(nextId);
  })
  .express({
    method: 'post',
    path: '/projects',
    async json(req) {
      return createProject(req.body);
    },
  });

export const updateProject = createContract('updateProject')
  .params('id', 'values')
  .schema({
    id: V.number(),
    values: V.object().keys({
      name: V.string(),
      ownerId: V.number(),
      memberIds: V.array().items(V.number()),
    }),
  })
  .fn(async (id, values) => {
    const project = await ProjectModel.findOne({ _id: id });
    if (!project) {
      throw new BadRequestError('project not found');
    }
    project.name = values.name;
    project.memberIds = values.memberIds;
    project.ownerId = values.ownerId;
    await ProjectModel.findOneAndUpdate({ _id: id }, { $set: project });
    return getProject(id);
  })
  .express({
    method: 'put',
    path: '/projects/:id',
    async json(req) {
      return updateProject(req.params.id as any, req.body);
    },
  });

export const deleteProject = createContract('deleteProject')
  .params('id')
  .schema({
    id: V.number(),
  })
  .fn(async id => {
    await ProjectModel.findOneAndDelete({ _id: id });
  })
  .express({
    method: 'delete',
    path: '/projects/:id',
    async json(req) {
      return deleteProject(req.params.id as any);
    },
  });

export const getProjects = createContract('getProjects')
  .params('user')
  .schema({
    user: V.object().unknown(),
  })
  .fn(async (user: AppUser) => {
    const criteria: any = {};
    if (user.role === 'owner') {
      criteria.ownerId = user.id;
    }
    if (user.role === 'reporter') {
      criteria.memberIds = user.id;
    }
    const projects = await ProjectModel.find(criteria)
      .sort({
        name: 1,
      })
      .toArray();
    const users = await UserModel.find().toArray();
    const userMap: Record<string, PublicUser> = {};
    users.forEach(user => {
      userMap[user._id] = mapUser(user);
    });
    const issues = await IssueModel.find().toArray();
    const issueCountMap: Record<string, number> = {};
    issues.forEach(issue => {
      if (!issueCountMap[issue.projectId]) {
        issueCountMap[issue.projectId] = 0;
      }
      issueCountMap[issue.projectId]++;
    });
    return projects.map(project => ({
      id: project._id,
      name: project.name,
      owner: userMap[project.ownerId],
      members: project.memberIds.map(id => userMap[id]),
      issueCount: issueCountMap[project._id] ?? 0,
    }));
  })
  .express({
    method: 'get',
    path: '/projects',
    async json(req) {
      return getProjects(req.user);
    },
  });

export const getIssues = createContract('getIssues')
  .params('projectId')
  .schema({
    projectId: V.number(),
  })
  .fn(async projectId => {
    const issues = await IssueModel.find({ projectId })
      .sort({
        issueId: -1,
      })
      .toArray();
    const users = await UserModel.find().toArray();
    const userMap: Record<string, PublicUser> = {};
    users.forEach(user => {
      userMap[user._id] = mapUser(user);
    });
    return issues.map(issue => {
      return {
        projectId: issue.projectId,
        issueId: issue.issueId,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        author: userMap[issue.authorId],
      };
    });
  })
  .express({
    method: 'get',
    path: '/projects/:projectId/issues',
    async json(req) {
      return getIssues(req.params.projectId as any);
    },
  });

export const postIssue = createContract('postIssue')
  .params('user', 'projectId', 'values')
  .schema({
    user: V.object().unknown(),
    projectId: V.number(),
    values: V.object().keys({
      title: V.string(),
      description: V.string(),
    }),
  })
  .fn(async (user: AppUser, projectId, values) => {
    const nextId = await getNextSeq('issue_' + projectId);
    const issue = {
      issueId: nextId,
      projectId,
      title: values.title,
      description: values.description,
      status: 'Open',
    };
    await IssueModel.insertOne({
      _id: `${projectId}_${nextId}`,
      authorId: user.id,
      ...issue,
    });
    return { ...issue, author: user };
  })
  .express({
    method: 'post',
    path: '/projects/:projectId/issues',
    async json(req) {
      return postIssue(req.user, req.params.projectId as any, req.body);
    },
  });

export const getIssue = createContract('getIssue')
  .params('projectId', 'issueId')
  .schema({
    projectId: V.number(),
    issueId: V.number(),
  })
  .fn(async (projectId, issueId) => {
    const issue = await IssueModel.findOne({
      _id: `${projectId}_${issueId}`,
    });
    if (!issue) {
      throw new BadRequestError('Issue not found');
    }
    return {
      projectId: issue.projectId,
      issueId: issue.issueId,
      title: issue.title,
      description: issue.description,
      author: await getUser(issue.authorId),
    };
  })
  .express({
    method: 'get',
    path: '/projects/:projectId/issues/:issueId',
    async json(req) {
      return getIssue(req.params.projectId as any, req.params.issueId as any);
    },
  });
