import express from 'express'
import { addVehicleToUserController } from '../controllers/vehicleControllers/addVehicleToUserController.js'
import paginationMiddleware from '../middlewares/paginationMiddleware.js'
import {
    getAllVehiclesController,
    getVehicleByIdController,
    getVehiclesByUserIdController
} from '../controllers/vehicleControllers/gettingvehiclesControllers.js'
import { getVehicleHistoryController } from '../controllers/vehicleControllers/vehicleHistory.js'
import { vehicleDataController } from '../controllers/VehicleDataController.js'

const VehicleRouter = express.Router()

// Route to add a vehicle to a user
VehicleRouter.post('/addvehicletouser/:userId',addVehicleToUserController)
VehicleRouter.get('/getallvehicles',paginationMiddleware,getAllVehiclesController)
VehicleRouter.get('/:id',paginationMiddleware,getVehicleByIdController)
VehicleRouter.get('/user/:userId/vehicles',paginationMiddleware,getVehiclesByUserIdController)
VehicleRouter.get('/:vehicleId/history', paginationMiddleware, getVehicleHistoryController)

// VEHICLE DATA for emission, fuel, and GPS data

VehicleRouter.get(
  "/:vehicleId/emissions/range",
  vehicleDataController.getEmissionsDataByTimeRange
);

VehicleRouter.get(
  "/:vehicleId/fuels/range",
  vehicleDataController.getFuelsDataByTimeRange
);

VehicleRouter.get(
  "/:vehicleId/gps/range",
  vehicleDataController.getGPSDataByTimeRange
);



export default VehicleRouter
