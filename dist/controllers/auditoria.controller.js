import { AuditoriaService } from "../services/auditoria.service.js";
const auditoriaService = new AuditoriaService();
export class AuditoriaController {
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
