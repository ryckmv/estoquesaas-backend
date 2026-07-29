"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vendaRoutes;
const venda_controller_js_1 = require("../controllers/venda.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const vendaController = new venda_controller_js_1.VendaController();
async function vendaRoutes(app) {
    // Criar venda
    // admin, gerente e funcionario
    app.post('/vendas', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, vendaController.criar.bind(vendaController));
    // Listar vendas
    // admin, gerente e funcionario
    app.get('/vendas', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, vendaController.listar.bind(vendaController));
    // Buscar venda
    // admin, gerente e funcionario
    app.get('/vendas/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, vendaController.buscarPorId.bind(vendaController));
    // Cancelar venda
    // somente admin e gerente
    app.delete('/vendas/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, vendaController.cancelar.bind(vendaController));
}
