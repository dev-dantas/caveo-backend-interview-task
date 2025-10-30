import pino from "pino";

import { env, NodeEnv } from "../config";

const isPretty = env.node.env === NodeEnv.Development;

export const logger = isPretty
  ? pino({
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
      level: env.log.level,
    })
  : pino({
      level: env.log.level,
    });
