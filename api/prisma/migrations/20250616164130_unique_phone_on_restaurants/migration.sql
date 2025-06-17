/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "restaurants_phone_key" ON "restaurants"("phone");
