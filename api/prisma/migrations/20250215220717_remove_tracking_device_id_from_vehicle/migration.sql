/*
  Warnings:

  - You are about to drop the column `trackingDeviceId` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Vehicle_trackingDeviceId_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "trackingDeviceId";
