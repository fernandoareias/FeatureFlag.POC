import { Client } from "pg";
import { dbConfig } from "./dbConfig";

async function createClient(database: string) {
  const config = dbConfig.databaseConfig[database];
  if (!config) {
    throw new Error(`Database configuration not found for ${database}`);
  }

  const client = new Client({
    user: config.user,
    host: config.host,
    database: database,
    password: config.password,
    port: config.port,
  });

  try {
    await client.connect();
    console.log("Connected to database");
    return client;
  } catch (err: any) {
    console.error("Connection error", err.stack);
    throw new Error("Failed to connect to the database");
  }
}

export default createClient;
