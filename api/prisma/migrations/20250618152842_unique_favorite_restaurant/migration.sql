/*
  Warnings:

  - A unique constraint covering the columns `[clientId,restaurantId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favorites_clientId_restaurantId_key" ON "favorites"("clientId", "restaurantId");
