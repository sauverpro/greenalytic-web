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

// export const addTrackingDeviceToVehicle = async (req, res) => {
//   try {
//     const { type, plateNumber } = req.body;

 

//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'Request body cannot be empty' })
//     }

//     if (!plateNumber) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'Plate number is required' })
//     }

//     const validTypes = ['GPS', 'FUEL', 'EMISSION']
//     if (!type || !validTypes.includes(type.toUpperCase())) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid device type. Type must be one of: ${validTypes.join(', ')}`
//       })
//     }

//         const normalizedBody = {
//           ...req.body,
//           type: type.toUpperCase(),
//         };

//     const trackingDevice =
//       await TrackingDeviceService.addTrackingDeviceToVehicle(normalizedBody);

//     return res.status(201).json({
//       success: true,
//       message: 'Tracking device added successfully',
//       data: trackingDevice
//     })
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message })
//   }
// }



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
