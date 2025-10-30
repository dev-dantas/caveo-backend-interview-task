import Koa, { Context } from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";

import { env } from "../config";

import authRouter from "./routes/auth-routes";
import userRouter from "./routes/user-routes";
import accountRouter from "./routes/account-routes";

import {
  errorHandlerMiddleware,
  requestLoggingMiddleware,
} from "./middlewares";

const app = new Koa();
const router = new Router();

app.use(errorHandlerMiddleware);

app.use(requestLoggingMiddleware);

app.use(cors({ origin: env.cors.origin }));
app.use(helmet());
app.use(bodyParser());

router.get("/", async (ctx: Context) => {
  ctx.body = { message: "Server listening" };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(accountRouter.routes());

export default app;
