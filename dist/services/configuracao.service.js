"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracaoService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
class ConfiguracaoService {
    async buscarEmpresa(empresaId) {
        return prisma_js_1.prisma.empresa.findUnique({
            where: {
                id: BigInt(empresaId)
            }
        });
    }
    async atualizarEmpresa({ empresaId, nome, cnpj, telefone, email }) {
        return prisma_js_1.prisma.empresa.update({
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
exports.ConfiguracaoService = ConfiguracaoService;
