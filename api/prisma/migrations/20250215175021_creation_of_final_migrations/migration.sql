/*
  Warnings:

  - You are about to drop the column `vehicleModel` on the `EmissionData` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `GPSData` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `TrackingDevice` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `TrackingDevice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trackingDeviceId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackingDeviceId` to the `EmissionData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GPSData" DROP CONSTRAINT "GPSData_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingDevice" DROP CONSTRAINT "TrackingDevice_vehicleId_fkey";

-- DropIndex
DROP INDEX "EmissionData_vehicleModel_idx";

-- DropIndex
DROP INDEX "GPSData_deviceId_idx";

-- DropIndex
DROP INDEX "TrackingDevice_plateNumber_idx";

-- DropIndex
DROP INDEX "TrackingDevice_serialNumber_idx";

-- DropIndex
DROP INDEX "TrackingDevice_vehicleId_key";

-- DropIndex
DROP INDEX "Vehicle_plateNumber_idx";

-- DropIndex
DROP INDEX "Vehicle_userId_idx";

-- AlterTable
ALTER TABLE "EmissionData" DROP COLUMN "vehicleModel",
ADD COLUMN     "trackingDeviceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FuelData" ADD COLUMN     "trackingDeviceId" INTEGER;

-- AlterTable
ALTER TABLE "GPSData" DROP COLUMN "deviceId",
ADD COLUMN     "trackingDeviceId" INTEGER;

-- AlterTable
ALTER TABLE "TrackingDevice" DROP COLUMN "deviceId",
DROP COLUMN "vehicleId";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "trackingDeviceId" INTEGER;

-- CreateIndex
CREATE INDEX "EmissionData_trackingDeviceId_idx" ON "EmissionData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "FuelData_trackingDeviceId_idx" ON "FuelData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "GPSData_trackingDeviceId_idx" ON "GPSData"("trackingDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_trackingDeviceId_key" ON "Vehicle"("trackingDeviceId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionData" ADD CONSTRAINT "EmissionData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPSData" ADD CONSTRAINT "GPSData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
