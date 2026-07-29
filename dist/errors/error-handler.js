"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_js_1 = require("./AppError.js");
function errorHandler(app) {
    app.setErrorHandler(async (error, request, reply) => {
        request.log.error(error);
        if (error instanceof AppError_js_1.AppError) {
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
