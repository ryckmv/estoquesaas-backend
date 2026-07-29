"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracaoController = void 0;
const configuracao_service_js_1 = require("../services/configuracao.service.js");
const service = new configuracao_service_js_1.ConfiguracaoService();
class ConfiguracaoController {
    async buscar(request, reply) {
        const empresaId = request.empresaId;
        const empresa = await service.buscarEmpresa(empresaId);
        if (!empresa) {
            return reply.status(404).send({
                mensagem: "Empresa não encontrada."
            });
        }
        return reply.send({
            ...empresa,
            id: empresa.id.toString()
        });
    }
    async atualizar(request, reply) {
        const { nome, cnpj, telefone, email } = request.body;
        const empresaId = request.empresaId;
        const empresa = await service.atualizarEmpresa({
            empresaId,
            nome,
            cnpj,
            telefone,
            email
        });
        return reply.send({
            mensagem: "Empresa atualizada com sucesso.",
            empresa: {
                ...empresa,
                id: empresa.id.toString()
            }
        });
    }
}
exports.ConfiguracaoController = ConfiguracaoController;
