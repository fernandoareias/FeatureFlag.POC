import amqp, { Connection, Channel } from "amqplib";
import { LogManager } from "../utils/logManager";
import dotenv from "dotenv";

export class MessageQueue {
  static async publishToQueue(
    routingKey: string,
    message: string
  ): Promise<boolean> {
    try {
      dotenv.config();

      const rabbitmqUri =
        process.env.RABBITMQ_URI ?? "amqp://admin:admin@rabbitmq:5672";
      const exchange = "disable-services-exchange";
      const queue = "disable-services-queue";

      LogManager.logInfo(
        `Se conectando com o servidor do rabbitmq: ${rabbitmqUri}`
      );
      const connection: Connection = await amqp.connect(rabbitmqUri);

      LogManager.logInfo(`Criando canal no rabbitmq`);
      const channel: Channel = await connection.createChannel();

      LogManager.logInfo(`Criando exchange ${exchange} se ela nao existir`);
      await channel.assertExchange(exchange, "fanout", { durable: true });

      LogManager.logInfo(`Criando queue ${queue} se ela nao existir`);
      await channel.assertQueue(queue, { durable: true });

      LogManager.logInfo(
        `Criando bind da queue ${queue} | routing key ${routingKey} se nao existir`
      );
      await channel.bindQueue(queue, exchange, routingKey);

      LogManager.logInfo(
        `Publicando mensagem: "${message}" na exchange: ${exchange} com a routing key: ${routingKey} na fila: ${queue}`
      );
      channel.publish(exchange, routingKey, Buffer.from(message), {
        persistent: true,
      });

      LogManager.logInfo(`Mensagem: ${message} enviada com sucesso.`);

      setTimeout(() => {
        channel.close();
        connection.close();
      }, 500);

      return true;
    } catch (error) {
      LogManager.logError(
        `Erro na publicacao da mensagem: "${message}" | error: ${error}`
      );
      return false;
    }
  }
}
