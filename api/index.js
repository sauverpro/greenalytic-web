import express from 'express'
import http from 'http'
import { faker } from '@faker-js/faker'
import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import cors from 'cors'
import { signup } from './src/controllers/userController.js'

import dotenv from 'dotenv'
dotenv.config()
import sanitizeUserMiddleware from './src/middlewares/sanitizeUserMiddleware.js'
import { startSimulation } from './src/controllers/addingdummydatas/client.js'
import { setupSocketServer } from './socketServer.js' // Import the socket server setup

const app = express()
app.use(sanitizeUserMiddleware)
app.use(express.json())
app.use(cors())

// Define your API routes
app.use('/users', userRouters)
app.use('/vehicles', VehicleRouter)
app.use('/trackingDevices', trackingRouter)

// Connect to the database
prisma
  .$connect()
  .then(() => console.log('Connected to the database!'))
  .catch(error => {
    console.error('Database connection error:', error)
    process.exit(1)
  })

// Create an HTTP server to share with both Express and Socket.IO
const server = http.createServer(app)

// Initialize Socket.IO on the same server instance
setupSocketServer(server)

// Start the server on the given port
const expressPort = process.env.EXPRESS_SERVER_PORT 
server.listen(expressPort, () => {
  console.log(`Server running on port ${expressPort}`)
})

// Handle server shutdown gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server...')
  await server.close()
  process.exit(0)
})
// startSimulation();