import { FastifyRequest, FastifyReply } from 'fastify';
import { verificarToken } from '../utils/jwt.js';

interface TokenPayload {
  usuarioId: string;
  empresaId: string;
  role: string;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      erro: 'Token não informado.'
    });
  }
  

  try {
    const token = authHeader.replace('Bearer ', '');

    const payload = verificarToken(token) as TokenPayload;

    request.usuarioId = BigInt(payload.usuarioId);
    request.empresaId = BigInt(payload.empresaId);
    request.role = payload.role;
     

  } catch {
    return reply.status(401).send({
      erro: 'Token inválido ou expirado.'
    });
  }

}