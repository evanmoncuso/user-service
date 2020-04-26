import "reflect-metadata";
import { createConnection } from "typeorm";

export async function initialize(): Promise<void> {
  console.log('Trying to initialize DB');
  // setup connection info
  const connectionUrl = process.env.PG_URL;
  const host = process.env.DB_HOST;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const environment = process.env.ENVIRONMENT;

  if (connectionUrl) {
    await createConnection({
      type: 'postgres',
      url: connectionUrl,
      synchronize: true,
      entities: [
        __dirname + '/models/**{.ts,.js}',
      ],
      ssl: {
        rejectUnauthorized: false,
      },
    })
  } else {
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
  }


  console.log('DB Connection Successful!')
}