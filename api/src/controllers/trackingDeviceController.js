import { PaginationService } from '../services/paginationService.js';
import TrackingDeviceService from '../services/trackingDeviceService.js'

export const addTrackingDeviceToVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { type } = req.body;

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

    const validTypes = ["GPS", "FUEL", "EMISSION"];
    if (!type || !validTypes.includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid device type. Type must be one of: ${validTypes.join(
          ", "
        )}`,
      });
    }

    const normalizedBody = {
      ...req.body,
      type: type.toUpperCase(),
      vehicleId: parsedVehicleId,
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

      const parsedVehicleId = parseInt(vehicleId, 10);
      if (isNaN(parsedVehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID",
        });
      }

      const trackingDevices =
        await TrackingDeviceService.getTrackingDevicesByVehicleId(
          parsedVehicleId
        );

      if (!trackingDevices || trackingDevices.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No tracking devices found for this vehicle",
        });
      }

      return res.status(200).json({
        success: true,
        count: trackingDevices.length,
        data: trackingDevices,
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
    const { deviceId, vehicleId } = req.params // Get deviceId and vehicleId from URL params

    const parsedDeviceId = parseInt(deviceId, 10)
    const parsedVehicleId = parseInt(vehicleId, 10)

    if (isNaN(parsedDeviceId) || isNaN(parsedVehicleId)) {
      return res.status(400).json({ success: false, message: 'Invalid IDs' })
    }

    const result = await TrackingDeviceService.removeTrackingDeviceFromVehicle(
      parsedDeviceId,
      parsedVehicleId
    )

    return res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteVehicleAndTrackingDevice = async (req, res) => {
  try {
    const { vehicleId } = req.params 

    const parsedVehicleId = parseInt(vehicleId, 10)

    if (isNaN(parsedVehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid vehicle ID' })
    }

    const result = await TrackingDeviceService.deleteVehicleAndTrackingDevice(
      parsedVehicleId
    )

    return res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const getTrackingDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params 

    const parsedDeviceId = parseInt(deviceId, 10)

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid device ID' })
    }

    const trackingStatus = await TrackingDeviceService.getTrackingDeviceStatus(
      parsedDeviceId
    )

    return res.status(200).json({
      success: true,
      message: 'Tracking device status fetched successfully',
      data: { trackingStatus }
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const getAllTrackingDevices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query 

    const devices = await TrackingDeviceService.getAllTrackingDevices(
      page,
      limit
    )

    return res.status(200).json({
      success: true,
      message: 'All tracking devices fetched successfully',
      data: devices
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const getTrackingDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params

    const parsedDeviceId = parseInt(deviceId, 10)

    if (isNaN(parsedDeviceId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid device ID' })
    }

    const trackingDevice = await TrackingDeviceService.getTrackingDeviceById(
      parsedDeviceId
    )

    return res.status(200).json({
      success: true,
      message: 'Tracking device fetched successfully',
      data: trackingDevice
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const getTrackingDevicesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Get tracking devices for the user
    const trackingDevices =
      await TrackingDeviceService.getTrackingDevicesByUser(parsedUserId);

    if (!trackingDevices || trackingDevices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tracking devices found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      count: trackingDevices.length,
      data: trackingDevices,
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
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const paginationParams = PaginationService.parsePaginationParams(
      req.query,
      10
    );

    const dateRange = {};
    if (startDate && endDate) {
      dateRange.startDate = startDate;
      dateRange.endDate = endDate;
    }

    const deviceDetails = await TrackingDeviceService.getDeviceDetails(
      deviceId,
      dateRange,
      paginationParams
    );

    return res.status(200).json({
      success: true,
      message: "Device details fetched successfully",
      data: deviceDetails.device,
      deviceData: deviceDetails.data,
      pagination: deviceDetails.pagination,
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

    if (deviceData.type) {
      const validTypes = ["GPS", "FUEL", "EMISSION"];
      if (!validTypes.includes(deviceData.type.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid device type. Type must be one of: ${validTypes.join(
            ", "
          )}`,
        });
      }
      deviceData.type = deviceData.type.toUpperCase();
    }

    if (deviceData.status) {
      const validStatuses = ["active", "inactive", "pending", "disconnected"];
      if (!validStatuses.includes(deviceData.status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Status must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      deviceData.status = deviceData.status.toLowerCase();
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