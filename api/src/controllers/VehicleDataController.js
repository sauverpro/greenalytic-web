import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler.js";
import { VehicleService } from "../services/vehiclesService/vehicleService.js";
import { PaginationService } from "../services/paginationService.js";

const prisma = new PrismaClient();

export class vehicleDataController {

  static getVehiclesByLoggedUser = async (req, res) => {
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


  static getMapData = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const totalVehicles = await prisma.vehicle.count({
        where: {
          deletedAt: null, 
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

static getDashboardCounts = async (req, res) => {
  try {
    const { timeFilter } = req.query; // 'today', 'week', 'month', 'quarter', 'year', or undefined for all
    
    const dateFilter = {};
    if (timeFilter) {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeFilter) {
        case 'today':  
          startDate.setHours(0, 0, 0, 0); //day
          break;
        case 'week':
          startDate.setDate(now.getDate() - now.getDay()); 
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate.setDate(1); 
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'quarter':
          const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
          startDate.setMonth(quarterMonth, 1); 
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'year':
          startDate.setMonth(0, 1); //current year
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          //  all data
          break;
      }
      
      if (timeFilter !== 'all') {
        dateFilter.timestamp = {
          gte: startDate,
          lte: now
        };
      }
    }

   
    const [
      usersCount,
      vehiclesCount,
      devicesCount,
      gpsDataCount,
      fuelDataCount,
      emissionDataCount
    ] = await Promise.all([
    
      prisma.user.count({
        where: {
          deletedAt: null 
        }
      }),
      
     
      prisma.vehicle.count({
        where: {
          deletedAt: null 
        }
      }),
      
      
      prisma.trackingDevice.count({
        where: {
          deletedAt: null 
        }
      }),
      
      
      prisma.gPSData.count({
        where: dateFilter
      }),
      
      
      prisma.fuelData.count({
        where: dateFilter
      }),
      
     
      prisma.emissionData.count({
        where: dateFilter
      })
    ]);

    const gpsAnalytics = await this.calculateGPSAnalytics(dateFilter);
    
    const fuelAnalytics = await this.calculateFuelAnalytics(dateFilter);
    
    const emissionAnalytics = await this.calculateEmissionAnalytics(dateFilter);

    res.status(200).json({
      success: true,
      timestamp: new Date(),
      counts: {
        users: usersCount,
        vehicles: vehiclesCount,
        devices: devicesCount,
        gpsData: gpsDataCount,
        fuelData: fuelDataCount,
        emissionData: emissionDataCount
      },
      analytics: {
        gps: gpsAnalytics,
        fuel: fuelAnalytics,
        emissions: emissionAnalytics
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
      error: error.message
    });
  }
};

static calculateGPSAnalytics = async (dateFilter) => {
  // Get the most recent GPS data points for analysis
  const gpsData = await prisma.gPSData.findMany({
    where: dateFilter,
    orderBy: {
      timestamp: "desc"
    },
    take: 1000 // Limit for performance
  });

  if (!gpsData.length) return null;

  // Track unique vehicles
  const uniqueVehicles = new Set();
  const movingVehicles = new Set();
  const stoppedVehicles = new Set();
  
  let totalSpeed = 0;
  let minSpeed = Infinity;
  let maxSpeed = 0;
  let highSpeedCount = 0;

  // Calculate metrics
  gpsData.forEach((gps) => {
    // Speed metrics
    totalSpeed += gps.speed;
    minSpeed = Math.min(minSpeed, gps.speed);
    maxSpeed = Math.max(maxSpeed, gps.speed);

    uniqueVehicles.add(gps.plateNumber);

    if (gps.speed > 3) {
      movingVehicles.add(gps.plateNumber);
    } else {
      stoppedVehicles.add(gps.plateNumber);
    }

    if (gps.speed > 100) {
      highSpeedCount++;
    }
  });

  return {
    speed: {
      average: totalSpeed / gpsData.length,
      min: minSpeed === Infinity ? 0 : minSpeed,
      max: maxSpeed
    },
    activeVehicles: uniqueVehicles.size,
    movingVehicles: movingVehicles.size,
    stoppedVehicles: stoppedVehicles.size,
    highSpeedCount
  };
};

static calculateFuelAnalytics = async (dateFilter) => {
  const fuels = await prisma.fuelData.findMany({
    where: dateFilter,
    orderBy: {
      timestamp: "desc"
    },
    take: 1000 // Limit for performance
  });

  if (!fuels.length) return null;

  let totalConsumption = 0;
  let minConsumption = Infinity;
  let maxConsumption = 0;
  
  let totalLevel = 0;
  let minLevel = Infinity;
  let maxLevel = 0;

  let lowFuelCount = 0;
  let highConsumptionCount = 0;

  fuels.forEach((fuel) => {
    totalConsumption += fuel.fuelConsumption;
    minConsumption = Math.min(minConsumption, fuel.fuelConsumption);
    maxConsumption = Math.max(maxConsumption, fuel.fuelConsumption);

    totalLevel += fuel.fuelLevel;
    minLevel = Math.min(minLevel, fuel.fuelLevel);
    maxLevel = Math.max(maxLevel, fuel.fuelLevel);

    if (fuel.fuelLevel < 20) {
      lowFuelCount++;
    }

    if (fuel.fuelConsumption > 15) {
      highConsumptionCount++;
    }
  });

  return {
    consumption: {
      average: totalConsumption / fuels.length,
      min: minConsumption === Infinity ? 0 : minConsumption,
      max: maxConsumption
    },
    level: {
      average: totalLevel / fuels.length,
      min: minLevel === Infinity ? 0 : minLevel,
      max: maxLevel
    },
    lowFuelCount,
    highConsumptionCount
  };
};

static calculateEmissionAnalytics = async (dateFilter) => {
  const emissions = await prisma.emissionData.findMany({
    where: dateFilter,
    orderBy: {
      timestamp: "desc"
    },
    take: 1000 // Limit for performance
  });

  if (!emissions.length) return null;

  let totalCO2 = 0;
  let minCO2 = Infinity;
  let maxCO2 = 0;
  
  let totalCO = 0;
  let minCO = Infinity;
  let maxCO = 0;
  
  let totalO2 = 0;
  let minO2 = Infinity;
  let maxO2 = 0;
  
  let totalHC = 0;
  let minHC = Infinity;
  let maxHC = 0;
  
  let anomalies = 0;

  // Calculate metrics
  emissions.forEach((emission) => {
    totalCO2 += emission.co2Percentage;
    minCO2 = Math.min(minCO2, emission.co2Percentage);
    maxCO2 = Math.max(maxCO2, emission.co2Percentage);

    totalCO += emission.coPercentage;
    minCO = Math.min(minCO, emission.coPercentage);
    maxCO = Math.max(maxCO, emission.coPercentage);

    totalO2 += emission.o2Percentage;
    minO2 = Math.min(minO2, emission.o2Percentage);
    maxO2 = Math.max(maxO2, emission.o2Percentage);

    totalHC += emission.hcPPM;
    minHC = Math.min(minHC, emission.hcPPM);
    maxHC = Math.max(maxHC, emission.hcPPM);

    if (emission.co2Percentage > 12 || emission.coPercentage > 2) {
      anomalies++;
    }
  });

  return {
    co2: {
      average: totalCO2 / emissions.length,
      min: minCO2 === Infinity ? 0 : minCO2,
      max: maxCO2
    },
    co: {
      average: totalCO / emissions.length,
      min: minCO === Infinity ? 0 : minCO,
      max: maxCO
    },
    o2: {
      average: totalO2 / emissions.length,
      min: minO2 === Infinity ? 0 : minO2,
      max: maxO2
    },
    hc: {
      average: totalHC / emissions.length,
      min: minHC === Infinity ? 0 : minHC,
      max: maxHC
    },
    anomalies
  };
};
  
}
