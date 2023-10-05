/*
  Warnings:

  - You are about to drop the column `progressRealSession` on the `HistoryProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoryProfile" DROP COLUMN "progressRealSession",
ADD COLUMN     "progressSession" INTEGER NOT NULL DEFAULT 0;
