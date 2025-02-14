/*
  Warnings:

  - You are about to drop the column `vehicleModel` on the `TrackingDevice` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TrackingDevice_vehicleModel_idx";

-- AlterTable
ALTER TABLE "TrackingDevice" DROP COLUMN "vehicleModel";
