// utils/sanitizeUser.js
const sanitizeUser = user => {
  const { password, otp, token, ...sanitizedUser } = user
  return sanitizedUser
}

export default sanitizeUser
