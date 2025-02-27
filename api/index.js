// api/index.js
import express from 'express'
import { faker } from '@faker-js/faker'

import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import { server, io } from './socketServer.js'

import cors from 'cors'
import { signup } from './src/controllers/userController.js'
import sanitizeUserMiddleware from './src/middlewares/sanitizeUserMiddleware.js'

const app = express()
app.use(sanitizeUserMiddleware)

app.use(express.json())
app.use(cors())
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
// startSimulation()
// manySimulation()
// Function to generate 400 users
const generateUsers = async numberOfUsers => {
  for (let i = 0; i < numberOfUsers; i++) {
    const fakeUser = {
      email: faker.internet.email(),
      username: faker.person.fullName(),
      phoneNumber: faker.phone.number(), // Updated method
      location: faker.location.city(),
      role: 'USER',
      password: faker.internet.password()
    }

    try {
      console.log(`Creating user ${i + 1}/${numberOfUsers}...`)

      // Simulate Express request and response
      const req = { body: fakeUser }
      const res = {
        status: statusCode => ({
          json: message =>
            console.log(`User ${i + 1} created: ${message.message}`)
        })
      }
      const next = error =>
        console.error(`Error creating user ${i + 1}:`, error)

      // Call the signup function to create the user
      await signup(req, res, next)
    } catch (error) {
      console.error(`Failed to create user ${i + 1}:`, error)
    }
  }

  console.log(`Finished creating ${numberOfUsers} users.`)
}

// Generate 400 users
// generateUsers(400)
