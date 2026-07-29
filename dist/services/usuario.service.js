import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
const rolesValidas = [
    'admin',
    'gerente',
    'funcionario'
];
export class UsuarioService {
    async criar(data) {
        if (!data.nome || !data.nome.trim()) {
            throw new AppError('Nome do usuário é obrigatório.', 400);
        }
        if (!data.email || !data.email.includes('@')) {
            throw new AppError('E-mail inválido.', 400);
        }
        if (!data.senha || data.senha.length < 6) {
            throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400);
        }
        if (data.role &&
            !rolesValidas.includes(data.role)) {
            throw new AppError('Role inválida.', 400);
        }
        const empresaId = BigInt(data.empresaId);
        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: data.email
            }
        });
        if (usuarioExistente) {
            throw new AppError('E-mail já cadastrado.', 400);
        }
        const senhaHash = await bcrypt.hash(data.senha, 10);
        const usuario = await prisma.usuario.create({
            data: {
                empresaId,
                nome: data.nome,
                email: data.email,
                senhaHash,
                role: data.role ?? 'funcionario'
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
                criadoEm: true
            }
        });
        return usuario;
    }
    async listar(empresaId) {
        return prisma.usuario.findMany({
            where: {
                empresaId: BigInt(empresaId)
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
                criadoEm: true
            },
            orderBy: {
                criadoEm: 'desc'
            }
        });
    }
    async buscarPorId(id, empresaId) {
        const usuario = await prisma.usuario.findFirst({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
                criadoEm: true
            }
        });
        if (!usuario) {
            throw new AppError('Usuário não encontrado.', 404);
        }
        return usuario;
    }
    async atualizar(id, empresaId, data) {
        const dados = {};
        if (data.nome !== undefined) {
            if (!data.nome.trim()) {
                throw new AppError('Nome do usuário é obrigatório.', 400);
            }
            dados.nome = data.nome;
        }
        if (data.role) {
            if (!rolesValidas.includes(data.role)) {
                throw new AppError('Role inválida.', 400);
            }
            dados.role = data.role;
        }
        if (data.ativo !== undefined) {
            dados.ativo = data.ativo;
        }
        if (data.senha) {
            if (data.senha.length < 6) {
                throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400);
            }
            dados.senhaHash =
                await bcrypt.hash(data.senha, 10);
        }
        const usuario = await prisma.usuario.updateMany({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            },
            data: dados
        });
        if (usuario.count === 0) {
            throw new AppError('Usuário não encontrado.', 404);
        }
        return {
            mensagem: 'Usuário atualizado com sucesso'
        };
    }
    async remover(id, empresaId) {
        const usuario = await prisma.usuario.updateMany({
            where: {
                id: BigInt(id),
                empresaId: BigInt(empresaId)
            },
            data: {
                ativo: false
            }
        });
        if (usuario.count === 0) {
            throw new AppError('Usuário não encontrado.', 404);
        }
        return {
            mensagem: 'Usuário desativado com sucesso'
        };
    }
}
