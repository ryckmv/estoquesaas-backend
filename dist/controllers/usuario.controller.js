import { UsuarioService } from '../services/usuario.service.js';
function serializarBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (_, value) => typeof value === 'bigint'
        ? value.toString()
        : value));
}
const usuarioService = new UsuarioService();
export class UsuarioController {
    async criar(request, reply) {
        const body = request.body;
        const usuario = await usuarioService.criar({
            empresaId: request.empresaId,
            nome: body.nome,
            email: body.email,
            senha: body.senha,
            role: body.role
        });
        return reply.send({
            usuario: serializarBigInt(usuario)
        });
    }
    async listar(request, reply) {
        const usuarios = await usuarioService.listar(request.empresaId);
        return reply.send({
            usuarios: serializarBigInt(usuarios)
        });
    }
    async buscarPorId(request, reply) {
        const params = request.params;
        const usuario = await usuarioService.buscarPorId(params.id, request.empresaId);
        return reply.send({
            usuario: serializarBigInt(usuario)
        });
    }
    async atualizar(request, reply) {
        const params = request.params;
        const body = request.body;
        const resultado = await usuarioService.atualizar(params.id, request.empresaId, body);
        return reply.send(resultado);
    }
    async remover(request, reply) {
        const params = request.params;
        const resultado = await usuarioService.remover(params.id, request.empresaId);
        return reply.send(resultado);
    }
}
