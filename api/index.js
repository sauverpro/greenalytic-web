import express from 'express'
import { faker } from '@faker-js/faker'
import cors from 'cors'

import prisma from './prismaClient.js'
import { getRedisClient } from './redisManager.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'
import { server, io } from './socketServer.js'
import { startSimulation } from './src/controllers/addingdummydatas/client.js'
import { manySimulation } from './src/controllers/addingdummydatas/manyClints.js'
import { signup } from './src/controllers/userController.js'
import sanitizeUserMiddleware from './src/middlewares/sanitizeUserMiddleware.js'
import emissionRouter from './src/routes/emissionRoutes.js'

// Initialize services in parallel
async function initializeServices () {
  try {
    // Initialize Redis (with fallback to mock client)
    console.log('Initializing Redis...')
    global.redisClient = await getRedisClient()

    if (global.redisClient.isMock) {
      console.log('Using mock Redis client - caching will be disabled')
      console.log('For Windows users, please install Redis:')
      console.log(
        '1. Download from: https://github.com/tporadowski/redis/releases'
      )
      console.log('2. Run the installer and add Redis to your PATH')
      console.log(
        '3. Or use Docker: docker run --name redis -p 6379:6379 -d redis'
      )
    } else {
      try {
        await global.redisClient.connect()
        console.log('Redis client connected successfully')
      } catch (error) {
        console.warn(
          'Redis connection failed, using mock client:',
          error.message
        )
        global.redisClient = createMockRedisClient()
      }
    }

    // Connect to database
    await prisma.$connect()
    console.log('Connected to the database!')

    // Start express server
    const app = express()
    const expressPort = process.env.EXPRESS_SERVER_PORT || 2222

    app.use(sanitizeUserMiddleware)
    app.use(express.json())
    app.use(cors())

    // Setup routes
    app.use('/users', userRouters)
    app.use('/vehicles', VehicleRouter)
    app.use('/trackingDevices', trackingRouter)
    app.use('/emmision', emissionRouter)

    // Start the express server
    app.listen(expressPort, () => {
      console.log(`Express server running on port ${expressPort}`)
    })

    // Start socket.io server
    const socketPort = process.env.SOCKET_SERVER_PORT || 4000
    server.listen(socketPort, () => {
      console.log(`Socket.IO server is running on port ${socketPort}`)
    })

    // Handle server shutdown gracefully
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Closing servers and connections...')
      if (global.redisClient && !global.redisClient.isMock) {
        await global.redisClient.quit()
      }
      await server.close()
      await prisma.$disconnect()
      process.exit(0)
    })

    // Uncomment to run simulations
    // startSimulation();
    // manySimulation();
    // generateUsers(400);
  } catch (error) {
    console.error('Failed to initialize services:', error)
    process.exit(1)
  }
}

// Function to generate users
const generateUsers = async numberOfUsers => {
  for (let i = 0; i < numberOfUsers; i++) {
    const fakeUser = {
      email: faker.internet.email(),
      username: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      location: faker.location.city(),
      role: 'USER',
      password: faker.internet.password()
    }

    try {
      console.log(`Creating user ${i + 1}/${numberOfUsers}...`)

      const req = { body: fakeUser }
      const res = {
        status: statusCode => ({
          json: message =>
            console.log(`User ${i + 1} created: ${message.message}`)
        })
      }
      const next = error =>
        console.error(`Error creating user ${i + 1}:`, error)

      await signup(req, res, next)
    } catch (error) {
      console.error(`Failed to create user ${i + 1}:`, error)
    }
  }

  console.log(`Finished creating ${numberOfUsers} users.`)
}

// Create mock Redis client if needed
function createMockRedisClient () {
  console.log('Creating mock Redis client - caching will be disabled')

  const cache = new Map()

  return {
    isReady: false,
    isMock: true,
    connect: async () => {
      return Promise.resolve()
    },
    quit: async () => {
      return Promise.resolve()
    },
    on: () => {},
    get: async key => {
      return Promise.resolve(cache.get(key))
    },
    set: async (key, value, options) => {
      cache.set(key, value)
      return Promise.resolve('OK')
    },
    del: async key => {
      cache.delete(key)
      return Promise.resolve(1)
    }
  }
}

// Start everything
// initializeServices()
