import createClient from "../../db/dbClient";
import { dbConfig, tableConfig } from "../../db/dbConfig";
import { ChangeFlagValue } from "../../models/changeFlagValue.model";
import { MessageQueue } from "../../rabbitmq/rabbitMQClient";
import { LogManager } from "../../utils/logManager";

const resolvers = {
  Query: {
    getFeatureFlags: async (_: any, args: { tables: string[] }) => {
      const results = [];
      const notFoundTables = [];

      for (const table of args.tables) {
        LogManager.logInfo("Buscando configuracao da tabela.");

        const _tableConfig = tableConfig.tables[table];

        LogManager.logInfo(
          "Configuracao da tabela: " + JSON.stringify(_tableConfig)
        );

        if (!_tableConfig) {
          notFoundTables.push(table);
          continue;
        }
        LogManager.logInfo("Buscando nome da base.");

        const database = _tableConfig.database;
        LogManager.logInfo("Base: " + database);

        LogManager.logInfo("Buscando configuracao da base.");

        const config = dbConfig.databaseConfig[database];

        LogManager.logInfo("Configuracao da base: " + JSON.stringify(config));

        if (!config) {
          notFoundTables.push(table);
          continue;
        }

        try {
          const client = await createClient(database);
          const query = `
          SELECT ${_tableConfig.column} 
          FROM ${_tableConfig.schema}.${table} LIMIT 1
      `;

          const res = await client.query(query);

          if (res.rows.length > 0) {
            results.push({
              active: res.rows[0][_tableConfig.column],
              tableName: table,
              aliasName: _tableConfig.aliasName,
            });
          } else {
            results.push({
              active: false,
              tableName: table,
              aliasName: "",
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
      args: { table: string; active: boolean }
    ) => {
      try {
        const _tableConfig = tableConfig.tables[args.table];

        LogManager.logInfo(
          "Buscando configuracao da tabela: " + JSON.stringify(_tableConfig)
        );

        if (!_tableConfig) {
          return {
            success: false,
          };
        }

        const databaseConfig = dbConfig.databaseConfig[_tableConfig.database];

        LogManager.logInfo(
          "Buscando configuracao da base: " + JSON.stringify(databaseConfig)
        );

        if (!databaseConfig) {
          return {
            success: false,
          };
        }

        const message = {
          active: args.active,
          table: args.table,
          column: _tableConfig.column,
          database: {
            host: databaseConfig.host,
            username: databaseConfig.user,
            password: databaseConfig.password,
            port: databaseConfig.port,
          },
        };

        const changeFlagValue = new ChangeFlagValue(message);

        const response = await MessageQueue.publishToQueue(
          args.table,
          changeFlagValue.toString()
        );

        return {
          success: response,
        };
      } catch (error) {
        LogManager.logError(`Erro no set flag, error: ${error}`);

        return {
          success: false,
        };
      }
    },
  },
};

export default resolvers;
