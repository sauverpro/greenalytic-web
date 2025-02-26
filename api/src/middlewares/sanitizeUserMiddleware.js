// middleware/sanitizeUserMiddleware.js

import sanitizeUser from "../utils/sanitizeUser.js"


const sanitizeUserMiddleware = (req, res, next) => {
  // Intercept the response and sanitize user data
  const originalSend = res.send

  res.send = body => {
    let modifiedBody = body

    // Check if the body contains user data and sanitize it
    if (modifiedBody && modifiedBody.user) {
      modifiedBody.user = sanitizeUser(modifiedBody.user)
    }

    // Handle case when body contains an array of users
    if (Array.isArray(modifiedBody.users)) {
      modifiedBody.users = modifiedBody.users.map(user => sanitizeUser(user))
    }

    // Handle case when body contains relations with user data
    if (modifiedBody && modifiedBody.data) {
      modifiedBody.data = modifiedBody.data.map(item => {
        if (item.user) {
          item.user = sanitizeUser(item.user)
        }
        return item
      })
    }

    // Call the original send function with the modified body
    originalSend.call(res, modifiedBody)
  }

  next()
}

export default sanitizeUserMiddleware
