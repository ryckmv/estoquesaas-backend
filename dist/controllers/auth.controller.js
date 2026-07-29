"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrar = entrar;
const auth_service_js_1 = require("../services/auth.service.js");
async function entrar(request, reply) {
    try {
        const body = request.body;
        const resultado = await (0, auth_service_js_1.login)(body);
        return reply.status(200).send(resultado);
    }
    catch (erro) {
        if (erro instanceof auth_service_js_1.ErroLogin) {
            return reply.status(401).send({
                erro: erro.message
            });
        }
        console.error(erro);
        return reply.status(500).send({
            erro: 'Erro interno ao fazer login.'
        });
    }
}
