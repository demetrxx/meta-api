-- DropForeignKey
ALTER TABLE "HistoryQuestion" DROP CONSTRAINT "HistoryQuestion_topicId_fkey";

-- AlterTable
ALTER TABLE "HistoryTopic" ALTER COLUMN "desc" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HistoryQuestion" ADD CONSTRAINT "HistoryQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HistoryTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
