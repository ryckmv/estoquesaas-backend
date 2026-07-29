import { AppError } from './AppError.js';
export function errorHandler(app) {
    app.setErrorHandler(async (error, request, reply) => {
        request.log.error(error);
        if (error instanceof AppError) {
            return reply
                .status(error.statusCode)
                .send({
                sucesso: false,
                mensagem: error.message
            });
        }
        return reply
            .status(500)
            .send({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    });
}
