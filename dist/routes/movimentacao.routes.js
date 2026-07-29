import { MovimentacaoController } from '../controllers/movimentacao.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verificarRole } from '../middlewares/role.middleware.js';
const movimentacaoController = new MovimentacaoController();
export default async function movimentacaoRoutes(app) {
    // Criar movimentação
    // admin e gerente
    app.post('/movimentacoes', {
        preHandler: [
            authMiddleware,
            verificarRole([
                'admin',
                'gerente'
            ])
        ]
    }, movimentacaoController.criar.bind(movimentacaoController));
    // Listar movimentações
    // admin, gerente e funcionário
    app.get('/movimentacoes', {
        preHandler: [
            authMiddleware,
            verificarRole([
                'admin',
                'gerente',
                'funcionario'
            ])
        ]
    }, movimentacaoController.listar.bind(movimentacaoController));
}
