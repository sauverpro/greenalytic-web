import {  addVehicleToUserService, deleteVehicleService, updateVehicleByIdService } from "../../services/vehiclesService/vehicleService .js";

export const addVehicleToUser = async (req, res) => {
  const { userId } = req.params;
  const vehicleData = req.body;

  try {
    const updatedUser = await addVehicleToUserService(userId, vehicleData);
    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully..",
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }

    if (!vehicleData || Object.keys(vehicleData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No update data provided" });
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
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const parsedVehicleId = parseInt(vehicleId, 10);

    if (isNaN(parsedVehicleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vehicle ID" });
    }

    const result = await deleteVehicleService(
      parsedVehicleId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
