import { DashboardService } from "../services/dashboard.service.js";
const dashboardService = new DashboardService();
export class DashboardController {
    async resumo(request, reply) {
        const { empresaId } = request;
        const dados = await dashboardService.resumo(empresaId);
        return reply.send(JSON.parse(JSON.stringify(dados, (_, value) => typeof value === "bigint"
            ? value.toString()
            : value)));
    }
}
