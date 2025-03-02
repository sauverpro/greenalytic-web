// emission-controller.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// CREATE - Add a new emission data record
export const createEmissionData = async (req, res) => {
  try {
    const {
      co2Percentage,
      coPercentage,
      o2Percentage,
      hcPPM,
      vehicleId,
      plateNumber,
      trackingDeviceId,
      timestamp
    } = req.body

    // Validate required fields
    if (
      !co2Percentage ||
      !coPercentage ||
      !o2Percentage ||
      !hcPPM ||
      !vehicleId ||
      !plateNumber ||
      !trackingDeviceId
    ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const emissionData = await prisma.emissionData.create({
      data: {
        co2Percentage: parseFloat(co2Percentage),
        coPercentage: parseFloat(coPercentage),
        o2Percentage: parseFloat(o2Percentage),
        hcPPM: parseInt(hcPPM),
        vehicleId: parseInt(vehicleId),
        plateNumber,
        trackingDeviceId: parseInt(trackingDeviceId),
        ...(timestamp && { timestamp: new Date(timestamp) })
      }
    })

    return res.status(201).json(emissionData)
  } catch (error) {
    console.error('Error creating emission data:', error)
    return res.status(500).json({ error: 'Failed to create emission data' })
  }
}

// READ - Get all emission data with pagination
export const getAllEmissionData = async (req, res) => {
  try {
    const { skip, take, startTime, endTime } = req.pagination // Ensure it's startTime and endTime

    // Debug log to check the parsed pagination values
    console.log('Pagination:', req.pagination)

    // Build the where clause for date filtering
    const whereClause = {}

    if (startTime && endTime) {
      whereClause.timestamp = {
        gte: startTime,
        lte: endTime
      }
    } else if (startTime) {
      whereClause.timestamp = { gte: startTime }
    } else if (endTime) {
      whereClause.timestamp = { lte: endTime }
    }

    // Debug log to check the where clause
    console.log('Where Clause:', whereClause)

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: true,
          trackingDevice: true
        }
      }),
      prisma.emissionData.count({
        where: whereClause
      })
    ])

    return res.status(200).json({
      data: emissionData,
      meta: {
        page: req.pagination.page,
        limit: req.pagination.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / req.pagination.limit)
      }
    })
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// Helper function to adjust start date to beginning of the day if only a date is given
const adjuststartTime = date => {
  const d = new Date(date)
  if (!date.includes('T')) {
    d.setHours(0, 0, 0, 0) // Start of the day
  }
  return d
}

// Helper function to adjust end date to end of the day if only a date is given
const adjustendTime = date => {
  const d = new Date(date)
  if (!date.includes('T')) {
    d.setHours(23, 59, 59, 999) // End of the day
  }
  return d
}

