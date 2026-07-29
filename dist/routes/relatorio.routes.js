"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = relatorioRoutes;
const relatorio_controller_js_1 = require("../controllers/relatorio.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const controller = new relatorio_controller_js_1.RelatorioController();
async function relatorioRoutes(app) {
    app.get("/relatorios/pdf", {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                "admin",
                "gerente"
            ])
        ]
    }, controller.gerarPDF.bind(controller));
    app.get("/relatorios/excel", {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                "admin",
                "gerente"
            ])
        ]
    }, controller.gerarExcel.bind(controller));
}
