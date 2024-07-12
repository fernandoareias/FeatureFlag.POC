// src/db/dbClient.ts
import { Client } from "pg";
import dbConfig from "./dbConfig";

const client = new Client({
  user: dbConfig.defaultConfig.user,
  host: dbConfig.defaultConfig.host,
  database: dbConfig.defaultConfig.database,
  password: dbConfig.defaultConfig.password,
  port: dbConfig.defaultConfig.port,
});

client
  .connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Connection error", err.stack));

export default client;
