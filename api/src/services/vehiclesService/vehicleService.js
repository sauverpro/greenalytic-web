import { PrismaClient } from "@prisma/client";
import { AppError } from "../../middlewares/globaleerorshandling.js";

const prisma = new PrismaClient();

export class VehicleService {
  /**
   * Check if a vehicle exists and belongs to the user
   * @param {number} vehicleId - The ID of the vehicle to check
   * @param {number} userId - The ID of the user making the request
   * @returns {Promise<boolean>} - True if the vehicle exists and belongs to the user, false otherwise
   */
  static async vehicleExistsAndBelongsToUser(vehicleId, userId) {
    try {
      const vehicle = await prisma.vehicle.findFirst({
        where: { 
          id: vehicleId, 
          userId: userId,
          deletedAt: null // Check for soft deletion
        },
      });
      return !!vehicle;
    } catch (error) {
      console.error('Error checking vehicle ownership:', error);
      throw new AppError('Failed to verify vehicle ownership', 500);
    }
  }

  /**
   * Get all vehicles belonging to a user with enhanced filtering and pagination
   * @param {number} userId - The ID of the user
   * @param {Object} pagination - Pagination parameters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} - Paginated list of vehicles with metadata
   */
  static async getVehiclesByUserId(userId, pagination = {}, filters = {}) {
    try {
      // Build where clause
      const whereClause = {
        userId: userId,
        deletedAt: null
      };

      // Apply filters
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.vehicleType) {
        whereClause.vehicleType = filters.vehicleType;
      }

      if (filters.fuelType) {
        whereClause.fuelType = filters.fuelType;
      }

      if (filters.emissionStatus) {
        whereClause.emissionStatus = filters.emissionStatus;
      }

      // Search functionality
      if (filters.search) {
        whereClause.OR = [
          { plateNumber: { contains: filters.search, mode: 'insensitive' } },
          { vehicleModel: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      // Get total count for pagination
      const totalCount = await prisma.vehicle.count({ where: whereClause });

      // Get vehicles with pagination
      const vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        skip: pagination.skip || 0,
        take: pagination.take || 10,
        orderBy: { createdAt: 'desc' },
        include: {
          trackingDevices: {
            where: { deletedAt: null },
            select: {
              id: true,
              serialNumber: true,
              model: true,
              status: true,
              batteryLevel: true,
              signalStrength: true
            }
          },
          _count: {
            select: {
              // emissionData: true,
              fuelData: true,
              gpsData: true,
              alerts: true
            }
          }
        }
      });

      // Build pagination metadata
      const meta = pagination.buildMeta ? pagination.buildMeta(totalCount) : {
        pagination: {
          currentPage: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
          totalPages: Math.ceil(totalCount / (pagination.take || 10)),
          totalCount,
          limit: pagination.take || 10
        }
      };

      return {
        data: vehicles,
        meta
      };
    } catch (error) {
      console.error('Error fetching vehicles by user ID:', error);
      throw new AppError('Failed to fetch user vehicles', 500);
    }
  }

  /**
   * Get a single vehicle by ID with full details
   * @param {number} vehicleId - The ID of the vehicle
   * @param {number} userId - The ID of the user (for ownership validation)
   * @returns {Promise<Object|null>} - Vehicle with full details or null
   */
  static async getVehicleById(vehicleId, userId = null) {
    try {
      const whereClause = {
        id: vehicleId,
        deletedAt: null
      };

      // Add user filter if provided (for ownership validation)
      if (userId) {
        whereClause.userId = userId;
      }

      const vehicle = await prisma.vehicle.findFirst({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              
              phoneNumber: true
            }
          },
          trackingDevices: {
            where: { deletedAt: null },
            include: {
              gpsData: {
                orderBy: { timestamp: 'desc' },
                take: 1 // Latest GPS data
              }
            }
          },
          // emissionData: {
          //   orderBy: { timestamp: 'desc' },
          //   take: 5 // Latest 5 emission readings
          // },
          fuelData: {
            orderBy: { timestamp: 'desc' },
            take: 5 // Latest 5 fuel readings
          },
          alerts: {
            where: { isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 10 // Latest unacknowledged alerts
          },
          _count: {
            select: {
              // emissionData: true,
              fuelData: true,
              gpsData: true,
              alerts: true
            }
          }
        }
      });

