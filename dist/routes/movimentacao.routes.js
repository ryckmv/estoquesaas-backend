"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = movimentacaoRoutes;
const movimentacao_controller_js_1 = require("../controllers/movimentacao.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const movimentacaoController = new movimentacao_controller_js_1.MovimentacaoController();
async function movimentacaoRoutes(app) {
    // Criar movimentação
    // admin e gerente
    app.post('/movimentacoes', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, movimentacaoController.criar.bind(movimentacaoController));
    // Listar movimentações
    // admin, gerente e funcionário
    app.get('/movimentacoes', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, movimentacaoController.listar.bind(movimentacaoController));
}
