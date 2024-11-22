-- DropForeignKey
ALTER TABLE "Borrow" DROP CONSTRAINT "Borrow_origanizationId_fkey";

-- AlterTable
ALTER TABLE "Borrow" ALTER COLUMN "origanizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_origanizationId_fkey" FOREIGN KEY ("origanizationId") REFERENCES "Origanization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
