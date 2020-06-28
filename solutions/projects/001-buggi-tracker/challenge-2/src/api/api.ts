import express, { Handler } from 'express';
import http from 'http';
import mongodb from 'mongodb';
import * as R from 'remeda';
import { initModels, TokenModel, UserModel } from './db';
import passport from 'passport';
import bodyParser from 'body-parser';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { ContractBinding } from 'defensive';
import { UnauthorizedError } from './errors';
import {
  wrapExpress,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
} from './helper';
import { Role } from '../types';

const app = express();

app.use(bodyParser.json());
const router = express.Router();

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: Role;
    }
  }
}
passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const tokenEntity = await TokenModel.findOne({ _id: token });
      if (tokenEntity) {
        const user = await UserModel.findOne({ _id: tokenEntity.userId });
        done(null, {
          id: user._id,
          username: user.username,
          role: user.role,
        });
      } else {
        return done(null, null);
      }
    } catch (e) {
      return done(e);
    }
  })
);

mongodb
  .connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  })
  .then(client => {
    const db = client.db('buggi');
    initModels(db);
    const bindings = R.flatMap(
      [require('./contracts')],
      m => Object.values(m) as Array<ContractBinding<any>>
    );

    R.flatMap(bindings, binding =>
      binding.expressOptions
        ? binding.expressOptions.map(options => ({ options, binding }))
        : []
    ).forEach(({ options }) => {
      const actions: Handler[] = [
        (req, res, next) => {
          if (!req.headers.authorization) {
            return next();
          }
          return passport.authenticate('bearer', { session: false })(
            req,
            res,
            next
          );
        },
        (req, res, next) => {
          if (options.public) {
            next();
            return;
          }
          if (!req.user) {
            next(new UnauthorizedError('Bearer token required'));
            return;
          }
          next();
        },
      ];
      console.log(
        `${
          options.public ? '[Public]' : '[Auth]'
        } ${options.method.toUpperCase()} /api${options.path}`
      );
      if (options.handler) {
        actions.push(options.handler);
      } else {
        actions.push((req, res, next) => {
          Promise.resolve(options.json!(req, res))
            .then(ret => {
              res.json(ret);
            })
            .catch(next);
        });
      }
      router[options.method](options.path, wrapExpress(actions) as any);
    });
    app.use((req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        next();
      } else {
        setTimeout(next, 500);
      }
    });
    app.use('/api', router);
    app.use(errorHandlerMiddleware);
    app.use(notFoundHandlerMiddleware);

    http.createServer(app).listen(4001, () => {
      console.log('listening on 4001');
    });
  })
  .catch(e => {
    console.error(e.stack);
    process.exit(-1);
  });
