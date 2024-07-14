import { Middleware } from "koa";
import { LogManager } from "../utils/logManager";

const loggerMiddleware: Middleware = async (ctx, next) => {
  const start = Date.now();

  LogManager.logInfo(`Incoming request: ${ctx.method} ${ctx.url}`);

  await next();

  const duration = Date.now() - start;

  LogManager.logInfo(`Response status: ${ctx.status}`);
  LogManager.logInfo(`Request duration: ${duration}ms`);
};

export default loggerMiddleware;
