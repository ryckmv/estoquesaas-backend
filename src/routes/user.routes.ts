import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export default async function userRoutes(app: FastifyInstance) {

  app.get(
    '/me',
    {
      preHandler: authMiddleware
    },
    async (request, reply) => {

      return reply.send({
        usuarioId: request.usuarioId?.toString(),
        empresaId: request.empresaId?.toString(),
        role: request.role
      });

    }
  );

}