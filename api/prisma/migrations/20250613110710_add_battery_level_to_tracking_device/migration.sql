-- CreateEnum
CREATE TYPE "emissionStatus" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "emissionStatus" "emissionStatus" NOT NULL DEFAULT 'LOW';
