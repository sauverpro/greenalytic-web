import { VehicleService } from "../../services/vehiclesService/vehicleService.js";

export const addVehicleToUser = async (req, res) => {
  const { userId } = req.params;
  const vehicleData = req.body;

  try {
    // Parse userId to ensure it's a number
    const parsedUserId = parseInt(userId, 10);
    
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Use the enhanced createVehicle method
    const newVehicle = await VehicleService.createVehicle(vehicleData, parsedUserId);
    
    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: newVehicle,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding vehicle to user:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to add vehicle",
      timestamp: new Date().toISOString()
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
        message: "Invalid vehicle ID",
        timestamp: new Date().toISOString()
      });
    }

    if (!vehicleData || Object.keys(vehicleData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No update data provided",
        timestamp: new Date().toISOString()
      });
    }

    // Use the enhanced updateVehicle method
    const updatedVehicle = await VehicleService.updateVehicle(
      parsedVehicleId,
      vehicleData,
      req.userId // Pass userId for ownership validation
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return res.status(error.statusCode || 500).json({ 
      success: false, 
      message: error.message || "Failed to update vehicle",
      timestamp: new Date().toISOString()
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
        message: "Invalid vehicle ID",
        timestamp: new Date().toISOString()
      });
    }

    // Use the enhanced deleteVehicle method
    const result = await VehicleService.deleteVehicle(
      parsedVehicleId,
      req.userId // Pass userId for ownership validation
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: { deleted: result },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return res.status(error.statusCode || 500).json({ 
      success: false, 
      message: error.message || "Failed to delete vehicle",
      timestamp: new Date().toISOString()
    });
  }
};