/*
  Warnings:

  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `service_description` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `service_type` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDescription` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `expiresAt` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `services` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `features` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "expires_at",
DROP COLUMN "name",
DROP COLUMN "otp",
DROP COLUMN "service_description",
DROP COLUMN "service_type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "serviceDescription" TEXT NOT NULL,
ADD COLUMN     "serviceId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "otps" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "expires_at",
DROP COLUMN "purpose",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "category",
DROP COLUMN "icon",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "features" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "company_name",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "companyName" TEXT NOT NULL DEFAULT 'N/A (Admin User)',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
