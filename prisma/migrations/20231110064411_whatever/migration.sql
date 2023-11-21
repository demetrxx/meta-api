/*
  Warnings:

  - You are about to drop the column `desc` on the `HistoryQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `HistoryQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `HistoryQuestion` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TicketType" ADD VALUE 'FIRST';
ALTER TYPE "TicketType" ADD VALUE 'SECOND';
ALTER TYPE "TicketType" ADD VALUE 'DEMO';

-- DropForeignKey
ALTER TABLE "HistoryQuestion" DROP CONSTRAINT "HistoryQuestion_topicId_fkey";

-- AlterTable
ALTER TABLE "HistoryQuestion" DROP COLUMN "desc",
DROP COLUMN "img",
DROP COLUMN "topicId";

-- CreateTable
CREATE TABLE "_HistoryQuestionToHistoryTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryQuestionToHistoryTopic_AB_unique" ON "_HistoryQuestionToHistoryTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryQuestionToHistoryTopic_B_index" ON "_HistoryQuestionToHistoryTopic"("B");

-- AddForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTopic" ADD CONSTRAINT "_HistoryQuestionToHistoryTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTopic" ADD CONSTRAINT "_HistoryQuestionToHistoryTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
