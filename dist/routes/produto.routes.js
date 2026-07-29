"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = produtoRoutes;
const produto_controller_js_1 = require("../controllers/produto.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const produtoController = new produto_controller_js_1.ProdutoController();
async function produtoRoutes(app) {
    app.post('/produtos', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, produtoController.create.bind(produtoController));
    app.get('/produtos', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, produtoController.list.bind(produtoController));
    app.get('/produtos/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, produtoController.findById.bind(produtoController));
    app.put('/produtos/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, produtoController.update.bind(produtoController));
    app.delete('/produtos/:id', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin'
            ])
        ]
    }, produtoController.delete.bind(produtoController));
}