// READ - Get emission data by ID
export const getEmissionDataById = async (req, res) => {
  try {
    const { id } = req.params

    const emissionData = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: true,
        trackingDevice: true
      }
    })

    if (!emissionData) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    return res.status(200).json(emissionData)
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// READ - Get emission data by vehicle ID
export const getEmissionDataByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { page = 1, limit = 10, startTime, endTime } = req.pagination// Get pagination and time filter values from query params
console.log('Pagination:', req.pagination)
    // Parse `page` and `limit` values (with defaults)
    const parsedPage = parseInt(page) || 1
    const parsedLimit = parseInt(limit) || 10
    const skip = (parsedPage - 1) * parsedLimit
    const take = parsedLimit

    // Build where clause
    const whereClause = { vehicleId: parseInt(vehicleId) }

    // Apply timestamp filters if provided
    if (startTime && endTime) {
      whereClause.timestamp = {
        gte: new Date(startTime),
        lte: new Date(endTime)
      }
    } else if (startTime) {
      whereClause.timestamp = {
        gte: new Date(startTime)
      }
    } else if (endTime) {
      whereClause.timestamp = {
        lte: new Date(endTime)
      }
    }

    // Fetch emission data and total count in parallel
    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          trackingDevice: true
        }
      }),
      prisma.emissionData.count({
        where: whereClause
      })
    ])

    // Calculate total pages, current page, and remaining items
    const totalPages = Math.ceil(totalCount / parsedLimit)
    const remainingItems = Math.max(0, totalCount - parsedPage * parsedLimit)

    // Return the response with required metadata
    return res.status(200).json({
      data: emissionData,
      meta: {
        currentPage: parsedPage,
        totalPages,
        remainingItems, // Items left after the current page
        totalItems: totalCount,
        limit: parsedLimit
      }
    })
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// READ - Get emission data by vehicle ID with time interval filtering
export const getEmissionDataByVehicleInterval = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { interval, value } = req.query
    const { skip, take } = req.pagination

    if (!interval || !value) {
      return res
        .status(400)
        .json({ error: 'Interval and value are required parameters' })
    }

    // Build where clause for vehicle
    const whereClause = { vehicleId: parseInt(vehicleId) }

    // Calculate date range based on interval
    const now = new Date()
    let startTime, endTime

    switch (interval) {
      case 'hours':
        startTime = new Date(now)
        startTime.setHours(now.getHours() - parseInt(value))
        break
      case 'days':
        startTime = new Date(now)
        startTime.setDate(now.getDate() - parseInt(value))
        break
      case 'daytime':
        // For daytime, we assume working hours (e.g., 9 AM to 5 PM)
        startTime = new Date(now)
        startTime.setHours(9, 0, 0, 0) // 9 AM
        endTime = new Date(now)
        endTime.setHours(17, 0, 0, 0) // 5 PM
        break
      default:
        return res
          .status(400)
          .json({ error: 'Invalid interval. Use hours, days, or daytime' })
    }

    // Set the date range in the where clause
    if (interval === 'daytime') {
      whereClause.timestamp = {
        gte: startTime,
        lte: endTime
      }
    } else {
      whereClause.timestamp = {
        gte: startTime
      }
    }

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          trackingDevice: true
        }
      }),
      prisma.emissionData.count({
        where: whereClause
      })
    ])

    return res.status(200).json({
      data: emissionData,
      meta: {
        page: req.pagination.page,
        limit: req.pagination.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / req.pagination.limit),
        interval,
        value: interval === 'daytime' ? 'working hours (9AM-5PM)' : value,
        timeRange: {
          from: startTime,
          to: endTime || now
        }
      }
    })
  } catch (error) {
    console.error('Error fetching emission data by interval:', error)
    return res
      .status(500)
      .json({ error: 'Failed to fetch emission data by interval' })
  }
}

// READ - Get emission data by plate number
export const getEmissionDataByPlateNumber = async (req, res) => {
  try {
    const { plateNumber } = req.params
    const { skip, take, startTime, endTime } = req.pagination

    // Build where clause
    const whereClause = { plateNumber }

    if (startTime && endTime) {
      whereClause.timestamp = {
        gte: startTime,
        lte: endTime
      }
    } else if (startTime) {
      whereClause.timestamp = {
        gte: startTime
      }
    } else if (endTime) {
      whereClause.timestamp = {
        lte: endTime
      }
    }

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: true,
          trackingDevice: true
        }
      }),
      prisma.emissionData.count({
        where: whereClause
      })
    ])

    return res.status(200).json({
      data: emissionData,
      meta: {
        page: req.pagination.page,
        limit: req.pagination.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / req.pagination.limit)
      }
    })
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// UPDATE - Update emission data by ID
export const updateEmissionData = async (req, res) => {
  try {
    const { id } = req.params
    const {
      co2Percentage,
      coPercentage,
      o2Percentage,
      hcPPM,
      vehicleId,
      plateNumber,
      trackingDeviceId,
      timestamp
    } = req.body

    // Check if record exists
    const existingRecord = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingRecord) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    // Prepare update data with proper type conversion
    const updateData = {}
    if (co2Percentage !== undefined) {
      updateData.co2Percentage = parseFloat(co2Percentage)
    }
    if (coPercentage !== undefined) {
      updateData.coPercentage = parseFloat(coPercentage)
    }
    if (o2Percentage !== undefined) {
      updateData.o2Percentage = parseFloat(o2Percentage)
    }
    if (hcPPM !== undefined) updateData.hcPPM = parseInt(hcPPM)
    if (vehicleId !== undefined) updateData.vehicleId = parseInt(vehicleId)
    if (plateNumber !== undefined) updateData.plateNumber = plateNumber
    if (trackingDeviceId !== undefined) {
      updateData.trackingDeviceId = parseInt(trackingDeviceId)
    }
    if (timestamp !== undefined) updateData.timestamp = new Date(timestamp)

    const updatedEmissionData = await prisma.emissionData.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return res.status(200).json(updatedEmissionData)
  } catch (error) {
    console.error('Error updating emission data:', error)
    return res.status(500).json({ error: 'Failed to update emission data' })
  }
}

