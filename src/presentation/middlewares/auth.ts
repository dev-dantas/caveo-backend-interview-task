import { Context, Next } from "koa";

import { cognitoVerifier } from "../../lib/aws/cognito";

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: "Missing Authorization header" };

    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await cognitoVerifier.verify(token);

    const role =
      decoded["cognito:groups"] && decoded["cognito:groups"].length > 0
        ? decoded["cognito:groups"][0]
        : "user";

    ctx.state.user = { sub: decoded.sub, email: decoded.email, role };

    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid or expired token" };
  }
}
