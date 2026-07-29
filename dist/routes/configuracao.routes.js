"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracaoRoutes = configuracaoRoutes;
const configuracao_controller_js_1 = require("../controllers/configuracao.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const controller = new configuracao_controller_js_1.ConfiguracaoController();
async function configuracaoRoutes(app) {
    app.get("/configuracoes", {
        preHandler: auth_middleware_js_1.authMiddleware
    }, controller.buscar);
    app.put("/configuracoes", {
        preHandler: auth_middleware_js_1.authMiddleware
    }, controller.atualizar);
}
