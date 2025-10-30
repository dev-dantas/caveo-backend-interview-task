import { Context } from "koa";
import Router from "@koa/router";

import { User, UserRole } from "../../domain/entity/User";

import { authMiddleware } from "../middlewares/auth";
import { scopeGuard } from "../middlewares/scope-guard";

const router = new Router({ prefix: "/users" });

router.get(
  "/",
  authMiddleware,
  scopeGuard([UserRole.Admin]),
  async (ctx: Context) => {
    const users = await User.find();

    ctx.body = users;
  }
);

export default router;
