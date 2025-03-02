import express from 'express'
import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import emissionRouter from './src/routes/emissionRoutes.js'
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

// Resolve directory path for Swagger YAML file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const swaggerDocument = YAML.load(path.join(__dirname, 'api-docs.yaml'))

// Middleware setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(cors())

app.use('/greenalytic', allRoutes)
// Connect to database
prisma
  .$connect()
  .then(() => console.log('Connected to the database!'))
  .catch(error => {
    console.error('Database connection error:', error)
    process.exit(1)
  })

// Create HTTP server
const server = createServer(app)

// Initialize WebSockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', socket => {
  console.log('A client connected:', socket.id)

  socket.on('sendMessage', message => {
    console.log('Message received:', message)
    socket.emit('receiveMessage', `Message received: ${message}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start server
const expressPort = process.env.EXPRESS_SERVER_PORT || 3000
server.listen(expressPort, () => {
  console.log(`Server running on port http://localhost:${expressPort}/api-docs`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing server...')
  await prisma.$disconnect()
  await server.close()
  process.exit(0)
})
