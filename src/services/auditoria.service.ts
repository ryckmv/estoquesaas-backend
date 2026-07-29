import { prisma } from "../lib/prisma.js";

interface RegistrarAuditoriaDTO {
  empresaId: bigint | string;
  usuarioId?: bigint | string;
  acao: string;
  detalhes?: string;
  ip?: string;
}


export class AuditoriaService {


  async registrar({
    empresaId,
    usuarioId,
    acao,
    detalhes,
    ip
  }: RegistrarAuditoriaDTO) {


    return prisma.logAuditoria.create({

      data: {

        empresaId: BigInt(empresaId),

        usuarioId: usuarioId
          ? BigInt(usuarioId)
          : null,

        acao,

        detalhes,

        ip

      }

    });

  }



  async listar(
    empresaId: bigint | string
  ) {


    return prisma.logAuditoria.findMany({

      where: {

        empresaId: BigInt(empresaId)

      },

      include: {

        usuario: {

          select: {

            nome: true

          }

        }

      },

      orderBy: {

        criadoEm: "desc"

      }

    });


  }


}