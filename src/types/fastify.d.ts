import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    usuarioId?: bigint;
    empresaId?: bigint | null;
    role?: string;
  }
}