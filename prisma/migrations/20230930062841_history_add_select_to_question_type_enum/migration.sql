/*
  Warnings:

  - Changed the type of `type` on the `HistoryQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HistoryQuestionType" AS ENUM ('SINGLE', 'ORDER', 'MATCH', 'SELECT');

-- AlterTable
ALTER TABLE "HistoryQuestion" DROP COLUMN "type",
ADD COLUMN     "type" "HistoryQuestionType" NOT NULL;

-- DropEnum
DROP TYPE "QuestionType";
