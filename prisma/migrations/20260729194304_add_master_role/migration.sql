-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'masterx';

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "empresa_id" DROP NOT NULL;
