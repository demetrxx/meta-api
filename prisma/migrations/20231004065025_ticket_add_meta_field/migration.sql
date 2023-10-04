/*
  Warnings:

  - Added the required column `meta` to the `HistoryTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoryTicket" ADD COLUMN     "meta" JSONB NOT NULL;
