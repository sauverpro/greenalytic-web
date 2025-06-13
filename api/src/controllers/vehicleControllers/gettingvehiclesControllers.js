import { VehicleService } from '../../services/vehiclesService/vehicleService.js';

export const getAllVehiclesController = async (req, res) => {
  try {
    const { pagination } = req;
    const { status, vehicleType, fuelType, emissionStatus, search, sortBy, sortOrder } = req.query;

    // Build filtering options
    const filters = {};
    
    // Validate and add status filter
    if (status) {
      if (!['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: ACTIVE, INACTIVE, MAINTENANCE",
          timestamp: new Date().toISOString()
        });
      }
      filters.status = status;
    }

    // Validate and add vehicle type filter
    if (vehicleType) {
      if (!['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'].includes(vehicleType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle type. Must be one of: CAR, TRUCK, BUS, MOTORCYCLE, OTHER",
          timestamp: new Date().toISOString()
        });
      }
      filters.vehicleType = vehicleType;
    }

    // Validate and add fuel type filter
    if (fuelType) {
      if (!['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(fuelType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID",
          timestamp: new Date().toISOString()
        });
      }
      filters.fuelType = fuelType;
    }

    // Validate and add emission status filter
    if (emissionStatus) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING'].includes(emissionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid emission status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING",
          timestamp: new Date().toISOString()
        });
      }
      filters.emissionStatus = emissionStatus;
    }

    // Add search and sorting filters
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;

    // Use enhanced service method for admin filtering
    const result = await VehicleService.getVehiclesWithAdvancedFilters(pagination, filters);

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.data,
      meta: result.meta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting all vehicles:', error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Failed to retrieve vehicles",
      timestamp: new Date().toISOString()
    });
  }
};

export const getVehicleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate vehicle ID
    const parsedVehicleId = parseInt(id, 10);
    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
        timestamp: new Date().toISOString()
      });
    }

    // Use enhanced service method - pass userId for ownership validation if not admin
    const userId = req.userRole === 'ADMIN' ? null : req.userId;
    const vehicle = await VehicleService.getVehicleById(parsedVehicleId, userId);

    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        message: 'Vehicle not found or access denied',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting vehicle by ID:', error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Failed to retrieve vehicle",
      timestamp: new Date().toISOString()
    });
  }
};

export const getVehiclesByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pagination } = req;
    const { status, vehicleType, fuelType, emissionStatus, search } = req.query;

    // Validate user ID
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        timestamp: new Date().toISOString()
      });
    }

    // Security check: Users can only access their own vehicles unless admin
    if (req.userRole !== 'ADMIN' && req.userId !== parsedUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own vehicles",
        timestamp: new Date().toISOString()
      });
    }

    // Build filtering options
    const filters = {};
    
    // Validate and add status filter
    if (status) {
      if (!['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: ACTIVE, INACTIVE, MAINTENANCE",
          timestamp: new Date().toISOString()
        });
      }
      filters.status = status;
    }

    // Validate and add vehicle type filter
    if (vehicleType) {
      if (!['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'].includes(vehicleType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle type. Must be one of: CAR, TRUCK, BUS, MOTORCYCLE, OTHER",
          timestamp: new Date().toISOString()
        });
      }
      filters.vehicleType = vehicleType;
    }

    // Validate and add fuel type filter
    if (fuelType) {
      if (!['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(fuelType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID",
          timestamp: new Date().toISOString()
        });
      }
      filters.fuelType = fuelType;
    }

    // Validate and add emission status filter
    if (emissionStatus) {
      if (!['NORMAL_EMISSION', 'TOP_POLLUTING'].includes(emissionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid emission status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING",
          timestamp: new Date().toISOString()
        });
      }
      filters.emissionStatus = emissionStatus;
    }

    // Add search filter
    if (search) filters.search = search;

    // Use enhanced service method
    const vehiclesData = await VehicleService.getVehiclesByUserId(parsedUserId, pagination, filters);

    // Send the response with the vehicles and pagination data
    res.status(200).json({
      success: true,
      message: "User vehicles retrieved successfully",
      data: vehiclesData.data,
      meta: vehiclesData.meta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting vehicles by user ID:', error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Failed to retrieve user vehicles",
      timestamp: new Date().toISOString()
    });
  }
};