



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

// Middleware for input validation


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
      include: { vehicles: true, trackingDevices: true }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Validate password
    let isTruePassword = await passComparer(password, user.password)
    if (!isTruePassword) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    // Pagination: limit the number of vehicles and tracking devices per page
    const maxLimit = 50; // Set a maximum limit for pagination
    const validLimit = Math.min(limit, maxLimit); // Ensure the limit does not exceed the maxLimit

    const vehiclesTotalCount = user.vehicles.length; // Total number of vehicles
    const trackingDevicesTotalCount = user.trackingDevices.length; // Total number of tracking devices

    // Calculate the total number of pages for vehicles and tracking devices
    const totalPagesForVehicles = Math.ceil(vehiclesTotalCount / validLimit);
    const totalPagesForTrackingDevices = Math.ceil(trackingDevicesTotalCount / validLimit);

    // If requested page exceeds available pages, set the page to the last available page
    const validPageForVehicles = Math.min(page, totalPagesForVehicles);
    const validPageForTrackingDevices = Math.min(page, totalPagesForTrackingDevices);

    // Fetch paginated vehicles and tracking devices
    const vehicles = user.vehicles.slice((validPageForVehicles - 1) * validLimit, validPageForVehicles * validLimit);
    const trackingDevices = user.trackingDevices.slice((validPageForTrackingDevices - 1) * validLimit, validPageForTrackingDevices * validLimit);

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
      trackingDevices: trackingDevices,
      pagination: {
        page: validPageForVehicles,
        limit: validLimit,
        totalVehicles: vehiclesTotalCount,
        totalPagesForVehicles: totalPagesForVehicles,
        totalTrackingDevices: trackingDevicesTotalCount,
        totalPagesForTrackingDevices: totalPagesForTrackingDevices
      }
    })
  } catch (err) {
    console.error('Login Error:', err)
    return res.status(500).json({ error: 'Internal Server Error' }) // 500 for unexpected errors
  }
}

