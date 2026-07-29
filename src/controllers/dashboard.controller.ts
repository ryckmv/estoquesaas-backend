import { FastifyRequest, FastifyReply } from "fastify";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();


export class DashboardController {

  async resumo(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const { empresaId } = request;

    const dados = await dashboardService.resumo(
      empresaId!
    );


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