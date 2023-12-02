-- AlterTable
ALTER TABLE "PaymentOption" ADD COLUMN     "accessFor" INTEGER,
ALTER COLUMN "accessUntil" DROP NOT NULL;
