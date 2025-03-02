import { Router } from 'express'
import userRouters from './userRoutes.js'
import VehicleRouter from './vehicleRoutes.js'
import trackingRouter from './trackingDeviceRoutes.js'
import emissionRouter from './emissionRoutes.js'

const allRoutes = Router()

// Define API routes
allRoutes.use('/users', userRouters)
allRoutes.use('/vehicles', VehicleRouter)
allRoutes.use('/trackingDevices', trackingRouter)
allRoutes.use('/emissions', emissionRouter)

export default allRoutes
