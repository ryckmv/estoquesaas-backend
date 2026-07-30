import { FastifyInstance } from "fastify";
import { ConfiguracaoController } from "../controllers/configuracao.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verificarRole } from "../middlewares/role.middleware.js";

const controller = new ConfiguracaoController();

export async function configuracaoRoutes(app: FastifyInstance) {

  app.get(
    "/configuracoes",
    {
      preHandler: [
        authMiddleware,
        verificarRole(["admin"])
      ]
    },
    controller.buscar
  );

  app.put(
    "/configuracoes",
    {
      preHandler: [
        authMiddleware,
        verificarRole(["admin"])
      ]
    },
    controller.atualizar
  );

}