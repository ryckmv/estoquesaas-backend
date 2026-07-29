import { FastifyRequest, FastifyReply } from 'fastify';
import { MovimentacaoService } from '../services/movimentacao.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';

const movimentacaoService = new MovimentacaoService();
const auditoriaService = new AuditoriaService();


interface MovimentacaoBody {
  produtoId: string;
  quantidade: number;
  tipo: 'entrada' | 'saida';
  motivo: 'compra' | 'ajuste' | 'perda';
}


export class MovimentacaoController {


  async criar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const body = request.body as MovimentacaoBody;


    if (
      !body.produtoId ||
      !body.quantidade ||
      !body.tipo ||
      !body.motivo
    ) {

      return reply.status(400).send({
        error: 'Produto, quantidade, tipo e motivo são obrigatórios.'
      });

    }

const produto = await movimentacaoService.criar({

  produtoId: body.produtoId,

  quantidade: body.quantidade,

  tipo: body.tipo,

  motivo: body.motivo,

  empresaId: request.empresaId!,

  usuarioId: request.usuarioId!

});
let acao = "ESTOQUE_AJUSTADO";

if (body.tipo === "entrada") {
  acao = "ESTOQUE_ENTRADA";
}

if (body.tipo === "saida") {
  acao = "ESTOQUE_SAIDA";
}


await auditoriaService.registrar({

  empresaId: request.empresaId!,

  usuarioId: request.usuarioId,

  acao,

  detalhes: `Produto ID ${body.produtoId} movimentado. Quantidade: ${body.quantidade}`,

  ip: request.ip

});



    return reply.status(201).send({

      message: 'Movimentação realizada com sucesso!',

      produto: {

        id: produto.id.toString(),

        empresaId: produto.empresaId.toString(),

        nome: produto.nome,

        codigoBarras: produto.codigoBarras,

        precoCusto: produto.precoCusto,

        precoVenda: produto.precoVenda,

        quantidade: produto.quantidade,

        estoqueMinimo: produto.estoqueMinimo,

        ativo: produto.ativo,

        criadoEm: produto.criadoEm

      }

    });

  }



  async listar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {


    const movimentacoes =
      await movimentacaoService.listar(
        request.empresaId!
      );
      



    return reply.send({

      movimentacoes: movimentacoes.map(item => ({

        id: item.id.toString(),

        empresaId: item.empresaId.toString(),

        produtoId: item.produtoId.toString(),

        usuarioId: item.usuarioId
          ? item.usuarioId.toString()
          : null,

        tipo: item.tipo,

        motivo: item.motivo,

        quantidade: item.quantidade,

        criadoEm: item.criadoEm,

        produto: {

          id: item.produto.id.toString(),

          nome: item.produto.nome

        }
        ,
  usuario: item.usuario
    ? {
        nome: item.usuario.nome
      }
    : null

      }))

    });

  }

}