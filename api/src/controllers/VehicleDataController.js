import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler.js";
import { VehicleService } from "../services/vehiclesService/vehicleService.js";

const prisma = new PrismaClient();

// Emission thresholds - to be confirmed with Emmanuel
const EMISSION_THRESHOLDS = {
  co2: { warning: 0.5, critical: 1.0 },
  co: { warning: 0.3, critical: 0.5 },
  hc: { warning: 200, critical: 400 },
  nox: { warning: 100, critical: 200 },
  pm25: { warning: 25, critical: 50 },
};

export class vehicleDataController {

  static getVehiclesByLoggedUser = async (req, res) => {
    try {
      const userId = req.userId;
      const { status, vehicleType, fuelType, emissionStatus } = req.query;
      const pagination = req.pagination;

      // Build filters
      const filters = {};

      // Validate and add status filter
      if (status) {
        const validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
          });
        }
        filters.status = status;
      }

      // Validate and add vehicle type filter
      if (vehicleType) {
        const validVehicleTypes = ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'];
        if (!validVehicleTypes.includes(vehicleType)) {
          return res.status(400).json({
            success: false,
            message: `Invalid vehicle type. Must be one of: ${validVehicleTypes.join(', ')}`
          });
        }
        filters.vehicleType = vehicleType;
      }

      // Validate and add fuel type filter
      if (fuelType) {
        const validFuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
        if (!validFuelTypes.includes(fuelType)) {
          return res.status(400).json({
            success: false,
            message: `Invalid fuel type. Must be one of: ${validFuelTypes.join(', ')}`
          });
        }
        filters.fuelType = fuelType;
      }

      // Validate and add emission status filter
      if (emissionStatus) {
        const validEmissionStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING'];
        if (!validEmissionStatuses.includes(emissionStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid emission status. Must be one of: ${validEmissionStatuses.join(', ')}`
          });
        }
        filters.emissionStatus = emissionStatus;
      }

      const result = await VehicleService.getVehiclesByUserId(userId, pagination, filters);

      return res.status(200).json({
        success: true,
        message: "User vehicles retrieved successfully",
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  static getEmissionsDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate, emissionLevel } = req.query;
      const userId = req.userId;
      const pagination = req.pagination;

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      if (isNaN(parsedVehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID"
        });
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      
      // Validate dates
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use ISO 8601 format"
        });
      }

      // Maximize the end date to include the full day
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs = await VehicleService.vehicleExistsAndBelongsToUser(
        parsedVehicleId,
        userId
      );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const whereClause = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      // Add emission level filtering
      if (emissionLevel) {
        if (emissionLevel === 'HIGH') {
          whereClause.OR = [
            { co2Percentage: { gte: EMISSION_THRESHOLDS.co2.warning } },
            { coPercentage: { gte: EMISSION_THRESHOLDS.co.warning } },
            { hcPPM: { gte: EMISSION_THRESHOLDS.hc.warning } },
            { noxPPM: { gte: EMISSION_THRESHOLDS.nox.warning } },
            { pm25Level: { gte: EMISSION_THRESHOLDS.pm25.warning } }
          ];
        } else if (emissionLevel === 'CRITICAL') {
          whereClause.OR = [
            { co2Percentage: { gte: EMISSION_THRESHOLDS.co2.critical } },
            { coPercentage: { gte: EMISSION_THRESHOLDS.co.critical } },
            { hcPPM: { gte: EMISSION_THRESHOLDS.hc.critical } },
            { noxPPM: { gte: EMISSION_THRESHOLDS.nox.critical } },
            { pm25Level: { gte: EMISSION_THRESHOLDS.pm25.critical } }
          ];
        }
      }

      const [totalItems, result] = await Promise.all([
        prisma.emissionData.count({ where: whereClause }),
        prisma.emissionData.findMany({
          where: whereClause,
          orderBy: { timestamp: "asc" },
          skip: pagination.skip,
          take: pagination.take,
          include: {
            vehicle: {
              select: {
                plateNumber: true,
                vehicleModel: true,
                status: true
              }
            },
            trackingDevice: {
              select: {
                serialNumber: true,
                model: true,
                deviceCategory: true
              }
            }
          }
        })
      ]);

      // Enhance data with emission level classification
      const enhancedData = result.map(data => {
        const isCritical = 
          data.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
          data.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
          data.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
          (data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
          (data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.critical);

        const isHigh = 
          data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
          data.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
          data.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
          (data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
          (data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning);

        let emissionLevel = 'NORMAL';
        if (isCritical) emissionLevel = 'CRITICAL';
        else if (isHigh) emissionLevel = 'HIGH';

        return {
          ...data,
          emissionLevel,
          exceedsThresholds: {
            co2: data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning,
            co: data.coPercentage >= EMISSION_THRESHOLDS.co.warning,
            hc: data.hcPPM >= EMISSION_THRESHOLDS.hc.warning,
            nox: data.noxPPM ? data.noxPPM >= EMISSION_THRESHOLDS.nox.warning : false,
            pm25: data.pm25Level ? data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning : false,
          }
        };
      });

      return res.status(200).json({
        success: true,
        message: "Emission data retrieved successfully",
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: enhancedData,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          totalCount: totalItems,
          totalPages: Math.ceil(totalItems / pagination.limit),
          filters: {
            applied: { emissionLevel },
            thresholds: EMISSION_THRESHOLDS
          }
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  static getFuelsDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate, fuelLevel, consumptionLevel } = req.query;
      const userId = req.userId;
      const pagination = req.pagination;

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      if (isNaN(parsedVehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID"
        });
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      
      // Validate dates
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use ISO 8601 format"
        });
      }

      // Maximize the end date to include the full day
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs = await VehicleService.vehicleExistsAndBelongsToUser(
        parsedVehicleId,
        userId
      );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const whereClause = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      // Add fuel level filtering
      if (fuelLevel === 'LOW') {
        whereClause.fuelLevel = { lt: 20 };
      } else if (fuelLevel === 'HIGH') {
        whereClause.fuelLevel = { gte: 80 };
      }

      // Add consumption level filtering
      if (consumptionLevel === 'HIGH') {
        whereClause.fuelConsumption = { gte: 15 };
      } else if (consumptionLevel === 'LOW') {
        whereClause.fuelConsumption = { lt: 5 };
      }

      const [totalItems, result] = await Promise.all([
        prisma.fuelData.count({ where: whereClause }),
        prisma.fuelData.findMany({
          where: whereClause,
          orderBy: { timestamp: "asc" },
          skip: pagination.skip,
          take: pagination.take,
          include: {
            vehicle: {
              select: {
                plateNumber: true,
                vehicleModel: true,
                fuelType: true
              }
            },
            trackingDevice: {
              select: {
                serialNumber: true,
                model: true
              }
            }
          }
        })
      ]);

      return res.status(200).json({
        success: true,
        message: "Fuel data retrieved successfully",
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: result,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          totalCount: totalItems,
          totalPages: Math.ceil(totalItems / pagination.limit),
          filters: {
            applied: { fuelLevel, consumptionLevel }
          }
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  static getGPSDataByTimeRange = async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate, speedRange, trackingStatus } = req.query;
      const userId = req.userId;
      const pagination = req.pagination;

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Vehicle ID, start date, and end date are required",
        });
      }

      const parsedVehicleId = parseInt(vehicleId);
      if (isNaN(parsedVehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID"
        });
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      
      // Validate dates
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use ISO 8601 format"
        });
      }

      // Maximize the end date to include the full day
      parsedEndDate.setHours(23, 59, 59, 999);

      const vehicleExistsAndBelongs = await VehicleService.vehicleExistsAndBelongsToUser(
        parsedVehicleId,
        userId
      );
      if (!vehicleExistsAndBelongs) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or does not belong to the user",
        });
      }

      const whereClause = {
        vehicleId: parsedVehicleId,
        timestamp: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      };

      // Add speed range filtering
      if (speedRange === 'STATIONARY') {
        whereClause.speed = { lte: 3 };
      } else if (speedRange === 'MOVING') {
        whereClause.speed = { gt: 3 };
      } else if (speedRange === 'HIGH_SPEED') {
        whereClause.speed = { gte: 100 };
      }

      // Add tracking status filtering
      if (trackingStatus) {
        const validStatuses = ['ACTIVE', 'INACTIVE', 'LOST_SIGNAL'];
        if (!validStatuses.includes(trackingStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid tracking status. Must be one of: ${validStatuses.join(', ')}`
          });
        }
        whereClause.trackingStatus = trackingStatus;
      }

      const [totalItems, result] = await Promise.all([
        prisma.gPSData.count({ where: whereClause }),
        prisma.gPSData.findMany({
          where: whereClause,
          orderBy: { timestamp: "asc" },
          skip: pagination.skip,
          take: pagination.take,
          include: {
            vehicle: {
              select: {
                plateNumber: true,
                vehicleModel: true
              }
            },
            trackingDevice: {
              select: {
                serialNumber: true,
                model: true
              }
            }
          }
        })
      ]);

      return res.status(200).json({
        success: true,
        message: "GPS data retrieved successfully",
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: result,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          totalCount: totalItems,
          totalPages: Math.ceil(totalItems / pagination.limit),
          filters: {
            applied: { speedRange, trackingStatus }
          }
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  static getMapData = async (req, res) => {
    try {
      const { startDate, endDate, vehicleStatus, emissionStatus } = req.query;

      // Build vehicle filter
      const vehicleWhereClause = {
        deletedAt: null
      };

      if (vehicleStatus) {
        const validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'];
        if (!validStatuses.includes(vehicleStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid vehicle status. Must be one of: ${validStatuses.join(', ')}`
          });
        }
        vehicleWhereClause.status = vehicleStatus;
      }

      const totalVehicles = await prisma.vehicle.count({
        where: vehicleWhereClause,
      });

      // Get the latest GPS data using proper Prisma query instead of raw SQL
      const latestGpsData = await prisma.gPSData.findMany({
        distinct: ['vehicleId'],
        orderBy: {
          timestamp: 'desc'
        },
        include: {
          vehicle: {
            select: {
              plateNumber: true,
              status: true,
              vehicleType: true,
              fuelType: true
            }
          },
          trackingDevice: {
            select: {
              serialNumber: true,
              deviceCategory: true,
              status: true
            }
          }
        }
      });

      // Filter by emission status if provided
      let filteredGpsData = latestGpsData;
      if (emissionStatus) {
        filteredGpsData = latestGpsData.filter(gps => 
          gps.vehicle && gps.vehicle.status === emissionStatus
        );
      }

      return res.status(200).json({
        success: true,
        message: "Map data retrieved successfully",
        totalVehicles,
        vehiclesWithGpsData: filteredGpsData.length,
        mapData: filteredGpsData.map((data) => ({
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
          vehicle: data.vehicle,
          trackingDevice: data.trackingDevice
        })),
        filters: {
          applied: { vehicleStatus, emissionStatus }
        }
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
      const { timeFilter } = req.query;
      
      // Validate time filter
      const validTimeFilters = ['today', 'week', 'month', 'quarter', 'year', 'all'];
      if (timeFilter && !validTimeFilters.includes(timeFilter)) {
        return res.status(400).json({
          success: false,
          message: `Invalid time filter. Must be one of: ${validTimeFilters.join(', ')}`
        });
      }
      
      const dateFilter = {};
      if (timeFilter && timeFilter !== 'all') {
        const now = new Date();
        const startDate = new Date();
        
        switch (timeFilter) {
          case 'today':  
            startDate.setHours(0, 0, 0, 0);
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
            startDate.setMonth(0, 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        }
        
        dateFilter.timestamp = {
          gte: startDate,
          lte: now
        };
      }

      const [
        usersCount,
        vehiclesCount,
        devicesCount,
        gpsDataCount,
        fuelDataCount,
        emissionDataCount,
        vehiclesByStatus,
        alertsCount
      ] = await Promise.all([
        prisma.user.count({
          where: { deletedAt: null }
        }),
        prisma.vehicle.count({
          where: { deletedAt: null }
        }),
        prisma.trackingDevice.count({
          where: { deletedAt: null }
        }),
        prisma.gPSData.count({
          where: dateFilter
        }),
        prisma.fuelData.count({
          where: dateFilter
        }),
        prisma.emissionData.count({
          where: dateFilter
        }),
        // Enhanced vehicle status breakdown
        prisma.vehicle.groupBy({
          by: ['status'],
          _count: { status: true },
          where: { deletedAt: null }
        }),
        // Count recent alerts
        prisma.alert.count({
          where: {
            ...dateFilter,
            acknowledged: false
          }
        })
      ]);

      const gpsAnalytics = await this.calculateGPSAnalytics(dateFilter);
      const fuelAnalytics = await this.calculateFuelAnalytics(dateFilter);
      const emissionAnalytics = await this.calculateEmissionAnalytics(dateFilter);

      res.status(200).json({
        success: true,
        message: "Dashboard data retrieved successfully",
        timestamp: new Date(),
        timeFilter: timeFilter || 'all',
        counts: {
          users: usersCount,
          vehicles: vehiclesCount,
          devices: devicesCount,
          gpsData: gpsDataCount,
          fuelData: fuelDataCount,
          emissionData: emissionDataCount,
          unacknowledgedAlerts: alertsCount
        },
        vehicleBreakdown: vehiclesByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        }, {}),
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
    const gpsData = await prisma.gPSData.findMany({
      where: dateFilter,
      orderBy: { timestamp: "desc" },
      take: 1000,
      include: {
        vehicle: {
          select: { plateNumber: true }
        }
      }
    });

    if (!gpsData.length) return null;

    const uniqueVehicles = new Set();
    const movingVehicles = new Set();
    const stoppedVehicles = new Set();
    
    let totalSpeed = 0;
    let minSpeed = Infinity;
    let maxSpeed = 0;
    let highSpeedCount = 0;

    gpsData.forEach((gps) => {
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
        average: parseFloat((totalSpeed / gpsData.length).toFixed(2)),
        min: minSpeed === Infinity ? 0 : minSpeed,
        max: maxSpeed
      },
      activeVehicles: uniqueVehicles.size,
      movingVehicles: movingVehicles.size,
      stoppedVehicles: stoppedVehicles.size,
      highSpeedCount,
      totalDataPoints: gpsData.length
    };
  };

  static calculateFuelAnalytics = async (dateFilter) => {
    const fuels = await prisma.fuelData.findMany({
      where: dateFilter,
      orderBy: { timestamp: "desc" },
      take: 1000
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
        average: parseFloat((totalConsumption / fuels.length).toFixed(2)),
        min: minConsumption === Infinity ? 0 : minConsumption,
        max: maxConsumption
      },
      level: {
        average: parseFloat((totalLevel / fuels.length).toFixed(2)),
        min: minLevel === Infinity ? 0 : minLevel,
        max: maxLevel
      },
      lowFuelCount,
      highConsumptionCount,
      totalDataPoints: fuels.length
    };
  };

  static calculateEmissionAnalytics = async (dateFilter) => {
    const emissions = await prisma.emissionData.findMany({
      where: dateFilter,
      orderBy: { timestamp: "desc" },
      take: 1000
    });

    if (!emissions.length) return null;

    let totalCO2 = 0, minCO2 = Infinity, maxCO2 = 0;
    let totalCO = 0, minCO = Infinity, maxCO = 0;
    let totalO2 = 0, minO2 = Infinity, maxO2 = 0;
    let totalHC = 0, minHC = Infinity, maxHC = 0;
    let totalNOx = 0, minNOx = Infinity, maxNOx = 0, noxCount = 0;
    let totalPM25 = 0, minPM25 = Infinity, maxPM25 = 0, pm25Count = 0;
    
    let warningLevelCount = 0;
    let criticalLevelCount = 0;

    emissions.forEach((emission) => {
      // CO2 analytics
      totalCO2 += emission.co2Percentage;
      minCO2 = Math.min(minCO2, emission.co2Percentage);
      maxCO2 = Math.max(maxCO2, emission.co2Percentage);

      // CO analytics
      totalCO += emission.coPercentage;
      minCO = Math.min(minCO, emission.coPercentage);
      maxCO = Math.max(maxCO, emission.coPercentage);

      // O2 analytics
      totalO2 += emission.o2Percentage;
      minO2 = Math.min(minO2, emission.o2Percentage);
      maxO2 = Math.max(maxO2, emission.o2Percentage);

      // HC analytics
      totalHC += emission.hcPPM;
      minHC = Math.min(minHC, emission.hcPPM);
      maxHC = Math.max(maxHC, emission.hcPPM);

      // NOx analytics (enhanced field)
      if (emission.noxPPM !== null && emission.noxPPM !== undefined) {
        totalNOx += emission.noxPPM;
        minNOx = Math.min(minNOx, emission.noxPPM);
        maxNOx = Math.max(maxNOx, emission.noxPPM);
        noxCount++;
      }

      // PM2.5 analytics (enhanced field)
      if (emission.pm25Level !== null && emission.pm25Level !== undefined) {
        totalPM25 += emission.pm25Level;
        minPM25 = Math.min(minPM25, emission.pm25Level);
        maxPM25 = Math.max(maxPM25, emission.pm25Level);
        pm25Count++;
      }

      // Enhanced threshold checking using document thresholds
      const isWarningLevel = 
        emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
        emission.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
        emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
        (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
        (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning);

      const isCriticalLevel = 
        emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
        emission.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
        emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
        (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
        (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical);

      if (isCriticalLevel) {
        criticalLevelCount++;
      } else if (isWarningLevel) {
        warningLevelCount++;
      }
    });

    return {
      co2: {
        average: parseFloat((totalCO2 / emissions.length).toFixed(2)),
        min: minCO2 === Infinity ? 0 : minCO2,
        max: maxCO2
      },
      co: {
        average: parseFloat((totalCO / emissions.length).toFixed(2)),
        min: minCO === Infinity ? 0 : minCO,
        max: maxCO
      },
      o2: {
        average: parseFloat((totalO2 / emissions.length).toFixed(2)),
        min: minO2 === Infinity ? 0 : minO2,
        max: maxO2
      },
      hc: {
        average: parseFloat((totalHC / emissions.length).toFixed(2)),
        min: minHC === Infinity ? 0 : minHC,
        max: maxHC
      },
      nox: noxCount > 0 ? {
        average: parseFloat((totalNOx / noxCount).toFixed(2)),
        min: minNOx === Infinity ? 0 : minNOx,
        max: maxNOx,
        dataPoints: noxCount
      } : null,
      pm25: pm25Count > 0 ? {
        average: parseFloat((totalPM25 / pm25Count).toFixed(2)),
        min: minPM25 === Infinity ? 0 : minPM25,
        max: maxPM25,
        dataPoints: pm25Count
      } : null,
      thresholdAnalysis: {
        warningLevel: warningLevelCount,
        criticalLevel: criticalLevelCount,
        normalLevel: emissions.length - warningLevelCount - criticalLevelCount,
        thresholds: EMISSION_THRESHOLDS
      },
      totalDataPoints: emissions.length
    };
  };
}