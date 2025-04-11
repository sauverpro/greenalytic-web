import prisma from '../../prismaClient.js'

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
          user: { select: { id: true, username: true, email: true } },
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
          user: { select: { id: true, username: true, email: true } },
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
}

export default TrackingDeviceService



