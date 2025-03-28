import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Keep your original vehicle and device IDs
  let vehicleId = 5;
  let plateNumber = "RA002A";
  let gpsId = 10;
  let fuelId = 11;
  let emId = 12;

  // Generate data for the last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // 30 days ago

  // Create arrays to hold our generated data
  const emissionsData = [];
  const gpsData = [];
  const fuelData = [];

  // Generate 100+ records spread across the last 30 days
  for (let i = 0; i < 120; i++) {
    // Create a random timestamp between start and end date
    const timestamp = faker.date.between({ from: startDate, to: endDate });

    // Add random emission data with realistic variations
    emissionsData.push({
      vehicleId: vehicleId,
      timestamp: new Date(timestamp),
      co2Percentage: faker.number.float({ min: 80, max: 140, precision: 0.1 }),
      coPercentage: faker.number.float({ min: 0.8, max: 2.4, precision: 0.01 }),
      o2Percentage: faker.number.float({ min: 0.3, max: 0.9, precision: 0.01 }),
      hcPPM: faker.number.int({ min: 15, max: 40 }),
      plateNumber: plateNumber,
      trackingDeviceId: emId,
    });

    // Create GPS data points showing movement around Kigali
    // Central coordinate for Kigali: -1.9403, 30.0596
    const baseLat = -1.9403;
    const baseLong = 30.0596;

    // Add some random variation to create a path
    const latVariance = faker.number.float({
      min: -0.03,
      max: 0.03,
      precision: 0.0001,
    });
    const longVariance = faker.number.float({
      min: -0.03,
      max: 0.03,
      precision: 0.0001,
    });

    gpsData.push({
      vehicleId: vehicleId,
      timestamp: new Date(timestamp),
      latitude: baseLat + latVariance,
      longitude: baseLong + longVariance,
      speed: faker.number.float({ min: 0, max: 120, precision: 0.1 }),
      plateNumber: plateNumber,
      trackingDeviceId: gpsId,
    });

    // Add fuel data with realistic decreasing fuel levels and varying consumption
    fuelData.push({
      vehicleId: vehicleId,
      timestamp: new Date(timestamp),
      fuelLevel: faker.number.float({ min: 5, max: 95, precision: 0.1 }),
      fuelConsumption: faker.number.float({ min: 8, max: 25, precision: 0.1 }),
      plateNumber: plateNumber,
      trackingDeviceId: fuelId,
    });
  }

  // Sort all data by timestamp to ensure chronological order
  emissionsData.sort((a, b) => a.timestamp - b.timestamp);
  gpsData.sort((a, b) => a.timestamp - b.timestamp);
  fuelData.sort((a, b) => a.timestamp - b.timestamp);

  // Create more realistic fuel level pattern (gradually decreasing with refills)
  let currentFuelLevel = 80;
  fuelData.forEach((item, index) => {
    // Simulate fuel consumption
    if (index > 0) {
      // Random consumption between trips
      const consumption = faker.number.float({
        min: 0.5,
        max: 3,
        precision: 0.1,
      });
      currentFuelLevel -= consumption;

      // Simulate refilling when fuel gets low
      if (currentFuelLevel < 15) {
        currentFuelLevel = faker.number.float({
          min: 75,
          max: 95,
          precision: 0.1,
        });
      }
    }

    item.fuelLevel = Math.max(0, currentFuelLevel);
  });

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

  console.log(
    `Data saved successfully: ${emissionsData.length} emission records, ${gpsData.length} GPS records, ${fuelData.length} fuel records`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
