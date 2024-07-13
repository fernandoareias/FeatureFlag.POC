import { Middleware } from "koa";

const loggerMiddleware: Middleware = async (ctx, next) => {
  const start = Date.now();

  console.log(`[+] - Incoming request: ${ctx.method} ${ctx.url}`);

  await next();

  const duration = Date.now() - start;
  console.log(`[+] - Response status: ${ctx.status}`);
  console.log(`[+] - Request duration: ${duration}ms`);
};

export default loggerMiddleware;
