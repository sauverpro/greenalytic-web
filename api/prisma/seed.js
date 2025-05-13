import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let vehicleId = 63;
  let plateNumber = "Up123";
  let gpsId = 55;
  let fuelId = 61;
  let emId = 56;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); 

  const emissionsData = [];
  const gpsData = [];
  const fuelData = [];

  for (let i = 0; i < 120; i++) {
    const timestamp = faker.date.between({ from: startDate, to: endDate });

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

    const baseLat = -1.9403;
    const baseLong = 30.0596;

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

    fuelData.push({
      vehicleId: vehicleId,
      timestamp: new Date(timestamp),
      fuelLevel: faker.number.float({ min: 5, max: 95, precision: 0.1 }),
      fuelConsumption: faker.number.float({ min: 8, max: 25, precision: 0.1 }),
      plateNumber: plateNumber,
      trackingDeviceId: fuelId,
    });
  }

  emissionsData.sort((a, b) => a.timestamp - b.timestamp);
  gpsData.sort((a, b) => a.timestamp - b.timestamp);
  fuelData.sort((a, b) => a.timestamp - b.timestamp);

  let currentFuelLevel = 80;
  fuelData.forEach((item, index) => {
    if (index > 0) {
      const consumption = faker.number.float({
        min: 0.5,
        max: 3,
        precision: 0.1,
      });
      currentFuelLevel -= consumption;

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

  await prisma.emissionData.createMany({
    data: emissionsData,
  });

  await prisma.gPSData.createMany({
    data: gpsData,
  });

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
