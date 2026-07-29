import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoService } from '../services/produto.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
const produtoService = new ProdutoService();

function formatarProduto(produto: any) {
  return {
    ...produto,
    id: produto.id.toString(),
    empresaId: produto.empresaId.toString(),
    precoCusto: produto.precoCusto.toString(),
    precoVenda: produto.precoVenda.toString(),
  };
}

export class ProdutoController {

  async create(request: FastifyRequest, reply: FastifyReply) {

    const {
      nome,
      codigoBarras,
      precoCusto,
      precoVenda,
      quantidade,
      estoqueMinimo
    } = request.body as any;

    const produto = await produtoService.create({
      empresaId: request.empresaId!,
      nome,
      codigoBarras,
      precoCusto,
      precoVenda,
      quantidade,
      estoqueMinimo
    });
    const auditoriaService = new AuditoriaService();

await auditoriaService.registrar({

  empresaId: request.empresaId!,

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

  async list(request: FastifyRequest, reply: FastifyReply) {

  const {
    page = "1",
    limit = "20"
  } = request.query as {
    page?: string;
    limit?: string;
  };

  const resultado = await produtoService.listByEmpresa(
    request.empresaId!,
    Number(page),
    Number(limit)
  );

  return reply.send({

    produtos: resultado.produtos.map(formatarProduto),

    total: resultado.total,

    pagina: resultado.pagina,

    limite: resultado.limite,

    totalPaginas: resultado.totalPaginas

  });

}
  async findById(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };

    const produto = await produtoService.findById(
      id,
      request.empresaId!
    );

    return reply.send({
      produto: formatarProduto(produto)
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };

    const produto = await produtoService.update(
      id,
      request.empresaId!,
      request.body as any
    );
    const auditoriaService = new AuditoriaService();
    await auditoriaService.registrar({

  empresaId: request.empresaId!,

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

  async delete(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };

    await produtoService.delete(
      id,
      request.empresaId!
    );
    const auditoriaService = new AuditoriaService();
    await auditoriaService.registrar({

  empresaId: request.empresaId!,

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