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
// VehicleRouter.use(verifyingtoken);

VehicleRouter.get(
  "/",
  vehicleDataController.getVehiclesByUserId
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
  "/admin/emissions",
  vehicleDataController.getAllEmissionsData
);

VehicleRouter.get(
  "/admin/fuels",
  vehicleDataController.getAllFuelsData
);

VehicleRouter.get("/admin/gps",vehicleDataController.getAllGPSData);

VehicleRouter.get(
  "/admin/summary",
  vehicleDataController.getOverallSummary
);

// User data summary route (users can see their own data, admins can see any user's data)
VehicleRouter.get(
  "/users/:userId/data",
  vehicleDataController.getUserVehicleData
);





export default VehicleRouter
