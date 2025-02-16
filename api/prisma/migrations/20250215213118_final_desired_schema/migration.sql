/*
  Warnings:

  - Added the required column `fuelConsumption` to the `FuelData` table without a default value. This is not possible if the table is not empty.
  - Made the column `trackingDeviceId` on table `FuelData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trackingDeviceId` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FuelData" DROP CONSTRAINT "FuelData_trackingDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_trackingDeviceId_fkey";

-- DropIndex
DROP INDEX "FuelData_timestamp_idx";

-- DropIndex
DROP INDEX "FuelData_trackingDeviceId_idx";

-- DropIndex
DROP INDEX "FuelData_vehicleId_idx";

-- DropIndex
DROP INDEX "FuelData_vehicleId_timestamp_idx";

-- AlterTable
ALTER TABLE "FuelData" ADD COLUMN     "fuelConsumption" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "trackingDeviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "trackingDeviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
