"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usuarioRoutes;
const usuario_controller_js_1 = require("../controllers/usuario.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const usuarioController = new usuario_controller_js_1.UsuarioController();
async function usuarioRoutes(app) {
    // Criar usuário
    // Apenas ADMIN
    app.post('/usuarios', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)(['admin'])
        ]
    }, usuarioController.criar.bind(usuarioController));
    // Listar usuários
    // ADMIN e GERENTE
    app.get('/usuarios', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)(['admin', 'gerente'])
        ]
    }, usuarioController.listar.bind(usuarioController));
    // Buscar usuário
    // ADMIN e GERENTE
    app.get('/usuarios/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)(['admin', 'gerente'])
        ]
    }, usuarioController.buscarPorId.bind(usuarioController));
    // Atualizar usuário
    // Apenas ADMIN
    app.put('/usuarios/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)(['admin'])
        ]
    }, usuarioController.atualizar.bind(usuarioController));
    // Desativar usuário
    // Apenas ADMIN
    app.delete('/usuarios/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)(['admin'])
        ]
    }, usuarioController.remover.bind(usuarioController));
}
