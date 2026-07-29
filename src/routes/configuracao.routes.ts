import { FastifyInstance } from "fastify";
import { ConfiguracaoController } from "../controllers/configuracao.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const controller = new ConfiguracaoController();

export async function configuracaoRoutes(app: FastifyInstance) {

  app.get(
    "/configuracoes",
    {
      preHandler: authMiddleware
    },
    controller.buscar
  );

  app.put(
    "/configuracoes",
    {
      preHandler: authMiddleware
    },
    controller.atualizar
  );

}