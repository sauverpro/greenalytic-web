import prisma from '../../prismaClient.js'
import { PaginationService } from './paginationService.js'

class TrackingDeviceService {
  
  static async registerTrackingDevice(data) {
    try {
      const {

        serialNumber,
        deviceCategory,
        firmwareVersion,
        simCardNumber,
        installationDate,
        communicationProtocol,
        
        plateNumber,
        chassisNumber,
        vehicleType,
        fuelType,

        dataTransmissionInterval,
        enableOBDMonitoring,
        enableGPSTracking,
        enableEmissionMonitoring,
    
        userId,
        vehicleId,
        
        model,
        type,
      } = data;

      if (!serialNumber || !deviceCategory || !plateNumber) {
        throw new Error("Missing required fields: serialNumber, deviceCategory, and plateNumber are required");
      }

      const existingSerial = await prisma.trackingDevice.findUnique({
        where: { serialNumber },
      });

      if (existingSerial) {
        throw new Error("Device with this serial number already exists");
      }

      let vehicleData = null;
      if (vehicleId) {
        vehicleData = await prisma.vehicle.findUnique({
          where: { id: vehicleId },
          select: { id: true, userId: true, plateNumber: true },
        });

        if (!vehicleData) {
          throw new Error("Vehicle not found");
        }

        if (vehicleData.plateNumber !== plateNumber) {
          throw new Error("Plate number mismatch with selected vehicle");
        }
      }

      const trackingDevice = await prisma.trackingDevice.create({
        data: {
          serialNumber,
          deviceCategory,
          firmwareVersion: firmwareVersion || null,
          simCardNumber: simCardNumber || null,
          installationDate: installationDate ? new Date(installationDate) : new Date(),
          communicationProtocol: communicationProtocol || 'MQTT',
          
          dataTransmissionInterval: dataTransmissionInterval || '30sec',
          enableOBDMonitoring: enableOBDMonitoring !== undefined ? enableOBDMonitoring : true,
          enableGPSTracking: enableGPSTracking !== undefined ? enableGPSTracking : true,
          enableEmissionMonitoring: enableEmissionMonitoring !== undefined ? enableEmissionMonitoring : true,
          
          plateNumber,
          vehicleId: vehicleId || null,
          userId: vehicleData?.userId || userId || null,
          
          model: model || 'Unknown',
          type: type || deviceCategory,
          
          status: 'PENDING', // Start as pending until activated
          isActive: false,
          lastPing: null,
        },
        include: {
          vehicle: {
            select: {
              id: true,
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
              fuelType: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      console.log(`Device ${serialNumber} registered at ${new Date().toISOString()}`);

      return {
        success: true,
        message: `Device ${serialNumber} has been successfully registered and assigned to vehicle ${plateNumber}. It will begin transmitting data based on the selected configuration.`,
        device: trackingDevice,
      };
    } catch (error) {
      throw new Error(`Device registration failed: ${error.message}`);
    }
  }

  /**
   * Add tracking device to vehicle
   */
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
        throw new Error("Tracking device with this serial number already exists.");
      }

      //  Check device category conflicts instead of just type
      const existingDeviceCategory = await prisma.trackingDevice.findFirst({
        where: {
          vehicleId,
          deviceCategory: type.toUpperCase(),
          deletedAt: null,
          status: { not: 'INACTIVE' },
        },
      });

      if (existingDeviceCategory) {
        throw new Error(`A ${type} device is already assigned to this vehicle.`);
      }

      const trackingDevice = await prisma.trackingDevice.create({
        data: {
          serialNumber,
          model,
          type,
          deviceCategory: type.toUpperCase(), // Map to device category
          plateNumber,
          vehicleId,
          userId: vehicleData.userId,
          isActive: true,
          status: 'ACTIVE',
          lastPing: new Date(),
          installationDate: new Date(),
          communicationProtocol: 'MQTT', // Default
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
        where: { 
          vehicleId: vehicleId,
          deletedAt: null 
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
              image: true,
              role: true,
            },
          },
          vehicle: {
            select: {
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
              status: true,
            },
          },
          gpsData: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
    
          obdData: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
          _count: {
            select: {
              gpsData: true,
              fuelData: true,
              emissionData: true,
              obdData: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const devicesWithStatus = trackingDevices.map(device => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isOnline = device.lastPing && new Date(device.lastPing) > fiveMinutesAgo;
        
        return {
          ...device,
          connectivityStatus: isOnline ? 'ONLINE' : 'OFFLINE',
          dataTypesEnabled: {
            gps: device.enableGPSTracking,
            obd: device.enableOBDMonitoring,
            emission: device.enableEmissionMonitoring,
          },
        };
      });

      return devicesWithStatus;
    } catch (error) {
      throw new Error(`Failed to retrieve tracking devices: ${error.message}`);
    }
  }

  /**
   *  device details
   */
  static async getDeviceDetails(deviceId, dateRange = {}, paginationParams = {}) {
    try {
      const parsedDeviceId = parseInt(deviceId, 10);
      if (isNaN(parsedDeviceId)) {
        throw new Error("Invalid device ID");
      }

      const device = await prisma.trackingDevice.findUnique({
        where: { id: parsedDeviceId },
        include: {
          vehicle: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  companyName: true,
                  role: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
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

      const { page = 1, limit = 10 } = paginationParams;
      const skip = (page - 1) * limit;

      // Data retrieval
      const deviceData = {};
      const counts = {};

      // GPS Data (if enabled)
      if (device.enableGPSTracking) {
        counts.gpsData = await prisma.gPSData.count({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
        });

        deviceData.gpsData = await prisma.gPSData.findMany({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      }

      // Fuel Data
      counts.fuelData = await prisma.fuelData.count({
        where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
      });

      deviceData.fuelData = await prisma.fuelData.findMany({
        where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      });

      // Emission Data (if enabled)
      if (device.enableEmissionMonitoring) {
        counts.emissionData = await prisma.emissionData.count({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
        });

        deviceData.emissionData = await prisma.emissionData.findMany({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      }

      // OBD Data (if enabled)
      if (device.enableOBDMonitoring) {
        counts.obdData = await prisma.oBDData.count({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
        });

        deviceData.obdData = await prisma.oBDData.findMany({
          where: { trackingDeviceId: parsedDeviceId, ...dateFilter },
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
        });
      }

      const pagination = PaginationService.processMultipleDatasets(counts, {
        page,
        limit,
      });

      // Device health analysis
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const deviceHealth = {
        isOnline: device.lastPing && new Date(device.lastPing) > fiveMinutesAgo,
        lastSeen: device.lastPing,
        dataStreams: {
          gps: device.enableGPSTracking && counts.gpsData > 0,
          fuel: counts.fuelData > 0,
          emission: device.enableEmissionMonitoring && counts.emissionData > 0,
          obd: device.enableOBDMonitoring && counts.obdData > 0,
        },
        configuration: {
          transmissionInterval: device.dataTransmissionInterval,
          protocol: device.communicationProtocol,
          firmwareVersion: device.firmwareVersion,
        },
      };

      return {
        device: {
          ...device,
          health: deviceHealth,
        },
        data: deviceData,
        pagination,
      };
    } catch (error) {
      throw new Error(`Error getting device details: ${error.message}`);
    }
  }

  /**
   *  device update
   */
  static async updateDeviceService(deviceId, data) {
    try {
      const existingDevice = await prisma.trackingDevice.findUnique({
        where: { id: deviceId, deletedAt: null },
        include: { vehicle: true },
      });

      if (!existingDevice) {
        throw new Error("Tracking device not found");
      }

      // Validate required fields
      const { serialNumber, plateNumber, vehicleId } = data;

      if (vehicleId && plateNumber) {
        const vehicleData = await prisma.vehicle.findUnique({
          where: { id: vehicleId, plateNumber: plateNumber },
          select: { id: true, userId: true },
        });

        if (!vehicleData) {
          throw new Error("Vehicle not found or plate number mismatch.");
        }
      }

      // Check serial number uniqueness if changed
      if (serialNumber && serialNumber !== existingDevice.serialNumber) {
        const existingSerial = await prisma.trackingDevice.findUnique({
          where: { serialNumber },
        });

        if (existingSerial) {
          throw new Error("Tracking device with this serial number already exists.");
        }
      }

      // Prepare update data
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      // Handle status changes
      if (data.status === 'INACTIVE' || data.isActive === false) {
        updateData.isActive = false;
        updateData.status = 'INACTIVE';
        updateData.lastPing = new Date(); // Update last ping on status change
      } else if (data.status === 'ACTIVE' || data.isActive === true) {
        updateData.isActive = true;
        updateData.status = 'ACTIVE';
      }

      const updatedDevice = await prisma.trackingDevice.update({
        where: { id: deviceId },
        data: updateData,
        include: {
          vehicle: {
            select: {
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      return updatedDevice;
    } catch (error) {
      throw error;
    }
  }

  /**
   * device listing with filtering capabilities
   */
  static async getAllTrackingDevices(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause with filters
      const whereClause = {
        deletedAt: null,
      };

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.deviceCategory) {
        whereClause.deviceCategory = filters.deviceCategory;
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }

      // Online/Offline filter
      if (filters.connectivity === 'ONLINE') {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        whereClause.lastPing = { gte: fiveMinutesAgo };
      } else if (filters.connectivity === 'OFFLINE') {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        whereClause.OR = [
          { lastPing: { lt: fiveMinutesAgo } },
          { lastPing: null },
        ];
      }

      const totalDevices = await prisma.trackingDevice.count({
        where: whereClause,
      });

      const devices = await prisma.trackingDevice.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: { 
              id: true, 
              username: true, 
              fullName: true, 
              email: true, 
              image: true,
              companyName: true,
            },
          },
          vehicle: {
            select: {
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
              status: true,
            },
          },
          _count: {
            select: {
              gpsData: true,
              fuelData: true,
              emissionData: true,
              obdData: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Add connectivity status
      const devicesWithStatus = devices.map(device => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isOnline = device.lastPing && new Date(device.lastPing) > fiveMinutesAgo;
        
        return {
          ...device,
          connectivityStatus: isOnline ? 'ONLINE' : 'OFFLINE',
        };
      });

      return {
        devices: devicesWithStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDevices / limit),
          totalItems: totalDevices,
          limit,
        },
      };
    } catch (error) {
      throw new Error(`Error retrieving devices: ${error.message}`);
    }
  }

  /**
   * Device heartbeat update for connectivity tracking
   */
  static async updateDeviceHeartbeat(serialNumber) {
    try {
      const updatedDevice = await prisma.trackingDevice.update({
        where: { serialNumber },
        data: { 
          lastPing: new Date(),
          status: 'ACTIVE',
          isActive: true,
        },
      });

      return updatedDevice;
    } catch (error) {
      throw new Error(`Error updating device heartbeat: ${error.message}`);
    }
  }

  /**
   * Get device configuration for data transmission
   */
  static async getDeviceConfiguration(serialNumber) {
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { serialNumber },
        select: {
          id: true,
          serialNumber: true,
          deviceCategory: true,
          communicationProtocol: true,
          dataTransmissionInterval: true,
          enableOBDMonitoring: true,
          enableGPSTracking: true,
          enableEmissionMonitoring: true,
          status: true,
          isActive: true,
        },
      });

      if (!device) {
        throw new Error("Device not found");
      }

      return device;
    } catch (error) {
      throw new Error(`Error getting device configuration: ${error.message}`);
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
        await prisma.trackingDevice.update({
          where: { id: deviceId },
          data: { 
            deletedAt: new Date(),
            status: 'INACTIVE',
            isActive: false,
          },
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

  static async getTrackingDeviceById(id) {
    try {
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
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
              fullName: true,
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
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return devices;
    } catch (error) {
      throw new Error(`Failed to retrieve tracking devices for user: ${error.message}`);
    }
  }
}

export default TrackingDeviceService;