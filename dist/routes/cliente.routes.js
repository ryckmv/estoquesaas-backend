"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clienteRoutes;
const cliente_controller_js_1 = require("../controllers/cliente.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const clienteController = new cliente_controller_js_1.ClienteController();
async function clienteRoutes(app) {
    // Criar cliente
    // admin e gerente
    app.post('/clientes', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, clienteController.create.bind(clienteController));
    // Listar clientes
    // admin, gerente e funcionário
    app.get('/clientes', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, clienteController.list.bind(clienteController));
    // Buscar cliente
    // admin, gerente e funcionário
    app.get('/clientes/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, clienteController.findById.bind(clienteController));
    // Atualizar cliente
    // admin e gerente
    app.put('/clientes/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, clienteController.update.bind(clienteController));
    // Excluir cliente
    // somente admin
    app.delete('/clientes/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin'
            ])
        ]
    }, clienteController.delete.bind(clienteController));
}
