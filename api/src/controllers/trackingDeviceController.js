import { PaginationService } from '../services/paginationService.js';
import TrackingDeviceService from '../services/trackingDeviceService.js'

export const addTrackingDeviceToVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { deviceCategory, enableEmissionMonitoring } = req.body;

    const parsedVehicleId = parseInt(vehicleId, 10);
    if (isNaN(parsedVehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Request body cannot be empty" });
    }

    // Validate required fields
    const requiredFields = ['serialNumber', 'model', 'deviceCategory'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate device category enum
    const validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK",  "TRICYCLE", "OTHER"];
    if (!deviceCategory || !validDeviceCategories.includes(deviceCategory)) {
      return res.status(400).json({
        success: false,
        message: `Invalid device category. Must be one of: ${validDeviceCategories.join(", ")}`,
      });
    }

    // Validate enableEmissionMonitoring if provided
    if (enableEmissionMonitoring !== undefined && typeof enableEmissionMonitoring !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "enableEmissionMonitoring must be a boolean value"
      });
    }

    // Validate status if provided
    if (req.body.status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
    }

    const normalizedBody = {
      ...req.body,
      deviceCategory,
      vehicleId: parsedVehicleId,
      status: req.body.status || 'ACTIVE', // Default status
      enableEmissionMonitoring: enableEmissionMonitoring || false, // Default to false
      isActive: true, // Set as active when created
      lastPing: new Date() // Set initial ping time
    };

    const trackingDevice =
      await TrackingDeviceService.addTrackingDeviceToVehicle(normalizedBody);

    return res.status(201).json({
      success: true,
      message: "Tracking device added successfully",
      data: trackingDevice,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTrackingDevicesByVehicleId = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { deviceCategory, status, enableEmissionMonitoring } = req.query;
    const pagination = req.pagination;

    const parsedVehicleId = parseInt(vehicleId, 10);
    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    // Build filters
    const filters = {};

    // Validate and add device category filter
    if (deviceCategory) {
      const validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK",  "TRICYCLE", "OTHER"];
      if (!validDeviceCategories.includes(deviceCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid device category. Must be one of: ${validDeviceCategories.join(", ")}`
        });
      }
      filters.deviceCategory = deviceCategory;
    }

    // Validate and add status filter
    if (status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      filters.status = status;
    }

    // Validate and add emission monitoring filter
    if (enableEmissionMonitoring !== undefined) {
      if (enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false') {
        return res.status(400).json({
          success: false,
          message: "enableEmissionMonitoring must be 'true' or 'false'"
        });
      }
      filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
    }

    const result = await TrackingDeviceService.getTrackingDevicesByVehicleId(
      parsedVehicleId,
      pagination,
      filters
    );
    

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tracking devices found for this vehicle",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tracking devices retrieved successfully",
      data: result,
      meta: {
        totalCount: result.length,
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 10,
        totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
      }
    });
  } catch (error) {
    console.error("Error retrieving tracking devices:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const removeTrackingDevice = async (req, res) => {
  try {
    const { deviceId, vehicleId } = req.params;

    const parsedDeviceId = parseInt(deviceId, 10);
    const parsedVehicleId = parseInt(vehicleId, 10);

    if (isNaN(parsedDeviceId) || isNaN(parsedVehicleId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid device ID or vehicle ID' 
      });
    }

    const result = await TrackingDeviceService.removeTrackingDeviceFromVehicle(
      parsedDeviceId,
      parsedVehicleId
    );

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVehicleAndTrackingDevice = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const parsedVehicleId = parseInt(vehicleId, 10);

    if (isNaN(parsedVehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid vehicle ID' });
    }

    const result = await TrackingDeviceService.deleteVehicleAndTrackingDevice(
      parsedVehicleId
    );

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTrackingDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const parsedDeviceId = parseInt(deviceId, 10);

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid device ID' });
    }

    const trackingStatus = await TrackingDeviceService.getTrackingDeviceStatus(
      parsedDeviceId
    );

    return res.status(200).json({
      success: true,
      message: 'Tracking device status fetched successfully',
      data: trackingStatus
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllTrackingDevices = async (req, res) => {
  try {
    const pagination = req.pagination;
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const { deviceCategory, status, enableEmissionMonitoring, isActive } = req.query;

    // Build filters
    const filters = {};

    // Validate and add device category filter
    if (deviceCategory) {
      const validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK",  "TRICYCLE", "OTHER"];
      if (!validDeviceCategories.includes(deviceCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid device category. Must be one of: ${validDeviceCategories.join(", ")}`
        });
      }
      filters.deviceCategory = deviceCategory;
    }

    // Validate and add status filter
    if (status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      filters.status = status;
    }

    // Validate and add emission monitoring filter
    if (enableEmissionMonitoring !== undefined) {
      if (enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false') {
        return res.status(400).json({
          success: false,
          message: "enableEmissionMonitoring must be 'true' or 'false'"
        });
      }
      filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
    }

    // Validate and add isActive filter
    if (isActive !== undefined) {
      if (isActive !== 'true' && isActive !== 'false') {
        return res.status(400).json({
          success: false,
          message: "isActive must be 'true' or 'false'"
        });
      }
      filters.isActive = isActive === 'true';
    }

    const result = await TrackingDeviceService.getAllTrackingDevices(
      page,
      limit,
      filters
    );

    console.log("Fetched tracking devices:", result.length);

    return res.status(200).json({
      success: true,
      message: 'All tracking devices fetched successfully',
      data: result,
       meta: {
        totalCount: result.length,
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 10,
        totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
      }
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTrackingDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const parsedDeviceId = parseInt(deviceId, 10);

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid device ID' });
    }

    const trackingDevice = await TrackingDeviceService.getTrackingDeviceById(
      parsedDeviceId
    );

    return res.status(200).json({
      success: true,
      message: 'Tracking device fetched successfully',
      data: trackingDevice
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTrackingDevicesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deviceCategory, status, enableEmissionMonitoring } = req.query;
    const pagination = req.pagination;

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Build filters
    const filters = {};

    // Validate and add device category filter
    if (deviceCategory) {
      const validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK",  "TRICYCLE", "OTHER"];
      if (!validDeviceCategories.includes(deviceCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid device category. Must be one of: ${validDeviceCategories.join(", ")}`
        });
      }
      filters.deviceCategory = deviceCategory;
    }

    // Validate and add status filter
    if (status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      filters.status = status;
    }

    // Validate and add emission monitoring filter
    if (enableEmissionMonitoring !== undefined) {
      if (enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false') {
        return res.status(400).json({
          success: false,
          message: "enableEmissionMonitoring must be 'true' or 'false'"
        });
      }
      filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
    }

    const result = await TrackingDeviceService.getTrackingDevicesByUser(
      parsedUserId,
      pagination,
      filters
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tracking devices found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User tracking devices retrieved successfully",
      data: result,
      meta: {
        totalCount: result.length,
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 10,
        totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
      }
    });
  } catch (error) {
    console.error("Error retrieving tracking devices for user:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getDeviceDetails = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;
    const pagination = req.pagination;

    const parsedDeviceId = parseInt(deviceId, 10);

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid device ID' });
    }

    // Validate dates if provided
    let validatedStartDate = null;
    let validatedEndDate = null;

    if (startDate) {
      validatedStartDate = new Date(startDate);
      if (isNaN(validatedStartDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
        });
      }
    }

    if (endDate) {
      validatedEndDate = new Date(endDate);
      if (isNaN(validatedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
        });
      }
    }

    // Validate date range
    if (validatedStartDate && validatedEndDate && validatedStartDate >= validatedEndDate) {
      return res.status(400).json({
        success: false,
        message: "startDate must be before endDate"
      });
    }

    const dateRange = {};
    if (validatedStartDate && validatedEndDate) {
      dateRange.startDate = validatedStartDate;
      dateRange.endDate = validatedEndDate;
    }

    const deviceDetails = await TrackingDeviceService.getDeviceDetails(
      parsedDeviceId,
      dateRange,
      pagination
    );

    return res.status(200).json({
      success: true,
      message: "Device details fetched successfully",
      data: {
        device: deviceDetails.device,
        deviceData: deviceDetails.data
      },
      meta: deviceDetails.meta
    });
  } catch (error) {
    console.error("Error retrieving device details:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Error retrieving device details",
    });
  }
};

export const updateTrackingDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const deviceData = req.body;

    const parsedDeviceId = parseInt(deviceId, 10);

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid device ID" });
    }

    if (!deviceData || Object.keys(deviceData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No update data provided" });
    }

    // Validate device category if provided
    if (deviceData.deviceCategory) {
      const validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK",  "TRICYCLE", "OTHER"];
      if (!validDeviceCategories.includes(deviceData.deviceCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid device category. Must be one of: ${validDeviceCategories.join(", ")}`,
        });
      }
    }

    // Validate status if provided
    if (deviceData.status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
      if (!validStatuses.includes(deviceData.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
    }

    // Validate enableEmissionMonitoring if provided
    if (deviceData.enableEmissionMonitoring !== undefined && typeof deviceData.enableEmissionMonitoring !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "enableEmissionMonitoring must be a boolean value"
      });
    }

    // Validate isActive if provided
    if (deviceData.isActive !== undefined && typeof deviceData.isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value"
      });
    }

    const updatedDevice = await TrackingDeviceService.updateDeviceService(
      parsedDeviceId,
      deviceData,
    );

    return res.status(200).json({
      success: true,
      message: "Tracking device updated successfully",
      data: updatedDevice,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDeviceStatistics = async (req, res) => {
  try {
    const { deviceId, interval } = req.query;
    const { startTime, endTime } = req.pagination;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    const parsedDeviceId = parseInt(deviceId, 10);
    if (isNaN(parsedDeviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid deviceId' });
    }

    let whereClause = { deviceId: parsedDeviceId };

    // Handle date filtering
    let intervalStartTime;
    if (interval) {
      const now = new Date();
      switch (interval) {
        case 'day':
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 1);
          break;
        case 'week':
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 7);
          break;
        case 'month':
          intervalStartTime = new Date(now);
          intervalStartTime.setMonth(now.getMonth() - 1);
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid interval. Use day, week, or month' });
      }
      whereClause.timestamp = { gte: intervalStartTime };
    } else if (startTime && endTime) {
      whereClause.timestamp = { gte: startTime, lte: endTime };
    } else if (startTime) {
      whereClause.timestamp = { gte: startTime };
    } else if (endTime) {
      whereClause.timestamp = { lte: endTime };
    }

    // Fetch device data (assuming emissionData is the relevant table for device statistics)
    const deviceData = await prisma.emissionData.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' },
      include: {
        device: {
          select: {
            serialNumber: true,
            model: true,
            status: true,
            deviceCategory: true,
            vehicleId: true
          }
        }
      }
    });

    if (!deviceData || deviceData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No device data found for the specified criteria',
        data: {
          averages: { co2: 0, co: 0, o2: 0, hc: 0, nox: 0, pm25: 0 },
          totals: { records: 0, exceedsThresholds: 0 },
          thresholdAnalysis: { normal: 0, high: 0, critical: 0 }
        }
      });
    }

    // Calculate statistics
    const stats = deviceData.reduce((acc, curr) => {
      const exceedsThreshold =
        curr.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
        curr.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
        curr.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
        (curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
        (curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.warning);

      const isCritical =
        curr.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
        curr.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
        curr.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
        (curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
        (curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.critical);

      return {
        co2Sum: acc.co2Sum + curr.co2Percentage,
        coSum: acc.coSum + curr.coPercentage,
        o2Sum: acc.o2Sum + curr.o2Percentage,
        hcSum: acc.hcSum + curr.hcPPM,
        noxSum: acc.noxSum + (curr.noxPPM || 0),
        noxCount: acc.noxCount + (curr.noxPPM ? 1 : 0),
        pm25Sum: acc.pm25Sum + (curr.pm25Level || 0),
        pm25Count: acc.pm25Count + (curr.pm25Level ? 1 : 0),
        count: acc.count + 1,
        exceedsThresholdCount: acc.exceedsThresholdCount + (exceedsThreshold ? 1 : 0),
        criticalCount: acc.criticalCount + (isCritical ? 1 : 0),
        highCount: acc.highCount + (exceedsThreshold && !isCritical ? 1 : 0),
      };
    }, {
      co2Sum: 0, coSum: 0, o2Sum: 0, hcSum: 0, noxSum: 0, noxCount: 0,
      pm25Sum: 0, pm25Count: 0, count: 0, exceedsThresholdCount: 0,
      criticalCount: 0, highCount: 0
    });

    const normalCount = stats.count - stats.exceedsThresholdCount;

    return res.status(200).json({
      success: true,
      data: {
        averages: {
          co2: (stats.co2Sum / stats.count).toFixed(3),
          co: (stats.coSum / stats.count).toFixed(3),
          o2: (stats.o2Sum / stats.count).toFixed(3),
          hc: (stats.hcSum / stats.count).toFixed(1),
          nox: stats.noxCount > 0 ? (stats.noxSum / stats.noxCount).toFixed(3) : null,
          pm25: stats.pm25Count > 0 ? (stats.pm25Sum / stats.pm25Count).toFixed(3) : null,
        },
        totals: {
          records: stats.count,
          exceedsThresholds: stats.exceedsThresholdCount,
          exceedsPercentage: ((stats.exceedsThresholdCount / stats.count) * 100).toFixed(1),
        },
        thresholdAnalysis: {
          normal: normalCount,
          high: stats.highCount,
          critical: stats.criticalCount,
          normalPercentage: ((normalCount / stats.count) * 100).toFixed(1),
          highPercentage: ((stats.highCount / stats.count) * 100).toFixed(1),
          criticalPercentage: ((stats.criticalCount / stats.count) * 100).toFixed(1),
        },
        thresholds: EMISSION_THRESHOLDS,
        timeRange: interval ? { interval } : {
          from: startTime || 'beginning',
          to: endTime || 'now'
        },
        device: deviceData[0]?.device || null
      }
    });
  } catch (error) {
    console.error('Error calculating device statistics:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate device statistics' });
  }
};