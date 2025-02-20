/*
  Warnings:

  - You are about to drop the column `email` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `qrId` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the `Qr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Qr_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_qrId_fkey";

-- DropForeignKey
ALTER TABLE "Qr_detail" DROP CONSTRAINT "Qr_detail_qrId_fkey";

-- DropIndex
DROP INDEX "Items_qrId_key";

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "qrId";

-- DropTable
DROP TABLE "Qr";

-- DropTable
DROP TABLE "Qr_detail";
