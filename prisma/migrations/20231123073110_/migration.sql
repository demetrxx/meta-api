-- DropForeignKey
ALTER TABLE "HistoryProfile" DROP CONSTRAINT "HistoryProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "HistoryProgress" DROP CONSTRAINT "HistoryProgress_profileId_fkey";

-- DropForeignKey
ALTER TABLE "HistorySession" DROP CONSTRAINT "HistorySession_profileId_fkey";

-- AddForeignKey
ALTER TABLE "HistoryProfile" ADD CONSTRAINT "HistoryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryProgress" ADD CONSTRAINT "HistoryProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorySession" ADD CONSTRAINT "HistorySession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
