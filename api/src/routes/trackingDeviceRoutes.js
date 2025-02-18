import express from 'express'
import {
  addTrackingDevice,
  removeTrackingDevice,
  deleteVehicleAndTrackingDevice,
  getTrackingDeviceStatus,
  getAllTrackingDevices,
  getTrackingDeviceById
} from '../controllers/trackingDeviceController.js'

const trackingRouter = express.Router()

// Route for adding a tracking device to a vehicle
trackingRouter.post('/trackvehicle/:vehicleId', addTrackingDevice)

// Route for removing a tracking device from a vehicle
trackingRouter.delete(
  '/trackvehicle/:vehicleId/:deviceId',
  removeTrackingDevice
)

// Route for deleting a vehicle and its tracking device
trackingRouter.delete('/vehicle/:vehicleId', deleteVehicleAndTrackingDevice)

// Route for getting the status of a tracking device
trackingRouter.get(
  '/tracking-device/:deviceId/status',
  getTrackingDeviceStatus
)

// Route for getting all tracking devices (with pagination support)
trackingRouter.get('/tracking-devices', getAllTrackingDevices)

// Route for getting a tracking device by its ID
trackingRouter.get('/tracking-device/:deviceId', getTrackingDeviceById)

export default trackingRouter
