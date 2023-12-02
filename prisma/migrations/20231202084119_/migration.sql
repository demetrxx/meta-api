/*
  Warnings:

  - Added the required column `accessUntil` to the `PaymentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `PaymentOption` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('HISTORY');

-- AlterTable
ALTER TABLE "PaymentOption" ADD COLUMN     "accessUntil" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "subjects" "Subject"[];
