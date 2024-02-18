-- DropForeignKey
ALTER TABLE "Date" DROP CONSTRAINT "Date_userId_fkey";

-- AlterTable
ALTER TABLE "Date" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
