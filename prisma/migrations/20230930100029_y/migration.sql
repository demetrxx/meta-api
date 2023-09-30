/*
  Warnings:

  - You are about to drop the column `answer` on the `HistoryQuestion` table. All the data in the column will be lost.
  - Added the required column `correct` to the `HistoryQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryQuestion" DROP COLUMN "answer",
ADD COLUMN     "correct" JSONB NOT NULL;
