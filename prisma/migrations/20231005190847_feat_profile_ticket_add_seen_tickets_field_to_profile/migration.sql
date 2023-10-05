-- CreateTable
CREATE TABLE "_HistoryProfileToHistoryTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryProfileToHistoryTicket_AB_unique" ON "_HistoryProfileToHistoryTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryProfileToHistoryTicket_B_index" ON "_HistoryProfileToHistoryTicket"("B");

-- AddForeignKey
ALTER TABLE "_HistoryProfileToHistoryTicket" ADD CONSTRAINT "_HistoryProfileToHistoryTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoryProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryProfileToHistoryTicket" ADD CONSTRAINT "_HistoryProfileToHistoryTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
