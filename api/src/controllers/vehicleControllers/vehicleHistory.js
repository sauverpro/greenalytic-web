import { getVehicleHistoryService } from "../../services/vehiclesService/otherServices.js"

// ✅ Controller to get vehicle history with pagination
export const getVehicleHistoryController = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { startTime, endTime } = req.query
    const pagination = req.pagination // Extract pagination from middleware

    // 🚀 Call the optimized service function
    const result = await getVehicleHistoryService(
      vehicleId,
      startTime,
      endTime,
      pagination
    )

    return res.status(200).json({
      success: true,
      message: 'Vehicle history fetched successfully',
      data: result
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}
