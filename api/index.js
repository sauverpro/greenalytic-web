// api/index.js
import express from 'express'

import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import { server, io } from './socketServer.js'
import { startSimulation } from './client.js'

const app = express()
const expressPort = process.env.EXPRESS_SERVER_PORT || 2222

app.use(express.json()) // for parsing application/json
app.use('/users', userRouters) // Use user routes
app.use('/vehicles', VehicleRouter) // Use vehicle routes
app.use('/trackingDevices', trackingRouter) // Use vehicle routes

prisma
  .$connect()
  .then(() => console.log('Connected to the database!'))
  .catch(error => {
    console.error('Database connection error:', error)
    process.exit(1)
  })
app.listen(expressPort, () => {
  console.log(`Server running on port ${expressPort}`)
})

const socketPort = process.env.SOCKET_SERVER_PORT || 4000
server.listen(socketPort, () => {
  console.log(`Socket.IO server is running on port ${socketPort}`)
})
// Handle server shutdown gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server...')
  await server.close()
  process.exit(0)
})
startSimulation()
