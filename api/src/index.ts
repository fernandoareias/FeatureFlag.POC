import Koa from "koa";
import Router from "koa-router";
import { ApolloServer } from "apollo-server-koa";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/featureFlags";

const startServer = async () => {
  const app = new Koa();
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
    console.log("Server running on http://localhost:4000");
  });
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
