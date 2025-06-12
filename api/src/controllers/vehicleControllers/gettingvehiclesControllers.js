import { 
  getAllVehiclesService, 
  getVehicleByIdService, 
  getVehiclesByUserIdService 
} from '../../services/vehiclesService/vehicleService.js'

export const getAllVehiclesController = async (req, res) => {
  try {
    const { pagination } = req
    const { status, vehicleType, fuelType, emissionStatus } = req.query

    // Build filtering options
    const filters = {}
    
    // Validate and add status filter
    if (status) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING, ACTIVE, INACTIVE, MAINTENANCE"
        })
      }
      filters.status = status
    }

    // Validate and add vehicle type filter
    if (vehicleType) {
      if (!['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'].includes(vehicleType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle type. Must be one of: CAR, TRUCK, BUS, MOTORCYCLE, OTHER"
        })
      }
      filters.vehicleType = vehicleType
    }

    // Validate and add fuel type filter
    if (fuelType) {
      if (!['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(fuelType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID"
        })
      }
      filters.fuelType = fuelType
    }

    // Validate and add emission status filter
    if (emissionStatus) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING'].includes(emissionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid emission status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING"
        })
      }
      filters.emissionStatus = emissionStatus
    }

    const result = await getAllVehiclesService(pagination, filters)

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    })
  }
}

export const getVehicleByIdController = async (req, res) => {
  try {
    const { id } = req.params

    // Validate vehicle ID
    const parsedVehicleId = parseInt(id, 10)
    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID"
      })
    }

    const vehicle = await getVehicleByIdService(parsedVehicleId)

    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        message: 'Vehicle not found' 
      })
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    })
  }
}

export const getVehiclesByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params
    const { pagination } = req
    const { status, vehicleType, fuelType, emissionStatus } = req.query

    // Validate user ID
    const parsedUserId = parseInt(userId, 10)
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      })
    }

    // Build filtering options
    const filters = {}
    
    // Validate and add status filter
    if (status) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING, ACTIVE, INACTIVE, MAINTENANCE"
        })
      }
      filters.status = status
    }

    // Validate and add vehicle type filter
    if (vehicleType) {
      if (!['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'].includes(vehicleType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle type. Must be one of: CAR, TRUCK, BUS, MOTORCYCLE, OTHER"
        })
      }
      filters.vehicleType = vehicleType
    }

    // Validate and add fuel type filter
    if (fuelType) {
      if (!['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(fuelType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID"
        })
      }
      filters.fuelType = fuelType
    }

    // Validate and add emission status filter
    if (emissionStatus) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING'].includes(emissionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid emission status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING"
        })
      }
      filters.emissionStatus = emissionStatus
    }

    // Call the service to get vehicles with pagination and filters for the user
    const vehiclesData = await getVehiclesByUserIdService(parsedUserId, pagination, filters)

    // Send the response with the vehicles and pagination data
    res.status(200).json({
      success: true,
      message: "User vehicles retrieved successfully",
      data: vehiclesData.data,
      meta: vehiclesData.meta
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    })
  }
}