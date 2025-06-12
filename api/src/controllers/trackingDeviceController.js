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
    const validDeviceCategories = ["GPS_TRACKER", "FUEL_MONITOR", "EMISSION_SENSOR", "OBD_DEVICE", "MULTI_SENSOR"];
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
      const validDeviceCategories = ["GPS_TRACKER", "FUEL_MONITOR", "EMISSION_SENSOR", "OBD_DEVICE", "MULTI_SENSOR"];
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

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tracking devices found for this vehicle",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tracking devices retrieved successfully",
      data: result.data,
      meta: result.meta
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
    const { deviceCategory, status, enableEmissionMonitoring, isActive } = req.query;

    // Build filters
    const filters = {};

    // Validate and add device category filter
    if (deviceCategory) {
      const validDeviceCategories = ["GPS_TRACKER", "FUEL_MONITOR", "EMISSION_SENSOR", "OBD_DEVICE", "MULTI_SENSOR"];
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
      pagination,
      filters
    );

    return res.status(200).json({
      success: true,
      message: 'All tracking devices fetched successfully',
      data: result.data,
      meta: result.meta
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
      const validDeviceCategories = ["GPS_TRACKER", "FUEL_MONITOR", "EMISSION_SENSOR", "OBD_DEVICE", "MULTI_SENSOR"];
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

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tracking devices found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User tracking devices retrieved successfully",
      data: result.data,
      meta: result.meta
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
      const validDeviceCategories = ["GPS_TRACKER", "FUEL_MONITOR", "EMISSION_SENSOR", "OBD_DEVICE", "MULTI_SENSOR"];
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