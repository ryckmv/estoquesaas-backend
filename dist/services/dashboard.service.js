"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_js_1 = require("../lib/prisma.js");
class DashboardService {
    async resumo(empresaId) {
        const empresa = BigInt(empresaId);
        const [resumo, financeiro, estoque, ultimasVendas, graficoVendas, produtosMaisVendidos] = await Promise.all([
            this.buscarResumo(empresa),
            this.buscarFinanceiro(empresa),
            this.buscarEstoque(empresa),
            this.buscarUltimasVendas(empresa),
            this.buscarGraficoVendas(empresa),
            this.buscarProdutosMaisVendidos(empresa)
        ]);
        return {
            resumo,
            financeiro,
            estoque,
            ultimasVendas,
            graficoVendas,
            produtosMaisVendidos
        };
    }
    // =====================================================
    // RESUMO
    // =====================================================
    async buscarResumo(empresaId) {
        const [produtos, clientes, usuarios, vendas] = await Promise.all([
            prisma_js_1.prisma.produto.count({
                where: {
                    empresaId,
                    ativo: true
                }
            }),
            prisma_js_1.prisma.cliente.count({
                where: {
                    empresaId
                }
            }),
            prisma_js_1.prisma.usuario.count({
                where: {
                    empresaId,
                    ativo: true
                }
            }),
            prisma_js_1.prisma.venda.count({
                where: {
                    empresaId,
                    status: 'confirmada'
                }
            })
        ]);
        return {
            produtos,
            clientes,
            usuarios,
            vendas
        };
    }
    // =====================================================
    // FINANCEIRO
    // =====================================================
    async buscarFinanceiro(empresaId) {
        const hoje = new Date();
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const inicioAmanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const inicioProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
        const [vendasHoje, vendasMes, faturamentoHoje, faturamentoMes] = await Promise.all([
            prisma_js_1.prisma.venda.count({
                where: {
                    empresaId,
                    status: 'confirmada',
                    criadoEm: {
                        gte: inicioHoje,
                        lt: inicioAmanha
                    }
                }
            }),
            prisma_js_1.prisma.venda.count({
                where: {
                    empresaId,
                    status: 'confirmada',
                    criadoEm: {
                        gte: inicioMes,
                        lt: inicioProximoMes
                    }
                }
            }),
            prisma_js_1.prisma.venda.aggregate({
                where: {
                    empresaId,
                    status: 'confirmada',
                    criadoEm: {
                        gte: inicioHoje,
                        lt: inicioAmanha
                    }
                },
                _sum: {
                    valorTotal: true
                }
            }),
            prisma_js_1.prisma.venda.aggregate({
                where: {
                    empresaId,
                    status: 'confirmada',
                    criadoEm: {
                        gte: inicioMes,
                        lt: inicioProximoMes
                    }
                },
                _sum: {
                    valorTotal: true
                }
            })
        ]);
        return {
            vendasHoje,
            vendasMes,
            faturamentoHoje: Number(faturamentoHoje._sum.valorTotal ?? 0),
            faturamentoMes: Number(faturamentoMes._sum.valorTotal ?? 0)
        };
    }
    // =====================================================
    // ESTOQUE
    // =====================================================
    async buscarEstoque(empresaId) {
        const produtos = await prisma_js_1.prisma.produto.findMany({
            where: {
                empresaId,
                ativo: true
            },
            select: {
                nome: true,
                quantidade: true,
                estoqueMinimo: true,
                precoCusto: true
            }
        });
        const valorEstoque = produtos.reduce((total, produto) => {
            return total + Number(produto.precoCusto) * produto.quantidade;
        }, 0);
        const estoqueBaixo = produtos.filter(produto => {
            return produto.quantidade <= produto.estoqueMinimo
                && produto.quantidade > 0;
        }).length;
        const semEstoque = produtos.filter(produto => {
            return produto.quantidade === 0;
        }).length;
        return {
            valorEstoque,
            estoqueBaixo,
            semEstoque,
            produtosBaixoEstoque: produtos.filter(produto => {
                return produto.quantidade <= produto.estoqueMinimo
                    && produto.quantidade > 0;
            })
        };
    }
    // =====================================================
    // ÚLTIMAS VENDAS
    // =====================================================
    async buscarUltimasVendas(empresaId) {
        const vendas = await prisma_js_1.prisma.venda.findMany({
            where: {
                empresaId
            },
            orderBy: {
                criadoEm: 'desc'
            },
            take: 10,
            select: {
                id: true,
                valorTotal: true,
                status: true,
                criadoEm: true,
                cliente: {
                    select: {
                        nome: true
                    }
                },
                usuario: {
                    select: {
                        nome: true
                    }
                }
            }
        });
        return vendas.map(venda => ({
            id: venda.id,
            cliente: venda.cliente?.nome ?? 'Consumidor final',
            usuario: venda.usuario?.nome ?? 'Não informado',
            valor: Number(venda.valorTotal),
            status: venda.status,
            criadoEm: venda.criadoEm
        }));
    }
    async buscarGraficoVendas(empresaId) {
        const hoje = new Date();
        const inicio = new Date();
        inicio.setDate(hoje.getDate() - 6);
        const vendas = await prisma_js_1.prisma.venda.findMany({
            where: {
                empresaId,
                criadoEm: {
                    gte: inicio
                }
            },
            select: {
                valorTotal: true,
                criadoEm: true
            },
            orderBy: {
                criadoEm: "asc"
            }
        });
        const dias = [];
        for (let i = 6; i >= 0; i--) {
            const data = new Date();
            data.setDate(hoje.getDate() - i);
            dias.push({
                dia: data.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit"
                }),
                vendas: 0,
                faturamento: 0
            });
        }
        vendas.forEach(venda => {
            const diaVenda = venda.criadoEm.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit"
            });
            const item = dias.find(d => d.dia === diaVenda);
            if (item) {
                item.vendas += 1;
                item.faturamento += Number(venda.valorTotal);
            }
        });
        return dias;
    }
    async buscarProdutosMaisVendidos(empresaId) {
        const itens = await prisma_js_1.prisma.vendaItem.findMany({
            where: {
                venda: {
                    empresaId,
                    status: "confirmada"
                }
            },
            select: {
                quantidade: true,
                produto: {
                    select: {
                        nome: true
                    }
                }
            }
        });
        const mapa = new Map();
        for (const item of itens) {
            const nome = item.produto.nome;
            if (!mapa.has(nome)) {
                mapa.set(nome, {
                    produto: nome,
                    quantidade: 0
                });
            }
            mapa.get(nome).quantidade += item.quantidade;
        }
        return Array
            .from(mapa.values())
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5);
    }
}
exports.DashboardService = DashboardService;
