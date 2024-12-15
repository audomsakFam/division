/*
  Warnings:

  - The `group` column on the `Origanization` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Origanization" DROP COLUMN "group",
ADD COLUMN     "group" INTEGER NOT NULL DEFAULT 0;
