import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler.js";
import { VehicleService } from "../services/vehiclesService/vehicleService.js";

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
}
