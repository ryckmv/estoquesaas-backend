import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
export class ProdutoService {
    async create(data) {
        if (!data.nome || !data.nome.trim()) {
            throw new AppError('Nome do produto é obrigatório.', 400);
        }
        if (data.precoCusto !== undefined &&
            data.precoCusto < 0) {
            throw new AppError('Preço de custo não pode ser negativo.', 400);
        }
        if (data.precoVenda !== undefined &&
            data.precoVenda < 0) {
            throw new AppError('Preço de venda não pode ser negativo.', 400);
        }
        if (data.quantidade !== undefined &&
            data.quantidade < 0) {
            throw new AppError('Quantidade não pode ser negativa.', 400);
        }
        if (data.estoqueMinimo !== undefined &&
            data.estoqueMinimo < 0) {
            throw new AppError('Estoque mínimo não pode ser negativo.', 400);
        }
        const empresaExists = await prisma.empresa.findUnique({
            where: { id: BigInt(data.empresaId) }
        });
        if (!empresaExists) {
            throw new AppError('Empresa não encontrada.', 404);
        }
        const produto = await prisma.produto.create({
            data: {
                empresaId: BigInt(data.empresaId),
                nome: data.nome,
                codigoBarras: data.codigoBarras,
                precoCusto: data.precoCusto ?? 0,
                precoVenda: data.precoVenda ?? 0,
                quantidade: data.quantidade ?? 0,
                estoqueMinimo: data.estoqueMinimo ?? 0,
            }
        });
        return produto;
    }
    async listByEmpresa(empresaId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {
            empresaId: BigInt(empresaId),
            ativo: true
        };
        const [produtos, total] = await Promise.all([
            prisma.produto.findMany({
                where,
                orderBy: {
                    nome: "asc"
                },
                skip,
                take: limit
            }),
            prisma.produto.count({
                where
            })
        ]);
        return {
            produtos,
            total,
            pagina: page,
            limite: limit,
            totalPaginas: Math.ceil(total / limit)
        };
    }
    async findById(id, empresaId) {
        const produto = await prisma.produto.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId),
                ativo: true
            }
        });
        if (!produto) {
            throw new AppError('Produto não encontrado.', 404);
        }
        return produto;
    }
    async update(id, empresaId, data) {
        await this.findById(id, empresaId);
        if (data.nome !== undefined && !data.nome.trim()) {
            throw new AppError('Nome do produto é obrigatório.', 400);
        }
        if (data.precoCusto !== undefined &&
            data.precoCusto < 0) {
            throw new AppError('Preço de custo não pode ser negativo.', 400);
        }
        if (data.precoVenda !== undefined &&
            data.precoVenda < 0) {
            throw new AppError('Preço de venda não pode ser negativo.', 400);
        }
        if (data.quantidade !== undefined &&
            data.quantidade < 0) {
            throw new AppError('Quantidade não pode ser negativa.', 400);
        }
        if (data.estoqueMinimo !== undefined &&
            data.estoqueMinimo < 0) {
            throw new AppError('Estoque mínimo não pode ser negativo.', 400);
        }
        return prisma.produto.update({
            where: {
                id: BigInt(id)
            },
            data: {
                nome: data.nome,
                codigoBarras: data.codigoBarras,
                precoCusto: data.precoCusto,
                precoVenda: data.precoVenda,
                quantidade: data.quantidade,
                estoqueMinimo: data.estoqueMinimo
            }
        });
    }
    async delete(id, empresaId) {
        await this.findById(id, empresaId);
        return prisma.produto.update({
            where: {
                id: BigInt(id)
            },
            data: {
                ativo: false
            }
        });
    }
}
