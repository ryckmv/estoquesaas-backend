import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";


export async function dashboard(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const empresas = await prisma.empresa.count();

  const usuarios = await prisma.usuario.count();

  const produtos = await prisma.produto.count();

  const vendas = await prisma.venda.count();


  return reply.send({
    empresas,
    usuarios,
    produtos,
    vendas,
  });

}