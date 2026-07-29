import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { gerarToken } from '../utils/jwt.js';
import { AuditoriaService } from './auditoria.service.js';
const auditoriaService = new AuditoriaService();
export class ErroLogin extends Error {
}
export async function login({ email, senha }) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            email,
        },
        include: {
            empresa: true,
        },
    });
    if (!usuario) {
        throw new ErroLogin('Email ou senha inválidos.');
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
        throw new ErroLogin('Email ou senha inválidos.');
    }
    const token = gerarToken({
        usuarioId: usuario.id.toString(),
        empresaId: usuario.empresaId
            ? usuario.empresaId.toString()
            : null,
        role: usuario.role,
    });
    if (usuario.empresaId) {
        await auditoriaService.registrar({
            empresaId: usuario.empresaId,
            usuarioId: usuario.id,
            acao: "LOGIN_REALIZADO",
            detalhes: `Usuário ${usuario.nome} realizou login`
        });
    }
    return {
        token,
        usuario: {
            id: usuario.id.toString(),
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        },
        empresa: usuario.empresa
            ? {
                id: usuario.empresa.id.toString(),
                nome: usuario.empresa.nome,
            }
            : null,
    };
}
