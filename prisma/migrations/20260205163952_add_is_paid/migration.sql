-- AlterTable
ALTER TABLE "app"."cours" ADD COLUMN     "isPaid" BOOLEAN,
ALTER COLUMN "price" DROP NOT NULL;
