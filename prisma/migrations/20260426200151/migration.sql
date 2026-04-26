-- DropForeignKey
ALTER TABLE "otps" DROP CONSTRAINT "otps_userId_fkey";

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
