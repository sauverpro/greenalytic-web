import express from 'express'
import prisma from './prismaClient.js'
import cors from 'cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { createServer } from 'http'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import allRoutes from './src/routes/greenalyticRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const swaggerDocument = YAML.load(path.join(__dirname, 'api-docs.yaml'))

// Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(cors())

app.use('/greenalytic', allRoutes)

// Connect to DB
prisma
  .$connect()
  .then(() => console.log('Connected to the database!'))
  .catch(error => {
    console.error('Database connection error:', error)
    process.exit(1)
  })

// Create server and Socket.IO
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Socket.IO logic
io.on('connection', socket => {
  console.log('Client connected:', socket.id)

  // IDENTIFY DEVICE
  socket.on('identify', async ({ trackingDeviceId }) => {
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { id: trackingDeviceId },
        include: { vehicle: true },
      })

      if (!device) {
        socket.emit('error', 'Unauthorized device')
        return socket.disconnect(true)
      }

      if (!device.vehicle) {
        socket.emit('error', 'Device not assigned to any vehicle')
        return socket.disconnect(true)
      }

      // Join a private room per device
      const roomName = `trackingDevice:${trackingDeviceId}`
      socket.join(roomName)
      socket.data.trackingDeviceId = trackingDeviceId

      await prisma.connectionState.upsert({
        where: { vehicleId: String(device.vehicle.id) },
        update: {
          socketId: socket.id,
          status: 'CONNECTED',
          lastUpdated: new Date(),
        },
        create: {
          vehicleId: String(device.vehicle.id),
          socketId: socket.id,
          status: 'CONNECTED',
          lastUpdated: new Date(),
        },
      })

      socket.emit('connected', 'Device connected and authorized')
      console.log(`✅ Device ${trackingDeviceId} joined room ${roomName}`)
    } catch (error) {
      console.error('Identify error:', error)
      socket.emit('error', 'Server error')
      socket.disconnect(true)
    }
  })

  // GPS DATA
  socket.on('gpsData', async data => {
    console.log('📡 Received GPS data:', data)
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { id: data.trackingDeviceId },
        include: { vehicle: true }
      })
      if (!device?.vehicle) return

      const gps = await prisma.gpsData.create({
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          accuracy: data.accuracy,
          plateNumber: data.plateNumber,
          trackingDeviceId: device.id,
          vehicleId: device.vehicle.id
        }
      })

      io.to(`trackingDevice:${data.trackingDeviceId}`).emit('gpsUpdate', gps)
    } catch (err) {
      console.error('GPS Error:', err)
    }
  })

  // FUEL DATA
  socket.on('fuelData', async data => {
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { id: data.trackingDeviceId },
        include: { vehicle: true }
      })
      if (!device?.vehicle) return

      const fuel = await prisma.fuelData.create({
        data: {
          fuelLevel: data.fuelLevel,
          fuelConsumption: data.fuelConsumption,
          plateNumber: data.plateNumber,
          trackingDeviceId: device.id,
          vehicleId: device.vehicle.id
        }
      })

      io.to(`trackingDevice:${data.trackingDeviceId}`).emit('fuelUpdate', fuel)
    } catch (err) {
      console.error('Fuel Error:', err)
    }
  })

  // EMISSION DATA
  socket.on('emissionData', async data => {
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { id: data.trackingDeviceId },
        include: { vehicle: true }
      })
      if (!device?.vehicle) return

      const emission = await prisma.emissionData.create({
        data: {
          co2Percentage: data.co2Percentage,
          coPercentage: data.coPercentage,
          o2Percentage: data.o2Percentage,
          hcPPM: data.hcPPM,
          noxPPM: data.noxPPM,
          pm25Level: data.pm25Level,
          plateNumber: data.plateNumber,
          trackingDeviceId: device.id,
          vehicleId: device.vehicle.id
        }
      })

      io.to(`trackingDevice:${data.trackingDeviceId}`).emit('emissionUpdate', emission)
    } catch (err) {
      console.error('Emission Error:', err)
    }
  })

  // OBD DATA
  socket.on('obdData', async data => {
    try {
      const device = await prisma.trackingDevice.findUnique({
        where: { id: data.trackingDeviceId },
        include: { vehicle: true }
      })
      if (!device?.vehicle) return

      const obd = await prisma.oBDData.create({
        data: {
          rpm: data.rpm,
          throttlePosition: data.throttlePosition,
          engineTemperature: data.engineTemperature,
          engineStatus: data.engineStatus,
          faultCodes: data.faultCodes || [],
          plateNumber: data.plateNumber,
          trackingDeviceId: device.id,
          vehicleId: device.vehicle.id
        }
      })

      io.to(`trackingDevice:${data.trackingDeviceId}`).emit('obdUpdate', obd)
    } catch (err) {
      console.error('OBD Error:', err)
    }
  })

  // DISCONNECT
  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id)
    try {
      await prisma.connectionState.updateMany({
        where: { socketId: socket.id },
        data: {
          status: 'DISCONNECTED',
          lastUpdated: new Date(),
        },
      })
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  })
})

// Start the server
const expressPort = process.env.EXPRESS_SERVER_PORT || 3000
server.listen(expressPort, () => {
  console.log(`Server running on http://localhost:${expressPort}/api-docs`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server...')
  await prisma.$disconnect()
   server.close()
  process.exit(0)
})
