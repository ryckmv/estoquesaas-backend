import { login, ErroLogin } from '../services/auth.service.js';
export async function entrar(request, reply) {
    try {
        const body = request.body;
        const resultado = await login(body);
        return reply.status(200).send(resultado);
    }
    catch (erro) {
        if (erro instanceof ErroLogin) {
            return reply.status(401).send({
                erro: erro.message
            });
        }
        console.error(erro);
        return reply.status(500).send({
            erro: 'Erro interno ao fazer login.'
        });
    }
}
