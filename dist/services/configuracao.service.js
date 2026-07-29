import { prisma } from "../lib/prisma.js";
export class ConfiguracaoService {
    async buscarEmpresa(empresaId) {
        return prisma.empresa.findUnique({
            where: {
                id: BigInt(empresaId)
            }
        });
    }
    async atualizarEmpresa({ empresaId, nome, cnpj, telefone, email }) {
        return prisma.empresa.update({
            where: {
                id: BigInt(empresaId)
            },
            data: {
                nome,
                cnpj,
                telefone,
                email
            }
        });
    }
}
