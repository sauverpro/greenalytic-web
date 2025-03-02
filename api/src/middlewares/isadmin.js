// Import Prisma client

import prisma from "../../prismaClient.js"

export const isAdmin = async (req, res, next, userRole) => {
  const { userId } = req

  // Fetch user from the database using Prisma
  let user = await prisma.user.findUnique({
    where: { id: parseInt(userId) } // Ensure userId is an integer
  })

  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  // Check if the user role matches the required role
  let isAdmin = user.role === userRole

  if (!isAdmin) {
    return res.status(401).json({
      message: `Action is only reserved for ${userRole}, while the user role is ${user.role}`
    })
  }

  next()
}
