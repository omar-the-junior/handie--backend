/*
  Warnings:

  - You are about to drop the column `sales` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Product` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- DropIndex
DROP INDEX "Product_sellerId_key";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sales",
DROP COLUMN "views";

-- AlterTable
ALTER TABLE "ProductReview" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Wishlist" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WishlistItem" ALTER COLUMN "updatedAt" DROP DEFAULT;
