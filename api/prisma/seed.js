import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
 
  let vehicle1 = await prisma.vehicle.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      plateNumber: "RAD456",
      vehicleType: "Sedan",
      vehicleModel: "Toyota Corolla",
      yearOfManufacture: 2020,
      usage: "Commercial",
      userId: 1, 
    },
  });

  // Create Vehicle 2
  let vehicle2 = await prisma.vehicle.upsert({
    where: { id: 10 },
    update: {},
    create: {
      id: 10,
      plateNumber: "RAE789",
      vehicleType: "SUV",
      vehicleModel: "Honda CR-V",
      yearOfManufacture: 2021,
      usage: "Private",
      userId: 21, 
    },
  });

  // Create tracking device for vehicle 1
  let trackingDevice1 = await prisma.trackingDevice.upsert({
    where: { vehicleId: 6 },
    update: {},
    create: {
      serialNumber: "TD123456",
      model: "Tracker 2000",
      type: "GPS",
      plateNumber: "RAD456",
      isActive: true,
      userId: 21, 
      vehicleId: 6,
    },
  });

  // Create tracking device for vehicle 2
  let trackingDevice2 = await prisma.trackingDevice.upsert({
    where: { vehicleId: 10 },
    update: {},
    create: {
      serialNumber: "TD789012",
      model: "Tracker 2000",
      type: "GPS",
      plateNumber: "R123A",
      isActive: true,
      userId: 21, 
      vehicleId: 10,
    },
  });

  // Example data to be saved - updated to match schema
  const emissionsData = [
    {
      vehicleId: 6,
      timestamp: new Date(),
      co2Percentage: 100,
      coPercentage: 1.5,
      o2Percentage: 0.5,
      hcPPM: 20,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice1.id,
    },
    {
      vehicleId: 10,
      timestamp: new Date(),
      co2Percentage: 120,
      coPercentage: 1.8,
      o2Percentage: 0.6,
      hcPPM: 30,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice2.id,
    },
  ];

  const gpsData = [
    {
      vehicleId: 6,
      timestamp: new Date(),
      latitude: -1.9403,
      longitude: 30.0596,
      speed: 60,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice1.id,
    },
    {
      vehicleId: 10,
      timestamp: new Date(),
      latitude: -1.9453,
      longitude: 30.0646,
      speed: 70,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice2.id,
    },
  ];

  const fuelData = [
    {
      vehicleId: 6,
      timestamp: new Date(),
      fuelLevel: 50,
      fuelConsumption: 15,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice1.id,
    },
    {
      vehicleId: 10,
      timestamp: new Date(),
      fuelLevel: 60,
      fuelConsumption: 18,
      plateNumber: "R123A",
      trackingDeviceId: trackingDevice2.id,
    },
  ];

  // Save emissions data
  await prisma.emissionData.createMany({
    data: emissionsData,
  });

  // Save GPS data
  await prisma.gPSData.createMany({
    data: gpsData,
  });

  // Save fuel data
  await prisma.fuelData.createMany({
    data: fuelData,
  });

  console.log("Data saved successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
