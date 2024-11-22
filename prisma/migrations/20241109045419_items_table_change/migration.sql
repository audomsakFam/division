-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_qrId_fkey";

-- AlterTable
ALTER TABLE "Items" ALTER COLUMN "qrId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE SET NULL ON UPDATE CASCADE;
