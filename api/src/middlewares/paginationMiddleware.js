export const paginationMiddleware = (req, res, next) => {
  let { page, limit, startTime, endTime } = req.query // Keep startTime and endTime as they are

  // Parse `page` and `limit`, ensuring defaults and valid numbers
  page = parseInt(page) || 1
  limit = parseInt(limit) || 10
  if (page < 1) page = 1
  if (limit < 1) limit = 10

  // Convert `startTime` & `endTime` to Date (if provided) and validate them
  startTime = startTime ? new Date(startTime) : null
  endTime = endTime ? new Date(endTime) : null

  if (startTime && isNaN(startTime.getTime())) startTime = null // Invalid date check
  if (endTime && isNaN(endTime.getTime())) endTime = null // Invalid date check

  // Attach pagination details to `req.pagination`
  req.pagination = {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
    startTime, // Keep startTime here as well
    endTime // Keep endTime here as well
  }

  next() // Proceed to the next middleware or route handler
}

export default paginationMiddleware
