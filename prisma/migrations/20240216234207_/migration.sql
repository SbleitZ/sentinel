/*
  Warnings:

  - Added the required column `serverAvatar` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "serverAvatar" TEXT NOT NULL;
