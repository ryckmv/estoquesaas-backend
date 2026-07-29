// lib/tenant.ts
//
// Aqui mora o "lugar central" do filtro por empresa.
// Em vez de cada service escrever `where: { empresaId }` na mão,
// toda a aplicação usa o client gerado por `createTenantClient`,
// que já injeta esse filtro automaticamente em toda consulta.
//
// Nota sobre os `as any` / `as unknown as typeof prisma` abaixo:
// a tipagem do Prisma 7 para extensões "genéricas" ($allModels /
// $allOperations, que interceptam TODOS os modelos de uma vez)
// não consegue inferir corretamente que o client resultante ainda
// tem os mesmos modelos do client original. Por isso forçamos o
// tipo de retorno a ser igual ao do `prisma` original — o que é
// verdade em runtime, só o TypeScript que não consegue provar
// isso sozinho nesse tipo de extensão. Os services que usam
// TenantPrismaClient continuam 100% tipados normalmente
// (db.produto, db.venda, autocomplete, etc.).

import { prisma } from './prisma';

const MODELOS_COM_EMPRESA = [
  'usuario',
  'cliente',
  'produto',
  'movimentacaoEstoque',
  'venda',
] as const;

export function createTenantClient(empresaId: bigint) {
  const client = prisma.$extends({
    name: 'tenant-scope',
    query: {
      $allModels: {
        async $allOperations(params: any) {
          const { model, operation, args, query } = params;
          const nomeModelo = model ? model.charAt(0).toLowerCase() + model.slice(1) : '';
          const ehTenant = (MODELOS_COM_EMPRESA as readonly string[]).includes(nomeModelo);

          if (!ehTenant) {
            return query(args);
          }

          if (
            operation === 'findMany' ||
            operation === 'findFirst' ||
            operation === 'updateMany' ||
            operation === 'deleteMany' ||
            operation === 'count'
          ) {
            args.where = { ...(args.where ?? {}), empresaId };
          }

          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            const resultado = await query({
              where: { ...(args.where ?? {}), empresaId },
            });
            if (!resultado && operation === 'findUniqueOrThrow') {
              throw new Error('Registro não encontrado para esta empresa.');
            }
            return resultado;
          }

          if (operation === 'create') {
            args.data = { ...args.data, empresaId };
          }

          if (operation === 'update' || operation === 'delete') {
            args.where = { ...(args.where ?? {}), empresaId };
          }

          return query(args);
        },
      },
    } as any,
  } as any);

  // Força o tipo do client retornado a ser o mesmo do client base
  // (que já tem produto, cliente, venda, etc. corretamente tipados).
  return client as unknown as typeof prisma;
}

export type TenantPrismaClient = typeof prisma;