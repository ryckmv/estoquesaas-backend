import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';

interface CreateClienteDTO {
  empresaId: string | bigint;
  nome: string;
  telefone?: string;
  cpf?: string;
}

interface UpdateClienteDTO {
  nome?: string;
  telefone?: string;
  cpf?: string;
}

export class ClienteService {
  

  async create(data: CreateClienteDTO) {

    if (!data.nome || !data.nome.trim()) {
  throw new AppError(
    'Nome do cliente é obrigatório.',
    400
  );
}
if (
  data.cpf &&
  !/^\d{11}$/.test(data.cpf)
) {
  throw new AppError(
    'CPF deve conter 11 números.',
    400
  );
}

    const cliente = await prisma.cliente.create({
      data: {
        empresaId: BigInt(data.empresaId),
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf
      }
    });

    return cliente;
  }


  async listByEmpresa(empresaId: string | bigint) {

    return prisma.cliente.findMany({
      where: {
        empresaId: BigInt(empresaId)
      },
      orderBy: {
        nome: 'asc'
      }
    });
  }


  async findById(
    id: string | bigint,
    empresaId: string | bigint
  ) {

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: BigInt(id),
        empresaId: BigInt(empresaId)
      }
    });


    if (!cliente) {
      throw new AppError(
        'Cliente não encontrado.',
        404
      );
    }


    return cliente;
  }


  async update(
    id: string | bigint,
    empresaId: string | bigint,
    data: UpdateClienteDTO
  ) {

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: BigInt(id),
        empresaId: BigInt(empresaId)
      }
    });


    if (!cliente) {
      throw new AppError(
        'Cliente não encontrado.',
        404
      );
    }


    return prisma.cliente.update({
      where: {
        id: BigInt(id)
      },
      data: {
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf
      }
    });
  }


  async delete(
    id: string | bigint,
    empresaId: string | bigint
  ) {

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: BigInt(id),
        empresaId: BigInt(empresaId)
      }
    });


    if (!cliente) {
      throw new AppError(
        'Cliente não encontrado.',
        404
      );
    }


    return prisma.cliente.delete({
      where: {
        id: BigInt(id)
      }
    });
  }
}