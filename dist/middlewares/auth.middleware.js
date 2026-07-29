"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_js_1 = require("../utils/jwt.js");
async function authMiddleware(request, reply) {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({
            erro: 'Token não informado.'
        });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = (0, jwt_js_1.verificarToken)(token);
        request.usuarioId = BigInt(payload.usuarioId);
        request.empresaId = BigInt(payload.empresaId);
        request.role = payload.role;
    }
    catch {
        return reply.status(401).send({
            erro: 'Token inválido ou expirado.'
        });
    }
}
