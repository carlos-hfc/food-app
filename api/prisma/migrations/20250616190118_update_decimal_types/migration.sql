/*
  Warnings:

  - Changed the type of `price` on the `orderItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `total` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tax` on the `restaurants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "price",
ADD COLUMN     "price" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "total",
ADD COLUMN     "total" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "price" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "tax",
ADD COLUMN     "tax" MONEY NOT NULL;
