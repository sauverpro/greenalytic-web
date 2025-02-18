import TrackingDeviceService from '../services/trackingDeviceService.js'

// Controller for adding a tracking device to a vehicle
export const addTrackingDevice = async (req, res) => {
  try {
    const { vehicleId } = req.params // Get vehicleId from URL params

    // Convert vehicleId to an integer and validate
    const parsedVehicleId = parseInt(vehicleId, 10)
    if (isNaN(parsedVehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid vehicle ID' })
    }

    // Ensure request body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Request body cannot be empty' })
    }

    // Call the service and pass the vehicleId
    const trackingDevice = await TrackingDeviceService.addTrackingDeviceToVehicle(
      {
        ...req.body,
        vehicleId: parsedVehicleId // Ensure it's a valid number
      }
    )

    return res.status(201).json({
      success: true,
      message: 'Tracking device added successfully',
      data: trackingDevice
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

// Controller for removing a tracking device from a vehicle
export const removeTrackingDevice = async (req, res) => {
  try {
    const { deviceId, vehicleId } = req.params // Get deviceId and vehicleId from URL params

    // Convert IDs to integers and validate
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

// Controller for deleting a vehicle and its tracking device
export const deleteVehicleAndTrackingDevice = async (req, res) => {
  try {
    const { vehicleId } = req.params // Get vehicleId from URL params

    // Convert vehicleId to integer and validate
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

// Controller for getting the status of a tracking device
export const getTrackingDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params // Get deviceId from URL params

    // Convert deviceId to integer and validate
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

// Controller for getting all tracking devices (paginated)
export const getAllTrackingDevices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query // Pagination parameters

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

// Controller for getting a tracking device by ID
export const getTrackingDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params // Get deviceId from URL params

    // Convert deviceId to integer and validate
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
