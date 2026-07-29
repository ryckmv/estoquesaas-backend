import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';


interface MovimentacaoDTO {
  empresaId: string | bigint;
  produtoId: string | bigint;
  usuarioId?: string | bigint;
  quantidade: number;
  tipo: 'entrada' | 'saida';
  motivo: 'compra' | 'ajuste' | 'perda';
}


const tiposValidos = [
  'entrada',
  'saida'
];


const motivosValidos = [
  'compra',
  'ajuste',
  'perda'
];



export class MovimentacaoService {



  async criar(data: MovimentacaoDTO) {


    if (data.quantidade <= 0) {

      throw new AppError(
        'Quantidade deve ser maior que zero.',
        400
      );

    }


    if (!tiposValidos.includes(data.tipo)) {

      throw new AppError(
        'Tipo de movimentação inválido.',
        400
      );

    }


    if (!motivosValidos.includes(data.motivo)) {

      throw new AppError(
        'Motivo de movimentação inválido.',
        400
      );

    }



    return prisma.$transaction(async (tx) => {


      const produto =
        await tx.produto.findFirst({

          where: {

            id: BigInt(data.produtoId),

            empresaId: BigInt(data.empresaId),

            ativo: true

          }

        });



      if (!produto) {

        throw new AppError(
          'Produto não encontrado.',
          404
        );

      }





      if (
        data.tipo === 'saida' &&
        produto.quantidade < data.quantidade
      ) {

        throw new AppError(
          'Estoque insuficiente.',
          400
        );

      }





      const quantidadeAtualizada =
        await tx.produto.update({

          where: {

            id: produto.id

          },


          data: {

            quantidade:

              data.tipo === 'entrada'

                ? {
                    increment: data.quantidade
                  }

                : {
                    decrement: data.quantidade
                  }

          }

        });







      await tx.movimentacaoEstoque.create({

        data: {

          empresaId:
            BigInt(data.empresaId),


          produtoId:
            produto.id,


          usuarioId:
            data.usuarioId
              ? BigInt(data.usuarioId)
              : undefined,


          tipo:
            data.tipo,


          motivo:
            data.motivo,


          quantidade:
            data.quantidade

        }

      });





      return quantidadeAtualizada;

    });

  }





async listar(
  empresaId: string | bigint
) {

  return prisma.movimentacaoEstoque.findMany({

    where: {
      empresaId: BigInt(empresaId)
    },

    orderBy: {
      criadoEm: 'desc'
    },

    include: {

      produto: true,

      usuario: {
        select: {
          nome: true
        }
      }

    }

  });

}


}