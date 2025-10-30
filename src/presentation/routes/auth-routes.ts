import { Context } from "koa";
import Router from "@koa/router";

import { User, UserRole } from "../../domain/entity/User";

const router = new Router({ prefix: "/auth" });

router.post("/", async (ctx: Context) => {
  const { email, name } = ctx.request.body as Record<string, any>;

  if (!email) {
    ctx.status = 422;
    ctx.body = { error: "Email is required" };

    return;
  }

  if (!name) {
    ctx.status = 422;
    ctx.body = { error: "Name is required" };

    return;
  }

  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser) {
    const newUser = User.create({
      name,
      email,
      role: UserRole.User,
      isOnboarded: false,
      createdAt: new Date(),
    });

    await newUser.save();

    ctx.body = { message: "User signed in", user: newUser };

    return;
  }

  ctx.body = { message: "User signed in", user: foundUser };
});

export default router;
