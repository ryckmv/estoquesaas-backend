import { RelatorioController } from "../controllers/relatorio.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verificarRole } from "../middlewares/role.middleware.js";
const controller = new RelatorioController();
export default async function relatorioRoutes(app) {
    app.get("/relatorios/pdf", {
        preHandler: [
            authMiddleware,
            verificarRole([
                "admin",
                "gerente"
            ])
        ]
    }, controller.gerarPDF.bind(controller));
    app.get("/relatorios/excel", {
        preHandler: [
            authMiddleware,
            verificarRole([
                "admin",
                "gerente"
            ])
        ]
    }, controller.gerarExcel.bind(controller));
}
