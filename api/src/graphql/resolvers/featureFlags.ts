// src/graphql/resolvers/index.ts

import { Pool } from "pg";
import dbConfig from "../../db/dbConfig";

const resolvers = {
  Query: {
    getFeatureFlags: async (_: any, args: { tables: string[] }) => {
      const results = [];
      const notFoundTables = [];

      for (const table of args.tables) {
        const config = dbConfig.tables[table];
        console.log("Buscando " + table);
        if (!config) {
          notFoundTables.push(table);
          continue; // Ignora tabelas não encontradas
        }

        const pool: Pool = new Pool({ ...dbConfig.defaultConfig });

        const query = `SELECT * FROM ${config.schema}.${table} WHERE active = true`;
        const res = await pool.query(query);

        if (res.rows.length > 0) {
          console.log("Encontrou " + table);
          results.push({
            active: true,
            tableName: table,
          });
        } else {
          console.log("Nao encontrou " + table);
          results.push({
            active: false,
            tableName: table,
          });
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
      // const config = dbConfig.tables[args.table];
      // if (!config) {
      //   throw new Error(`Table ${args.table} not found in configuration.`);
      // }
      // const pool: Pool = new Pool({ ...dbConfig.defaultConfig });
      // const query = `UPDATE ${config.schema}.${args.table} SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
      // const res = await pool.query(query, [args.active, args.id]);
      // return res.rows[0];
    },
  },
};

export default resolvers;