// DELETE - Delete emission data by ID
export const deleteEmissionData = async (req, res) => {
  try {
    const { id } = req.params

    // Check if record exists
    const existingRecord = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingRecord) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    await prisma.emissionData.delete({
      where: { id: parseInt(id) }
    })

    return res
      .status(200)
      .json({ message: 'Emission data deleted successfully' })
  } catch (error) {
    console.error('Error deleting emission data:', error)
    return res.status(500).json({ error: 'Failed to delete emission data' })
  }
}

// BONUS - Get statistics about emissions
export const getEmissionStatistics = async (req, res) => {
  try {
    const { vehicleId, interval } = req.query
    const { startTime, endTime } = req.pagination

    let whereClause = {}

    if (vehicleId) {
      whereClause.vehicleId = parseInt(vehicleId)
    }

    // Handle date filtering
    if (interval) {
      const now = new Date()
      let intervalstartTime

      switch (interval) {
        case 'day':
          intervalstartTime = new Date(now)
          intervalstartTime.setDate(now.getDate() - 1)
          break
        case 'week':
          intervalstartTime = new Date(now)
          intervalstartTime.setDate(now.getDate() - 7)
          break
        case 'month':
          intervalstartTime = new Date(now)
          intervalstartTime.setMonth(now.getMonth() - 1)
          break
        default:
          return res
            .status(400)
            .json({ error: 'Invalid interval. Use day, week, or month' })
      }

      whereClause.timestamp = {
        gte: intervalstartTime
      }
    } else if (startTime && endTime) {
      whereClause.timestamp = {
        gte: startTime,
        lte: endTime
      }
    } else if (startTime) {
      whereClause.timestamp = {
        gte: startTime
      }
    } else if (endTime) {
      whereClause.timestamp = {
        lte: endTime
      }
    }

    const emissionData = await prisma.emissionData.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' }
    })

    if (emissionData.length === 0) {
      return res.status(200).json({
        message: 'No emission data found for the specified criteria',
        data: {
          averageCO2: 0,
          averageCO: 0,
          averageO2: 0,
          averageHC: 0,
          totalRecords: 0
        }
      })
    }

    // Calculate statistics
    const stats = emissionData.reduce(
      (acc, curr) => {
        return {
          co2Sum: acc.co2Sum + curr.co2Percentage,
          coSum: acc.coSum + curr.coPercentage,
          o2Sum: acc.o2Sum + curr.o2Percentage,
          hcSum: acc.hcSum + curr.hcPPM,
          count: acc.count + 1
        }
      },
      { co2Sum: 0, coSum: 0, o2Sum: 0, hcSum: 0, count: 0 }
    )

    return res.status(200).json({
      data: {
        averageCO2: stats.co2Sum / stats.count,
        averageCO: stats.coSum / stats.count,
        averageO2: stats.o2Sum / stats.count,
        averageHC: stats.hcSum / stats.count,
        totalRecords: stats.count,
        timeRange: interval
          ? { interval }
          : {
            from: startTime || 'beginning',
            to: endTime || 'now'
          }
      }
    })
  } catch (error) {
    console.error('Error calculating emission statistics:', error)
    return res
      .status(500)
      .json({ error: 'Failed to calculate emission statistics' })
  }
}
