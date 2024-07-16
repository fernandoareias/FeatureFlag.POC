import Koa from "koa";
import Router from "koa-router";
import { ApolloServer } from "apollo-server-koa";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/featureFlags";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import bodyParser from "koa-bodyparser";
import { LogManager } from "./utils/logManager";
import "./rabbitmq/consumerJob";

import dotenv from "dotenv";

const startServer = async () => {
  dotenv.config();

  const app = new Koa();
  app.use(loggerMiddleware);

  const router = new Router();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ ctx }) => ({ db: ctx.request.query.db }),
  });

  await server.start();

  server.applyMiddleware({ app });

  router.get("/", async (ctx) => {
    ctx.body = "Hello";
  });

  app.use(router.routes()).use(router.allowedMethods());

  app.listen({ port: 4000 }, () => {
    LogManager.logInfo("Server running on http://localhost:4000");
  });
};

startServer().catch((err) => {
  LogManager.logError("Error starting server: " + err);
});
