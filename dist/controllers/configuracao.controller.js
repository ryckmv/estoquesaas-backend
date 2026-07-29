import { ConfiguracaoService } from "../services/configuracao.service.js";
const service = new ConfiguracaoService();
export class ConfiguracaoController {
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
