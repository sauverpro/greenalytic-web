import { getVehicleHistoryService } from "../../services/vehiclesService/otherServices.js"

// ✅ Controller to get vehicle history with pagination and filtering
export const getVehicleHistoryController = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { startTime, endTime, historyType, dataSource } = req.query
    const pagination = req.pagination // Extract pagination from middleware

    // Validate vehicle ID
    const parsedVehicleId = parseInt(vehicleId, 10)
    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID"
      })
    }

    // Validate date parameters if provided
    let validatedStartTime = null
    let validatedEndTime = null

    if (startTime) {
      validatedStartTime = new Date(startTime)
      if (isNaN(validatedStartTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid startTime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
        })
      }
    }

    if (endTime) {
      validatedEndTime = new Date(endTime)
      if (isNaN(validatedEndTime.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid endTime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
        })
      }
    }

    // Validate date range
    if (validatedStartTime && validatedEndTime && validatedStartTime >= validatedEndTime) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime"
      })
    }

    // Validate history type filter if provided
    const validHistoryTypes = ['GPS', 'EMISSION', 'FUEL', 'OBD', 'ALL']
    if (historyType && !validHistoryTypes.includes(historyType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid history type. Must be one of: ${validHistoryTypes.join(', ')}`
      })
    }

    // Validate data source filter if provided
    const validDataSources = ['GPS_DATA', 'EMISSION_DATA', 'FUEL_DATA', 'OBD_DATA']
    if (dataSource && !validDataSources.includes(dataSource)) {
      return res.status(400).json({
        success: false,
        message: `Invalid data source. Must be one of: ${validDataSources.join(', ')}`
      })
    }

    // Build filter options
    const filters = {
      historyType: historyType || 'ALL',
      dataSource: dataSource || null
    }

    // 🚀 Call the optimized service function
    const result = await getVehicleHistoryService(
      parsedVehicleId,
      validatedStartTime,
      validatedEndTime,
      pagination,
      filters
    )

    return res.status(200).json({
      success: true,
      message: 'Vehicle history fetched successfully',
      data: result.data,
      meta: {
        ...result.meta,
        filters: {
          applied: {
            startTime: validatedStartTime?.toISOString() || null,
            endTime: validatedEndTime?.toISOString() || null,
            historyType: filters.historyType,
            dataSource: filters.dataSource
          },
          available: {
            historyTypes: validHistoryTypes,
            dataSources: validDataSources
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching vehicle history:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}