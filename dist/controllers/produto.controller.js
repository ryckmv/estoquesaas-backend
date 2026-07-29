import { ProdutoService } from '../services/produto.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
const produtoService = new ProdutoService();
function formatarProduto(produto) {
    return {
        ...produto,
        id: produto.id.toString(),
        empresaId: produto.empresaId.toString(),
        precoCusto: produto.precoCusto.toString(),
        precoVenda: produto.precoVenda.toString(),
    };
}
export class ProdutoController {
    async create(request, reply) {
        const { nome, codigoBarras, precoCusto, precoVenda, quantidade, estoqueMinimo } = request.body;
        const produto = await produtoService.create({
            empresaId: request.empresaId,
            nome,
            codigoBarras,
            precoCusto,
            precoVenda,
            quantidade,
            estoqueMinimo
        });
        const auditoriaService = new AuditoriaService();
        await auditoriaService.registrar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            acao: "PRODUTO_CRIADO",
            detalhes: `Produto ${produto.nome} criado`,
            ip: request.ip
        });
        return reply.status(201).send({
            message: 'Produto cadastrado com sucesso!',
            produto: formatarProduto(produto)
        });
    }
    async list(request, reply) {
        const { page = "1", limit = "20" } = request.query;
        const resultado = await produtoService.listByEmpresa(request.empresaId, Number(page), Number(limit));
        return reply.send({
            produtos: resultado.produtos.map(formatarProduto),
            total: resultado.total,
            pagina: resultado.pagina,
            limite: resultado.limite,
            totalPaginas: resultado.totalPaginas
        });
    }
    async findById(request, reply) {
        const { id } = request.params;
        const produto = await produtoService.findById(id, request.empresaId);
        return reply.send({
            produto: formatarProduto(produto)
        });
    }
    async update(request, reply) {
        const { id } = request.params;
        const produto = await produtoService.update(id, request.empresaId, request.body);
        const auditoriaService = new AuditoriaService();
        await auditoriaService.registrar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            acao: "PRODUTO_EDITADO",
            detalhes: `Produto ${produto.nome} atualizado`,
            ip: request.ip
        });
        return reply.send({
            message: 'Produto atualizado com sucesso!',
            produto: formatarProduto(produto)
        });
    }
    async delete(request, reply) {
        const { id } = request.params;
        await produtoService.delete(id, request.empresaId);
        const auditoriaService = new AuditoriaService();
        await auditoriaService.registrar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            acao: "PRODUTO_EXCLUIDO",
            detalhes: `Produto ID ${id} removido`,
            ip: request.ip
        });
        return reply.send({
            message: 'Produto removido com sucesso!'
        });
    }
}
