// userValidation.js
export const validateUserSignup = (req, res, next) => {
  const { email, password, username,  phoneNumber } = req.body
console.log("the request body we receive is  ", req.body)
  if (!email || !password || !username || !phoneNumber) {
    return res.status(400).json({
      message:
        'Please provide all required fields: email, password, name, phoneNumber.'
    })
  }

  // Additional validation for email format, password length, etc.
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      message: 'Please provide a valid email address.'
    })
  }

  next()
}
