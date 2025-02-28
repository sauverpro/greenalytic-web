import express from 'express'
import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import cors from 'cors'
import { Server } from 'socket.io' // Import Socket.IO server
import dotenv from 'dotenv'
dotenv.config()
import sanitizeUserMiddleware from './src/middlewares/sanitizeUserMiddleware.js'
import { createServer } from 'http' // ES6 Import for creating HTTP server

const app = express()

// Middleware setup
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

// Create an HTTP server to work with both Express and Socket.IO
const server = createServer(app) // Use ES6 import method for creating HTTP server

// Initialize Socket.IO with the existing HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], 
    
  }
})

// Socket.IO Setup (for handling WebSocket communication)
io.on('connection', socket => {
  console.log('A client connected:', socket.id)

  // Listen for events from the client
  socket.on('sendMessage', message => {
    console.log('Message received:', message)

    // Respond back to the client
    socket.emit('receiveMessage', `Message received: ${message}`)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start the server on the given port
const expressPort = process.env.EXPRESS_SERVER_PORT || 3000
server.listen(expressPort, () => {
  console.log(`Server running on port ${expressPort}`)
})

// Handle server shutdown gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server...')
  await server.close() // Close the server gracefully
  process.exit(0) // Exit process
})


