import { Context, Next } from "koa";

import { UserRole } from "../../domain/entity/User";

export function scopeGuard(allowedScopes: UserRole[]) {
  return async (ctx: Context, next: Next) => {
    const user = ctx.state.user;

    if (!user || !user.role) {
      ctx.status = 401;
      ctx.body = { error: "Access denied: user not authenticated" };

      return;
    }

    if (!allowedScopes.includes(user.role)) {
      ctx.status = 401;
      ctx.body = { error: "Access denied: insufficient permissions" };

      return;
    }

    await next();
  };
}
