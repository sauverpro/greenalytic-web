import express from 'express'
import {
  removeTrackingDevice,
  deleteVehicleAndTrackingDevice,
  getTrackingDeviceStatus,
  getAllTrackingDevices,
  getTrackingDeviceById,
  getTrackingDevicesByVehicleId,
  addTrackingDeviceToVehicle,
  getTrackingDevicesByUser,
  getDeviceDetails
} from '../controllers/trackingDeviceController.js'

const deviceRouter = express.Router()

deviceRouter.post('/add/:vehicleId', addTrackingDeviceToVehicle)

deviceRouter.get(
  '/vehicle/:vehicleId/devices',
  getTrackingDevicesByVehicleId
)
deviceRouter.get(
  '/:userId/devices',
  getTrackingDevicesByUser
)
deviceRouter.get(
  '/devices/:deviceId',
  getDeviceDetails
)

deviceRouter.delete(
  '/device/:vehicleId/:deviceId',
  removeTrackingDevice
)

deviceRouter.get(
  '/device/:deviceId/status',
  getTrackingDeviceStatus
)

deviceRouter.get('/all', getAllTrackingDevices)

deviceRouter.get('/:deviceId', getTrackingDeviceById)

export default deviceRouter
