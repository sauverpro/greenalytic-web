import { getAllVehiclesService, getVehicleByIdService, getVehiclesByUserIdService } from '../../services/vehiclesService/vehicleService .js'

export const getAllVehiclesController = async (req, res) => {
  try {
    const { pagination } = req
    const result = await getAllVehiclesService()

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getVehicleByIdController = async (req, res) => {
  try {
    const vehicle = await getVehicleByIdService(req.params.id)

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' })
    }

    res.status(200).json(vehicle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getVehiclesByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const pagination = req.pagination;

    // Call the service to get vehicles with pagination for the user
    const vehiclesData = await getVehiclesByUserIdService(userId, pagination);

    // Send the response with the vehicles and pagination data
    res.status(200).json(vehiclesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
