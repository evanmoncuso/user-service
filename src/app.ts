import * as express from 'express';
import * as bp from 'body-parser';
import * as cors from 'cors';

import { initialize } from './data/initialize';
import { createUser } from './routes/users';
import { getUserByUUID, editUser, promoteUser, deleteUser } from './routes/user';

import { createTokenAuthMiddleware } from '@evanmoncuso/token-auth-middleware';

const PORT = process.env.PORT;

export default async function main() {
  try {
    if (!PORT) {
      throw new Error('No PORT specified')
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('No ACCESS_TOKEN_SECRET provided');
    }

    await initialize();

    const app = express();

    // Setup app usables
    app.use(cors());

    app.use(bp.urlencoded({ extended: false }));
    app.use(bp.text());

    app.use(bp.json({
      type: [
        'application/json',
        'application/vnd.api+json',
      ]
    }));

    // logger
    app.use((req: express.Request, _, next: express.NextFunction) => {
      console.log(`[ ${req.method} ] :: ${req.url} - ${new Date()}`)
      next();
    });

    app.get('/health', (_, res: express.Response) => {
      res.sendStatus(204);
    });

    // Unauthenticated Paths
    app.post('/users', createUser);

    // Authenticated Paths
    app.get('/users/:user_uuid', createTokenAuthMiddleware(), getUserByUUID);
    app.patch('/users/:user_uuid', createTokenAuthMiddleware(), editUser);
    app.patch('/users/:user_uuid/promote', createTokenAuthMiddleware({ roles: [ 'ADMIN' ]}), promoteUser);
    app.delete('/users/:user_uuid', createTokenAuthMiddleware({ roles: [ 'ADMIN' ]}), deleteUser);

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  } catch(e) {
    console.log('error', e);
  }
}

main();