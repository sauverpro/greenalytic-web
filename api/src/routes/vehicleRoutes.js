import express from 'express'
import { addVehicleController } from '../controllers/vehicleController.js'

const VehicleRouter = express.Router()

// Route to add a vehicle to a user
VehicleRouter.post('/addvehicle/:userId', addVehicleController)

export default VehicleRouter
