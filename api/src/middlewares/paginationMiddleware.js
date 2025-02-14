// paginationMiddleware.js
export const paginationMiddleware = (req, res, next) => {
  // Default values for page and limit if not provided
  const defaultPage = 1
  const defaultLimit = 10

  // Extract the page and limit from query params (default to 1 and 10 if not provided)
  const page = parseInt(req.query.page) || defaultPage
  const limit = parseInt(req.query.limit) || defaultLimit

  // Optional: Validate that page and limit are positive integers
  if (page < 1 || limit < 1) {
    return res.status(400).json({
      message: 'Page and limit must be positive integers.'
    })
  }

  // Attach pagination info to the request object
  req.pagination = { page, limit }

  // Continue to the next middleware/controller
  next()
}
