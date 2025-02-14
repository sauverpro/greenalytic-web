-- DropIndex
DROP INDEX "User_username_idx";

-- DropIndex
DROP INDEX "User_username_key";

-- DropIndex
DROP INDEX "Vehicle_plateNumber_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "picture" DROP NOT NULL,
ALTER COLUMN "picture" DROP DEFAULT;
