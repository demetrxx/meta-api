/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauthToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isEmailVerified",
DROP COLUMN "oauthToken",
DROP COLUMN "password",
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "HistoryQuestion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "type" VARCHAR(10),
    "img" TEXT,
    "options" JSONB NOT NULL,
    "answer" JSONB NOT NULL,
    "topicId" INTEGER NOT NULL,
    "solution" TEXT,
    "whereToLearn" TEXT[],
    "advice" TEXT,

    CONSTRAINT "HistoryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryTopic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "HistoryTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryKeyWord" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "HistoryKeyWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryTicket" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "HistoryTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryProfile" (
    "id" SERIAL NOT NULL,
    "progressTotal" INTEGER NOT NULL,
    "timeAvarage" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "HistoryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryProgress" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "HistoryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryRealSession" (
    "id" SERIAL NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "time" INTEGER NOT NULL,
    "score" INTEGER,
    "answers" JSONB NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "HistoryRealSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HistoryQuestionToHistoryTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HistoryKeyWordToHistoryQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_profilesAnswered" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_profilesFailed" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoryTopic_order_key" ON "HistoryTopic"("order");

-- CreateIndex
CREATE UNIQUE INDEX "HistoryKeyWord_topicId_key" ON "HistoryKeyWord"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryQuestionToHistoryTicket_AB_unique" ON "_HistoryQuestionToHistoryTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryQuestionToHistoryTicket_B_index" ON "_HistoryQuestionToHistoryTicket"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryKeyWordToHistoryQuestion_AB_unique" ON "_HistoryKeyWordToHistoryQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryKeyWordToHistoryQuestion_B_index" ON "_HistoryKeyWordToHistoryQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_profilesAnswered_AB_unique" ON "_profilesAnswered"("A", "B");

-- CreateIndex
CREATE INDEX "_profilesAnswered_B_index" ON "_profilesAnswered"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_profilesFailed_AB_unique" ON "_profilesFailed"("A", "B");

-- CreateIndex
CREATE INDEX "_profilesFailed_B_index" ON "_profilesFailed"("B");

-- AddForeignKey
ALTER TABLE "HistoryQuestion" ADD CONSTRAINT "HistoryQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HistoryTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryKeyWord" ADD CONSTRAINT "HistoryKeyWord_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HistoryTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryProfile" ADD CONSTRAINT "HistoryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryProgress" ADD CONSTRAINT "HistoryProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HistoryTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryProgress" ADD CONSTRAINT "HistoryProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "HistoryProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryRealSession" ADD CONSTRAINT "HistoryRealSession_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "HistoryTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryRealSession" ADD CONSTRAINT "HistoryRealSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "HistoryProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTicket" ADD CONSTRAINT "_HistoryQuestionToHistoryTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryQuestionToHistoryTicket" ADD CONSTRAINT "_HistoryQuestionToHistoryTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryKeyWordToHistoryQuestion" ADD CONSTRAINT "_HistoryKeyWordToHistoryQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryKeyWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryKeyWordToHistoryQuestion" ADD CONSTRAINT "_HistoryKeyWordToHistoryQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesAnswered" ADD CONSTRAINT "_profilesAnswered_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesAnswered" ADD CONSTRAINT "_profilesAnswered_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesFailed" ADD CONSTRAINT "_profilesFailed_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesFailed" ADD CONSTRAINT "_profilesFailed_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
