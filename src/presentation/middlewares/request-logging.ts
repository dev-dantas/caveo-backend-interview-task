import { Context, Next } from "koa"

import { logger } from "../../utils"

export async function requestLoggingMiddleware(ctx: Context, next: Next) {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;

  logger.info({
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration: `${ms}ms`,
  });
}
