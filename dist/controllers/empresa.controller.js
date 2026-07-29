"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrar = cadastrar;
exports.listar = listar;
const empresa_service_js_1 = require("../services/empresa.service.js");
async function cadastrar(request, reply) {
    const body = request.body;
    const resultado = await (0, empresa_service_js_1.cadastrarEmpresaComAdmin)(body);
    return reply
        .status(201)
        .send(resultado);
}
async function listar(request, reply) {
    const empresas = await (0, empresa_service_js_1.listarEmpresas)();
    return reply
        .status(200)
        .send(empresas);
}
