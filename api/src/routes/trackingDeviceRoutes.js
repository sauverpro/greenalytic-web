import express from 'express'
import { addTrackingDevice } from '../controllers/trackingDeviceController.js'


const trackingRouter = express.Router()

trackingRouter.post('/trackvehicle/:vehicleId', addTrackingDevice)

export default trackingRouter
