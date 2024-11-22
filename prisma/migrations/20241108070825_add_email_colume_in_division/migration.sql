/*
  Warnings:

  - Added the required column `email` to the `Division` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "email" VARCHAR(100) NOT NULL;
