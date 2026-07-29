"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
async function userRoutes(app) {
    app.get('/me', {
        preHandler: auth_middleware_js_1.authMiddleware
    }, async (request, reply) => {
        return reply.send({
            usuarioId: request.usuarioId?.toString(),
            empresaId: request.empresaId?.toString(),
            role: request.role
        });
    });
}
