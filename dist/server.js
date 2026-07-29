"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_js_1 = require("./lib/prisma.js");
const empresa_routes_js_1 = __importDefault(require("./routes/empresa.routes.js"));
const produto_routes_js_1 = __importDefault(require("./routes/produto.routes.js"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const movimentacao_routes_js_1 = __importDefault(require("./routes/movimentacao.routes.js"));
const venda_routes_js_1 = __importDefault(require("./routes/venda.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const usuario_routes_js_1 = __importDefault(require("./routes/usuario.routes.js"));
const error_handler_js_1 = require("./errors/error-handler.js");
const relatorio_routes_js_1 = __importDefault(require("./routes/relatorio.routes.js"));
const auditoria_routes_js_1 = require("./routes/auditoria.routes.js");
const configuracao_routes_js_1 = require("./routes/configuracao.routes.js");
dotenv_1.default.config();
const app = (0, fastify_1.default)({
    logger: true
});
(0, error_handler_js_1.errorHandler)(app);
// Rota inicial
app.get('/', async () => {
    return {
        name: 'EstoqueSaas API',
        status: 'online'
    };
});
// Teste de conexão com banco
app.get('/health', async (request, reply) => {
    try {
        const result = await prisma_js_1.prisma.$queryRaw `SELECT NOW()`;
        return {
            status: 'online',
            database_time: result[0].now
        };
    }
    catch (error) {
        console.error('ERRO DETALHADO DO BANCO:', error);
        reply.status(500);
        return {
            status: 'error',
            message: error.message
        };
    }
});
// Registro das rotas
app.register(usuario_routes_js_1.default);
app.register(empresa_routes_js_1.default);
app.register(produto_routes_js_1.default);
app.register(cliente_routes_1.default);
app.register(auth_routes_js_1.default);
app.register(user_routes_js_1.default);
app.register(movimentacao_routes_js_1.default);
app.register(venda_routes_js_1.default);
app.register(dashboard_routes_js_1.default);
app.register(relatorio_routes_js_1.default);
app.register(auditoria_routes_js_1.auditoriaRoutes);
app.register(configuracao_routes_js_1.configuracaoRoutes);
// Inicialização do servidor
const start = async () => {
    try {
        await app.register(cors_1.default, {
            origin: process.env.FRONTEND_URL || "http://localhost:3000"
        });
        const port = Number(process.env.PORT) || 3334;
        await app.listen({
            port,
            host: '0.0.0.0'
        });
        console.log(`🚀 Servidor rodando na porta ${port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
