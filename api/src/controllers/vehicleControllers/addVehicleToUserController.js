import { addVehicleToUser } from '../../services/vehiclesService/addVehicleToUserService .js'

export const addVehicleToUserController = async (req, res) => {
  const { userId } = req.params
  const vehicleData = req.body

  try {
    const updatedUser = await addVehicleToUser(userId, vehicleData)
    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: updatedUser // Returning updated user with vehicles
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}
