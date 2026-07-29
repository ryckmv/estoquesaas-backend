import Fastify from 'fastify';
import cors from "@fastify/cors";
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import empresaRoutes from './routes/empresa.routes.js';
import produtoRoutes from './routes/produto.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import movimentacaoRoutes from './routes/movimentacao.routes.js';
import vendaRoutes from './routes/venda.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import { errorHandler } from './errors/error-handler.js';
import relatorioRoutes from './routes/relatorio.routes.js';
import { auditoriaRoutes } from './routes/auditoria.routes.js';
import { configuracaoRoutes } from "./routes/configuracao.routes.js";
dotenv.config();
const app = Fastify({
    logger: true
});
errorHandler(app);
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
        const result = await prisma.$queryRaw `SELECT NOW()`;
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
app.register(usuarioRoutes);
app.register(empresaRoutes);
app.register(produtoRoutes);
app.register(clienteRoutes);
app.register(authRoutes);
app.register(userRoutes);
app.register(movimentacaoRoutes);
app.register(vendaRoutes);
app.register(dashboardRoutes);
app.register(relatorioRoutes);
app.register(auditoriaRoutes);
app.register(configuracaoRoutes);
// Inicialização do servidor
const start = async () => {
    try {
        await app.register(cors, {
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
