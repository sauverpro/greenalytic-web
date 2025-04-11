-- CreateEnum
CREATE TYPE "deviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'DISCONNECTED');

-- AlterTable
ALTER TABLE "TrackingDevice" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
