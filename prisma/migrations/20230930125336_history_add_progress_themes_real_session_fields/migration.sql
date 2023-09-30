/*
  Warnings:

  - You are about to drop the column `answeredIds` on the `HistoryProfile` table. All the data in the column will be lost.
  - Added the required column `progressRealSession` to the `HistoryProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progressThemes` to the `HistoryProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryProfile" DROP COLUMN "answeredIds",
ADD COLUMN     "progressRealSession" INTEGER NOT NULL,
ADD COLUMN     "progressThemes" INTEGER NOT NULL;
