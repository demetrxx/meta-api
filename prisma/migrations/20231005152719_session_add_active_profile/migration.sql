/*
  Warnings:

  - A unique constraint covering the columns `[activeSessionId]` on the table `HistoryProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HistoryProfile" ADD COLUMN     "activeSessionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "HistoryProfile_activeSessionId_key" ON "HistoryProfile"("activeSessionId");

-- AddForeignKey
ALTER TABLE "HistoryProfile" ADD CONSTRAINT "HistoryProfile_activeSessionId_fkey" FOREIGN KEY ("activeSessionId") REFERENCES "HistorySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
