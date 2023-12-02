/*
  Warnings:

  - You are about to drop the column `accessFor` on the `PaymentOption` table. All the data in the column will be lost.
  - You are about to drop the column `accessUntil` on the `PaymentOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentOption" DROP COLUMN "accessFor",
DROP COLUMN "accessUntil";
