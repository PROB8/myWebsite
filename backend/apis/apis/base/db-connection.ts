import { ServerErrors } from '../../declarations/enums';
import { MongoClient, Db } from 'mongodb';

export interface ConnectionResponse {
  db: Db;
  close: Function;
  client: MongoClient;
}

const { DB_CONNECTION, DB_NAME } = process.env;
const options = {
  maxPoolSize: 50,
};
let db: Db;
let client: MongoClient;
let close: Function;

export async function connect(): Promise<ConnectionResponse> {
  if (!db && DB_CONNECTION) {
    client = await MongoClient.connect(DB_CONNECTION, options);
    db = client.db(DB_NAME);
    close = client.close;
  }

  return { db, close, client };
}

export async function retryConnection(
  retries: number
): Promise<{ client: MongoClient; db: Db; close: Function }> {
  if (retries === 0) {
    throw new Error(ServerErrors.CannotConnectDb);
  }
  if (db) return { client, db, close };
  const { client: c, close: cl, db: d } = await connect();
  if (c !== undefined) {
    return { client: c, db: d, close: cl };
  }
  return retryConnection(retries - 1);
}
