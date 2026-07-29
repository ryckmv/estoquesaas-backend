import { prisma } from "../lib/prisma.js";

interface AtualizarEmpresaDTO {
  empresaId: bigint | string;
  nome: string;
  cnpj?: string | null;
  telefone?: string | null;
  email?: string | null;
}

export class ConfiguracaoService {

  async buscarEmpresa(empresaId: bigint | string) {

    return prisma.empresa.findUnique({
      where: {
        id: BigInt(empresaId)
      }
    });

  }

  async atualizarEmpresa({
    empresaId,
    nome,
    cnpj,
    telefone,
    email
  }: AtualizarEmpresaDTO) {

    return prisma.empresa.update({
      where: {
        id: BigInt(empresaId)
      },
      data: {
        nome,
        cnpj,
        telefone,
        email
      }
    });

  }

}