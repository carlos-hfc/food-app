/*
  Warnings:

  - You are about to drop the column `address` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `uf` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `state` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `number` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "address",
DROP COLUMN "uf",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "state" CHAR(2) NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "number" SET NOT NULL;
