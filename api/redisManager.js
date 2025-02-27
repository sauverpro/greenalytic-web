// redisManager.js - Updated for Windows compatibility
import { exec } from 'child_process'
import redis from 'redis'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

const execPromise = promisify(exec)

// Common Windows Redis installation paths
const WINDOWS_REDIS_PATHS = [
  'C:\\Program Files\\Redis',
  'C:\\Redis',
  'C:\\Program Files (x86)\\Redis'
]

// Find Redis executable on Windows
async function findRedisOnWindows () {
  // Try to find redis-server.exe in common locations
  for (const basePath of WINDOWS_REDIS_PATHS) {
    const serverPath = path.join(basePath, 'redis-server.exe')
    try {
      if (fs.existsSync(serverPath)) {
        return serverPath
      }
    } catch (error) {
      // Continue to next path
    }
  }

  // Try to find in PATH
  try {
    await execPromise('where redis-server')
    return 'redis-server'
  } catch (error) {
    // Not in PATH
  }

  return null
}

// Check if Redis is running
async function isRedisRunning () {
  try {
    const client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      socket: {
        connectTimeout: 1000 // Short timeout for quick check
      }
    })

    await client.connect()
    await client.quit()
    return true
  } catch (error) {
    return false
  }
}

// Start Redis server based on platform
async function startRedisServer () {
  console.log('Attempting to start Redis server...')

  try {
    const platform = process.platform

    if (platform === 'darwin') {
      // macOS
      await execPromise(
        'brew services start redis || redis-server --daemonize yes'
      )
    } else if (platform === 'linux') {
      // Linux
      await execPromise(
        'service redis-server start || redis-server --daemonize yes'
      )
    } else if (platform === 'win32') {
      // Windows - more robust approach
      const redisPath = await findRedisOnWindows()

      if (redisPath) {
        console.log(`Found Redis at: ${redisPath}`)
        // Start Redis in background
        const process = exec(`"${redisPath}"`)

        // Don't wait for process to exit
        process.unref()
        console.log('Started Redis process')
      } else {
        console.log(
          'Redis executable not found. You may need to install Redis for Windows.'
        )
        console.log(
          'Download from: https://github.com/tporadowski/redis/releases'
        )
        console.log(
          'Or use a Redis Docker container: docker run --name redis -p 6379:6379 -d redis'
        )

        return false
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    // Wait for Redis to start
    let attempts = 0
    while (attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (await isRedisRunning()) {
        console.log('Redis server started successfully')
        return true
      }
      attempts++
    }

    throw new Error('Redis server started but not responding')
  } catch (error) {
    console.error('Failed to start Redis server:', error.message)
    return false
  }
}

// Create a mock Redis client for when Redis is unavailable
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

// Initialize Redis - check if running and start if needed
async function initializeRedis () {
  if (await isRedisRunning()) {
    console.log('Redis is already running')
    return true
  }

  return startRedisServer()
}

// Create Redis client with reconnection logic
function createRedisClient () {
  const MAX_RETRIES = 5

  // Check if Redis URL is in env variables
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

  const client = redis.createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: retries => {
        if (retries >= MAX_RETRIES) {
          console.error(
            `Maximum reconnection attempts (${MAX_RETRIES}) reached. Giving up.`
          )
          return new Error('Maximum reconnection attempts reached')
        }
        const delay = Math.min(Math.pow(2, retries) * 200, 3000)
        console.log(
          `Reconnection attempt ${retries + 1}/${MAX_RETRIES} in ${delay}ms...`
        )
        return delay
      }
    }
  })

  client.on('connect', () => console.log('Redis client connected'))
  client.on('ready', () => console.log('Redis client ready'))
  client.on('reconnecting', () => console.log('Redis client reconnecting...'))
  client.on('error', err => console.error('Redis error:', err))
  client.on('end', () => console.log('Redis connection ended'))

  return client
}

// Get a Redis client - either real or mock depending on availability
async function getRedisClient () {
  // Try to connect to Redis
  try {
    if (await initializeRedis()) {
      return createRedisClient()
    }
  } catch (error) {
    console.error('Error initializing Redis:', error.message)
  }

  // Fall back to mock client if Redis is unavailable
  return createMockRedisClient()
}

export { initializeRedis, createRedisClient, getRedisClient }
