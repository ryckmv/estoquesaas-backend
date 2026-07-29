export function verificarRole(rolesPermitidas) {
    return async function (request, reply) {
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
