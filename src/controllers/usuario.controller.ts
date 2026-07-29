import { FastifyReply, FastifyRequest } from 'fastify';
import { UsuarioService } from '../services/usuario.service.js';

function serializarBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    )
  );
}

const usuarioService = new UsuarioService();

export class UsuarioController {


  async criar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const body = request.body as {
      nome: string;
      email: string;
      senha: string;
      role?: 'admin' | 'gerente' | 'funcionario';
    };


    const usuario = await usuarioService.criar({
      empresaId: request.empresaId!,
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      role: body.role
    });


   return reply.send({
  usuario: serializarBigInt(usuario)
   });
  }



  async listar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const usuarios = await usuarioService.listar(
      request.empresaId!
    );


   return reply.send({
  usuarios: serializarBigInt(usuarios)

    });

  }



  async buscarPorId(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const params = request.params as {
      id: string;
    };


    const usuario = await usuarioService.buscarPorId(
      params.id,
      request.empresaId!
    );


  return reply.send({
  usuario: serializarBigInt(usuario)

    });

  }



  async atualizar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const params = request.params as {
      id: string;
    };


    const body = request.body as {
      nome?: string;
      senha?: string;
      role?: 'admin' | 'gerente' | 'funcionario';
      ativo?: boolean;
    };


    const resultado = await usuarioService.atualizar(
      params.id,
      request.empresaId!,
      body
    );


    return reply.send(resultado);

  }



  async remover(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const params = request.params as {
      id: string;
    };


    const resultado = await usuarioService.remover(
      params.id,
      request.empresaId!
    );


    return reply.send(resultado);

  }

}