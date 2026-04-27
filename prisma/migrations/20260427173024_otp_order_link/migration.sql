-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "orderId" INTEGER;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
