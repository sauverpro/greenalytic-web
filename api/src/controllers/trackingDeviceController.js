import TrackingDeviceService from '../services/trackingDeviceService.js'

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
