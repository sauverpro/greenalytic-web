/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `plateNumber` to the `EmissionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleModel` to the `EmissionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GPSData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `TrackingDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `TrackingDevice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleModel` to the `TrackingDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrackingDevice" DROP CONSTRAINT "TrackingDevice_vehicleId_fkey";

-- AlterTable
ALTER TABLE "EmissionData" ADD COLUMN     "plateNumber" TEXT NOT NULL,
ADD COLUMN     "vehicleModel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GPSData" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "deviceId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TrackingDevice" ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "deviceId" INTEGER,
ADD COLUMN     "plateNumber" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "vehicleModel" TEXT NOT NULL,
ALTER COLUMN "vehicleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "clientId" INTEGER;

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fuelLevel" DOUBLE PRECISION NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FuelData_vehicleId_idx" ON "FuelData"("vehicleId");

-- CreateIndex
CREATE INDEX "FuelData_timestamp_idx" ON "FuelData"("timestamp");

-- CreateIndex
CREATE INDEX "FuelData_vehicleId_timestamp_idx" ON "FuelData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "EmissionData_plateNumber_idx" ON "EmissionData"("plateNumber");

-- CreateIndex
CREATE INDEX "EmissionData_vehicleModel_idx" ON "EmissionData"("vehicleModel");

-- CreateIndex
CREATE INDEX "GPSData_deviceId_idx" ON "GPSData"("deviceId");

-- CreateIndex
CREATE INDEX "TrackingDevice_plateNumber_idx" ON "TrackingDevice"("plateNumber");

-- CreateIndex
CREATE INDEX "TrackingDevice_vehicleModel_idx" ON "TrackingDevice"("vehicleModel");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GPSData" ADD CONSTRAINT "GPSData_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
