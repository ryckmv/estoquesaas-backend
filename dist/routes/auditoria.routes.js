"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditoriaRoutes = auditoriaRoutes;
const auditoria_controller_js_1 = require("../controllers/auditoria.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const controller = new auditoria_controller_js_1.AuditoriaController();
async function auditoriaRoutes(app) {
    app.get("/auditoria", {
        preHandler: auth_middleware_js_1.authMiddleware
    }, controller.listar);
}
