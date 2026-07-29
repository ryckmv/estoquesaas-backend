"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimentacaoService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const AppError_js_1 = require("../errors/AppError.js");
const tiposValidos = [
    'entrada',
    'saida'
];
const motivosValidos = [
    'compra',
    'ajuste',
    'perda'
];
class MovimentacaoService {
    async criar(data) {
        if (data.quantidade <= 0) {
            throw new AppError_js_1.AppError('Quantidade deve ser maior que zero.', 400);
        }
        if (!tiposValidos.includes(data.tipo)) {
            throw new AppError_js_1.AppError('Tipo de movimentação inválido.', 400);
        }
        if (!motivosValidos.includes(data.motivo)) {
            throw new AppError_js_1.AppError('Motivo de movimentação inválido.', 400);
        }
        return prisma_js_1.prisma.$transaction(async (tx) => {
            const produto = await tx.produto.findFirst({
                where: {
                    id: BigInt(data.produtoId),
                    empresaId: BigInt(data.empresaId),
                    ativo: true
                }
            });
            if (!produto) {
                throw new AppError_js_1.AppError('Produto não encontrado.', 404);
            }
            if (data.tipo === 'saida' &&
                produto.quantidade < data.quantidade) {
                throw new AppError_js_1.AppError('Estoque insuficiente.', 400);
            }
            const quantidadeAtualizada = await tx.produto.update({
                where: {
                    id: produto.id
                },
                data: {
                    quantidade: data.tipo === 'entrada'
                        ? {
                            increment: data.quantidade
                        }
                        : {
                            decrement: data.quantidade
                        }
                }
            });
            await tx.movimentacaoEstoque.create({
                data: {
                    empresaId: BigInt(data.empresaId),
                    produtoId: produto.id,
                    usuarioId: data.usuarioId
                        ? BigInt(data.usuarioId)
                        : undefined,
                    tipo: data.tipo,
                    motivo: data.motivo,
                    quantidade: data.quantidade
                }
            });
            return quantidadeAtualizada;
        });
    }
    async listar(empresaId) {
        return prisma_js_1.prisma.movimentacaoEstoque.findMany({
            where: {
                empresaId: BigInt(empresaId)
            },
            orderBy: {
                criadoEm: 'desc'
            },
            include: {
                produto: true,
                usuario: {
                    select: {
                        nome: true
                    }
                }
            }
        });
    }
}
exports.MovimentacaoService = MovimentacaoService;
