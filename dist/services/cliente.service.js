"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const AppError_js_1 = require("../errors/AppError.js");
class ClienteService {
    async create(data) {
        if (!data.nome || !data.nome.trim()) {
            throw new AppError_js_1.AppError('Nome do cliente é obrigatório.', 400);
        }
        if (data.cpf &&
            !/^\d{11}$/.test(data.cpf)) {
            throw new AppError_js_1.AppError('CPF deve conter 11 números.', 400);
        }
        const cliente = await prisma_js_1.prisma.cliente.create({
            data: {
                empresaId: BigInt(data.empresaId),
                nome: data.nome,
                telefone: data.telefone,
                cpf: data.cpf
            }
        });
        return cliente;
    }
    async listByEmpresa(empresaId) {
        return prisma_js_1.prisma.cliente.findMany({
            where: {
                empresaId: BigInt(empresaId)
            },
            orderBy: {
                nome: 'asc'
            }
        });
    }
    async findById(id, empresaId) {
        const cliente = await prisma_js_1.prisma.cliente.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            }
        });
        if (!cliente) {
            throw new AppError_js_1.AppError('Cliente não encontrado.', 404);
        }
        return cliente;
    }
    async update(id, empresaId, data) {
        const cliente = await prisma_js_1.prisma.cliente.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            }
        });
        if (!cliente) {
            throw new AppError_js_1.AppError('Cliente não encontrado.', 404);
        }
        return prisma_js_1.prisma.cliente.update({
            where: {
                id: BigInt(id)
            },
            data: {
                nome: data.nome,
                telefone: data.telefone,
                cpf: data.cpf
            }
        });
    }
    async delete(id, empresaId) {
        const cliente = await prisma_js_1.prisma.cliente.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            }
        });
        if (!cliente) {
            throw new AppError_js_1.AppError('Cliente não encontrado.', 404);
        }
        return prisma_js_1.prisma.cliente.delete({
            where: {
                id: BigInt(id)
            }
        });
    }
}
exports.ClienteService = ClienteService;
