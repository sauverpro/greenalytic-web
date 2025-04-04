import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler.js";
import { VehicleService } from "../services/vehiclesService/vehicleService.js";
import { PaginationService } from "../services/paginationService.js";

const prisma = new PrismaClient();

/**
 * Vehicle Data Controller
 * Manages emission data, fuel data, and GPS data from the database
 */
export class vehicleDataController {
  /**
   * Get all vehicles belonging to a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getVehiclesByUserId = async (req, res) => {
    try {
      const userId = req.userId;

      const vehicles = await VehicleService.getVehiclesByUserId(userId);

      return res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get emission data for a specific vehicle within a time range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getEmissionsDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.userId;
      const { page, limit, skip } = PaginationService.parsePaginationParams(
        req.query
      );

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      const parsedStartDate = new Date(startDate);

      // Maximize the end date to include the full day
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs =
        await VehicleService.vehicleExistsAndBelongsToUser(
          parsedVehicleId,
          userId
        );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const where = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      // Get total count first
      const totalItems = await prisma.emissionData.count({ where });

      const result = await prisma.emissionData.findMany({
        where,
        orderBy: { timestamp: "asc" },
        ...PaginationService.applyPagination({}, skip, limit),
      });

      const paginationDetails = PaginationService.getPaginationDetails(
        totalItems,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        ...PaginationService.paginatedResponse(result, paginationDetails),
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get fuel data for a specific vehicle within a time range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getFuelsDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.userId;
      const { page, limit, skip } = PaginationService.parsePaginationParams(
        req.query
      );

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      const parsedStartDate = new Date(startDate);

      // Maximize the end date to include the full day
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs =
        await VehicleService.vehicleExistsAndBelongsToUser(
          parsedVehicleId,
          userId
        );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const where = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      const totalItems = await prisma.fuelData.count({ where });

      const result = await prisma.fuelData.findMany({
        where,
        orderBy: { timestamp: "asc" },
        ...PaginationService.applyPagination({}, skip, limit),
      });

      const paginationDetails = PaginationService.getPaginationDetails(
        totalItems,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        ...PaginationService.paginatedResponse(result, paginationDetails),
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get GPS data for a specific vehicle within a time range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getGPSDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.userId;
      const { page, limit, skip } = PaginationService.parsePaginationParams(
        req.query
      );

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      const parsedStartDate = new Date(startDate);

      // Maximize the end date to include the full day
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs =
        await VehicleService.vehicleExistsAndBelongsToUser(
          parsedVehicleId,
          userId
        );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const where = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      const totalItems = await prisma.gPSData.count({ where });

      const result = await prisma.gPSData.findMany({
        where,
        orderBy: { timestamp: "asc" },
        ...PaginationService.applyPagination({}, skip, limit),
      });

      const paginationDetails = PaginationService.getPaginationDetails(
        totalItems,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        ...PaginationService.paginatedResponse(result, paginationDetails),
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  static getAllDataInSystem = async (req, res) => {
    try {
      const { startDate, endDate, vehicleId, plateNumber } = req.query;
      const { page, limit, skip } = PaginationService.parsePaginationParams(
        req.query
      );

      // Build filter criteria
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.timestamp = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      // Prepare vehicle filter
      const vehicleFilter = {};
      if (vehicleId) vehicleFilter.vehicleId = parseInt(vehicleId, 10);
      if (plateNumber) vehicleFilter.plateNumber = plateNumber;

      // Execute queries in parallel for better performance
      const [emissionsCount, emissions, fuelsCount, fuels, gpsCount, gps] =
        await Promise.all([
          // Get emissions data count
          prisma.emissionData.count({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
          }),

          // Get emissions data with pagination
          prisma.emissionData.findMany({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
            select: {
              id: true,
              timestamp: true,
              co2Percentage: true,
              coPercentage: true,
              o2Percentage: true,
              hcPPM: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
            },
            ...PaginationService.applyPagination({}, skip, limit),
            orderBy: {
              timestamp: "desc",
            },
          }),

          // Get fuel data count
          prisma.fuelData.count({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
          }),

          // Get fuel data with pagination
          prisma.fuelData.findMany({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
            select: {
              id: true,
              timestamp: true,
              fuelLevel: true,
              fuelConsumption: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
            },
            ...PaginationService.applyPagination({}, skip, limit),
            orderBy: {
              timestamp: "desc",
            },
          }),

          // Get GPS data count
          prisma.gPSData.count({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
          }),

          // Get GPS data with pagination
          prisma.gPSData.findMany({
            where: {
              ...dateFilter,
              ...vehicleFilter,
            },
            select: {
              id: true,
              timestamp: true,
              latitude: true,
              longitude: true,
              speed: true,
              accuracy: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
              trackingStatus: true,
            },
            ...PaginationService.applyPagination({}, skip, limit),
            orderBy: {
              timestamp: "desc",
            },
          }),
        ]);

      // Calculate summary metrics
      const averageCO2 =
        emissions.length > 0
          ? emissions.reduce((sum, item) => sum + item.co2Percentage, 0) /
            emissions.length
          : 0;

      const averageFuelConsumption =
        fuels.length > 0
          ? fuels.reduce((sum, item) => sum + item.fuelConsumption, 0) /
            fuels.length
          : 0;

      const averageSpeed =
        gps.length > 0
          ? gps.reduce((sum, item) => sum + item.speed, 0) / gps.length
          : 0;

      const counts = {
        emission: emissionsCount,
        fuel: fuelsCount,
        gps: gpsCount,
      };
      const pagination = PaginationService.processMultipleDatasets(counts, {
        page,
        limit,
      });

      // Prepare response with pagination info
      res.status(200).json({
        success: true,
        pagination,
        summary: {
          averageCO2,
          averageFuelConsumption,
          averageSpeed,
        },
        data: {
          emissions,
          fuels,
          gps,
        },
      });
    } catch (error) {
      console.error("Error fetching emissions data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch emissions data",
        error: error.message,
      });
    }
  };

  /**
   * Analytics Hub - Central function for all analytical operations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static analyticHub = async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        vehicleId,
        plateNumber,
        dataType, // 'emissions', 'fuel', 'gps', or 'all'
        view = "summary", // 'summary', 'detail', or 'map'
      } = req.query;

      const userId = req.userId;

      // Pagination parameters
      const { page, limit, skip } = PaginationService.parsePaginationParams(
        req.query
      );

      // Build date filter
      const dateFilter = {};
      if (startDate && endDate) {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        parsedEndDate.setHours(23, 59, 59, 999);

        dateFilter.timestamp = {
          gte: parsedStartDate,
          lte: parsedEndDate,
        };
      }

      // Prepare vehicle filter
      const vehicleFilter = {};
      if (vehicleId) vehicleFilter.vehicleId = parseInt(vehicleId, 10);
      if (plateNumber) vehicleFilter.plateNumber = plateNumber;

      // User access validation if userId provided
      if (userId && vehicleId) {
        const vehicleExistsAndBelongs =
          await VehicleService.vehicleExistsAndBelongsToUser(
            parseInt(vehicleId, 10),
            userId
          );

        if (!vehicleExistsAndBelongs) {
          return res.status(404).json({
            success: false,
            message: "Vehicle not found or does not belong to the user",
          });
        }
      }

      let emissionsData = [],
        fuelsData = [],
        gpsData = [];
      let emissionsCount = 0,
        fuelsCount = 0,
        gpsCount = 0;

      //determine Pagination and limit settings based on view
      const getSummaryLimit = () => (view === "summary" ? 10 : limit);
      const getMapLimit = () => (view === "map" ? 10000000 : limit);
      const getSummarySkip = () => (view === "summary" ? 0 : skip);
      const getMapSkip = () => (view === "map" ? 0 : skip);

      if (!dataType || dataType === "all" || dataType === "emissions") {
        [emissionsCount, emissionsData] = await Promise.all([
          prisma.emissionData.count({
            where: { ...dateFilter, ...vehicleFilter },
          }),
          prisma.emissionData.findMany({
            where: { ...dateFilter, ...vehicleFilter },
            select: {
              id: true,
              timestamp: true,
              co2Percentage: true,
              coPercentage: true,
              o2Percentage: true,
              hcPPM: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
            },
            skip: getSummarySkip(),
            take: getSummaryLimit(),
            orderBy: { timestamp: "desc" },
          }),
        ]);
      }

      // Fetch fuel data if needed
      if (!dataType || dataType === "all" || dataType === "fuel") {
        [fuelsCount, fuelsData] = await Promise.all([
          prisma.fuelData.count({ where: { ...dateFilter, ...vehicleFilter } }),
          prisma.fuelData.findMany({
            where: { ...dateFilter, ...vehicleFilter },
            select: {
              id: true,
              timestamp: true,
              fuelLevel: true,
              fuelConsumption: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
            },
            skip: getSummarySkip(),
            take: getSummaryLimit(),
            orderBy: { timestamp: "desc" },
          }),
        ]);
      }

      // Fetch GPS data if needed
      if (!dataType || dataType === "all" || dataType === "gps") {
        [gpsCount, gpsData] = await Promise.all([
          prisma.gPSData.count({ where: { ...dateFilter, ...vehicleFilter } }),
          prisma.gPSData.findMany({
            where: { ...dateFilter, ...vehicleFilter },
            select: {
              id: true,
              timestamp: true,
              latitude: true,
              longitude: true,
              speed: true,
              accuracy: true,
              plateNumber: true,
              vehicleId: true,
              trackingDeviceId: true,
              trackingStatus: true,
            },
            skip: getMapSkip(),
            take: getMapLimit(),
            orderBy: { timestamp: "desc" },
          }),
        ]);
      }
      // Generate pagination info using PaginationService
      const counts = {
        emissions: emissionsCount,
        fuels: fuelsCount,
        gps: gpsCount,
      };
      const pagination = PaginationService.processMultipleDatasets(counts, {
        page,
        limit,
      });
      // Calculate analytics based on the view requested
      let response = {
        success: true,
        timestamp: new Date(),
        pagination,
      };

      // Add specific data based on the view requested
      if (view === "summary") {
        // Calculate summary analytics
        const emissionsAnalytics =
          this.calculateEmissionAnalytics(emissionsData);
        const fuelAnalytics = this.calculateFuelAnalytics(fuelsData);
        const gpsAnalytics = this.calculateGPSAnalytics(gpsData);

        response.analytics = {
          emissions: emissionsAnalytics,
          fuel: fuelAnalytics,
          gps: gpsAnalytics,
        };

        // Include some sample data
        response.sampleData = {
          emissions: emissionsData.slice(0, 3),
          fuels: fuelsData.slice(0, 3),
          gps: gpsData.slice(0, 3),
        };
      } else if (view === "map") {
        // Process and return vehicle location data for mapping
        const vehicleLocations = this.processVehicleLocations(gpsData);

        response.mapData = {
          vehicles: vehicleLocations.vehicles,
          stats: {
            totalVehicles: vehicleLocations.totalVehicles,
            activeVehicles: vehicleLocations.activeVehicles,
            inactiveVehicles: vehicleLocations.inactiveVehicles,
          },
        };
      } else {
        // Detail view - return actual data
        response.data = {
          emissions: emissionsData,
          fuels: fuelsData,
          gps: gpsData,
        };
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in analyticHub:", error);
      return errorHandler(res, error);
    }
  };

  static getMapData = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // First, get the total number of vehicles in the system
      const totalVehicles = await prisma.vehicle.count({
        where: {
          deletedAt: null, // Only count active vehicles
        },
      });

      // Define date filtering if provided
      const whereClause = {};
      if (startDate && endDate) {
        whereClause.timestamp = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      // Get the latest GPS data for each vehicle using Prisma's $queryRawUnsafe
      // This uses DISTINCT ON which is PostgreSQL specific
      const latestGpsData = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT ON ("vehicleId") 
        "id", 
        "latitude", 
        "longitude", 
        "plateNumber", 
        "speed", 
        "accuracy", 
        "timestamp", 
        "vehicleId", 
        "trackingStatus",
        "trackingDeviceId"
      FROM "GPSData"
      ORDER BY "vehicleId", "timestamp" DESC
    `);

      // Return both the total vehicle count and the GPS data
      return res.status(200).json({
        success: true,
        totalVehicles,
        vehiclesWithGpsData: latestGpsData.length,
        mapData: latestGpsData.map((data) => ({
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          plateNumber: data.plateNumber,
          speed: data.speed,
          accuracy: data.accuracy,
          timestamp: data.timestamp,
          vehicleId: data.vehicleId,
          trackingStatus: data.trackingStatus,
          trackingDeviceId: data.trackingDeviceId,
        })),
      });
    } catch (error) {
      console.error("Error fetching vehicle map data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch vehicle map data",
        error: error.message,
      });
    }
  };

  /**
   * Process vehicle location data for mapping
   * @param {Array} gpsData - Array of GPS data points
   * @returns {Object} Object containing processed vehicle location data
  //  */
  static processVehicleLocations(gpsData) {
    const vehicleMap = new Map();
    let activeVehicles = 0;
    let inactiveVehicles = 0;

    gpsData.forEach((point) => {
      if (!vehicleMap.has(point.plateNumber)) {
        const isActive = point.trackingStatus;
        isActive ? activeVehicles++ : inactiveVehicles++;

        vehicleMap.set(point.plateNumber, {
          plateNumber: point.plateNumber,
          vehicleId: point.vehicleId,
          lastSeen: point.timestamp,
          position: {
            lat: point.latitude,
            lng: point.longitude,
          },
          speed: point.speed,
          isActive: point.trackingStatus,
          accuracy: point.accuracy || 0,
        });
      } else {
        const vehicle = vehicleMap.get(point.plateNumber);
        if (new Date(point.timestamp) > new Date(vehicle.lastSeen)) {
          vehicle.lastSeen = point.timestamp;
          vehicle.position = {
            lat: point.latitude,
            lng: point.longitude,
          };
          vehicle.speed = point.speed;
          vehicle.isActive = point.trackingStatus;
          vehicle.accuracy = point.accuracy || 0;
        }
      }
    });

    return {
      vehicles: Array.from(vehicleMap.values()),
      totalVehicles: vehicleMap.size,
      activeVehicles,
      inactiveVehicles,
    };
  }

