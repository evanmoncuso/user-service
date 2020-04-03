import * as express from 'express';
import * as bp from 'body-parser';
import * as cors from 'cors';

import { createUser } from './routes/users';

const PORT = process.env.PORT;

export default function main() {
  try {
    if (!PORT) {
      throw new Error('No PORT specified')
    }

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

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  } catch(e) {
    console.log('error', e);
  }
}

main();