/*
  Warnings:

  - A unique constraint covering the columns `[serverId]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Config_serverId_key" ON "Config"("serverId");
