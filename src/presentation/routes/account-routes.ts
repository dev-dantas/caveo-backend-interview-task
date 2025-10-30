import { Context } from "koa";
import Router from "@koa/router";

import { User, UserRole } from "../../domain/entity/User";

import { authMiddleware } from "../middlewares/auth";

const router = new Router({ prefix: "" });

router.get("/me", authMiddleware, async (ctx: Context) => {
  const user = await User.findOne({
    where: { email: ctx.state.user.email },
  });

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };

    return;
  }

  ctx.body = user;
});

router.put("/edit-account", authMiddleware, async (ctx: Context) => {
  const { name, role } = ctx.request.body as Record<string, any>;

  const user = await User.findOne({
    where: { email: ctx.state.user.email },
  });

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };

    return;
  }

  if ([UserRole.SuperAdmin, UserRole.Admin].includes(ctx.state.user.role)) {
    if (name) user.name = name;
    if (role) user.role = role;
  } else {
    if (name && !role) {
      user.name = name;
      user.isOnboarded = true;
    } else {
      ctx.status = 409;
      ctx.body = { error: "Regular users can only update their name" };

      return;
    }
  }

  await user.save();

  ctx.body = user;
});

export default router;
