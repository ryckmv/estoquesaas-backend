import { VendaService } from '../services/venda.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
const vendaService = new VendaService();
const auditoriaService = new AuditoriaService();
export class VendaController {
    async criar(request, reply) {
        const body = request.body;
        if (!body.itens || body.itens.length === 0) {
            return reply.status(400).send({
                error: 'A venda precisa ter produtos.'
            });
        }
        const venda = await vendaService.criar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            clienteId: body.clienteId,
            itens: body.itens
        });
        await auditoriaService.registrar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            acao: "VENDA_CRIADA",
            detalhes: `Venda ID ${venda.id} criada`,
            ip: request.ip
        });
        return reply.status(201).send({
            message: 'Venda realizada com sucesso!',
            venda: {
                id: venda.id.toString(),
                empresaId: venda.empresaId.toString(),
                clienteId: venda.clienteId
                    ? venda.clienteId.toString()
                    : null,
                valorTotal: venda.valorTotal,
                status: venda.status,
                criadoEm: venda.criadoEm
            }
        });
    }
    async buscarPorId(request, reply) {
        const { id } = request.params;
        const venda = await vendaService.buscarPorId(id, request.empresaId);
        if (!venda) {
            return reply.status(404).send({
                error: 'Venda não encontrada.'
            });
        }
        return reply.send({
            venda: {
                id: venda.id.toString(),
                empresaId: venda.empresaId.toString(),
                clienteId: venda.clienteId
                    ? venda.clienteId.toString()
                    : null,
                cliente: venda.cliente
                    ? {
                        id: venda.cliente.id.toString(),
                        nome: venda.cliente.nome
                    }
                    : null,
                valorTotal: venda.valorTotal,
                status: venda.status,
                criadoEm: venda.criadoEm,
                itens: venda.itens.map(item => ({
                    id: item.id.toString(),
                    produtoId: item.produtoId.toString(),
                    produto: item.produto.nome,
                    quantidade: item.quantidade,
                    precoVendaUnitario: item.precoVendaUnitario,
                    precoCustoUnitario: item.precoCustoUnitario
                }))
            }
        });
    }
    async cancelar(request, reply) {
        const { id } = request.params;
        const venda = await vendaService.cancelar(id, request.empresaId);
        await auditoriaService.registrar({
            empresaId: request.empresaId,
            usuarioId: request.usuarioId,
            acao: "VENDA_CANCELADA",
            detalhes: `Venda ID ${id} cancelada`,
            ip: request.ip
        });
        return reply.send({
            message: 'Venda cancelada com sucesso!',
            venda: {
                id: venda.id.toString(),
                status: venda.status,
                criadoEm: venda.criadoEm
            }
        });
    }
    async listar(request, reply) {
        const vendas = await vendaService.listar(request.empresaId);
        return reply.send({
            vendas: vendas.map(venda => ({
                id: venda.id.toString(),
                empresaId: venda.empresaId.toString(),
                // mantém o antigo
                clienteId: venda.clienteId
                    ? venda.clienteId.toString()
                    : null,
                // adiciona o novo
                cliente: venda.cliente
                    ? {
                        id: venda.cliente.id.toString(),
                        nome: venda.cliente.nome
                    }
                    : null,
                valorTotal: venda.valorTotal,
                status: venda.status,
                criadoEm: venda.criadoEm,
                itens: venda.itens.map(item => ({
                    id: item.id.toString(),
                    produtoId: item.produtoId.toString(),
                    produto: item.produto.nome,
                    quantidade: item.quantidade,
                    precoVendaUnitario: item.precoVendaUnitario
                }))
            }))
        });
    }
}
