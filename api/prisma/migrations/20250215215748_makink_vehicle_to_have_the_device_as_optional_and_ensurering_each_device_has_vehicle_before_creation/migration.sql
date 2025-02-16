/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId]` on the table `TrackingDevice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plateNumber` to the `FuelData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `GPSData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `TrackingDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_trackingDeviceId_fkey";

-- AlterTable
ALTER TABLE "FuelData" ADD COLUMN     "plateNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GPSData" ADD COLUMN     "plateNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrackingDevice" ADD COLUMN     "vehicleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrackingDevice_vehicleId_key" ON "TrackingDevice"("vehicleId");

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
