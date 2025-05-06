import prisma from '../../prismaClient.js'
import { PaginationService } from './paginationService.js'

class TrackingDeviceService {
  static async addTrackingDeviceToVehicle(data) {
    try {
      const { serialNumber, model, type, plateNumber, vehicleId } = data;

      if (!serialNumber || !model || !type || !plateNumber) {
        throw new Error("Missing required tracking device information");
      }

      const vehicleData = await prisma.vehicle.findUnique({
        where: { id: vehicleId, plateNumber: plateNumber },
        select: { id: true, userId: true },
      });

      if (!vehicleData) {
        throw new Error("Vehicle not found or plate number mismatch.");
      }

      const existingSerial = await prisma.trackingDevice.findUnique({
        where: { serialNumber },
      });

      if (existingSerial) {
        throw new Error(
          "Tracking device with this serial number already exists."
        );
      }

          const existingDeviceType = await prisma.trackingDevice.findFirst({
            where: {
              vehicleId,
              type,
              deletedAt: null, 
            },
          });

          if (existingDeviceType) {
            throw new Error(
              `A ${type} device is already assigned to this vehicle.`
            );
          }

      const trackingDevice = await prisma.trackingDevice.create({
        data: {
          serialNumber,
          model,
          type,
          plateNumber,
          vehicleId,
          userId: vehicleData.userId,
          isActive: true,
          lastPing: new Date(),
        },
      });

      return { trackingDevice, vehicleId };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getTrackingDevicesByVehicleId(vehicleId) {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const trackingDevices = await prisma.trackingDevice.findMany({
        where: { vehicleId: vehicleId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              image: true,
            },
          },
          gpsDatas: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return trackingDevices;
    } catch (error) {
      throw new Error(`Failed to retrieve tracking devices: ${error.message}`);
    }
  }
  static async removeTrackingDeviceFromVehicle(deviceId, vehicleId) {
    try {
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id: deviceId },
        include: { vehicle: true },
      });

      if (!trackingDevice) {
        throw new Error("Tracking device not found.");
      }

      if (trackingDevice.vehicleId === vehicleId) {
        // Then delete the vehicle
        await prisma.trackingDevice.delete({
          where: { id: deviceId },
        });

        return {
          success: true,
          message: "Tracking device removed from vehicle.",
        };
      } else {
        throw new Error("Tracking device is not assigned to this vehicle.");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllTrackingDevices(page, limit) {
    try {
      const skip = (page - 1) * limit;
      const devices = await prisma.trackingDevice.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, email: true, image: true },
          },
        },
      });

      return devices;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getTrackingDeviceById(id) {
    try {
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id },
        include: {
          vehicle,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true,
              role: true,
              image: true,
            },
          },
        },
      });

      if (!trackingDevice) {
        throw new Error("Tracking device not found.");
      }

      return trackingDevice;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getTrackingDevicesByUser(userId) {
    try {
      const devices = await prisma.trackingDevice.findMany({
        where: {
          userId: userId,
          deletedAt: null,
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true,
              role: true,
              image: true,
            },
          },
          vehicle: {
            select: {
              plateNumber: true,
              vehicleType: true,
              vehicleModel: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
          vehicle: {
            select: {
              plateNumber: true,
              vehicleType: true,
              vehicleModel: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return devices;
    } catch (error) {
      throw new Error(
        `Failed to retrieve tracking devices for user: ${error.message}`
      );
    }
  }

  static async getDeviceDetails(
    deviceId,
    dateRange = {},
    paginationParams = {}
  ) {
    try {
      const parsedDeviceId = parseInt(deviceId, 10);
      if (isNaN(parsedDeviceId)) {
        throw new Error("Invalid device ID");
      }

      const device = await prisma.trackingDevice.findUnique({
        where: { id: parsedDeviceId },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true,
              role: true,
              image: true,
            },
          },
        },
      });

      if (!device) {
        throw new Error("Device not found");
      }

      const dateFilter = {};
      if (dateRange.startDate && dateRange.endDate) {
        dateFilter.timestamp = {
          gte: new Date(dateRange.startDate),
          lte: new Date(dateRange.endDate),
        };
      }

      let deviceData = {};
      const { page = 1, limit = 10 } = paginationParams;
      const skip = (page - 1) * limit;

      const counts = {};

      if (device.type === "GPS") {
        counts.gpsData = await prisma.gPSData.count({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
        });

        deviceData.gpsData = await prisma.gPSData.findMany({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      } else if (device.type === "FUEL") {
        counts.fuelData = await prisma.fuelData.count({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
        });

        deviceData.fuelData = await prisma.fuelData.findMany({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      } else if (device.type === "EMISSION") {
        counts.emissionData = await prisma.emissionData.count({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
        });

        deviceData.emissionData = await prisma.emissionData.findMany({
          where: {
            trackingDeviceId: parsedDeviceId,
            ...dateFilter,
          },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      }

      const pagination = PaginationService.processMultipleDatasets(counts, {
        page,
        limit,
      });

      return {
        device,
        data: deviceData,
        pagination,
      };
    } catch (error) {
      throw new Error(`Error getting device details: ${error.message}`);
    }
  }
  static async updateDeviceService(deviceId, data) {
    try {
      const existingDevice = await prisma.trackingDevice.findUnique({
        where: {
          id: deviceId,
          deletedAt: null,
        },
        include: {
          vehicle: true,
        },
      });

      if (!existingDevice) {
        throw new Error("Tracking device not found");
      }

      const { serialNumber, model, type, plateNumber, vehicleId } = data;

      if (!serialNumber || !model || !type || !plateNumber) {
        throw new Error("Missing required tracking device information");
      }

      const vehicleData = await prisma.vehicle.findUnique({
        where: { id: vehicleId, plateNumber: plateNumber },
        select: { id: true, userId: true },
      });

      if (!vehicleData) {
        throw new Error("Vehicle not found or plate number mismatch.");
      }

      if (serialNumber !== existingDevice.serialNumber) {
        const existingSerial = await prisma.trackingDevice.findUnique({
          where: { serialNumber },
        });

        if (existingSerial) {
          throw new Error(
            "Tracking device with this serial number already exists."
          );
        }
      }

      const updatedDevice = await prisma.trackingDevice.update({
        where: {
          id: deviceId,
        },
        data: {
          ...data, 
        },
      });

      if (
        (data.status === "inactive" || data.isActive === false) &&
        (existingDevice.status !== "inactive" ||
          existingDevice.isActive !== false)
      ) {
        await prisma.trackingDevice.update({
          where: {
            id: deviceId,
          },
          data: {
            lastPing: new Date(),
          },
        });
      }

      return updatedDevice;
    } catch (error) {
      throw error;
    }
  }
}


export default TrackingDeviceService
