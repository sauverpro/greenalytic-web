
import  prisma  from "../../../prismaClient.js";

// ✅ 2️⃣ Get All Vehicles (with Pagination & Filtering)
export const getAllVehiclesService = async (filters, pagination) => {
  try {
    const where = filters ? { ...filters } : {}

    const totalCount = await prisma.vehicle.count({ where })
    const totalPages = Math.ceil(totalCount / pagination.limit)

    const vehicles = await prisma.vehicle.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take
    })

    return {
      vehicles,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pagination.page,
        pageSize: pagination.limit,
        hasNextPage: pagination.page < totalPages,
        hasPrevPage: pagination.page > 1,
        nextPage: pagination.page < totalPages ? pagination.page + 1 : null,
        prevPage: pagination.page > 1 ? pagination.page - 1 : null
      }
    }
  } catch (error) {
    throw error
  }
}

// ✅ 3️⃣ Get Vehicle by ID
export const getVehicleByIdService = async vehicleId => {
  try {
    return await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    })
  } catch (error) {
    throw error
  }
}

// ✅ 4️⃣ Update Vehicle
export const updateVehicleService = async (vehicleId, updateData) => {
  try {
    return await prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data: updateData
    })
  } catch (error) {
    throw error
  }
}

// ✅ 5️⃣ Soft Delete Vehicle
export const softDeleteVehicleService = async vehicleId => {
  try {
    return await prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data: { deletedAt: new Date() }
    })
  } catch (error) {
    throw error
  }
}

// ✅ 6️⃣ Restore Soft Deleted Vehicle
export const restoreVehicleService = async vehicleId => {
  try {
    return await prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data: { deletedAt: null }
    })
  } catch (error) {
    throw error
  }
}

// ✅ 7️⃣ Hard Delete Vehicle (Permanent)
export const hardDeleteVehicleService = async vehicleId => {
  try {
    return await prisma.vehicle.delete({ where: { id: parseInt(vehicleId) } })
  } catch (error) {
    throw error
  }
}

// ✅ 🔟 Check if Vehicle Exists
export const checkVehicleExistsService = async plateNumber => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { plateNumber } })
    return !!vehicle
  } catch (error) {
    throw error
  }
}

// ✅ 1️⃣2️⃣ Search Vehicles by Plate Number
export const searchVehiclesByPlateService = async query => {
  try {
    return await prisma.vehicle.findMany({
      where: { plateNumber: { contains: query, mode: 'insensitive' } }
    })
  } catch (error) {
    throw error
  }
}

// ✅ 1️⃣3️⃣ Filter Vehicles (Type, Model, Usage)
export const filterVehiclesService = async filters => {
  try {
    return await prisma.vehicle.findMany({ where: filters })
  } catch (error) {
    throw error
  }
}

// ✅ 1️⃣4️⃣ Get Vehicle History (GPS, Fuel, Emission) in a Time Range
export const getVehicleHistoryService = async (
  vehicleId,
  startTime,
  endTime,
  pagination
) => {
  try {
    const { skip, take, page, limit } = pagination

    // ✅ Step 1: Check if the vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      select: { id: true } // Select only the ID to reduce query load
    })

    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // ✅ Step 2: Fetch emissions, GPS, and fuel data efficiently using Prisma transactions
    const [
      emissions,
      gpsData,
      fuelData,
      totalCounts
    ] = await prisma.$transaction([
      prisma.emissionData.findMany({
        where: {
          vehicleId: parseInt(vehicleId),
          timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
        },
        select: {
          id: true,
          timestamp: true,
          co2Percentage: true,
          coPercentage: true,
          o2Percentage: true,
          hcPPM: true
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take
      }),

      // prisma.gpsData.findMany({
      //   where: {
      //     vehicleId: parseInt(vehicleId),
      //     timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
      //   },
      //   select: {
      //     id: true,
      //     timestamp: true,
      //     latitude: true,
      //     longitude: true,
      //     speed: true,
      //     accuracy: true
      //   },
      //   orderBy: { timestamp: 'desc' },
      //   skip,
      //   take
      // }),

      // prisma.fuelData.findMany({
      //   where: {
      //     vehicleId: parseInt(vehicleId),
      //     timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
      //   },
      //   select: {
      //     id: true,
      //     timestamp: true,
      //     fuelLevel: true,
      //     fuelConsumption: true
      //   },
      //   orderBy: { timestamp: 'desc' },
      //   skip,
      //   take
      // }),

      // ✅ Step 3: Fetch total counts for pagination
      prisma.$transaction([
        prisma.emissionData.count({
          where: {
            vehicleId: parseInt(vehicleId),
            timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
          }
        }),
        prisma.gpsData.count({
          where: {
            vehicleId: parseInt(vehicleId),
            timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
          }
        }),
        prisma.fuelData.count({
          where: {
            vehicleId: parseInt(vehicleId),
            timestamp: { gte: new Date(startTime), lte: new Date(endTime) }
          }
        })
      ])
    ])

    // ✅ Step 4: Compute total pagination values
    const totalItems = totalCounts.reduce((acc, count) => acc + count, 0)
    const totalPages = Math.ceil(totalItems / limit)
    const remainingItems = Math.max(0, totalItems - page * limit)

    return {
      emissions,
      gpsData,
      fuelData,
      pagination: {
        currentPage: page,
        totalPages,
        remainingItems,
        totalItems,
        limit
      }
    }
  } catch (error) {
    throw error
  }
}
