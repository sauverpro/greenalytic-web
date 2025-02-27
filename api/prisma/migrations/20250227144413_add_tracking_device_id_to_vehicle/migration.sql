-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "trackingDeviceId" INTEGER;

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");

-- CreateIndex
CREATE INDEX "Vehicle_deletedAt_idx" ON "Vehicle"("deletedAt");

-- CreateIndex
CREATE INDEX "Vehicle_vehicleType_idx" ON "Vehicle"("vehicleType");

-- CreateIndex
CREATE INDEX "Vehicle_trackingDeviceId_idx" ON "Vehicle"("trackingDeviceId");
