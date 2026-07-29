import { FastifyInstance } from 'fastify';
import { VendaController } from '../controllers/venda.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';

const vendaController = new VendaController();

export default async function vendaRoutes(
  app: FastifyInstance
) {


  // Criar venda
  // admin, gerente e funcionario
  app.post(
    '/vendas',
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
    vendaController.criar.bind(vendaController)
  );


  // Listar vendas
  // admin, gerente e funcionario
  app.get(
    '/vendas',
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
    vendaController.listar.bind(vendaController)
  );


  // Buscar venda
  // admin, gerente e funcionario
  app.get(
    '/vendas/:id',
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
    vendaController.buscarPorId.bind(vendaController)
  );
  


  // Cancelar venda
  // somente admin e gerente
  app.delete(
    '/vendas/:id',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'admin',
          'gerente'
        ])
      ]
    },
    vendaController.cancelar.bind(vendaController)
  );

}