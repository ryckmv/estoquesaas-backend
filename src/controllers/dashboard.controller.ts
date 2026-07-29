import { FastifyRequest, FastifyReply } from "fastify";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export class DashboardController {

  async resumo(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const { empresaId, role } = request;

    let dados;


    // MASTER NÃO POSSUI EMPRESA
    if (role === "master") {

      dados = await dashboardService.resumoMaster();

    } else {


      // USUÁRIOS NORMAIS PRECISAM DE EMPRESA
      if (!empresaId) {

        return reply.status(401).send({
          erro: "Usuário sem empresa vinculada."
        });

      }


      dados = await dashboardService.resumo(
        empresaId
      );

    }


    return reply.send(
      JSON.parse(
        JSON.stringify(
          dados,
          (_, value) =>
            typeof value === "bigint"
              ? value.toString()
              : value
        )
      )
    );

  }

}