  static calculateEmissionAnalytics = (emissions) => {
    if (!emissions.length) return null;

    const analytics = {
      co2: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      co: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      o2: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      hc: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      anomalies: 0,
    };

    // Calculate metrics
    emissions.forEach((emission) => {
      analytics.co2.average += emission.co2Percentage;
      analytics.co2.min = Math.min(analytics.co2.min, emission.co2Percentage);
      analytics.co2.max = Math.max(analytics.co2.max, emission.co2Percentage);

      analytics.co.average += emission.coPercentage;
      analytics.co.min = Math.min(analytics.co.min, emission.coPercentage);
      analytics.co.max = Math.max(analytics.co.max, emission.coPercentage);

      analytics.o2.average += emission.o2Percentage;
      analytics.o2.min = Math.min(analytics.o2.min, emission.o2Percentage);
      analytics.o2.max = Math.max(analytics.o2.max, emission.o2Percentage);

      analytics.hc.average += emission.hcPPM;
      analytics.hc.min = Math.min(analytics.hc.min, emission.hcPPM);
      analytics.hc.max = Math.max(analytics.hc.max, emission.hcPPM);

      // Check for anomalies (high CO2 or CO levels)
      if (emission.co2Percentage > 12 || emission.coPercentage > 2) {
        analytics.anomalies++;
      }
    });

    // Calculate averages
    analytics.co2.average /= emissions.length;
    analytics.co.average /= emissions.length;
    analytics.o2.average /= emissions.length;
    analytics.hc.average /= emissions.length;

    return analytics;
  };

