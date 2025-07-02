/*
  Warnings:

  - The `status` column on the `TrackingDevice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `deviceCategory` to the `TrackingDevice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'DISCONNECTED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('GPS_TRACKER', 'FUEL_MONITOR', 'EMISSION_SENSOR', 'OBD_DEVICE', 'MULTI_SENSOR');

-- CreateEnum
CREATE TYPE "CommunicationProtocol" AS ENUM ('MQTT', 'HTTP', 'SMS');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('HIGH_EMISSION_ALERT', 'DIAGNOSTIC_FAULT_NOTIFICATION', 'FUEL_ANOMALY_ALERT', 'DEVICE_OFFLINE_WARNING', 'SPEED_VIOLATION_ALERT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'FLEET_MANAGER';
ALTER TYPE "UserRole" ADD VALUE 'ANALYST';
ALTER TYPE "UserRole" ADD VALUE 'SUPPORT_AGENT';

-- AlterTable
ALTER TABLE "EmissionData" ADD COLUMN     "noxPPM" DOUBLE PRECISION,
ADD COLUMN     "pm25Level" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TrackingDevice" ADD COLUMN     "communicationProtocol" "CommunicationProtocol" NOT NULL DEFAULT 'MQTT',
ADD COLUMN     "dataTransmissionInterval" TEXT,
ADD COLUMN     "deviceCategory" "DeviceCategory" NOT NULL,
ADD COLUMN     "enableEmissionMonitoring" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableGPSTracking" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableOBDMonitoring" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firmwareVersion" TEXT,
ADD COLUMN     "installationDate" TIMESTAMP(3),
ADD COLUMN     "simCardNumber" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessSector" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyRegistrationNumber" TEXT,
ADD COLUMN     "fleetSize" INTEGER,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "language" TEXT DEFAULT 'English',
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "notificationPreference" TEXT DEFAULT 'Email',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "fuelType" "FuelType",
ADD COLUMN     "lastMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'NORMAL_EMISSION';

-- DropEnum
DROP TYPE "deviceStatus";

-- CreateTable
CREATE TABLE "OBDData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rpm" INTEGER,
    "throttlePosition" DOUBLE PRECISION NOT NULL,
    "engineTemperature" DOUBLE PRECISION,
    "engineStatus" TEXT,
    "faultCodes" TEXT[],
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackingDeviceId" INTEGER NOT NULL,

    CONSTRAINT "OBDData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "triggerValue" TEXT,
    "triggerThreshold" TEXT,
    "vehicleId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "filePath" TEXT,
    "dateFrom" TIMESTAMP(3),
    "dateTo" TIMESTAMP(3),
    "vehicleIds" INTEGER[],
    "status" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendedAction" TEXT,
    "cost" DOUBLE PRECISION,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OBDData_vehicleId_idx" ON "OBDData"("vehicleId");

-- CreateIndex
CREATE INDEX "OBDData_timestamp_idx" ON "OBDData"("timestamp");

-- CreateIndex
CREATE INDEX "OBDData_trackingDeviceId_idx" ON "OBDData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "Alert_vehicleId_idx" ON "Alert"("vehicleId");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_type_idx" ON "Alert"("type");

-- CreateIndex
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Report_type_idx" ON "Report"("type");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_vehicleId_idx" ON "MaintenanceRecord"("vehicleId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_performedAt_idx" ON "MaintenanceRecord"("performedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_nextDueDate_idx" ON "MaintenanceRecord"("nextDueDate");

-- CreateIndex
CREATE INDEX "FuelData_vehicleId_timestamp_idx" ON "FuelData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "FuelData_trackingDeviceId_idx" ON "FuelData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "TrackingDevice_serialNumber_idx" ON "TrackingDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "TrackingDevice_status_idx" ON "TrackingDevice"("status");

-- CreateIndex
CREATE INDEX "TrackingDevice_deviceCategory_idx" ON "TrackingDevice"("deviceCategory");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- AddForeignKey
ALTER TABLE "OBDData" ADD CONSTRAINT "OBDData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OBDData" ADD CONSTRAINT "OBDData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
