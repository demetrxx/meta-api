/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `HistoryProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HistoryProfile_userId_key" ON "HistoryProfile"("userId");
