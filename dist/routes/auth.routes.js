import * as authController from '../controllers/auth.controller.js';
export default async function authRoutes(app) {
    app.post('/login', authController.entrar);
}
