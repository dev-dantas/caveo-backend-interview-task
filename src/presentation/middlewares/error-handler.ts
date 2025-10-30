import { Context, Next } from "koa";

import { env, NodeEnv } from "../../config";

import { logger } from "../../utils";

export async function errorHandlerMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    logger.error({ err, path: ctx.path }, "Erro não tratado");

    const isDevelopment = env.node.env === NodeEnv.Development;

    const errorMessage =
      err.message && isDevelopment ? err.message : "Erro interno do servidor";

    ctx.status = err.status || 500;
    ctx.body = {
      error: true,
      message: errorMessage,
      stack: isDevelopment ? err.stack : undefined,
    };
  }
}