  // Helper function to calculate fuel analytics
  static calculateFuelAnalytics = (fuels) => {
    if (!fuels.length) return null;

    const analytics = {
      consumption: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      level: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      lowFuelCount: 0,
      highConsumptionCount: 0,
    };

    // Calculate metrics
    fuels.forEach((fuel) => {
      // Consumption metrics
      analytics.consumption.average += fuel.fuelConsumption;
      analytics.consumption.min = Math.min(
        analytics.consumption.min,
        fuel.fuelConsumption
      );
      analytics.consumption.max = Math.max(
        analytics.consumption.max,
        fuel.fuelConsumption
      );

      // Level metrics
      analytics.level.average += fuel.fuelLevel;
      analytics.level.min = Math.min(analytics.level.min, fuel.fuelLevel);
      analytics.level.max = Math.max(analytics.level.max, fuel.fuelLevel);

      // check if vehicle has low fuel (less than 20%)
      if (fuel.fuelLevel < 20) {
        analytics.lowFuelCount++;
      }

      // Count high consumption instances
      if (fuel.fuelConsumption > 15) {
        analytics.highConsumptionCount++;
      }
    });

    // Calculate averages
    analytics.consumption.average /= fuels.length;
    analytics.level.average /= fuels.length;

    return analytics;
  };

