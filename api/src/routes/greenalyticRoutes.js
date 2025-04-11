import { Router } from 'express'
import userRouters from './userRoutes.js'
import VehicleRouter from './vehicleRoutes.js'
import deviceRouter from "./trackingDeviceRoutes.js";
import emissionRouter from './emissionRoutes.js'
import { all } from 'axios'

const allRoutes = Router()

// Define API routes
allRoutes.use('/users', userRouters)
allRoutes.use('/vehicles', VehicleRouter)
allRoutes.use("/trackingDevices", deviceRouter);
allRoutes.use('/emissions', emissionRouter)

export default allRoutes
