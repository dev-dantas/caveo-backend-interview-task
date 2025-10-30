import dotenv from "dotenv";

dotenv.config();

export enum NodeEnv {
  Development = "development",
  Homolog = "homolog",
  Production = "production",
  Staging = "staging",
}

export interface EnvConfig {
  node: {
    env: NodeEnv;
  };
  server: {
    port: number;
  };
  lib: {
    cognito: {
      clientId: string;
      userPoolId: string;
    };
  };
  log: {
    level: string;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  cors: {
    origin: string;
  };
}

const resolveNodeEnv = (): NodeEnv => {
  const env = process.env.NODE_ENV?.toLowerCase();

  switch (env) {
    case NodeEnv.Production:
      return NodeEnv.Production;
    case NodeEnv.Homolog:
      return NodeEnv.Homolog;
    case NodeEnv.Staging:
      return NodeEnv.Staging;
    default:
      return NodeEnv.Development;
  }
};

export const env: EnvConfig = {
  node: {
    env: resolveNodeEnv(),
  },
  server: {
    port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
  },
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "admin",
    name: process.env.DATABASE_NAME || "test",
  },
  lib: {
    cognito: {
      clientId: process.env.COGNITO_CLIENT_ID || "",
      userPoolId: process.env.COGNITO_USER_POOL_ID || "",
    },
  },
  log: {
    level: process.env.LOG_LEVEL || "info",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};
