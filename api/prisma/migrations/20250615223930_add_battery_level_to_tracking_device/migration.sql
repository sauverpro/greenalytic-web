/*
  Warnings:

  - The values [GPS_TRACKER,FUEL_MONITOR,EMISSION_SENSOR,OBD_DEVICE,MULTI_SENSOR] on the enum `DeviceCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeviceCategory_new" AS ENUM ('MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER');
ALTER TABLE "TrackingDevice" ALTER COLUMN "deviceCategory" TYPE "DeviceCategory_new" USING ("deviceCategory"::text::"DeviceCategory_new");
ALTER TYPE "DeviceCategory" RENAME TO "DeviceCategory_old";
ALTER TYPE "DeviceCategory_new" RENAME TO "DeviceCategory";
DROP TYPE "DeviceCategory_old";
COMMIT;
