"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
class AuditoriaService {
    async registrar({ empresaId, usuarioId, acao, detalhes, ip }) {
        return prisma_js_1.prisma.logAuditoria.create({
            data: {
                empresaId: BigInt(empresaId),
                usuarioId: usuarioId
                    ? BigInt(usuarioId)
                    : null,
                acao,
                detalhes,
                ip
            }
        });
    }
    async listar(empresaId) {
        return prisma_js_1.prisma.logAuditoria.findMany({
            where: {
                empresaId: BigInt(empresaId)
            },
            include: {
                usuario: {
                    select: {
                        nome: true
                    }
                }
            },
            orderBy: {
                criadoEm: "desc"
            }
        });
    }
}
exports.AuditoriaService = AuditoriaService;
