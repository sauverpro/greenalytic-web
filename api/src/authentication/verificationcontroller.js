import cron from 'node-cron'
import { catchAsync } from '../middlewares/globaleerorshandling.js'
import prisma from '../prismaClient.js' // Import Prisma client
import { isOTPValid } from '../utils/passwordfunctions.js' // Assuming isOTPValid function is in utils

const tokenExpirationTime = 24 * 60 * 60 * 1000 // Token expiration time in milliseconds

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Token is required for email verification.' })
  }

  // Find user with the given OTP token using Prisma
  const user = await prisma.user.findUnique({
    where: {
      otp: token
    }
  })

  if (!user) {
    return res.status(404).json({ message: 'Invalid token. User not found.' })
  }

  const receivedOTP = token
  const storedOTP = user.otp

  console.log('storedOTP-----', storedOTP)
  console.log('receivedOTP-----', receivedOTP)

  // Validate the OTP
  let validOTP = isOTPValid(storedOTP, receivedOTP, user.otpExpiresAt, res)
  console.log('____________________________isOTPValid_____________', validOTP)

  if (validOTP === true) {
    console.log('OTP is valid!')
    console.log('storedOTP-----', storedOTP)
    console.log('receivedOTP-----', receivedOTP)
    console.log('user.otpExpiresAt-----', user.otpExpiresAt)
    console.log('the current date is-----', new Date())

    // Mark the user as verified and clear OTP details
    await prisma.user.update({
      where: {
        email: user.email // Assuming email is unique
      },
      data: {
        verified: true,
        otp: null, // Clear OTP
        otpExpiresAt: null // Clear OTP expiration time
      }
    })

    res
      .status(200)
      .json({ message: 'Email verification successful. You can now login.' })
  }
})
