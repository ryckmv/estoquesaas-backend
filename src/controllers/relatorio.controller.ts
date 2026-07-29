import { FastifyReply, FastifyRequest } from "fastify";
import { RelatorioService } from "../services/relatorio.service.js";

const service = new RelatorioService();

export class RelatorioController {

  async gerarPDF(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    return service.gerarPDF(
      reply,
      request.empresaId!
    );
  }

  async gerarExcel(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    return service.gerarExcel(
      reply,
      request.empresaId!
    );
  }

}