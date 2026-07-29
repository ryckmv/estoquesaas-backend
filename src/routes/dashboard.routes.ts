import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';

const dashboardController = new DashboardController();

export default async function dashboardRoutes(
  app: FastifyInstance
) {

  app.get(
    '/dashboard',
    {
      preHandler: [
        authMiddleware,
        verificarRole([
          'master',
          'admin',
          'gerente'
        ])
      ]
    },
    dashboardController.resumo.bind(dashboardController)
  );

}