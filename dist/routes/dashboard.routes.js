"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dashboardRoutes;
const dashboard_controller_js_1 = require("../controllers/dashboard.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const dashboardController = new dashboard_controller_js_1.DashboardController();
async function dashboardRoutes(app) {
    app.get('/dashboard', {
        preHandler: [
            auth_middleware_js_1.authMiddleware,
            (0, role_middleware_js_1.verificarRole)([
                'admin',
                'gerente'
            ])
        ]
    }, dashboardController.resumo.bind(dashboardController));
}
