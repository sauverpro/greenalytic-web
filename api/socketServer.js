import { Server } from 'socket.io'

import dotenv from 'dotenv'
dotenv.config()
let io

export const setupSocketServer = server => {
  // Initialize Socket.IO server with the existing HTTP server
  io = new Server(server, {
    cors: {
      origin: '*' // Allow all origins (adjust for security)
    }
  })

  // Array to keep track of vehicle connections
  let vehicleSocketArray = []

  // Data handlers for different types of data
  const dataHandlers = {
    emission: async data => {
      const { vehicleId, dataPayload } = data
      // Your logic to save emission data
      // Example: return await prisma.emissionData.create({...})
    },
    fuel: async data => {
      const { vehicleId, dataPayload } = data
      // Your logic to save fuel data
      // Example: return await prisma.fuelData.create({...})
    },
    gps: async data => {
      const { vehicleId, dataPayload } = data
      // Your logic to save GPS data
      // Example: return await prisma.gPSData.create({...})
    }
  }

  // Function to broadcast data to all connected clients
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

  // Handle client connections
  io.on('connection', socket => {
    console.log('A client connected:', socket.id)

    // Handle vehicle tracking requests
    socket.on('trackVehicle', async vehicleId => {
      try {
        // Remove any existing connection for this vehicleId
        const existingIndex = vehicleSocketArray.findIndex(
          entry => entry.vehicleId === vehicleId
        )
        if (existingIndex !== -1) {
          vehicleSocketArray.splice(existingIndex, 1)
        }

        // Add new vehicle connection
        vehicleSocketArray.push({ vehicleId, socketId: socket.id })
        console.log(
          `Tracking vehicle ID: ${vehicleId} with socket ID: ${socket.id}`
        )

        // Notify all clients that tracking started for this vehicle
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

    // Handle incoming data
    socket.on('sendData', async data => {
      try {
        const { type } = data
        const handler = dataHandlers[type]

        if (!handler) {
          throw new Error(`Unsupported data type: ${type}`)
        }

        const savedData = await handler(data) // Call appropriate handler based on data type

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

    // Handle client disconnections
    socket.on('disconnect', async () => {
      console.log('A client disconnected:', socket.id)

      // Find and remove the disconnected vehicle from the vehicleSocketArray
      const disconnectedVehicles = vehicleSocketArray.filter(
        entry => entry.socketId === socket.id
      )
      for (const vehicle of disconnectedVehicles) {
        // Update the vehicle connection status to 'DISCONNECTED' in the database
        // Example: await updateVehicleConnection(vehicle.vehicleId, socket.id, 'DISCONNECTED')

        // Notify all clients about the vehicle disconnection
        io.emit('vehicleTracking', {
          vehicleId: vehicle.vehicleId,
          action: 'stopped',
          timestamp: new Date()
        })
      }

      // Remove the vehicle socket connection from the array
      vehicleSocketArray = vehicleSocketArray.filter(
        entry => entry.socketId !== socket.id
      )
    })
  })

  return io // Return the io instance so it can be used elsewhere if needed
}

export { io }
