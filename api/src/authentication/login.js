import prisma from '../../prismaClient.js'
import { tokengenerating } from '../utils/jwtfunctions.js'
import { passComparer } from '../utils/passwordfunctions.js'
import { body, validationResult } from 'express-validator'

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

// Login function
export const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }) // 400 Bad Request
    }

    const { email, password } = req.body

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Validate password
    let isTruePassword = await passComparer(password, user.password)
    if (!isTruePassword) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    // Generate token with only the essential user info
    let token = tokengenerating({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    })

    // Response
    res.status(200).json({
      message: 'User logged in successfully',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login Error:', err)
    return res.status(500).json({ error: 'Internal Server Error' }) // 500 for unexpected errors
  }
}
