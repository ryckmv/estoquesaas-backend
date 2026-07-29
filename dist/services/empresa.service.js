"use strict";
// services/empresa.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarEmpresaComAdmin = cadastrarEmpresaComAdmin;
exports.listarEmpresas = listarEmpresas;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../lib/prisma.js");
const jwt_js_1 = require("../utils/jwt.js");
const AppError_js_1 = require("../errors/AppError.js");
const SALT_ROUNDS = 10;
async function cadastrarEmpresaComAdmin(dados) {
    const { empresa, nome, email, senha, cnpj } = dados;
    if (!empresa?.trim() ||
        !nome?.trim() ||
        !email?.trim() ||
        !senha) {
        throw new AppError_js_1.AppError('Preencha empresa, nome, email e senha.', 400);
    }
    if (senha.length < 6) {
        throw new AppError_js_1.AppError('A senha precisa ter pelo menos 6 caracteres.', 400);
    }
    const senhaHash = await bcrypt_1.default.hash(senha, SALT_ROUNDS);
    let empresaCriada;
    try {
        empresaCriada = await prisma_js_1.prisma.empresa.create({
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
    }
    catch (erro) {
        if (erro.code === 'P2002') {
            throw new AppError_js_1.AppError('Já existe uma empresa cadastrada com esse CNPJ.', 400);
        }
        throw erro;
    }
    const usuarioAdmin = empresaCriada.usuarios[0];
    const token = (0, jwt_js_1.gerarToken)({
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
async function listarEmpresas() {
    const empresas = await prisma_js_1.prisma.empresa.findMany();
    return JSON.parse(JSON.stringify(empresas, (_, valor) => typeof valor === 'bigint'
        ? valor.toString()
        : valor));
}
