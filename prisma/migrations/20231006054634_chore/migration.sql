/*
  Warnings:

  - Changed the type of `type` on the `HistoryTicket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('MAIN', 'ADDITIONAL', 'TEST');

-- AlterTable
ALTER TABLE "HistoryTicket" DROP COLUMN "type",
ADD COLUMN     "type" "TicketType" NOT NULL;

-- DropEnum
DROP TYPE "SessionType";
