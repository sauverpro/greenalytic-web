
import prisma from '../prismaClient.js'
import { passHashing } from '../src/utils/passwordfunctions.js'


async function seed () {
  console.log('🧹 Clearing existing records...')

  // Delete in order: child -> parent
  await prisma.alert.deleteMany()
  await prisma.fuelData.deleteMany()
  await prisma.gpsData.deleteMany()
  await prisma.emissionData.deleteMany()
  await prisma.oBDData.deleteMany()
  await prisma.maintenanceRecord.deleteMany()
  await prisma.trackingDevice.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()
  await prisma.connectionState.deleteMany()
  await prisma.report.deleteMany()

  console.log('🌱 Seeding data...')

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await passHashing('admin123'),
      fullName: 'Admin One',
      role: 'ADMIN'
    }
  })
  const user2 = await prisma.user.create({
    data: {
      email: 'tech@example.com',
      password: await passHashing('tech123'),
      fullName: 'Technician Two',
      role: 'TECHNICIAN'
    }
  })
  const user3 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: await passHashing('user123'),
      fullName: 'Fleet User',
      role: 'FLEET_MANAGER'
    }
  })

  // Create vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      plateNumber: 'RAC101A',
      vehicleType: 'Car',
      vehicleModel: 'Toyota Corolla',
      yearOfManufacture: 2015,
      usage: 'Private',
      userId: user1.id
    }
  })
  const vehicle2 = await prisma.vehicle.create({
    data: {
      plateNumber: 'RAD202B',
      vehicleType: 'Truck',
      vehicleModel: 'Isuzu D-MAX',
      yearOfManufacture: 2018,
      usage: 'Commercial',
      userId: user2.id
    }
  })
  const vehicle3 = await prisma.vehicle.create({
    data: {
      plateNumber: 'RAE303C',
      vehicleType: 'Motorcycle',
      vehicleModel: 'TVS XL100',
      yearOfManufacture: 2020,
      usage: 'Delivery',
      userId: user3.id
    }
  })

  // Create tracking devices
  const device1 = await prisma.trackingDevice.create({
    data: {
      serialNumber: 'TD1001',
      model: 'TrackPro v1',
      type: 'OBD',
      plateNumber: 'RAC101A',
      deviceCategory: 'CAR',
      vehicleId: vehicle1.id,
      userId: user1.id
    }
  })
  const device2 = await prisma.trackingDevice.create({
    data: {
      serialNumber: 'TD1002',
      model: 'TrackLite v2',
      type: 'GPS',
      plateNumber: 'RAD202B',
      deviceCategory: 'TRUCK',
      vehicleId: vehicle2.id,
      userId: user2.id
    }
  })
  const device3 = await prisma.trackingDevice.create({
    data: {
      serialNumber: 'TD1003',
      model: 'EcoTracker',
      type: 'Hybrid',
      plateNumber: 'RAE303C',
      deviceCategory: 'MOTORCYCLE',
      vehicleId: vehicle3.id,
      userId: user3.id
    }
  })

  // GPS Data
  await prisma.gpsData.createMany({
    data: [
      {
        latitude: -1.95,
        longitude: 30.06,
        speed: 40,
        plateNumber: 'RAC101A',
        vehicleId: vehicle1.id,
        trackingDeviceId: device1.id
      },
      {
        latitude: -1.96,
        longitude: 30.07,
        speed: 60,
        plateNumber: 'RAD202B',
        vehicleId: vehicle2.id,
        trackingDeviceId: device2.id
      },
      {
        latitude: -1.97,
        longitude: 30.08,
        speed: 50,
        plateNumber: 'RAE303C',
        vehicleId: vehicle3.id,
        trackingDeviceId: device3.id
      }
    ]
  })

  // Fuel Data
  await prisma.fuelData.createMany({
    data: [
      {
        fuelLevel: 60,
        fuelConsumption: 6.2,
        plateNumber: 'RAC101A',
        vehicleId: vehicle1.id,
        trackingDeviceId: device1.id
      },
      {
        fuelLevel: 45,
        fuelConsumption: 7.5,
        plateNumber: 'RAD202B',
        vehicleId: vehicle2.id,
        trackingDeviceId: device2.id
      },
      {
        fuelLevel: 80,
        fuelConsumption: 3.1,
        plateNumber: 'RAE303C',
        vehicleId: vehicle3.id,
        trackingDeviceId: device3.id
      }
    ]
  })

  // Emission Data
  await prisma.emissionData.createMany({
    data: [
      {
        co2Percentage: 0.05,
        coPercentage: 0.01,
        o2Percentage: 20.8,
        hcPPM: 180,
        vehicleId: vehicle1.id,
        plateNumber: 'RAC101A',
        trackingDeviceId: device1.id
      },
      {
        co2Percentage: 0.07,
        coPercentage: 0.02,
        o2Percentage: 20.7,
        hcPPM: 190,
        vehicleId: vehicle2.id,
        plateNumber: 'RAD202B',
        trackingDeviceId: device2.id
      },
      {
        co2Percentage: 0.04,
        coPercentage: 0.01,
        o2Percentage: 20.9,
        hcPPM: 170,
        vehicleId: vehicle3.id,
        plateNumber: 'RAE303C',
        trackingDeviceId: device3.id
      }
    ]
  })

  // OBD Data
  await prisma.oBDData.createMany({
    data: [
      {
        rpm: 2200,
        throttlePosition: 45,
        engineTemperature: 90,
        engineStatus: 'Running',
        faultCodes: ['P0133'],
        plateNumber: 'RAC101A',
        vehicleId: vehicle1.id,
        trackingDeviceId: device1.id
      },
      {
        rpm: 1800,
        throttlePosition: 35,
        engineTemperature: 85,
        engineStatus: 'Running',
        faultCodes: [],
        plateNumber: 'RAD202B',
        vehicleId: vehicle2.id,
        trackingDeviceId: device2.id
      },
      {
        rpm: 2500,
        throttlePosition: 50,
        engineTemperature: 95,
        engineStatus: 'Running',
        faultCodes: ['P0420'],
        plateNumber: 'RAE303C',
        vehicleId: vehicle3.id,
        trackingDeviceId: device3.id
      }
    ]
  })

  // Alerts
  await prisma.alert.createMany({
    data: [
      {
        type: 'HIGH_EMISSION_ALERT',
        title: 'CO2 Too High',
        message: 'CO2 exceeds threshold',
        vehicleId: vehicle1.id
      },
      {
        type: 'FUEL_ANOMALY_ALERT',
        title: 'Fuel Drop Detected',
        message: 'Unexpected fuel drop',
        vehicleId: vehicle2.id
      },
      {
        type: 'DIAGNOSTIC_FAULT_NOTIFICATION',
        title: 'Engine Fault Code',
        message: 'P0420 detected',
        vehicleId: vehicle3.id
      }
    ]
  })

  console.log('✅ Seed complete.')
}

seed()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
