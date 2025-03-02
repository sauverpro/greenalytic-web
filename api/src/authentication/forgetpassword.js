
import prisma from '../../prismaClient.js'
import { sendEmail } from '../utils/emailUtility.js'
import {
  generateOTP,
  isOTPValid,
  passHashing
} from '../utils/passwordfunctions.js'

// Generate and send OTP for password reset
export const generateAndSendOTP = async (req, res) => {
  try {
    const otp = generateOTP().code
    const expiresAt = generateOTP().expiresAt
    const userEmail = req.body.email

    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return res.status(404).json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
    }

    // Update OTP and expiration time for the user
    await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        otp: otp,
        otpExpiresAt: expiresAt
      }
    })

    // Send OTP email to user
    await sendEmail(
      user.email,
      'Password OTP Code Reset',
      'Password Resetting!',
      `Use this ${otp} to change your password. It is valid for five minutes and will expire at ${expiresAt}`
    )

    return res.status(200).json({
      message:
        'OTP sent successfully! Please check your email and use the OTP to reset your password.'
    })
  } catch (error) {
    console.error('Error generating and sending OTP:', error)
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' })
  }
}

// Verify OTP and update password
export const verifyOTPAndUpdatePassword = async (req, res) => {
  try {
    const userEmail = req.body.email

    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return res.status(404).json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
    }

    const receivedOTP = req.body.otp
    const storedOTP = user.otp

    console.log(
      'Accompanied information:',
      user.otpExpiresAt,
      '---',
      storedOTP
    )

    // Validate OTP
    let validotp = isOTPValid(storedOTP, receivedOTP, user.otpExpiresAt, res)
    if (validotp) {
      const newPassword = req.body.newpassword
      console.log('The new requested password:', req.body)

      // Hash the new password
      const hashedPassword = await passHashing(newPassword)

      // Update user password
      await prisma.user.update({
        where: {
          email: userEmail
        },
        data: {
          password: hashedPassword,
          otp: null, // Clear OTP after successful password reset
          otpExpiresAt: null // Clear OTP expiration time
        }
      })

      return res
        .status(200)
        .json({ message: 'Password updated successfully.' })
    }
  } catch (error) {
    console.error('Error verifying OTP and updating password:', error)
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' })
  }
}
