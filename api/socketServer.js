// socketServer.js
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
})

// Store vehicleId to socketId mapping in database
const updateVehicleConnection = async (
  vehicleId,
  socketId,
  status = 'CONNECTED'
) => {
  try {
    await prisma.connectionState.upsert({
      where: {
        vehicleId: vehicleId
      },
      update: {
        socketId: socketId,
        status: status,
        lastUpdated: new Date()
      },
      create: {
        vehicleId: vehicleId,
        socketId: socketId,
        status: status,
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error('Error updating connection state:', error)
  }
}

// Restore connections from database
const restoreConnections = async () => {
  try {
    const activeConnections = await prisma.connectionState.findMany({
      where: {
        status: 'CONNECTED'
      }
    })
    return activeConnections.reduce((acc, conn) => {
      acc.push({ vehicleId: conn.vehicleId, socketId: conn.socketId })
      return acc
    }, [])
  } catch (error) {
    console.error('Error restoring connections:', error)
    return []
  }
}

let vehicleSocketArray = []
const initializeConnections = async () => {
  vehicleSocketArray = await restoreConnections()
  console.log('Restored connections:', vehicleSocketArray)
}

initializeConnections()

// Data handlers for different types
const dataHandlers = {
  emission: async data => {
    const { vehicleId, dataPayload } = data
    return await prisma.emissionData.create({
      data: {
        timestamp: new Date(),
        co2Percentage: dataPayload.co2Percentage,
        coPercentage: dataPayload.coPercentage,
        o2Percentage: dataPayload.o2Percentage,
        hcPPM: dataPayload.hcPPM,
        vehicleId: vehicleId,
        plateNumber: dataPayload.plateNumber,
        trackingDeviceId: 1
      }
    })
  },
  fuel: async data => {
    const { vehicleId, dataPayload } = data
    return await prisma.fuelData.create({
      data: {
        timestamp: new Date(),
        fuelLevel: dataPayload.fuelLevel,
        fuelConsumption: dataPayload.fuelConsumption,
        plateNumber: dataPayload.plateNumber,
        trackingDeviceId: 1,
        vehicleId: vehicleId
      }
    })
  },
  gps: async data => {
    const { vehicleId, dataPayload } = data
    return await prisma.gPSData.create({
      data: {
        latitude: dataPayload.latitude,
        longitude: dataPayload.longitude,
        speed: dataPayload.speed,
        accuracy: dataPayload.accuracy,
        plateNumber: dataPayload.plateNumber,
        timestamp: new Date(),
        vehicleId: vehicleId,
        trackingDeviceId: 1
      }
    })
  }
}

// Broadcast data to all connected clients
const broadcastData = (type, data, savedData) => {
  io.emit('dataStatus', {
    success: true,
    type,
    vehicleId: data.vehicleId,
    message: `${type} data received`,
    emissionData: type === 'emission' ? savedData : null,
    fuelData: type === 'fuel' ? savedData : null,
    gpsData: type === 'gps' ? savedData : null,
    timestamp: new Date()
  })
}

io.on('connection', socket => {
  console.log('A client connected:', socket.id)

  socket.on('trackVehicle', async vehicleId => {
    try {
      const existingIndex = vehicleSocketArray.findIndex(
        entry => entry.vehicleId === vehicleId
      )
      if (existingIndex !== -1) {
        vehicleSocketArray.splice(existingIndex, 1)
      }

      vehicleSocketArray.push({ vehicleId, socketId: socket.id })
      await updateVehicleConnection(vehicleId, socket.id)

      console.log(
        `Tracking vehicle ID: ${vehicleId} with socket ID: ${socket.id}`
      )

      // Notify all clients about new vehicle being tracked
      io.emit('vehicleTracking', {
        vehicleId,
        action: 'started',
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Error in trackVehicle:', error)
      socket.emit('trackingError', {
        success: false,
        message: 'Failed to establish tracking'
      })
    }
  })

  socket.on('sendData', async data => {
    try {
      const { type } = data
      const handler = dataHandlers[type]

      if (!handler) {
        throw new Error(`Unsupported data type: ${type}`)
      }

      const savedData = await handler(data)

      // Confirm to sender
      socket.emit('dataSaved', {
        success: true,
        message: `${type} data saved successfully`
      })

      // Broadcast to all connected clients
      broadcastData(type, data, savedData)
    } catch (error) {
      console.error('Error processing data:', error)
      socket.emit('dataStatus', {
        success: false,
        message: 'Error saving data.'
      })
    }
  })

  socket.on('disconnect', async () => {
    console.log('A client disconnected:', socket.id)

    const disconnectedVehicles = vehicleSocketArray.filter(
      entry => entry.socketId === socket.id
    )

    for (const vehicle of disconnectedVehicles) {
      await updateVehicleConnection(
        vehicle.vehicleId,
        socket.id,
        'DISCONNECTED'
      )

      // Notify all clients about vehicle disconnection
      io.emit('vehicleTracking', {
        vehicleId: vehicle.vehicleId,
        action: 'stopped',
        timestamp: new Date()
      })
    }

    vehicleSocketArray = vehicleSocketArray.filter(
      entry => entry.socketId !== socket.id
    )
  })
})

export { server, io, vehicleSocketArray }
