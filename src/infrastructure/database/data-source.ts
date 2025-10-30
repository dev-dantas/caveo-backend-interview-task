import { DataSource } from "typeorm";

import { env, NodeEnv } from "../../config";

import { User } from "../../domain/entity/User";

export const dataSource = new DataSource({
  type: "postgres",
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  entities: [User],
  synchronize: true,
  logging: env.node.env === NodeEnv.Development ? true : false,
});
