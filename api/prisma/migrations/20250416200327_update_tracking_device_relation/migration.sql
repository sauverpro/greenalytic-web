-- DropForeignKey
ALTER TABLE "EmissionData" DROP CONSTRAINT "EmissionData_trackingDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "FuelData" DROP CONSTRAINT "FuelData_trackingDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "GPSData" DROP CONSTRAINT "GPSData_vehicleId_fkey";

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionData" ADD CONSTRAINT "EmissionData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPSData" ADD CONSTRAINT "GPSData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
