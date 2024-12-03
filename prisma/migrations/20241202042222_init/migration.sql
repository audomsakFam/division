-- AlterTable
ALTER TABLE "Items" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ปกติ';
