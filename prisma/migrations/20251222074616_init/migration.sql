/*
  Warnings:

  - You are about to drop the `mailNoti` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[qrId]` on the table `Items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "qrId" INTEGER;

-- DropTable
DROP TABLE "mailNoti";

-- CreateTable
CREATE TABLE "Qr" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(500) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qr_detail" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "detail" VARCHAR(1000) NOT NULL,
    "qrId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qr_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_qrId_key" ON "Items"("qrId");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qr_detail" ADD CONSTRAINT "Qr_detail_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
