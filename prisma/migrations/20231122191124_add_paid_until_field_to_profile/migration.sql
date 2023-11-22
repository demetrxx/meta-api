-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "HistoryProfile" ADD COLUMN     "accessUntil" TIMESTAMP(3);
