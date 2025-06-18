/*
  Warnings:

  - You are about to drop the `categoryRestaurants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categoryRestaurants" DROP CONSTRAINT "categoryRestaurants_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categoryRestaurants" DROP CONSTRAINT "categoryRestaurants_restaurantId_fkey";

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "categoryRestaurants";

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
