-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'gerente', 'funcionario');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('entrada', 'saida');

-- CreateEnum
CREATE TYPE "MotivoMovimentacao" AS ENUM ('compra', 'ajuste', 'perda');

-- CreateEnum
CREATE TYPE "StatusVenda" AS ENUM ('confirmada', 'cancelada');

-- CreateTable
CREATE TABLE "empresas" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cnpj" VARCHAR(18),
    "telefone" VARCHAR(20),
    "email" VARCHAR(150),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'funcionario',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "telefone" VARCHAR(20),
    "cpf" VARCHAR(14),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "codigo_barras" VARCHAR(50),
    "preco_custo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "preco_venda" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "estoque_minimo" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "produto_id" BIGINT NOT NULL,
    "usuario_id" BIGINT,
    "tipo" "TipoMovimentacao" NOT NULL,
    "motivo" "MotivoMovimentacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" BIGSERIAL NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "cliente_id" BIGINT,
    "usuario_id" BIGINT,
    "status" "StatusVenda" NOT NULL DEFAULT 'confirmada',
    "valor_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venda_itens" (
    "id" BIGSERIAL NOT NULL,
    "venda_id" BIGINT NOT NULL,
    "produto_id" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_venda_unitario" DECIMAL(12,2) NOT NULL,
    "preco_custo_unitario" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "venda_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_empresa_id_email_key" ON "usuarios"("empresa_id", "email");

-- CreateIndex
CREATE INDEX "clientes_empresa_id_idx" ON "clientes"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_empresa_id_cpf_key" ON "clientes"("empresa_id", "cpf");

-- CreateIndex
CREATE INDEX "produtos_empresa_id_nome_idx" ON "produtos"("empresa_id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_empresa_id_codigo_barras_key" ON "produtos"("empresa_id", "codigo_barras");

-- CreateIndex
CREATE INDEX "movimentacoes_estoque_produto_id_idx" ON "movimentacoes_estoque"("produto_id");

-- CreateIndex
CREATE INDEX "vendas_empresa_id_criado_em_idx" ON "vendas"("empresa_id", "criado_em");

-- CreateIndex
CREATE INDEX "venda_itens_venda_id_idx" ON "venda_itens"("venda_id");

-- CreateIndex
CREATE INDEX "venda_itens_produto_id_idx" ON "venda_itens"("produto_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda_itens" ADD CONSTRAINT "venda_itens_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda_itens" ADD CONSTRAINT "venda_itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
