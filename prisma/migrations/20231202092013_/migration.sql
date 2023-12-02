/*
  Warnings:

  - You are about to drop the column `accssUntil` on the `PaymentOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentOption" DROP COLUMN "accssUntil",
ADD COLUMN     "accessUntil" TIMESTAMP(3);
