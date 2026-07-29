import { FastifyInstance } from 'fastify';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';

const usuarioController = new UsuarioController();

export default async function usuarioRoutes(
  app: FastifyInstance
) {


  // Criar usuário
  // Apenas ADMIN
  app.post(
    '/usuarios',
    {
      preHandler: [
        authMiddleware,
        verificarRole(['admin'])
      ]
    },
    usuarioController.criar.bind(usuarioController)
  );


  // Listar usuários
  // ADMIN e GERENTE
  app.get(
    '/usuarios',
    {
      preHandler: [
        authMiddleware,
        verificarRole(['admin', 'gerente'])
      ]
    },
    usuarioController.listar.bind(usuarioController)
  );


  // Buscar usuário
  // ADMIN e GERENTE
  app.get(
    '/usuarios/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole(['admin', 'gerente'])
      ]
    },
    usuarioController.buscarPorId.bind(usuarioController)
  );


  // Atualizar usuário
  // Apenas ADMIN
  app.put(
    '/usuarios/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole(['admin'])
      ]
    },
    usuarioController.atualizar.bind(usuarioController)
  );


  // Desativar usuário
  // Apenas ADMIN
  app.delete(
    '/usuarios/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole(['admin'])
      ]
    },
    usuarioController.remover.bind(usuarioController)
  );

}