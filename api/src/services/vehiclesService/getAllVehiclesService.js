import prisma from '../../../prismaClient.js'

// Service to get all vehicles with pagination
export const getAllVehiclesService = async pagination => {
  try {
    const { skip, take, page, limit } = pagination

    // Fetch the vehicles with refined user and trackingDevice info
    const vehicles = await prisma.vehicle.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            username: true, // Only show username
            image: true, // Profile picture
            phoneNumber: true // If needed
          }
        },
        trackingDevice: {
          select: {
            id: true,
            serialNumber: true,
            type: true,
            isActive: true,
            lastPing: true
          }
        }
      }
    })

    // Get the total count of vehicles in the system
    const totalCount = await prisma.vehicle.count()

    return {
      vehicles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        remainingItems: Math.max(0, totalCount - page * limit),
        totalItems: totalCount,
        limit
      }
    }
  } catch (error) {
    throw error
  }
}

// Service to get a vehicle by its ID
export const getVehicleByIdService = async id => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
      include: {
        trackingDevice: {
          select: {
            id: true,
            serialNumber: true,
            type: true,
            isActive: true,
            lastPing: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            image: true
          }
        }
      }
    })

    return vehicle
  } catch (error) {
    throw error
  }
}

// Service to get vehicles for a given user ID with pagination
export const getVehiclesByUserIdService = async (userId, pagination) => {
  try {
    const { skip, take, page, limit } = pagination

    // Fetch the vehicles for a given user with refined data
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: parseInt(userId) // Filter vehicles by userId
      },
      skip,
      take,
      include: {
        trackingDevice: {
          select: {
            id: true,
            serialNumber: true,
            type: true,
            isActive: true,
            lastPing: true
          }
        }
      }
    })

    // Get the total count of vehicles for this specific user
    const totalCount = await prisma.vehicle.count({
      where: {
        userId: parseInt(userId) // Count vehicles for the specific user
      }
    })

    return {
      vehicles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        remainingItems: Math.max(0, totalCount - page * limit),
        totalItems: totalCount,
        limit
      }
    }
  } catch (error) {
    throw error
  }
}
