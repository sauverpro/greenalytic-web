import express from 'express'
import { verifyingtoken } from "../utils/jwtfunctions.js";
import { addVehicleToUser, deleteVehicle } from '../controllers/vehicleControllers/addVehicleToUserController.js'
import {
  getVehicleByIdController,
  getAllVehiclesController,
  getVehiclesByUserIdController,
} from "../controllers/vehicleControllers/gettingvehiclesControllers.js";
import { getVehicleHistoryController } from '../controllers/vehicleControllers/vehicleHistory.js'
import { vehicleDataController } from '../controllers/VehicleDataController.js'

import paginationMiddleware from '../middlewares/paginationMiddleware.js'

const VehicleRouter = express.Router()

VehicleRouter.post('/add/:userId', addVehicleToUser)
VehicleRouter.delete('/:vehicleId', deleteVehicle)
VehicleRouter.get(
  '/all',
  paginationMiddleware,
  getAllVehiclesController
)
VehicleRouter.get('/:id',
  // paginationMiddleware,
  getVehicleByIdController)
VehicleRouter.get(
  "/user/:userId/vehicles",
  paginationMiddleware,
  getVehiclesByUserIdController
);
VehicleRouter.get(
  '/:vehicleId/history',
  paginationMiddleware,
  getVehicleHistoryController
)


// VEHICLE DATA for emission, fuel, and GPS data
VehicleRouter.use(verifyingtoken);

VehicleRouter.get(
  "/",
  vehicleDataController.getVehiclesByLoggedUser
);

VehicleRouter.get(
  '/:vehicleId/emissions/range',
  vehicleDataController.getEmissionsDataByTimeRange
);

VehicleRouter.get(
  '/:vehicleId/fuels/range',
  vehicleDataController.getFuelsDataByTimeRange
);

VehicleRouter.get(
  '/:vehicleId/gps/range',
  vehicleDataController.getGPSDataByTimeRange
);

VehicleRouter.get(
  "/data/all",
  vehicleDataController.getAllDataInSystem
);


VehicleRouter.get(
  "/analytics/data",
  vehicleDataController.analyticHub
);

VehicleRouter.get(
  "/map/data",
  vehicleDataController.getMapData
);


export default VehicleRouter
