"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioController = void 0;
const relatorio_service_js_1 = require("../services/relatorio.service.js");
const service = new relatorio_service_js_1.RelatorioService();
class RelatorioController {
    async gerarPDF(request, reply) {
        return service.gerarPDF(reply, request.empresaId);
    }
    async gerarExcel(request, reply) {
        return service.gerarExcel(reply, request.empresaId);
    }
}
exports.RelatorioController = RelatorioController;
