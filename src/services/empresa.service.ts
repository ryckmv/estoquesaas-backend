// services/empresa.service.ts

import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { gerarToken } from '../utils/jwt.js';
import { AppError } from '../errors/AppError.js';


interface DadosCadastroEmpresa {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  cnpj?: string;
}


const SALT_ROUNDS = 10;


export async function cadastrarEmpresaComAdmin(
  dados: DadosCadastroEmpresa
) {

  const {
    empresa,
    nome,
    email,
    senha,
    cnpj
  } = dados;


  if (
    !empresa?.trim() ||
    !nome?.trim() ||
    !email?.trim() ||
    !senha
  ) {

    throw new AppError(
      'Preencha empresa, nome, email e senha.',
      400
    );

  }


  if (senha.length < 6) {

    throw new AppError(
      'A senha precisa ter pelo menos 6 caracteres.',
      400
    );

  }


  const senhaHash = await bcrypt.hash(
    senha,
    SALT_ROUNDS
  );


  let empresaCriada;


  try {

    empresaCriada = await prisma.empresa.create({

      data: {

        nome: empresa,

        cnpj: cnpj || null,

        usuarios: {

          create: {

            nome,

            email,

            senhaHash,

            role: 'admin',

          },

        },

      },

      include: {
        usuarios: true
      },

    });


  } catch (erro: any) {


    if (erro.code === 'P2002') {

      throw new AppError(
        'Já existe uma empresa cadastrada com esse CNPJ.',
        400
      );

    }


    throw erro;

  }



  const usuarioAdmin = empresaCriada.usuarios[0];


  const token = gerarToken({

    usuarioId: usuarioAdmin.id.toString(),

    empresaId: empresaCriada.id.toString(),

    role: usuarioAdmin.role,

  });



  return {

    token,


    empresa: {

      id: empresaCriada.id.toString(),

      nome: empresaCriada.nome,

    },


    usuario: {

      id: usuarioAdmin.id.toString(),

      nome: usuarioAdmin.nome,

      email: usuarioAdmin.email,

      role: usuarioAdmin.role,

    },

  };

}



export async function listarEmpresas() {


  const empresas = await prisma.empresa.findMany();


  return JSON.parse(

    JSON.stringify(

      empresas,

      (_, valor) =>

        typeof valor === 'bigint'

          ? valor.toString()

          : valor

    )

  );

}