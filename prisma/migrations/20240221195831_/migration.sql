-- AlterTable
ALTER TABLE "Date" ADD COLUMN     "absenceReason" TEXT,
ADD COLUMN     "isRestarted" BOOLEAN DEFAULT false;
