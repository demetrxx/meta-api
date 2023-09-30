/*
  Warnings:

  - The primary key for the `HistoryProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `HistoryProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoryProgress" DROP CONSTRAINT "HistoryProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "HistoryProgress_pkey" PRIMARY KEY ("topicId", "profileId");
