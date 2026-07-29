import { FastifyRequest, FastifyReply } from 'fastify';
import { login, ErroLogin } from '../services/auth.service.js';

interface LoginBody {
  email: string;
  senha: string;
}

export async function entrar(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = request.body as LoginBody;

    const resultado = await login(body);

    return reply.status(200).send(resultado);

  } catch (erro: any) {

    if (erro instanceof ErroLogin) {
      return reply.status(401).send({
        erro: erro.message
      });
    }

    console.error(erro);

    return reply.status(500).send({
      erro: 'Erro interno ao fazer login.'
    });
  }
}