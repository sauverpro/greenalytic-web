// Adjust the import based on your Prisma setup
import prisma from '../../../prismaClient.js'

// Get emission data (without Redis caching)
export const getEmissionData = async (page, limit, startDate, endDate) => {
  try {
    // Define filtering conditions
    const whereCondition = {
      deletedAt: null, // Ignore soft-deleted records
      ...(startDate && endDate
        ? { timestamp: { gte: startDate, lte: endDate } }
        : {}) // Time-based filtering
    }

    // Get total count for pagination
    const totalItems = await prisma.emissionData.count({
      where: whereCondition
    })
    const totalPages = Math.ceil(totalItems / limit)

    // Fetch emission data with pagination
    const emissions = await prisma.emissionData.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { timestamp: 'desc' }, // Fetch latest records first
      select: {
        id: true,
        timestamp: true,
        co2Percentage: true,
        coPercentage: true,
        o2Percentage: true,
        hcPPM: true,
        plateNumber: true,
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            vehicleModel: true
          }
        }
      }
    })

    return {
      success: true,
      emissions,
      pagination: {
        currentPage: page,
        totalPages,
        remainingItems: Math.max(0, totalItems - page * limit),
        totalItems,
        limit
      }
    }
  } catch (error) {
    console.error('Error retrieving emission data:', error)
    return {
      success: false,
      message: 'Error retrieving emission data, please try again.'
    }
  }
}

// Get aggregated emission data (without Redis caching)
export const getAggregatedEmissionData = async (
  page,
  limit,
  startDate,
  endDate,
  interval = 'day'
) => {
  try {
    // Define the aggregation interval (hour or day)
    const dateGroupBy = interval === 'hour' ? 'hour' : 'day'

    // Define the filtering conditions
    const whereCondition = {
      deletedAt: null,
      ...(startDate && endDate
        ? { timestamp: { gte: startDate, lte: endDate } }
        : {})
    }

    // Get total count for pagination
    const totalItems = await prisma.emissionData.count({
      where: whereCondition
    })
    const totalPages = Math.ceil(totalItems / limit)

    // Aggregate emissions by the specified interval (day/hour)
    const emissions = await prisma.emissionData.groupBy({
      by: [dateGroupBy],
      where: whereCondition,
      _avg: {
        co2Percentage: true,
        coPercentage: true,
        o2Percentage: true,
        hcPPM: true
      },
      orderBy: { [dateGroupBy]: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Prepare response data
    const result = {
      success: true,
      emissions,
      pagination: {
        currentPage: page,
        totalPages,
        remainingItems: Math.max(0, totalItems - page * limit),
        totalItems,
        limit
      }
    }

    return result
  } catch (error) {
    console.error('Error retrieving aggregated emission data:', error)
    return {
      success: false,
      message: 'Error retrieving aggregated emission data, please try again.'
    }
  }
}
