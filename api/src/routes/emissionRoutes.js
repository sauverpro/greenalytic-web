// emission-routes.js
import express from 'express'
import { paginationMiddleware } from '../middlewares/paginationMiddleware.js'
import {
  createEmissionData,
  getAllEmissionData,
  getEmissionDataById,
  getEmissionDataByVehicle,
  getEmissionDataByVehicleInterval,
  getEmissionDataByPlateNumber,
  updateEmissionData,
  deleteEmissionData,
  getEmissionStatistics
} from '../controllers/emissionController/emissionController.js'

const emissionRouter = express.Router()

// Apply pagination middleware to all GET routes
emissionRouter.use(
  [
    '/',
    '/vehicle/:vehicleId',
    '/vehicle/:vehicleId/interval',
    '/plate/:plateNumber',
    '/statistics'
  ],
  paginationMiddleware
)

// Create routes
emissionRouter.post('/', createEmissionData)

// Read routes
emissionRouter.get('/', getAllEmissionData)
emissionRouter.get('/:id', getEmissionDataById)
emissionRouter.get('/vehicle/:vehicleId', getEmissionDataByVehicle)
emissionRouter.get(
  '/vehicle/:vehicleId/interval',
  getEmissionDataByVehicleInterval
)
emissionRouter.get(
  '/plate/:plateNumber',
  getEmissionDataByPlateNumber
)
emissionRouter.get('/statistics', getEmissionStatistics)

// Update route
emissionRouter.put('/:id', updateEmissionData)

// Delete route
emissionRouter.delete('/:id', deleteEmissionData)

export default emissionRouter
