/*
  Warnings:

  - You are about to drop the column `clientId` on the `TrackingDevice` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingDevice" DROP CONSTRAINT "TrackingDevice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_clientId_fkey";

-- AlterTable
ALTER TABLE "TrackingDevice" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "clientId";

-- DropTable
DROP TABLE "Client";
