-- AlterTable
ALTER TABLE "items" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
