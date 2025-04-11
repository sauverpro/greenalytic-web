-- DropForeignKey
ALTER TABLE "TrackingDevice" DROP CONSTRAINT "TrackingDevice_vehicleId_fkey";

-- AlterTable
ALTER TABLE "TrackingDevice" ALTER COLUMN "vehicleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
