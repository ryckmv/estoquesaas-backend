import { AuditoriaController } from "../controllers/auditoria.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const controller = new AuditoriaController();
export async function auditoriaRoutes(app) {
    app.get("/auditoria", {
        preHandler: authMiddleware
    }, controller.listar);
}
