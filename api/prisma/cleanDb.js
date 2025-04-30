import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDb() {
  try {
    console.log("Cleaning database...");

    await prisma.gPSData.deleteMany({});
    await prisma.emissionData.deleteMany({});
    await prisma.fuelData.deleteMany({});
    await prisma.trackingDevice.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.connectionState.deleteMany({});

    console.log("Database cleaned successfully.");
  } catch (error) {
    console.error("Error cleaning database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDb();
