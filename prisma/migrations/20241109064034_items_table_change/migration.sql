/*
  Warnings:

  - You are about to drop the column `exists` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Items" DROP COLUMN "exists",
DROP COLUMN "total";
