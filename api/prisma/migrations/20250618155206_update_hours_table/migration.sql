/*
  Warnings:

  - Changed the type of `weekday` on the `hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "hours" DROP COLUMN "weekday",
ADD COLUMN     "weekday" INTEGER NOT NULL;