  // Helper function to calculate GPS analytics
  static calculateGPSAnalytics = (gpsData) => {
    if (!gpsData.length) return null;

    const analytics = {
      speed: {
        average: 0,
        min: Infinity,
        max: 0,
      },
      activeVehicles: 0,
      movingVehicles: 0,
      stoppedVehicles: 0,
      highSpeedCount: 0,
    };

    // Track unique vehicles
    const uniqueVehicles = new Set();
    const movingVehicles = new Set();
    const stoppedVehicles = new Set();

    // Calculate metrics
    gpsData.forEach((gps) => {
      // Speed metrics
      analytics.speed.average += gps.speed;
      analytics.speed.min = Math.min(analytics.speed.min, gps.speed);
      analytics.speed.max = Math.max(analytics.speed.max, gps.speed);

      // Track unique vehicles
      uniqueVehicles.add(gps.plateNumber);

      // Check if vehicle is moving or stopped
      if (gps.speed > 3) {
        // More than 3 km/h is considered moving
        movingVehicles.add(gps.plateNumber);
      } else {
        stoppedVehicles.add(gps.plateNumber);
      }

      // Count high speed instances
      if (gps.speed > 100) {
        // Above 100 km/h
        analytics.highSpeedCount++;
      }
    });

    // Calculate averages and totals
    analytics.speed.average /= gpsData.length;
    analytics.activeVehicles = uniqueVehicles.size;
    analytics.movingVehicles = movingVehicles.size;
    analytics.stoppedVehicles = stoppedVehicles.size;

    return analytics;
  };
}
