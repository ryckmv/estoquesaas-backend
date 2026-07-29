import { FastifyInstance } from 'fastify';
import { ProdutoController } from '../controllers/produto.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';

const produtoController = new ProdutoController();

export default async function produtoRoutes(app: FastifyInstance) {

  app.post(
    '/produtos',
   {
  preHandler: [
    authMiddleware,
    verificarRole([
      'admin',
      'gerente'
    ])
  ]
},
    produtoController.create.bind(produtoController)
  );

  app.get(
    '/produtos',
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
    produtoController.list.bind(produtoController)
  );

  app.get(
    '/produtos/:id',
   {
  preHandler: [
    authMiddleware,
    verificarRole([
      'admin',
       'gerente'
    ])
  ]
},
    produtoController.findById.bind(produtoController)
  );

 
  app.put(
  '/produtos/:id',
  {
    preHandler: [
      authMiddleware,
      verificarRole([
        'admin',
        'gerente'
      ])
    ]
  },
  produtoController.update.bind(produtoController)
);

 
   app.delete(
  '/produtos/:id',
  {
    preHandler: [
      authMiddleware,
      verificarRole([
        'admin'
      ])
    ]
  },
  produtoController.delete.bind(produtoController)
);
}