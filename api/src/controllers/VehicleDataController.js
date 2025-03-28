import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler.js";
import { VehicleService } from "../services/vehiclesService/vehicleService.js";
import { getAllVehiclesController } from "./vehicleControllers/gettingvehiclesControllers.js";
import { TimeRangeService } from "../services/vehiclesService/timeRange.js";

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

      const result = await prisma.emissionData.findMany({
        where,
        orderBy: { timestamp: "asc" },
      });

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: result,
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

      const result = await prisma.fuelData.findMany({
        where,
        orderBy: { timestamp: "asc" },
      });

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: result,
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

      const result = await prisma.gPSData.findMany({
        where,
        orderBy: { timestamp: "asc" },
      });

      return res.status(200).json({
        success: true,
        timeRange: {
          start: parsedStartDate,
          end: parsedEndDate,
        },
        data: result,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };



  /**
   * Get all emission data for all vehicles (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getAllEmissionsData = async (req, res) => {
    try {
      const { periodType, periodValue } = req.query;
      // const userId = req.userId;

      // // Check if user has admin privileges
      // const isAdmin = await VehicleService.isUserAdmin(userId);
      // if (!isAdmin) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized: Admin privileges required",
      //   });
      // }

      // Get time range
      const { startDate, endDate } = TimeRangeService.getTimeRange(periodType, periodValue);

      const where = {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      };

      const result = await prisma.emissionData.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              vehicleModel: true,
              yearOfManufacture: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { timestamp: "asc" },
      });

      // Generate summary of data
      const summary = await vehicleDataController.generateEmissionsSummary(result);

      return res.status(200).json({
        success: true,
        timeRange: {
          periodType,
          periodValue,
          start: startDate,
          end: endDate,
        },
        summary,
        data: result,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get all fuel data for all vehicles (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getAllFuelsData = async (req, res) => {
    try {
      const { periodType, periodValue } = req.query;
 

      // Get time range
      const { startDate, endDate } = TimeRangeService.getTimeRange(periodType, periodValue);

      const where = {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      };

      const result = await prisma.fuelData.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              vehicleModel: true,
              yearOfManufacture: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: { timestamp: "asc" },
      });

      // Generate summary of data
      const summary = await vehicleDataController.generateFuelSummary(result);

      return res.status(200).json({
        success: true,
        timeRange: {
          periodType,
          periodValue,
          start: startDate,
          end: endDate,
        },
        summary,
        data: result,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get all GPS data for all vehicles (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getAllGPSData = async (req, res) => {
    try {
      const { periodType, periodValue } = req.query;

      // Get time range
      const { startDate, endDate } = TimeRangeService.getTimeRange(periodType, periodValue);

      const where = {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      };

      const result = await prisma.gPSData.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              vehicleModel: true,
              yearOfManufacture: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: { timestamp: "asc" },
      });

      // Generate summary of data
      const summary = await vehicleDataController.generateGPSSummary(result);

      return res.status(200).json({
        success: true,
        timeRange: {
          periodType,
          periodValue,
          start: startDate,
          end: endDate,
        },
        summary,
        data: result,
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get comprehensive vehicle data (emissions, fuel, GPS) for a specific user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getUserVehicleData = async (req, res) => {
    try {
      const { userId } = req.params;
      const { periodType, periodValue } = req.query;
      const requestingUserId = req.userId;

      // Check if user is requesting their own data or has admin privileges
      const isAdmin = await VehicleService.isUserAdmin(requestingUserId);
      if (parseInt(userId) !== requestingUserId && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only access your own data",
        });
      }

      // Get time range
      const { startDate, endDate } = TimeRangeService.getTimeRange(periodType, periodValue);

      // Get vehicles for the user
      const vehicles = await VehicleService.getVehiclesByUserId(parseInt(userId));
      const vehicleIds = vehicles.map(vehicle => vehicle.id);

      if (vehicleIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No vehicles found for this user",
          data: {
            emissions: [],
            fuels: [],
            gps: []
          },
          summary: {
            emissions: {},
            fuels: {},
            gps: {}
          }
        });
      }

      // Get data for all vehicles belonging to the user
      const [emissionsData, fuelsData, gpsData] = await Promise.all([
        prisma.emissionData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
              }
            }
          },
          orderBy: { timestamp: "asc" },
        }),
        prisma.fuelData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
              }
            }
          },
          orderBy: { timestamp: "asc" },
        }),
        prisma.gPSData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
              }
            }
          },
          orderBy: { timestamp: "asc" },
        })
      ]);

      // Generate summaries
      const emissionsSummary = await vehicleDataController.generateEmissionsSummary(emissionsData);
      const fuelSummary = await vehicleDataController.generateFuelSummary(fuelsData);
      const gpsSummary = await vehicleDataController.generateGPSSummary(gpsData);

      return res.status(200).json({
        success: true,
        timeRange: {
          periodType,
          periodValue,
          start: startDate,
          end: endDate,
        },
        data: {
          emissions: emissionsData,
          fuels: fuelsData,
          gps: gpsData
        },
        summary: {
          emissions: emissionsSummary,
          fuels: fuelSummary,
          gps: gpsSummary
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Get summarized data for all vehicles and all users (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getOverallSummary = async (req, res) => {
    try {
      const { periodType, periodValue } = req.query;
      const userId = req.userId;

      // Check if user has admin privileges
      const isAdmin = await VehicleService.isUserAdmin(userId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Admin privileges required",
        });
      }

      // Get time range
      const { startDate, endDate } = TimeRangeService.getTimeRange(periodType, periodValue);

      // Get all vehicles
      const vehicles = await getAllVehiclesController.getAllVehiclesService();
      const vehicleIds = vehicles.map(vehicle => vehicle.id);

      if (vehicleIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No vehicles found in the system",
          summary: {
            emissions: {},
            fuels: {},
            gps: {}
          }
        });
      }

      // Get data for all vehicles
      const [emissionsData, fuelsData, gpsData] = await Promise.all([
        prisma.emissionData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  }
                }
              }
            }
          },
        }),
        prisma.fuelData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  }
                }
              }
            }
          },
        }),
        prisma.gPSData.findMany({
          where: {
            vehicleId: { in: vehicleIds },
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  }
                }
              }
            }
          },
        })
      ]);

      // Generate detailed summaries
      const emissionsSummary = await vehicleDataController.generateEmissionsSummary(emissionsData);
      const fuelSummary = await vehicleDataController.generateFuelSummary(fuelsData);
      const gpsSummary = await vehicleDataController.generateGPSSummary(gpsData);

      // Generate user-based summaries
      const userEmissionsSummary = await vehicleDataController.generateUserBasedSummary(emissionsData, 'emissions');
      const userFuelSummary = await vehicleDataController.generateUserBasedSummary(fuelsData, 'fuel');
      const userGPSSummary = await vehicleDataController.generateUserBasedSummary(gpsData, 'gps');

      // Generate vehicle type summaries
      const vehicleTypeEmissionsSummary = await vehicleDataController.generateVehicleTypeSummary(emissionsData, 'emissions');
      const vehicleTypeFuelSummary = await vehicleDataController.generateVehicleTypeSummary(fuelsData, 'fuel');

      return res.status(200).json({
        success: true,
        timeRange: {
          periodType,
          periodValue,
          start: startDate,
          end: endDate,
        },
        summary: {
          emissions: emissionsSummary,
          fuels: fuelSummary,
          gps: gpsSummary,
          userBased: {
            emissions: userEmissionsSummary,
            fuels: userFuelSummary,
            gps: userGPSSummary
          },
          vehicleType: {
            emissions: vehicleTypeEmissionsSummary,
            fuels: vehicleTypeFuelSummary
          }
        }
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  };

  /**
   * Generate summary for emissions data
   * @param {Array} data - Emissions data array
   * @returns {Object} - Summary statistics
   */
  static generateEmissionsSummary = async (data) => {
    if (!data || data.length === 0) {
      return {
        totalRecords: 0,
        averageCO2: 0,
        averageNOx: 0,
        averagePM: 0,
        totalCO2: 0,
        totalNOx: 0,
        totalPM: 0,
        highestCO2: { value: 0, vehicle: null, timestamp: null },
        highestNOx: { value: 0, vehicle: null, timestamp: null },
        highestPM: { value: 0, vehicle: null, timestamp: null },
      };
    }

    // Initialize summary object
    let totalCO2 = 0;
    let totalNOx = 0;
    let totalPM = 0;
    let highestCO2 = { value: 0, vehicle: null, timestamp: null };
    let highestNOx = { value: 0, vehicle: null, timestamp: null };
    let highestPM = { value: 0, vehicle: null, timestamp: null };

    // Calculate totals and find highest values
    data.forEach(record => {
      // Add to totals
      totalCO2 += record.co2Level || 0;
      totalNOx += record.noxLevel || 0;
      totalPM += record.particulateMatter || 0;

      // Check for highest CO2
      if ((record.co2Level || 0) > highestCO2.value) {
        highestCO2 = {
          value: record.co2Level,
          vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})` : `Vehicle ID: ${record.vehicleId}`,
          timestamp: record.timestamp
        };
      }

      // Check for highest NOx
      if ((record.noxLevel || 0) > highestNOx.value) {
        highestNOx = {
          value: record.noxLevel,
          vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})` : `Vehicle ID: ${record.vehicleId}`,
          timestamp: record.timestamp
        };
      }

      // Check for highest PM
      if ((record.particulateMatter || 0) > highestPM.value) {
        highestPM = {
          value: record.particulateMatter,
          vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})` : `Vehicle ID: ${record.vehicleId}`,
          timestamp: record.timestamp
        };
      }
    });

    // Calculate averages
    const totalRecords = data.length;
    const averageCO2 = totalRecords > 0 ? totalCO2 / totalRecords : 0;
    const averageNOx = totalRecords > 0 ? totalNOx / totalRecords : 0;
    const averagePM = totalRecords > 0 ? totalPM / totalRecords : 0;

    return {
      totalRecords,
      averageCO2,
      averageNOx,
      averagePM,
      totalCO2,
      totalNOx,
      totalPM,
      highestCO2,
      highestNOx,
      highestPM,
    };
  };

  /**
   * Generate summary for fuel data
   * @param {Array} data - Fuel data array
   * @returns {Object} - Summary statistics
   */
  static generateFuelSummary = async (data) => {
    if (!data || data.length === 0) {
      return {
        totalRecords: 0,
        averageFuelLevel: 0,
        averageFuelConsumption: 0,
        totalFuelConsumed: 0,
        vehiclesWithLowFuel: [],
      };
    }

    // Initialize summary object
    let totalFuelLevel = 0;
    let totalFuelConsumption = 0;
    let lowFuelVehicles = {};

    // Calculate totals and find vehicles with low fuel
    data.forEach(record => {
      // Add to totals
      totalFuelLevel += record.fuelLevel || 0;
      totalFuelConsumption += record.fuelConsumption || 0;

      // Check for low fuel (below 20%)
      if ((record.fuelLevel || 0) < 20) {
        const vehicleId = record.vehicleId;
        if (!lowFuelVehicles[vehicleId] || record.timestamp > lowFuelVehicles[vehicleId].timestamp) {
          lowFuelVehicles[vehicleId] = {
            fuelLevel: record.fuelLevel,
            vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})` : `Vehicle ID: ${vehicleId}`,
            timestamp: record.timestamp,
            user: record.vehicle?.user ? `${record.vehicle.user.username} (${record.vehicle.user.email})` : 'Unknown',
          };
        }
      }
    });

    // Calculate averages
    const totalRecords = data.length;
    const averageFuelLevel = totalRecords > 0 ? totalFuelLevel / totalRecords : 0;
    const averageFuelConsumption = totalRecords > 0 ? totalFuelConsumption / totalRecords : 0;

    return {
      totalRecords,
      averageFuelLevel,
      averageFuelConsumption,
      totalFuelConsumed: totalFuelConsumption,
      vehiclesWithLowFuel: Object.values(lowFuelVehicles),
    };
  };

  /**
   * Generate summary for GPS data
   * @param {Array} data - GPS data array
   * @returns {Object} - Summary statistics
   */
  static generateGPSSummary = async (data) => {
    if (!data || data.length === 0) {
      return {
        totalRecords: 0,
        averageSpeed: 0,
        maxSpeed: { value: 0, vehicle: null, timestamp: null },
        distanceCovered: 0,
        frequentLocations: [],
      };
    }

    // Initialize summary object
    let totalSpeed = 0;
    let maxSpeed = { value: 0, vehicle: null, timestamp: null };
    let distanceCovered = 0;
    let locationCount = {};

    // Group data by vehicle for distance calculation
    const vehicleData = {};

    data.forEach(record => {
      const vehicleId = record.vehicleId;
      if (!vehicleData[vehicleId]) {
        vehicleData[vehicleId] = [];
      }
      vehicleData[vehicleId].push(record);

      // Add to totals
      totalSpeed += record.speed || 0;

      // Check for max speed
      if ((record.speed || 0) > maxSpeed.value) {
        maxSpeed = {
          value: record.speed,
          vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})` : `Vehicle ID: ${vehicleId}`,
          timestamp: record.timestamp,
          location: `${record.latitude}, ${record.longitude}`
        };
      }

      // Count location occurrences (rounded to 3 decimal places for proximity)
      const locationKey = `${parseFloat(record.latitude).toFixed(3)},${parseFloat(record.longitude).toFixed(3)}`;
      if (!locationCount[locationKey]) {
        locationCount[locationKey] = {
          count: 0,
          location: { latitude: record.latitude, longitude: record.longitude },
          vehicles: new Set()
        };
      }
      locationCount[locationKey].count += 1;
      locationCount[locationKey].vehicles.add(vehicleId);
    });

    // Calculate total distance for each vehicle and sum up
    Object.values(vehicleData).forEach(vehicleRecords => {
      // Sort by timestamp
      vehicleRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Calculate distance between consecutive points
      for (let i = 1; i < vehicleRecords.length; i++) {
        const prev = vehicleRecords[i - 1];
        const curr = vehicleRecords[i];
        
        // distanceCovered += vehicleDataController.calculateDistance(
        //   prev.latitude, prev.longitude,
        //   curr.latitude, curr.longitude
        // );
      }
    });
        // Find frequent locations (more than 5 occurrences)
    const frequentLocations = Object.values(locationCount)
      .filter(loc => loc.count > 5)
      .map(loc => ({
        location: loc.location,
        visits: loc.count,
        uniqueVehicles: loc.vehicles.size
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10); // Get top 10 locations

    // Calculate averages
    const totalRecords = data.length;
    const averageSpeed = totalRecords > 0 ? totalSpeed / totalRecords : 0;

    return {
      totalRecords,
      averageSpeed,
      maxSpeed,
      // distanceCovered,
      frequentLocations
    };
  }
}
