import { FastifyInstance } from 'fastify';
import { ClienteController } from '../controllers/cliente.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';

const clienteController = new ClienteController();

export default async function clienteRoutes(
  app: FastifyInstance
) {


  // Criar cliente
  // admin e gerente
  app.post(
    '/clientes',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin',
          'gerente'
        ])
      ]
    },
    clienteController.create.bind(clienteController)
  );


  // Listar clientes
  // admin, gerente e funcionário
  app.get(
    '/clientes',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin',
          'gerente',
          'funcionario'
        ])
      ]
    },
    clienteController.list.bind(clienteController)
  );


  // Buscar cliente
  // admin, gerente e funcionário
  app.get(
    '/clientes/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin',
          'gerente',
          'funcionario'
        ])
      ]
    },
    clienteController.findById.bind(clienteController)
  );


  // Atualizar cliente
  // admin e gerente
  app.put(
    '/clientes/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin',
          'gerente'
        ])
      ]
    },
    clienteController.update.bind(clienteController)
  );


  // Excluir cliente
  // somente admin
  app.delete(
    '/clientes/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin'
        ])
      ]
    },
    clienteController.delete.bind(clienteController)
  );

}