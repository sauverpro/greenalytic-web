import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const passHashing = async password => {
  const saltRounds = parseInt(process.env.saltRounds) || 12;
  let hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export const passComparer = async (password, hashedPass) => {
  let result = await bcrypt.compare(password, hashedPass)
  return result
}

export const generateOTP = (expiryMinutes = 30) => {
  const otp = crypto.randomInt(100000, 999999)
  const expiryTime = new Date()
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes)
  return {
    code: otp.toString(),
    expiresAt: expiryTime
  }
}

export const isOTPValid = (storedOTP, enteredOTP, expiresAt) => {
  if (storedOTP !== enteredOTP) {
    return {
      valid: false,
      message: "Invalid OTP provided"
    }
  }
  
  const currentDateTime = new Date()
  const storedExpiresAt = new Date(expiresAt)
  
  if (currentDateTime > storedExpiresAt) {
    return {
      valid: false,
      message: "The provided OTP has expired"
    }
  }
  
  return {
    valid: true,
    message: "OTP is valid"
  }
}