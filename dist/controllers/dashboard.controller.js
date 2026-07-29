"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_js_1 = require("../services/dashboard.service.js");
const dashboardService = new dashboard_service_js_1.DashboardService();
class DashboardController {
    async resumo(request, reply) {
        const { empresaId } = request;
        const dados = await dashboardService.resumo(empresaId);
        return reply.send(JSON.parse(JSON.stringify(dados, (_, value) => typeof value === "bigint"
            ? value.toString()
            : value)));
    }
}
exports.DashboardController = DashboardController;
