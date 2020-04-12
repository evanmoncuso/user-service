import "reflect-metadata";
import { createConnection } from "typeorm";

export async function initialize(): Promise<void> {
  try {
    console.log('Trying to initialize DB');
    // setup connection info
    const connectionUrl = process.env.DATABASE_URL;
    const host = process.env.DB_HOST;
    const username = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const environment = process.env.ENVIRONMENT;

    if (connectionUrl) {
      throw new Error('not set up for url connections yet');
    }

    await createConnection({
      type: 'postgres',
      host,
      port: 5432,
      username,
      password,
      database,
      entities: [
        __dirname + '/models/**{.ts,.js}',
      ],
      synchronize: true,
      logging: environment === 'development' ? true : false,
    });

    console.log('DB Connection Successful!')
  } catch(e) {
    throw e;
  }
}