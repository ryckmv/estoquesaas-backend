import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller.js';

export default async function authRoutes(app: FastifyInstance) {

  app.post('/login', authController.entrar);

}