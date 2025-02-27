// middlewares/paginationMiddleware.js

export const paginationMiddleware = (req, res, next) => {
  // Extract page and limit from query parameters
  let { page, limit, startTime, endTime } = req.query

  // Parse them into integers, with defaults if not provided
  page = parseInt(page) || 1 // Default to page 1 if not provided
  limit = parseInt(limit) || 10 // Default to 10 items per page if not provided

  // Ensure the values are not below 1
  if (page < 1) page = 1
  if (limit < 1) limit = 10
  // Convert startTime & endTime to Date format (if provided)
  const startDate = startTime ? new Date(startTime) : null
  const endDate = endTime ? new Date(endTime) : null

  // Attach pagination details to the request object
  req.pagination = {
    skip: (page - 1) * limit, // Skip the number of records already displayed in previous pages
    take: limit, // Number of records to fetch
    page,
    limit,
    startDate,
    endDate
  }

  next() // Move to the next middleware or route handler
}

export default paginationMiddleware
