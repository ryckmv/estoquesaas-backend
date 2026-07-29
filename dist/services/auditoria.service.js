import { prisma } from "../lib/prisma.js";
export class AuditoriaService {
    async registrar({ empresaId, usuarioId, acao, detalhes, ip }) {
        return prisma.logAuditoria.create({
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
        return prisma.logAuditoria.findMany({
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
