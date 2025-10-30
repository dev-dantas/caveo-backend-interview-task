import "reflect-metadata";

import { env } from "./config";
import { logger } from "./utils";
import { dataSource } from "./infrastructure/database";

import server from "./presentation/server";

const port = env.server.port;

dataSource
  .initialize()
  .then(() => {
    logger.info("📦 Conexão com o PostgreSQL estabelecida com sucesso!");

    server.listen(port, () => {
      logger.info(`✅ Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error({ error }, "❌ Falha ao conectar ao banco de dados");

    process.exit(1);
  });
