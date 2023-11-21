/*
  Warnings:

  - You are about to drop the `_HistoryQuestionToHistoryTicket` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order` to the `HistoryQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketId` to the `HistoryQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTicket" DROP CONSTRAINT "_HistoryQuestionToHistoryTicket_A_fkey";

-- DropForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTicket" DROP CONSTRAINT "_HistoryQuestionToHistoryTicket_B_fkey";

-- AlterTable
ALTER TABLE "HistoryQuestion" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "ticketId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_HistoryQuestionToHistoryTicket";

-- AddForeignKey
ALTER TABLE "HistoryQuestion" ADD CONSTRAINT "HistoryQuestion_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "HistoryTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
