import createClient from "../../db/dbClient";
import { dbConfig, tableConfig } from "../../db/dbConfig";

const resolvers = {
  Query: {
    getFeatureFlags: async (_: any, args: { tables: string[] }) => {
      const results = [];
      const notFoundTables = [];

      for (const table of args.tables) {
        console.log("[+] - Buscando configuracao da tabela.");
        const _tableConfig = tableConfig.tables[table];
        console.log("[+] - " + _tableConfig);

        if (!_tableConfig) {
          notFoundTables.push(table);
          continue;
        }

        console.log("[+] - Buscando nome da base.");
        const database = _tableConfig.database;
        console.log("[+] - Base: " + database);

        console.log("[+] - Buscando configuracao da base.");
        const config = dbConfig.databaseConfig[database];
        console.log("[+] - Configuracao da base: " + JSON.stringify(config));

        if (!config) {
          notFoundTables.push(table);
          continue;
        }

        try {
          const client = await createClient(database);
          const query = `SELECT * FROM ${_tableConfig.schema}.${table} WHERE ${_tableConfig.column} = ${_tableConfig.expected}`;
          const res = await client.query(query);

          if (res.rows.length > 0) {
            results.push({
              active: true,
              tableName: table,
            });
          } else {
            results.push({
              active: false,
              tableName: table,
            });
          }

          await client.end();
        } catch (err) {
          console.error(`Error handling table ${table}:`, err);
          notFoundTables.push(table);
        }
      }

      return {
        featureFlags: results,
        message:
          notFoundTables.length > 0
            ? `As seguintes tabelas não foram encontradas: ${notFoundTables.join(
                ", "
              )}`
            : null,
      };
    },
  },
  Mutation: {
    setFeatureFlag: async (
      _: any,
      args: { table: string; id: string; active: boolean }
    ) => {
      // const _tableConfig = tableConfig.tables[args.table];
      // if (!_tableConfig) {
      //   throw new Error(`Table ${args.table} not found in configuration.`);
      // }
      // const database = _tableConfig.database;
      // const config = dbConfig.databaseConfig[database];
      // if (!config) {
      //   throw new Error(`Database configuration not found for ${database}`);
      // }
      // try {
      //   const client = await createClient(database);
      //   const query = `UPDATE ${config.schema}.${args.table} SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
      //   const res = await client.query(query, [args.active, args.id]);
      //   await client.end();
      //   return res.rows[0];
      // } catch (err) {
      //   console.error(
      //     `Error updating feature flag for table ${args.table}:`,
      //     err
      //   );
      //   throw new Error("Failed to update feature flag");
      // }
    },
  },
};

export default resolvers;
