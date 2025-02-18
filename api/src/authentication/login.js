// Middleware for input validation
export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  body('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer')
]

import prisma from '../../prismaClient.js'
import { tokengenerating } from '../utils/jwtfunctions.js'
import { passComparer } from '../utils/passwordfunctions.js'
import { body, validationResult } from 'express-validator'

// Login function
export const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }) // 400 Bad Request
    }

    const { email, password, page = 1, limit = 5 } = req.body

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        vehicles: {
          include: {
            trackingDevice: true // Fetch tracking device data
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Validate password
    let isTruePassword = await passComparer(password, user.password)
    if (!isTruePassword) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    // Pagination: limit the number of vehicles per page
    const maxLimit = 50 // Set a maximum limit for pagination
    const validLimit = Math.min(limit, maxLimit) // Ensure the limit does not exceed maxLimit

    const vehiclesTotalCount = user.vehicles.length // Total number of vehicles
    const totalPagesForVehicles = Math.ceil(vehiclesTotalCount / validLimit) // Calculate total pages

    // If requested page exceeds available pages, set to last available page
    const validPageForVehicles = Math.min(page, totalPagesForVehicles)

    // Fetch and format only necessary vehicle details
    const vehicles = user.vehicles
      .slice(
        (validPageForVehicles - 1) * validLimit,
        validPageForVehicles * validLimit
      )
      .map(vehicle => ({
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        trackingDevice: vehicle.trackingDevice
          ? {
            id: vehicle.trackingDevice.id,
            serialNumber: vehicle.trackingDevice.serialNumber
          }
          : null
      }))

    // Generate token
    let token = tokengenerating({
      user: user,
      _id: user.id,
      email: user.email
    })

    res.status(200).json({
      message: 'User logged in successfully',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
      vehicles: vehicles,
      pagination: {
        page: validPageForVehicles,
        limit: validLimit,
        totalVehicles: vehiclesTotalCount,
        totalPagesForVehicles: totalPagesForVehicles
      }
    })
  } catch (err) {
    console.error('Login Error:', err)
    return res.status(500).json({ error: 'Internal Server Error' }) // 500 for unexpected errors
  }
}
