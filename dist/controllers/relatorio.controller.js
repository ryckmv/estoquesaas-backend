import { RelatorioService } from "../services/relatorio.service.js";
const service = new RelatorioService();
export class RelatorioController {
    async gerarPDF(request, reply) {
        return service.gerarPDF(reply, request.empresaId);
    }
    async gerarExcel(request, reply) {
        return service.gerarExcel(reply, request.empresaId);
    }
}
