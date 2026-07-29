import { FastifyInstance } from 'fastify';
import * as empresaController from '../controllers/empresa.controller.js';

export default async function empresaRoutes(app: FastifyInstance) {
  // Rota para cadastrar empresa (POST)
  app.post('/empresas', empresaController.cadastrar);

  // Rota para listar empresas (GET) -> Mudado para o controller correto de listagem
  app.get('/empresas', empresaController.listar);
}