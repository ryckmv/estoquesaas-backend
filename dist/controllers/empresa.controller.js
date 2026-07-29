import { cadastrarEmpresaComAdmin, listarEmpresas } from '../services/empresa.service.js';
export async function cadastrar(request, reply) {
    const body = request.body;
    const resultado = await cadastrarEmpresaComAdmin(body);
    return reply
        .status(201)
        .send(resultado);
}
export async function listar(request, reply) {
    const empresas = await listarEmpresas();
    return reply
        .status(200)
        .send(empresas);
}
