import { FastifyRequest, FastifyReply } from 'fastify';
import {
  cadastrarEmpresaComAdmin,
  listarEmpresas
} from '../services/empresa.service.js';


interface CadastrarBody {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  cnpj?: string;
}


export async function cadastrar(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const body = request.body as CadastrarBody;

  const resultado =
    await cadastrarEmpresaComAdmin(body);


  return reply
    .status(201)
    .send(resultado);

}



export async function listar(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const empresas =
    await listarEmpresas();


  return reply
    .status(200)
    .send(empresas);

}