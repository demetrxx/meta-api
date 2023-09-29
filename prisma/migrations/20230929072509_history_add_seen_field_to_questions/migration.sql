-- AlterTable
ALTER TABLE "HistoryProfile" ADD COLUMN     "answeredIds" INTEGER[];

-- CreateTable
CREATE TABLE "_profilesSeen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_profilesSeen_AB_unique" ON "_profilesSeen"("A", "B");

-- CreateIndex
CREATE INDEX "_profilesSeen_B_index" ON "_profilesSeen"("B");

-- AddForeignKey
ALTER TABLE "_profilesSeen" ADD CONSTRAINT "_profilesSeen_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesSeen" ADD CONSTRAINT "_profilesSeen_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
