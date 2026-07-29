"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErroLogin = void 0;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../lib/prisma.js");
const jwt_js_1 = require("../utils/jwt.js");
const auditoria_service_js_1 = require("./auditoria.service.js");
const auditoriaService = new auditoria_service_js_1.AuditoriaService();
class ErroLogin extends Error {
}
exports.ErroLogin = ErroLogin;
async function login({ email, senha }) {
    const usuario = await prisma_js_1.prisma.usuario.findUnique({
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
    const senhaValida = await bcrypt_1.default.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
        throw new ErroLogin('Email ou senha inválidos.');
    }
    const token = (0, jwt_js_1.gerarToken)({
        usuarioId: usuario.id.toString(),
        empresaId: usuario.empresaId.toString(),
        role: usuario.role,
    });
    await auditoriaService.registrar({
        empresaId: usuario.empresaId,
        usuarioId: usuario.id,
        acao: "LOGIN_REALIZADO",
        detalhes: `Usuário ${usuario.nome} realizou login`
    });
    return {
        token,
        usuario: {
            id: usuario.id.toString(),
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        },
        empresa: {
            id: usuario.empresa.id.toString(),
            nome: usuario.empresa.nome,
        },
    };
}
