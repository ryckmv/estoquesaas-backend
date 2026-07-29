import { FastifyRequest, FastifyReply } from 'fastify';
import { ClienteService } from '../services/cliente.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';

const clienteService = new ClienteService();
const auditoriaService = new AuditoriaService();
interface CreateClienteBody {
  nome: string;
  telefone?: string;
  cpf?: string;
}

interface UpdateClienteBody {
  nome?: string;
  telefone?: string;
  cpf?: string;
}

export class ClienteController {

  async create(request: FastifyRequest, reply: FastifyReply) {

    const body = request.body as CreateClienteBody;

    if (!body.nome) {
      return reply.status(400).send({
        error: 'O campo nome é obrigatório.'
      });
    }

    const cliente = await clienteService.create({
      ...body,
      empresaId: request.empresaId!
    });

    return reply.status(201).send({
      message: 'Cliente cadastrado com sucesso!',
      cliente: {
        ...cliente,
        id: cliente.id.toString(),
        empresaId: cliente.empresaId.toString()
      }
    });
  }


  async list(request: FastifyRequest, reply: FastifyReply) {

    const clientes = await clienteService.listByEmpresa(
      request.empresaId!
    );

    return reply.send({
      clientes: clientes.map(cliente => ({
        ...cliente,
        id: cliente.id.toString(),
        empresaId: cliente.empresaId.toString()
      }))
    });
  }


  async findById(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as {
      id: string
    };


    const cliente = await clienteService.findById(
      id,
      request.empresaId!
    );
    await auditoriaService.registrar({

  empresaId: request.empresaId!,

  usuarioId: request.usuarioId,

  acao: "CLIENTE_CRIADO",

  detalhes: `Cliente ${cliente.nome} criado`,

  ip: request.ip

});


    if (!cliente) {
      return reply.status(404).send({
        message: 'Cliente não encontrado.'
      });
    }


    return reply.send({
      cliente: {
        ...cliente,
        id: cliente.id.toString(),
        empresaId: cliente.empresaId.toString()
      }
    });
  }


  async update(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as {
      id: string
    };


    const body = request.body as UpdateClienteBody;


    const cliente = await clienteService.update(
      id,
      request.empresaId!,
      body
    );
    await auditoriaService.registrar({

  empresaId: request.empresaId!,

  usuarioId: request.usuarioId,

  acao: "CLIENTE_EDITADO",

  detalhes: `Cliente ${cliente.nome} atualizado`,

  ip: request.ip

});


    return reply.send({
      message: 'Cliente atualizado com sucesso!',
      cliente: {
        ...cliente,
        id: cliente.id.toString(),
        empresaId: cliente.empresaId.toString()
      }
    });
  }


  async delete(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as {
      id: string
    };


    await clienteService.delete(
      id,
      request.empresaId!
    );
    await auditoriaService.registrar({

  empresaId: request.empresaId!,

  usuarioId: request.usuarioId,

  acao: "CLIENTE_EXCLUIDO",

  detalhes: `Cliente ID ${id} removido`,

  ip: request.ip

});


    return reply.send({
      message: 'Cliente removido com sucesso!'
    });
  }
}