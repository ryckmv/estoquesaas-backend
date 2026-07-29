"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaController = void 0;
const auditoria_service_js_1 = require("../services/auditoria.service.js");
const auditoriaService = new auditoria_service_js_1.AuditoriaService();
class AuditoriaController {
    async listar(request, reply) {
        const logs = await auditoriaService.listar(request.empresaId);
        return reply.send({
            auditorias: logs.map(log => ({
                id: log.id.toString(),
                acao: log.acao,
                detalhes: log.detalhes,
                usuario: log.usuario
                    ? {
                        nome: log.usuario.nome
                    }
                    : null,
                criadoEm: log.criadoEm
            }))
        });
    }
}
exports.AuditoriaController = AuditoriaController;
