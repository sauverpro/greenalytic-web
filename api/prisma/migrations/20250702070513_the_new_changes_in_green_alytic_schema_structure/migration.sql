/*
  Warnings:

  - Added the required column `plateNumber` to the `OBDData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OBDData" ADD COLUMN     "plateNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrackingDevice" ADD COLUMN     "enebleFuelMonitoring" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "enableEmissionMonitoring" SET DEFAULT false,
ALTER COLUMN "enableGPSTracking" SET DEFAULT false,
ALTER COLUMN "enableOBDMonitoring" SET DEFAULT false;
