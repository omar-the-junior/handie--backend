/*
  Warnings:

  - Made the column `businessName` on table `SellerProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SellerProfile" ALTER COLUMN "businessName" SET NOT NULL;
