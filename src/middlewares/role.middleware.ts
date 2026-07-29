import { FastifyReply, FastifyRequest } from 'fastify';

export function verificarRole(
  rolesPermitidas: string[]
) {

  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const role = request.role;
    console.log("ROLE RECEBIDA NO ROLE MIDDLEWARE:", role);
    console.log("ROLES PERMITIDAS:", rolesPermitidas);


    if (!role) {
      return reply.status(403).send({
        mensagem: 'Usuário sem permissão'
      });
    }


    if (!rolesPermitidas.includes(role)) {
      return reply.status(403).send({
        mensagem: 'Acesso negado para este perfil'
      });
    }

  };

}