      return vehicle;
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      throw new AppError('Failed to fetch vehicle details', 500);
    }
  }

  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data to create
   * @param {number} userId - The ID of the user creating the vehicle
   * @returns {Promise<Object>} - Created vehicle
   */
  static async createVehicle(vehicleData, userId) {
    try {
      // Check for duplicate plate number
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          plateNumber: vehicleData.plateNumber,
          deletedAt: null
        }
      });

      if (existingVehicle) {
        throw new AppError('A vehicle with this plate number already exists', 400);
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          ...vehicleData,
          userId: userId,
          status: vehicleData.status || 'NORMAL_EMISSION',
          emissionStatus: vehicleData.emissionStatus || 'NORMAL'
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true
            }
          }
        }
      });

      return vehicle;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error creating vehicle:', error);
      throw new AppError('Failed to create vehicle', 500);
    }
  }

  /**
   * Update a vehicle
   * @param {number} vehicleId - The ID of the vehicle to update
   * @param {Object} updateData - Data to update
   * @param {number} userId - The ID of the user updating (for ownership validation)
   * @returns {Promise<Object>} - Updated vehicle
   */
  static async updateVehicle(vehicleId, updateData, userId = null) {
    try {
      // Verify vehicle exists and belongs to user if userId provided or if user is not admin
      // if (userId) {

      //   const user = await prisma.user.findUnique({
      //   where: { id: userId, deletedAt: null },
      //   select: { role: true }
      // });
      //   const isUserAdmin = user && user.role === 'ADMIN';
      //   const exists = await this.vehicleExistsAndBelongsToUser(vehicleId, userId);
      //   if (!exists && !isUserAdmin) {
      //     throw new AppError('Vehicle not found or access denied', 404);
      //   }
      // }

      // Check for duplicate plate number if updating plate number
      if (updateData.plateNumber) {
        const existingVehicle = await prisma.vehicle.findFirst({
          where: {
            plateNumber: updateData.plateNumber,
            id: { not: vehicleId },
            deletedAt: null
          }
        });

        if (existingVehicle) {
          throw new AppError('A vehicle with this plate number already exists', 400);
        }
      }

      const vehicle = await prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true
            }
          },
          trackingDevices: {
            where: { deletedAt: null },
            select: {
              id: true,
              serialNumber: true,
              model: true,
              status: true
            }
          }
        }
      });

      return vehicle;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error updating vehicle:', error);
      throw new AppError('Failed to update vehicle', 500);
    }
  }

  /**
   * Soft delete a vehicle
   * @param {number} vehicleId - The ID of the vehicle to delete
   * @param {number} userId - The ID of the user deleting (for ownership validation)
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteVehicle(vehicleId, userId = null) {
    try {
      // Verify vehicle exists and belongs to user if userId provided
      if (userId) {
        const exists = await this.vehicleExistsAndBelongsToUser(vehicleId, userId);
        if (!exists) {
          throw new AppError('Vehicle not found or access denied', 404);
        }
      }

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error deleting vehicle:', error);
      throw new AppError('Failed to delete vehicle', 500);
    }
  }

  /**
   * Get vehicles with advanced filtering for admin
   * @param {Object} pagination - Pagination parameters
   * @param {Object} filters - Advanced filter parameters
   * @returns {Promise<Object>} - Filtered vehicles with metadata
   */
  static async getVehiclesWithAdvancedFilters(pagination = {}, filters = {}) {
    try {
      const whereClause = {
        deletedAt: null
      };

      // Apply filters
      if (filters.status) whereClause.status = filters.status;
      if (filters.vehicleType) whereClause.vehicleType = filters.vehicleType;
      if (filters.fuelType) whereClause.fuelType = filters.fuelType;
      if (filters.emissionStatus) whereClause.emissionStatus = filters.emissionStatus;
      if (filters.userId) whereClause.userId = filters.userId;

      // Year range filter
      if (filters.yearFrom || filters.yearTo) {
        whereClause.yearOfManufacture = {};
        if (filters.yearFrom) whereClause.yearOfManufacture.gte = parseInt(filters.yearFrom);
        if (filters.yearTo) whereClause.yearOfManufacture.lte = parseInt(filters.yearTo);
      }

      // Search functionality
      if (filters.search) {
        whereClause.OR = [
          { plateNumber: { contains: filters.search, mode: 'insensitive' } },
          { vehicleModel: { contains: filters.search, mode: 'insensitive' } },
          { user: { email: { contains: filters.search, mode: 'insensitive' } } },
          { user: { fullName: { contains: filters.search, mode: 'insensitive' } } }
        ];
      }

      const totalCount = await prisma.vehicle.count({ where: whereClause });

      const vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        skip: pagination.skip || 0,
        take: pagination.take || 10,
        orderBy: filters.sortBy ? { [filters.sortBy]: filters.sortOrder || 'desc' } : { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              
              phoneNumber: true
            }
          },
          trackingDevices: {
            where: { deletedAt: null },
            select: {
              id: true,
              serialNumber: true,
              model: true,
              status: true,
              batteryLevel: true
            }
          },
          _count: {
            select: {
              // emissionData: true,
              fuelData: true,
              gpsData: true,
              alerts: true
            }
          }
        }
      });

      const meta = pagination.buildMeta ? pagination.buildMeta(totalCount) : {
        pagination: {
          currentPage: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
          totalPages: Math.ceil(totalCount / (pagination.take || 10)),
          totalCount,
          limit: pagination.take || 10
        },
        filters: filters
      };

      return {
        data: vehicles,
        meta
      };
    } catch (error) {
      console.error('Error fetching vehicles with advanced filters:', error);
      throw new AppError('Failed to fetch vehicles', 500);
    }
  }

  /**
   * Get vehicle statistics
   * @returns {Promise<Object>} - Vehicle statistics
   */
  static async getVehicleStatistics() {
    try {
      const [
        totalVehicles,
        activeVehicles,
        vehiclesByType,
        vehiclesByFuelType,
        vehiclesByEmissionStatus,
        recentVehicles
      ] = await Promise.all([
        prisma.vehicle.count({ where: { deletedAt: null } }),
        prisma.vehicle.count({ where: { status: 'ACTIVE', deletedAt: null } }),
        prisma.vehicle.groupBy({
          by: ['vehicleType'],
          _count: { vehicleType: true },
          where: { deletedAt: null }
        }),
        prisma.vehicle.groupBy({
          by: ['fuelType'],
          _count: { fuelType: true },
          where: { deletedAt: null }
        }),
        prisma.vehicle.groupBy({
          by: ['emissionStatus'],
          _count: { emissionStatus: true },
          where: { deletedAt: null }
        }),
        prisma.vehicle.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            deletedAt: null
          }
        })
      ]);

      return {
        totalVehicles,
        activeVehicles,
        inactiveVehicles: totalVehicles - activeVehicles,
        recentVehicles,
        breakdown: {
          byType: vehiclesByType.reduce((acc, item) => {
            acc[item.vehicleType] = item._count.vehicleType;
            return acc;
          }, {}),
          byFuelType: vehiclesByFuelType.reduce((acc, item) => {
            acc[item.fuelType] = item._count.fuelType;
            return acc;
          }, {}),
          byEmissionStatus: vehiclesByEmissionStatus.reduce((acc, item) => {
            acc[item.emissionStatus] = item._count.emissionStatus;
            return acc;
          }, {})
        }
      };
    } catch (error) {
      console.error('Error fetching vehicle statistics:', error);
      throw new AppError('Failed to fetch vehicle statistics', 500);
    }
  }
}