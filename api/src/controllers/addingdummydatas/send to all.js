// socketServer.js
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Create a Prisma client instance
const prisma = new PrismaClient()

// Create a server to handle Socket.IO
const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: '*'
    // methods: ['GET', 'POST']
  }
})

// Set up Socket.IO connection
io.on('connection', socket => {
  console.log('A client connected:', socket.id)

  // Listen for incoming data from clients (EmissionData, FuelData, GPSData)
  socket.on('sendData', async data => {
    try {
      // Destructure incoming data
      const { type, serialNumber, vehicleId, dataPayload } = data
      let responseMessage = ''
      let savedData = null
      // Based on data type, insert into the appropriate table (EmissionData, FuelData, GPSData)
      if (type === 'emission') {
        savedData = await prisma.emissionData.create({
          data: {
            timestamp: new Date(),
            co2Percentage: dataPayload.co2Percentage,
            coPercentage: dataPayload.coPercentage,
            o2Percentage: dataPayload.o2Percentage,
            hcPPM: dataPayload.hcPPM,
            vehicleId: vehicleId,
            plateNumber: dataPayload.plateNumber,
            trackingDeviceId: 1 // Assuming serial number links to trackingDevice
          }
        })
        responseMessage = 'Emission data saved successfully.'
        console.log('Emission data saved:', savedData)
      } else if (type === 'fuel') {
        savedData = await prisma.fuelData.create({
          data: {
            timestamp: new Date(),
            fuelLevel: dataPayload.fuelLevel,
            fuelConsumption: dataPayload.fuelConsumption,
            plateNumber: dataPayload.plateNumber,
            trackingDeviceId: 1,
            vehicleId: vehicleId
          }
        })
        responseMessage = 'Fuel data saved successfully.'
        console.log('Fuel data saved:', savedData)
      } else if (type === 'gps') {
        savedData = await prisma.gPSData.create({
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
        responseMessage = 'GPS data saved successfully.'
        console.log('GPS data saved:', savedData)
      }

      // Emit back to the client that the data was saved successfully
      socket.emit('dataStatus', {
        success: true,
        message: responseMessage
      })
      // ✅ Broadcast data to **all** connected clients
      io.emit('dataStatus', {
        success: true,
        message: responseMessage,
        emissionData: type === 'emission' ? savedData : null,
        fuelData: type === 'fuel' ? savedData : null,
        gpsData: type === 'gps' ? savedData : null
      })
    } catch (error) {
      // Handle errors and send failure status to client
      console.error('Error processing data:', error)
      socket.emit('dataStatus', {
        success: false,
        message: 'Error saving data.'
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id)
  })
})

// Export the server to be used in another file
export { server, io }
