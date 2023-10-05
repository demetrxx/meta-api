/*
  Warnings:

  - You are about to drop the `HistoryRealSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `HistoryTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `HistoryTicket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('MAIN', 'ADDITIONAL', 'TEST');

-- DropForeignKey
ALTER TABLE "HistoryRealSession" DROP CONSTRAINT "HistoryRealSession_profileId_fkey";

-- DropForeignKey
ALTER TABLE "HistoryRealSession" DROP CONSTRAINT "HistoryRealSession_ticketId_fkey";

-- AlterTable
ALTER TABLE "HistoryTicket" ADD COLUMN     "type" "SessionType" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "HistoryRealSession";

-- CreateTable
CREATE TABLE "HistorySession" (
    "id" SERIAL NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "lastViewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timePassed" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "answers" JSONB NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "HistorySession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistorySession" ADD CONSTRAINT "HistorySession_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "HistoryTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorySession" ADD CONSTRAINT "HistorySession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "HistoryProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
