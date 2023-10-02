/*
  Warnings:

  - You are about to drop the column `progressThemes` on the `HistoryProfile` table. All the data in the column will be lost.
  - Added the required column `desc` to the `HistoryTopic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryProfile" DROP COLUMN "progressThemes",
ADD COLUMN     "progressTopics" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "progressTotal" SET DEFAULT 0,
ALTER COLUMN "timeAvarage" DROP NOT NULL,
ALTER COLUMN "progressRealSession" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "HistoryProgress" ALTER COLUMN "value" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "HistoryTopic" ADD COLUMN     "desc" TEXT NOT NULL;
