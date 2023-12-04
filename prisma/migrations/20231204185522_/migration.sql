/*
  Warnings:

  - Made the column `discount` on table `PaymentOption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentOption" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "active" DROP NOT NULL;
