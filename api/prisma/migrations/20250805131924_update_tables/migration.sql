/*
  Warnings:

  - You are about to drop the column `comment` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `ratingDate` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "comment",
DROP COLUMN "createdAt",
DROP COLUMN "grade",
DROP COLUMN "ratingDate",
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "preparedAt" TIMESTAMP(3),
ADD COLUMN     "routedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_orderId_key" ON "evaluations"("orderId");

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
