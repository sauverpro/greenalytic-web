import bcrypt from 'bcrypt'
import crypto from 'crypto'
export const passHashing = async password => {
  const saltRounds = await bcrypt.genSalt(parseInt(process.env.saltRounds))
  let hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export const passComparer = async (password, hashedPass) => {
  let result = await bcrypt.compare(password, hashedPass)
  return result
}

export const generateOTP = (expiryMinutes = 5) => {
  const otp = crypto.randomInt(100000, 999999)
  const expiryTime = new Date()
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes)
  return {
    code: otp.toString(),
    expiresAt: expiryTime
  }
}

export const isOTPValid = (storedOTP, enteredOTP, expiresAt, res) => {
  if (storedOTP !== enteredOTP) {
    res
      .status(401)
      .json({
        message: `Enter a valid OTP. Entered: ${enteredOTP}, Stored: ${storedOTP}`
      })
    return false
  }
  const currentDateTime = new Date()
  console.log('Current Date:', currentDateTime)

  const storedExpiresAt = new Date(expiresAt)

  if (currentDateTime > storedExpiresAt) {
    res.status(409).json({
      message: `The provided OTP has expired. Current date: ${currentDateTime}, Expiration date: ${storedExpiresAt}`
    })
    return false
  }

  return true
}
