-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'TECHNICIAN', 'MANAGER', 'FLEET_MANAGER', 'ANALYST', 'SUPPORT_AGENT');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('CONNECTED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'DISCONNECTED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "emissionStatus" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER');

-- CreateEnum
CREATE TYPE "CommunicationProtocol" AS ENUM ('MQTT', 'HTTP', 'SMS');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('HIGH_EMISSION_ALERT', 'DIAGNOSTIC_FAULT_NOTIFICATION', 'FUEL_ANOMALY_ALERT', 'DEVICE_OFFLINE_WARNING', 'SPEED_VIOLATION_ALERT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "nationalId" TEXT,
    "gender" TEXT,
    "phoneNumber" TEXT,
    "location" TEXT,
    "companyName" TEXT,
    "companyRegistrationNumber" TEXT,
    "businessSector" TEXT,
    "fleetSize" INTEGER,
    "language" TEXT DEFAULT 'English',
    "notificationPreference" TEXT DEFAULT 'Email',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "otpExpiresAt" TIMESTAMP(3),
    "otp" TEXT,
    "token" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "chassisNumber" TEXT,
    "vehicleType" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "yearOfManufacture" INTEGER NOT NULL,
    "usage" TEXT NOT NULL,
    "fuelType" "FuelType",
    "status" "VehicleStatus" NOT NULL DEFAULT 'NORMAL_EMISSION',
    "emissionStatus" "emissionStatus" NOT NULL DEFAULT 'LOW',
    "lastMaintenanceDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingDevice" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "batteryLevel" DOUBLE PRECISION,
    "signalStrength" INTEGER,
    "deviceCategory" "DeviceCategory" NOT NULL,
    "firmwareVersion" TEXT,
    "simCardNumber" TEXT,
    "installationDate" TIMESTAMP(3),
    "communicationProtocol" "CommunicationProtocol" NOT NULL DEFAULT 'MQTT',
    "dataTransmissionInterval" TEXT,
    "enableOBDMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "enableGPSTracking" BOOLEAN NOT NULL DEFAULT false,
    "enableEmissionMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "enebleFuelMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastPing" TIMESTAMP(3),
    "userId" INTEGER,
    "vehicleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrackingDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fuelLevel" DOUBLE PRECISION NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "trackingDeviceId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmissionData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "co2Percentage" DOUBLE PRECISION NOT NULL,
    "coPercentage" DOUBLE PRECISION NOT NULL,
    "o2Percentage" DOUBLE PRECISION NOT NULL,
    "hcPPM" INTEGER NOT NULL,
    "noxPPM" DOUBLE PRECISION,
    "pm25Level" DOUBLE PRECISION,
    "vehicleId" INTEGER NOT NULL,
    "plateNumber" TEXT,
    "trackingDeviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EmissionData_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "OBDData" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rpm" INTEGER,
    "plateNumber" TEXT NOT NULL,
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
CREATE TABLE "ConnectionState" (
    "id" SERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionState_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");

-- CreateIndex
CREATE INDEX "Vehicle_deletedAt_idx" ON "Vehicle"("deletedAt");

-- CreateIndex
CREATE INDEX "Vehicle_vehicleType_idx" ON "Vehicle"("vehicleType");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingDevice_serialNumber_key" ON "TrackingDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "TrackingDevice_serialNumber_idx" ON "TrackingDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "TrackingDevice_status_idx" ON "TrackingDevice"("status");

-- CreateIndex
CREATE INDEX "TrackingDevice_deviceCategory_idx" ON "TrackingDevice"("deviceCategory");

-- CreateIndex
CREATE INDEX "FuelData_vehicleId_timestamp_idx" ON "FuelData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "FuelData_trackingDeviceId_idx" ON "FuelData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "EmissionData_vehicleId_idx" ON "EmissionData"("vehicleId");

-- CreateIndex
CREATE INDEX "EmissionData_timestamp_idx" ON "EmissionData"("timestamp");

-- CreateIndex
CREATE INDEX "EmissionData_vehicleId_timestamp_idx" ON "EmissionData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "EmissionData_plateNumber_idx" ON "EmissionData"("plateNumber");

-- CreateIndex
CREATE INDEX "EmissionData_trackingDeviceId_idx" ON "EmissionData"("trackingDeviceId");

-- CreateIndex
CREATE INDEX "GpsData_vehicleId_idx" ON "GpsData"("vehicleId");

-- CreateIndex
CREATE INDEX "GpsData_timestamp_idx" ON "GpsData"("timestamp");

-- CreateIndex
CREATE INDEX "GpsData_vehicleId_timestamp_idx" ON "GpsData"("vehicleId", "timestamp");

-- CreateIndex
CREATE INDEX "GpsData_trackingDeviceId_idx" ON "GpsData"("trackingDeviceId");

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
CREATE UNIQUE INDEX "ConnectionState_vehicleId_key" ON "ConnectionState"("vehicleId");

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

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingDevice" ADD CONSTRAINT "TrackingDevice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelData" ADD CONSTRAINT "FuelData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionData" ADD CONSTRAINT "EmissionData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionData" ADD CONSTRAINT "EmissionData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpsData" ADD CONSTRAINT "GpsData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpsData" ADD CONSTRAINT "GpsData_trackingDeviceId_fkey" FOREIGN KEY ("trackingDeviceId") REFERENCES "TrackingDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
