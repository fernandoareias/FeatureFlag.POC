import amqp from "amqplib";
import { ChangeFlagValue } from "../models/changeFlagValue.model";
import { LogManager } from "../utils/logManager";
import { Pool } from "pg";
import createClient from "../db/dbClient";
import { dbConfig, tableConfig } from "../db/dbConfig";
import { response } from "express";
import dotenv from "dotenv";

const QUEUE_NAME = "disable-services-queue";

const consumeMessages = async () => {
  try {
    dotenv.config();
    const rabbitmqUri =
      process.env.RABBITMQ_URI ?? "amqp://admin:admin@rabbitmq:5672";
    LogManager.logInfo(
      `Se conectando com o servidor do rabbitmq: ${rabbitmqUri}`
    );
    const connection = await amqp.connect(rabbitmqUri);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    LogManager.logInfo(`Aguardando mensagens na fila: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          const changeFlagValue = new ChangeFlagValue(content);

          LogManager.logInfo(
            `Mensagem consumida: ${changeFlagValue.toString()}`
          );

          const _tableConfig = tableConfig.tables[changeFlagValue.table];

          LogManager.logInfo(
            "Configuracao da tabela: " + JSON.stringify(_tableConfig)
          );

          if (!_tableConfig) {
            throw Error("Table not exists");
          }
          LogManager.logInfo("Buscando nome da base.");

          const database = _tableConfig.database;
          LogManager.logInfo("Base: " + database);

          LogManager.logInfo("Buscando configuracao da base.");

          const configDatabase = dbConfig.databaseConfig[database];

          LogManager.logInfo(
            "Configuracao da base: " + JSON.stringify(configDatabase)
          );

          if (!configDatabase) {
            throw Error("Config database not exists");
          }

          const client = await createClient(database);
          try {
            const query = `
              SELECT ${_tableConfig.column} 
              FROM ${_tableConfig.schema}.${changeFlagValue.table}  
              LIMIT 1
          `;

            const res = await client.query(query);

            if (res.rows.length <= 0) {
              LogManager.logError("Nao existe registro nessa tabela");
              throw new Error("Nao existe registro nessa tabela");
            }

            const row = res.rows[0];
            LogManager.logInfo("Retorno do banco: " + JSON.stringify(row));
            LogManager.logInfo("Atualizando para: " + changeFlagValue.active);

            const queryUpdate = `
                UPDATE ${_tableConfig.schema}.${changeFlagValue.table} 
                SET ${_tableConfig.column} = '${changeFlagValue.active}' 
            `;

            const resUpdate = await client.query(queryUpdate);

            if (resUpdate.rowCount! <= 0) {
              LogManager.logError(JSON.stringify(resUpdate));
            }
          } catch (error) {
            throw error;
          } finally {
            await client.end();
          }

          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          throw error;
        }
      }
    });
  } catch (error) {
    console.error("Erro ao consumir mensagens:", error);
  }
};

consumeMessages();
