"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendaService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const AppError_js_1 = require("../errors/AppError.js");
class VendaService {
    async criar(data) {
        if (!data.itens || data.itens.length === 0) {
            throw new AppError_js_1.AppError('A venda precisa ter pelo menos um item.', 400);
        }
        for (const item of data.itens) {
            if (item.quantidade <= 0) {
                throw new AppError_js_1.AppError('A quantidade do produto deve ser maior que zero.', 400);
            }
        }
        return prisma_js_1.prisma.$transaction(async (tx) => {
            if (data.clienteId) {
                const cliente = await tx.cliente.findFirst({
                    where: {
                        id: BigInt(data.clienteId),
                        empresaId: BigInt(data.empresaId)
                    }
                });
                if (!cliente) {
                    throw new AppError_js_1.AppError('Cliente não encontrado.', 404);
                }
            }
            let valorTotal = 0;
            const produtos = [];
            for (const item of data.itens) {
                const produto = await tx.produto.findFirst({
                    where: {
                        id: BigInt(item.produtoId),
                        empresaId: BigInt(data.empresaId),
                        ativo: true
                    }
                });
                if (!produto) {
                    throw new AppError_js_1.AppError('Produto não encontrado.', 404);
                }
                if (produto.quantidade < item.quantidade) {
                    throw new AppError_js_1.AppError(`Estoque insuficiente para ${produto.nome}`, 400);
                }
                valorTotal +=
                    Number(produto.precoVenda) *
                        item.quantidade;
                produtos.push({
                    produto,
                    quantidade: item.quantidade
                });
            }
            const venda = await tx.venda.create({
                data: {
                    empresaId: BigInt(data.empresaId),
                    clienteId: data.clienteId
                        ? BigInt(data.clienteId)
                        : undefined,
                    usuarioId: data.usuarioId
                        ? BigInt(data.usuarioId)
                        : undefined,
                    valorTotal
                }
            });
            for (const item of produtos) {
                await tx.vendaItem.create({
                    data: {
                        vendaId: venda.id,
                        produtoId: item.produto.id,
                        quantidade: item.quantidade,
                        precoVendaUnitario: item.produto.precoVenda,
                        precoCustoUnitario: item.produto.precoCusto
                    }
                });
                await tx.produto.update({
                    where: {
                        id: item.produto.id
                    },
                    data: {
                        quantidade: {
                            decrement: item.quantidade
                        }
                    }
                });
                await tx.movimentacaoEstoque.create({
                    data: {
                        empresaId: BigInt(data.empresaId),
                        produtoId: item.produto.id,
                        usuarioId: data.usuarioId
                            ? BigInt(data.usuarioId)
                            : undefined,
                        tipo: 'saida',
                        motivo: 'ajuste',
                        quantidade: item.quantidade
                    }
                });
            }
            return venda;
        });
    }
    async buscarPorId(id, empresaId) {
        const venda = await prisma_js_1.prisma.venda.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            },
            include: {
                cliente: true,
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });
        if (!venda) {
            throw new AppError_js_1.AppError('Venda não encontrada.', 404);
        }
        return venda;
    }
    async listar(empresaId) {
        return prisma_js_1.prisma.venda.findMany({
            where: {
                empresaId: BigInt(empresaId)
            },
            include: {
                cliente: true,
                itens: {
                    include: {
                        produto: true
                    }
                }
            },
            orderBy: {
                criadoEm: 'desc'
            }
        });
    }
    async cancelar(id, empresaId) {
        return prisma_js_1.prisma.$transaction(async (tx) => {
            const venda = await tx.venda.findFirst({
                where: {
                    id: BigInt(id),
                    empresaId: BigInt(empresaId)
                },
                include: {
                    itens: true
                }
            });
            if (!venda) {
                throw new AppError_js_1.AppError('Venda não encontrada.', 404);
            }
            if (venda.status === 'cancelada') {
                throw new AppError_js_1.AppError('Venda já está cancelada.', 400);
            }
            for (const item of venda.itens) {
                await tx.produto.update({
                    where: {
                        id: item.produtoId
                    },
                    data: {
                        quantidade: {
                            increment: item.quantidade
                        }
                    }
                });
                await tx.movimentacaoEstoque.create({
                    data: {
                        empresaId: BigInt(empresaId),
                        produtoId: item.produtoId,
                        tipo: 'entrada',
                        motivo: 'ajuste',
                        quantidade: item.quantidade
                    }
                });
            }
            const vendaCancelada = await tx.venda.update({
                where: {
                    id: venda.id
                },
                data: {
                    status: 'cancelada'
                }
            });
            return vendaCancelada;
        });
    }
}
exports.VendaService = VendaService;
