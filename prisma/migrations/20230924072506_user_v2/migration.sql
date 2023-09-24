/*
  Warnings:

  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "name",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLoginDate",
ADD COLUMN     "lastVisitDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
