import {
  addVehicleToUserService,
  deleteVehicleService,
  updateVehicleByIdService
} from "../../services/vehiclesService/vehicleService.js";

export const addVehicleToUser = async (req, res) => {
  const { userId } = req.params;
  const vehicleData = req.body;

  try {
    // Validate required fields based on schema
    const requiredFields = ['plateNumber', 'vehicleModel', 'vehicleType'];
    const missingFields = requiredFields.filter(field => !vehicleData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate userId
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Validate enum values if provided
    if (vehicleData.vehicleType && !['CAR', 'TRUCK', 'MOTORCYCLE', 'TRICYCLE', 'OTHER'].includes(vehicleData.vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type. Must be one of: 'CAR', 'TRUCK', 'MOTORCYCLE', 'TRICYCLE', 'OTHER'"
      });
    }

    if (vehicleData.fuelType && !['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(vehicleData.fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID"
      });
    }

    if (vehicleData.status && !['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(vehicleData.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING, ACTIVE, INACTIVE, MAINTENANCE"
      });
    }

    // Set default values based on schema
    const enhancedVehicleData = {
      ...vehicleData,
      userId: parsedUserId,
      status: vehicleData.status || 'ACTIVE', // Default status
      // Set emission status to NORMAL_EMISSION by default (will be updated by emission controller)
      emissionStatus: 'NORMAL_EMISSION'
    };

    const updatedUser = await addVehicleToUserService(parsedUserId, enhancedVehicleData);
    
    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicleData = req.body;

    const parsedVehicleId = parseInt(vehicleId, 10);

    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid vehicle ID" 
      });
    }

    if (!vehicleData || Object.keys(vehicleData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No update data provided" 
      });
    }

    // Validate enum values if provided in update
    if (vehicleData.vehicleType && !['CAR', 'TRUCK', 'MOTORCYCLE', 'TRICYCLE', 'OTHER'].includes(vehicleData.vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type. Must be one of: 'CAR', 'TRUCK', 'MOTORCYCLE', 'TRICYCLE', 'OTHER'"
      });
    }

    if (vehicleData.fuelType && !['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(vehicleData.fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fuel type. Must be one of: PETROL, DIESEL, ELECTRIC, HYBRID"
      });
    }

    if (vehicleData.status && !['NORMAL_EMISSION', 'TOP_POLLUTING', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(vehicleData.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: NORMAL_EMISSION, TOP_POLLUTING, ACTIVE, INACTIVE, MAINTENANCE"
      });
    }

    // Validate year if provided
    if (vehicleData.year) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(vehicleData.year);
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid year. Must be between 1900 and ${currentYear + 1}`
        });
      }
    }

    // Note: Don't allow manual updates to emission status - this should only be updated by emission controller
    if (vehicleData.hasOwnProperty('emissionStatus')) {
      return res.status(400).json({
        success: false,
        message: "Emission status cannot be manually updated. It is automatically managed by the emission monitoring system."
      });
    }

    const updatedVehicle = await updateVehicleByIdService(
      parsedVehicleId,
      vehicleData
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const parsedVehicleId = parseInt(vehicleId, 10);

    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid vehicle ID" 
      });
    }

    const result = await deleteVehicleService(parsedVehicleId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};