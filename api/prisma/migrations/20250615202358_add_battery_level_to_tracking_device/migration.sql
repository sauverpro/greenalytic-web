/*
  Warnings:

  - You are about to drop the `GPSData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GPSData" DROP CONSTRAINT "GPSData_trackingDeviceId_fkey";

-- DropForeignKey
ALTER TABLE "GPSData" DROP CONSTRAINT "GPSData_vehicleId_fkey";

-- DropTable
DROP TABLE "GPSData";

-- CreateTable
CREATE TABLE "GpsData" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicleId" INTEGER NOT NULL,
    "trackingStatus" BOOLEAN NOT NULL DEFAULT false,
    "trackingDeviceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GpsData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GpsData_vehicleId_idx" ON "GpsData"("vehicleId");

-- CreateIndex
CREATE INDEX "GpsData_timestamp_idx" ON "GpsData"("timestamp");

-- CreateIndex
CREATE INDEX "GpsData_vehicleId_timestamp_idx" ON "GpsData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "GpsData_trackingDeviceId_idx" ON "GpsData"("trackingDeviceId");

-- AddForeignKey
ALTER TABLE "GpsData" ADD CONSTRAINT "GpsData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpsData" ADD CONSTRAINT "GpsData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
