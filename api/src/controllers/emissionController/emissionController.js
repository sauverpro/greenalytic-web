// emission-controller.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// This needs to be confirmed with Emmanuel. I just came up with these thresholds. They are currently used as a placeholder.
const EMISSION_THRESHOLDS = {
  co2: { warning: 0.5, critical: 1.0 }, // CO2 percentage
  co: { warning: 0.3, critical: 0.5 },  // CO percentage  
  hc: { warning: 200, critical: 400 },   // HC in PPM
  nox: { warning: 100, critical: 200 },  // NOx in PPM
  pm25: { warning: 25, critical: 50 },   // PM2.5 in μg/m³
}

// Helper function to analyze emission levels and generate alerts
const analyzeEmissionLevels = async (emissionData, vehicleId, plateNumber) => {
  const alerts = []
  
  // Check CO2 levels
  if (emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'Critical CO2 Emission Level',
      message: `Vehicle ${plateNumber} has critically high CO2 emissions (${emissionData.co2Percentage}%)`,
      triggerValue: `${emissionData.co2Percentage}%`,
      triggerThreshold: `CO2 > ${EMISSION_THRESHOLDS.co2.critical}%`,
      vehicleId,
    })
  } else if (emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'High CO2 Emission Level',
      message: `Vehicle ${plateNumber} has high CO2 emissions (${emissionData.co2Percentage}%)`,
      triggerValue: `${emissionData.co2Percentage}%`,
      triggerThreshold: `CO2 > ${EMISSION_THRESHOLDS.co2.warning}%`,
      vehicleId,
    })
  }

  // Check CO levels
  if (emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'Critical CO Emission Level',
      message: `Vehicle ${plateNumber} has critically high CO emissions (${emissionData.coPercentage}%)`,
      triggerValue: `${emissionData.coPercentage}%`,
      triggerThreshold: `CO > ${EMISSION_THRESHOLDS.co.critical}%`,
      vehicleId,
    })
  }

  // Check HC levels
  if (emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'Critical HC Emission Level',
      message: `Vehicle ${plateNumber} has critically high HC emissions (${emissionData.hcPPM} PPM)`,
      triggerValue: `${emissionData.hcPPM} PPM`,
      triggerThreshold: `HC > ${EMISSION_THRESHOLDS.hc.critical} PPM`,
      vehicleId,
    })
  }

  // Check NOx levels (new field from updated schema)
  if (emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'Critical NOx Emission Level',
      message: `Vehicle ${plateNumber} has critically high NOx emissions (${emissionData.noxPPM} PPM)`,
      triggerValue: `${emissionData.noxPPM} PPM`,
      triggerThreshold: `NOx > ${EMISSION_THRESHOLDS.nox.critical} PPM`,
      vehicleId,
    })
  }

  // Check PM2.5 levels (new field from updated schema)
  if (emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical) {
    alerts.push({
      type: 'HIGH_EMISSION_ALERT',
      title: 'Critical PM2.5 Level',
      message: `Vehicle ${plateNumber} has critically high PM2.5 levels (${emissionData.pm25Level} μg/m³)`,
      triggerValue: `${emissionData.pm25Level} μg/m³`,
      triggerThreshold: `PM2.5 > ${EMISSION_THRESHOLDS.pm25.critical} μg/m³`,
      vehicleId,
    })
  }

  return alerts
}

// Helper function to update vehicle emission status
const updateVehicleEmissionStatus = async (vehicleId, emissionData) => {
  const exceedsThresholds = 
    emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
    emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
    emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
    (emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
    (emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

  const newStatus = exceedsThresholds ? 'TOP_POLLUTING' : 'NORMAL_EMISSION'

  // Update vehicle status
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: newStatus },
  })

  return newStatus
}

// CREATE - Enhanced emission data creation with alert generation
export const createEmissionData = async (req, res) => {
  try {
    const {
      co2Percentage,
      coPercentage,
      o2Percentage,
      hcPPM,
      noxPPM,        // New field from updated schema
      pm25Level,     // New field from updated schema
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

    // Validate emission values are within reasonable ranges
    if (co2Percentage < 0 || co2Percentage > 100) {
      return res.status(400).json({ error: 'CO2 percentage must be between 0 and 100' })
    }
    if (coPercentage < 0 || coPercentage > 100) {
      return res.status(400).json({ error: 'CO percentage must be between 0 and 100' })
    }
    if (o2Percentage < 0 || o2Percentage > 100) {
      return res.status(400).json({ error: 'O2 percentage must be between 0 and 100' })
    }
    if (hcPPM < 0) {
      return res.status(400).json({ error: 'HC PPM must be non-negative' })
    }

    // Verify vehicle and tracking device exist
    const [vehicle, device] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } }),
      prisma.trackingDevice.findUnique({ where: { id: parseInt(trackingDeviceId) } })
    ])

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' })
    }
    if (!device) {
      return res.status(404).json({ error: 'Tracking device not found' })
    }

    // Create emission data with enhanced fields
    const emissionData = await prisma.emissionData.create({
      data: {
        co2Percentage: parseFloat(co2Percentage),
        coPercentage: parseFloat(coPercentage),
        o2Percentage: parseFloat(o2Percentage),
        hcPPM: parseInt(hcPPM),
        noxPPM: noxPPM ? parseFloat(noxPPM) : null,
        pm25Level: pm25Level ? parseFloat(pm25Level) : null,
        vehicleId: parseInt(vehicleId),
        plateNumber,
        trackingDeviceId: parseInt(trackingDeviceId),
        timestamp: timestamp ? new Date(timestamp) : new Date()
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            vehicleModel: true,
            userId: true,
          }
        },
        trackingDevice: {
          select: {
            serialNumber: true,
            model: true,
          }
        }
      }
    })

     await prisma.trackingDevice.update({
      where: { id: parseInt(trackingDeviceId) },
      data: { 
        lastPing: new Date(),
        status: 'ACTIVE',
        isActive: true,
      }
    })

    // Analyze emission levels and generate alerts if needed
    const alerts = await analyzeEmissionLevels(emissionData, parseInt(vehicleId), plateNumber)
    
    // Create alerts in database
    if (alerts.length > 0) {
      await prisma.alert.createMany({
        data: alerts.map(alert => ({
          ...alert,
          userId: vehicle.userId, // Assign to vehicle owner
        }))
      })
    }

    // Update vehicle emission status
    const vehicleStatus = await updateVehicleEmissionStatus(parseInt(vehicleId), emissionData)

    return res.status(201).json({
      message: 'Emission data created successfully',
      data: emissionData,
      vehicleStatus,
      alertsGenerated: alerts.length,
      alerts: alerts.map(alert => ({
        type: alert.type,
        title: alert.title,
        severity: alert.title.includes('Critical') ? 'CRITICAL' : 'WARNING'
      }))
    })
  } catch (error) {
    console.error('Error creating emission data:', error)
    return res.status(500).json({ error: 'Failed to create emission data' })
  }
}

// Enhanced statistics with basic analytics
export const getAllEmissionData = async (req, res) => {
  try {
    const { skip, take, startTime, endTime } = req.pagination
    const { vehicleStatus, emissionLevel, deviceCategory } = req.query

    console.log('Pagination:', req.pagination)

    // Build enhanced where clause
    const whereClause = {}

    // Date filtering
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

    if (vehicleStatus) {
      whereClause.vehicle = {
        status: vehicleStatus
      }
    }

    // Filter by emission level
    if (emissionLevel === 'HIGH') {
      whereClause.OR = [
        { co2Percentage: { gte: EMISSION_THRESHOLDS.co2.warning } },
        { coPercentage: { gte: EMISSION_THRESHOLDS.co.warning } },
        { hcPPM: { gte: EMISSION_THRESHOLDS.hc.warning } },
        { noxPPM: { gte: EMISSION_THRESHOLDS.nox.warning } },
        { pm25Level: { gte: EMISSION_THRESHOLDS.pm25.warning } }
      ]
    } else if (emissionLevel === 'CRITICAL') {
      whereClause.OR = [
        { co2Percentage: { gte: EMISSION_THRESHOLDS.co2.critical } },
        { coPercentage: { gte: EMISSION_THRESHOLDS.co.critical } },
        { hcPPM: { gte: EMISSION_THRESHOLDS.hc.critical } },
        { noxPPM: { gte: EMISSION_THRESHOLDS.nox.critical } },
        { pm25Level: { gte: EMISSION_THRESHOLDS.pm25.critical } }
      ]
    }

    // Filter by device category
    if (deviceCategory) {
      whereClause.trackingDevice = {
        deviceCategory: deviceCategory
      }
    }

    console.log('Enhanced Where Clause:', JSON.stringify(whereClause, null, 2))

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: {
            select: {
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
              status: true,
              fuelType: true,
            }
          },
          trackingDevice: {
            select: {
              serialNumber: true,
              model: true,
              deviceCategory: true,
              status: true,
            }
          }
        }
      }),
      prisma.emissionData.count({
        where: whereClause
      })
    ])

    // Add emission level classification to each record
    const enhancedData = emissionData.map(data => {
      const isCritical = 
        data.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
        data.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
        data.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
        (data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
        (data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

      const isHigh = 
        data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
        data.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
        data.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
        (data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
        (data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

      let emissionLevel = 'NORMAL'
      if (isCritical) emissionLevel = 'CRITICAL'
      else if (isHigh) emissionLevel = 'HIGH'

      return {
        ...data,
        emissionLevel,
        exceedsThresholds: {
          co2: data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning,
          co: data.coPercentage >= EMISSION_THRESHOLDS.co.warning,
          hc: data.hcPPM >= EMISSION_THRESHOLDS.hc.warning,
          nox: data.noxPPM ? data.noxPPM >= EMISSION_THRESHOLDS.nox.warning : false,
          pm25: data.pm25Level ? data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning : false,
        }
      }
    })

    return res.status(200).json({
      data: enhancedData,
      meta: {
        page: req.pagination.page,
        limit: req.pagination.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / req.pagination.limit),
        filters: {
          applied: { vehicleStatus, emissionLevel, deviceCategory },
          thresholds: EMISSION_THRESHOLDS
        }
      }
    })
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// READ - Get emission data by ID
export const getEmissionDataById = async (req, res) => {
  try {
    const { id } = req.params

    const emissionData = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            vehicleModel: true,
            vehicleType: true,
            fuelType: true,
            status: true,
            user: {
              select: {
                fullName: true,
                companyName: true,
              }
            }
          }
        },
        trackingDevice: {
          select: {
            serialNumber: true,
            model: true,
            deviceCategory: true,
            status: true,
          }
        }
      }
    })

    if (!emissionData) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    // Add emission level analysis
    const isCritical = 
      emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
      emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
      emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
      (emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
      (emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

    const isHigh = 
      emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
      emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
      emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
      (emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
      (emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

    const enhancedData = {
      ...emissionData,
      emissionLevel: isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL',
      thresholdAnalysis: {
        co2: {
          value: emissionData.co2Percentage,
          exceedsWarning: emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning,
          exceedsCritical: emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical,
        },
        co: {
          value: emissionData.coPercentage,
          exceedsWarning: emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning,
          exceedsCritical: emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical,
        },
        hc: {
          value: emissionData.hcPPM,
          exceedsWarning: emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning,
          exceedsCritical: emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical,
        },
        nox: emissionData.noxPPM ? {
          value: emissionData.noxPPM,
          exceedsWarning: emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning,
          exceedsCritical: emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical,
        } : null,
        pm25: emissionData.pm25Level ? {
          value: emissionData.pm25Level,
          exceedsWarning: emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning,
          exceedsCritical: emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical,
        } : null,
      },
      thresholds: EMISSION_THRESHOLDS
    }

    return res.status(200).json(enhancedData)
  } catch (error) {
    console.error('Error fetching emission data:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data' })
  }
}

// READ - Get emission data by vehicle ID
export const getEmissionDataByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const { page = 1, limit = 10, startTime, endTime } = req.pagination
    console.log('Pagination:', req.pagination)

    const parsedPage = parseInt(page) || 1
    const parsedLimit = parseInt(limit) || 10
    const skip = (parsedPage - 1) * parsedLimit
    const take = parsedLimit

    const whereClause = { vehicleId: parseInt(vehicleId) }

    if (startTime && endTime) {
      whereClause.timestamp = {
        gte: new Date(startTime),
        lte: new Date(endTime)
      }
    } else if (startTime) {
      whereClause.timestamp = { gte: new Date(startTime) }
    } else if (endTime) {
      whereClause.timestamp = { lte: new Date(endTime) }
    }

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          trackingDevice: {
            select: {
              serialNumber: true,
              model: true,
              deviceCategory: true,
            }
          }
        }
      }),
      prisma.emissionData.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(totalCount / parsedLimit)
    const remainingItems = Math.max(0, totalCount - parsedPage * parsedLimit)

    return res.status(200).json({
      data: emissionData,
      meta: {
        currentPage: parsedPage,
        totalPages,
        remainingItems,
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
      return res.status(400).json({ error: 'Interval and value are required parameters' })
    }

    const whereClause = { vehicleId: parseInt(vehicleId) }
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
        startTime = new Date(now)
        startTime.setHours(9, 0, 0, 0)
        endTime = new Date(now)
        endTime.setHours(17, 0, 0, 0)
        break
      default:
        return res.status(400).json({ error: 'Invalid interval. Use hours, days, or daytime' })
    }

    if (interval === 'daytime') {
      whereClause.timestamp = { gte: startTime, lte: endTime }
    } else {
      whereClause.timestamp = { gte: startTime }
    }

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          trackingDevice: {
            select: {
              serialNumber: true,
              model: true,
            }
          }
        }
      }),
      prisma.emissionData.count({ where: whereClause })
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
        timeRange: { from: startTime, to: endTime || now }
      }
    })
  } catch (error) {
    console.error('Error fetching emission data by interval:', error)
    return res.status(500).json({ error: 'Failed to fetch emission data by interval' })
  }
}

// READ - Get emission data by plate number
export const getEmissionDataByPlateNumber = async (req, res) => {
  try {
    const { plateNumber } = req.params
    const { skip, take, startTime, endTime } = req.pagination

    const whereClause = { plateNumber }

    if (startTime && endTime) {
      whereClause.timestamp = { gte: startTime, lte: endTime }
    } else if (startTime) {
      whereClause.timestamp = { gte: startTime }
    } else if (endTime) {
      whereClause.timestamp = { lte: endTime }
    }

    const [emissionData, totalCount] = await Promise.all([
      prisma.emissionData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          vehicle: {
            select: {
              vehicleModel: true,
              vehicleType: true,
              status: true,
            }
          },
          trackingDevice: {
            select: {
              serialNumber: true,
              model: true,
            }
          }
        }
      }),
      prisma.emissionData.count({ where: whereClause })
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

// UPDATE - Enhanced update with validation
export const updateEmissionData = async (req, res) => {
  try {
    const { id } = req.params
    const {
      co2Percentage,
      coPercentage,
      o2Percentage,
      hcPPM,
      noxPPM,        // New field
      pm25Level,     // New field
      vehicleId,
      plateNumber,
      trackingDeviceId,
      timestamp,
      deletedAt
    } = req.body

    const existingRecord = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) },
      include: { vehicle: true }
    })

    if (!existingRecord) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    // Prepare update data with proper type conversion and validation
    const updateData = {}
    
    if (co2Percentage !== undefined) {
      if (co2Percentage < 0 || co2Percentage > 100) {
        return res.status(400).json({ error: 'CO2 percentage must be between 0 and 100' })
      }
      updateData.co2Percentage = parseFloat(co2Percentage)
    }
    
    if (coPercentage !== undefined) {
      if (coPercentage < 0 || coPercentage > 100) {
        return res.status(400).json({ error: 'CO percentage must be between 0 and 100' })
      }
      updateData.coPercentage = parseFloat(coPercentage)
    }
    
    if (o2Percentage !== undefined) {
      if (o2Percentage < 0 || o2Percentage > 100) {
        return res.status(400).json({ error: 'O2 percentage must be between 0 and 100' })
      }
      updateData.o2Percentage = parseFloat(o2Percentage)
    }
    
    if (hcPPM !== undefined) {
      if (hcPPM < 0) {
        return res.status(400).json({ error: 'HC PPM must be non-negative' })
      }
      updateData.hcPPM = parseInt(hcPPM)
    }
    
    if (noxPPM !== undefined) updateData.noxPPM = noxPPM ? parseFloat(noxPPM) : null
    if (pm25Level !== undefined) updateData.pm25Level = pm25Level ? parseFloat(pm25Level) : null
    if (vehicleId !== undefined) updateData.vehicleId = parseInt(vehicleId)
    if (plateNumber !== undefined) updateData.plateNumber = plateNumber
    if (trackingDeviceId !== undefined) updateData.trackingDeviceId = parseInt(trackingDeviceId)
    if (timestamp !== undefined) updateData.timestamp = new Date(timestamp)
    if (deletedAt !== undefined) {
      updateData.deletedAt = deletedAt ? new Date(deletedAt) : null
    }

    const updatedEmissionData = await prisma.emissionData.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            vehicleModel: true,
            status: true,
          }
        },
        trackingDevice: {
          select: {
            serialNumber: true,
            model: true,
          }
        }
      }
    })

    // Re-analyze emission levels if emission values were updated
    const emissionFieldsUpdated = 
      co2Percentage !== undefined || 
      coPercentage !== undefined || 
      hcPPM !== undefined || 
      noxPPM !== undefined || 
      pm25Level !== undefined

    if (emissionFieldsUpdated && vehicleId) {
      await updateVehicleEmissionStatus(parseInt(vehicleId), updatedEmissionData)
    }

    return res.status(200).json({
      message: 'Emission data updated successfully',
      data: updatedEmissionData
    })
  } catch (error) {
    console.error('Error updating emission data:', error)
    return res.status(500).json({ error: 'Failed to update emission data' })
  }
}

// DELETE - Delete emission data by ID
export const deleteEmissionData = async (req, res) => {
  try {
    const { id } = req.params

    const existingRecord = await prisma.emissionData.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingRecord) {
      return res.status(404).json({ error: 'Emission data not found' })
    }

    await prisma.emissionData.delete({
      where: { id: parseInt(id) }
    })

    return res.status(200).json({ message: 'Emission data deleted successfully' })
  } catch (error) {
    console.error('Error deleting emission data:', error)
    return res.status(500).json({ error: 'Failed to delete emission data' })
  }
}

// Enhanced statistics with basic analytics
export const getEmissionStatistics = async (req, res) => {
  try {
    const { vehicleId, interval } = req.query
    const { startTime, endTime } = req.pagination

    let whereClause = {}

    if (vehicleId) {
      whereClause.vehicleId = parseInt(vehicleId)
    }

    // Handle date filtering
    let intervalStartTime
    if (interval) {
      const now = new Date()

      switch (interval) {
        case 'day':
          intervalStartTime = new Date(now)
          intervalStartTime.setDate(now.getDate() - 1)
          break
        case 'week':
          intervalStartTime = new Date(now)
          intervalStartTime.setDate(now.getDate() - 7)
          break
        case 'month':
          intervalStartTime = new Date(now)
          intervalStartTime.setMonth(now.getMonth() - 1)
          break
        default:
          return res.status(400).json({ error: 'Invalid interval. Use day, week, or month' })
      }

      whereClause.timestamp = { gte: intervalStartTime }
    } else if (startTime && endTime) {
      whereClause.timestamp = { gte: startTime, lte: endTime }
    } else if (startTime) {
      whereClause.timestamp = { gte: startTime }
    } else if (endTime) {
      whereClause.timestamp = { lte: endTime }
    }

    const emissionData = await prisma.emissionData.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            vehicleModel: true,
            status: true,
          }
        }
      }
    })

    if (emissionData.length === 0) {
      return res.status(200).json({
        message: 'No emission data found for the specified criteria',
        data: {
          averages: { co2: 0, co: 0, o2: 0, hc: 0, nox: 0, pm25: 0 },
          totals: { records: 0, exceedsThresholds: 0 },
          thresholdAnalysis: { normal: 0, high: 0, critical: 0 }
        }
      })
    }

    // Calculate enhanced statistics
    const stats = emissionData.reduce((acc, curr) => {
      const exceedsThreshold = 
        curr.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
        curr.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
        curr.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
        (curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
        (curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

      const isCritical = 
        curr.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
        curr.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
        curr.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
        (curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
        (curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

      return {
        co2Sum: acc.co2Sum + curr.co2Percentage,
        coSum: acc.coSum + curr.coPercentage,
        o2Sum: acc.o2Sum + curr.o2Percentage,
        hcSum: acc.hcSum + curr.hcPPM,
        noxSum: acc.noxSum + (curr.noxPPM || 0),
        noxCount: acc.noxCount + (curr.noxPPM ? 1 : 0),
        pm25Sum: acc.pm25Sum + (curr.pm25Level || 0),
        pm25Count: acc.pm25Count + (curr.pm25Level ? 1 : 0),
        count: acc.count + 1,
        exceedsThresholdCount: acc.exceedsThresholdCount + (exceedsThreshold ? 1 : 0),
        criticalCount: acc.criticalCount + (isCritical ? 1 : 0),
        highCount: acc.highCount + (exceedsThreshold && !isCritical ? 1 : 0),
      }
    }, { 
      co2Sum: 0, coSum: 0, o2Sum: 0, hcSum: 0, noxSum: 0, noxCount: 0, 
      pm25Sum: 0, pm25Count: 0, count: 0, exceedsThresholdCount: 0, 
      criticalCount: 0, highCount: 0 
    })

    const normalCount = stats.count - stats.exceedsThresholdCount

    return res.status(200).json({
      data: {
        averages: {
          co2: (stats.co2Sum / stats.count).toFixed(3),
          co: (stats.coSum / stats.count).toFixed(3),
          o2: (stats.o2Sum / stats.count).toFixed(3),
          hc: (stats.hcSum / stats.count).toFixed(1),
          nox: stats.noxCount > 0 ? (stats.noxSum / stats.noxCount).toFixed(3) : null,
          pm25: stats.pm25Count > 0 ? (stats.pm25Sum / stats.pm25Count).toFixed(3) : null,
        },
        totals: {
          records: stats.count,
          exceedsThresholds: stats.exceedsThresholdCount,
          exceedsPercentage: ((stats.exceedsThresholdCount / stats.count) * 100).toFixed(1),
        },
        thresholdAnalysis: {
          normal: normalCount,
          high: stats.highCount,
          critical: stats.criticalCount,
          normalPercentage: ((normalCount / stats.count) * 100).toFixed(1),
          highPercentage: ((stats.highCount / stats.count) * 100).toFixed(1),
          criticalPercentage: ((stats.criticalCount / stats.count) * 100).toFixed(1),
        },
        thresholds: EMISSION_THRESHOLDS,
        timeRange: interval ? { interval } : {
          from: startTime || 'beginning',
          to: endTime || 'now'
        }
      }
    })
  } catch (error) {
    console.error('Error calculating emission statistics:', error)
    return res.status(500).json({ error: 'Failed to calculate emission statistics' })
  }
}

// export const getEmissionDashboard = async (req, res) => {
//   try {
//     const { userId } = req.query
//     const now = new Date()
//     const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
//     const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

//     // Build where clause for user filtering
//     const userFilter = userId ? {
//       vehicle: { userId: parseInt(userId) }
//     } : {}

//     const [
//       recentEmissions,
//       todayStats,
//       weeklyEmissions,
//       activeAlerts
//     ] = await Promise.all([
//       // Recent emissions (last 10 records)
//       prisma.emissionData.findMany({
//         where: {
//           timestamp: { gte: last24Hours },
//           ...userFilter
//         },
//         take: 10,
//         orderBy: { timestamp: 'desc' },
//         include: {
//           vehicle: {
//             select: {
//               plateNumber: true,
//               vehicleModel: true,
//               status: true,
//             }
//           },
//           trackingDevice: {
//             select: {
//               serialNumber: true,
//               status: true,
//             }
//           }
//         }
//       }),

//       // Today's statistics
//       prisma.emissionData.aggregate({
//         where: {
//           timestamp: { gte: last24Hours },
//           ...userFilter
//         },
//         _avg: {
//           co2Percentage: true,
//           coPercentage: true,
//           o2Percentage: true,
//           hcPPM: true,
//           noxPPM: true,
//           pm25Level: true,
//         },
//         _count: true
//       }),

//       // Weekly emission count by status
//       prisma.emissionData.findMany({
//         where: {
//           timestamp: { gte: lastWeek },
//           ...userFilter
//         },
//         select: {
//           co2Percentage: true,
//           coPercentage: true,
//           hcPPM: true,
//           noxPPM: true,
//           pm25Level: true,
//         }
//       }),

//       // Active emission alerts
//       prisma.alert.findMany({
//         where: {
//           type: 'HIGH_EMISSION_ALERT',
//           isRead: false,
//           createdAt: { gte: last24Hours },
//           ...(userId && { userId: parseInt(userId) })
//         },
//         include: {
//           vehicle: {
//             select: {
//               plateNumber: true,
//               vehicleModel: true,
//             }
//           }
//         },
//         orderBy: { createdAt: 'desc' },
//         take: 5
//       })
//     ])

//     // Analyze weekly emissions by threshold levels
//     const weeklyAnalysis = weeklyEmissions.reduce((acc, emission) => {
//       const exceedsThreshold = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

//       const isCritical = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

//       if (isCritical) acc.critical++
//       else if (exceedsThreshold) acc.high++
//       else acc.normal++

//       acc.total++
//       return acc
//     }, { normal: 0, high: 0, critical: 0, total: 0 })

//     // Add emission level classification to recent emissions
//     const enhancedRecentEmissions = recentEmissions.map(emission => {
//       const isCritical = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

//       const isHigh = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

//       return {
//         ...emission,
//         emissionLevel: isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL'
//       }
//     })

//     return res.status(200).json({
//       summary: {
//         todayAverages: {
//           co2: todayStats._avg.co2Percentage?.toFixed(3) || 0,
//           co: todayStats._avg.coPercentage?.toFixed(3) || 0,
//           hc: todayStats._avg.hcPPM?.toFixed(1) || 0,
//           nox: todayStats._avg.noxPPM?.toFixed(3) || null,
//           pm25: todayStats._avg.pm25Level?.toFixed(3) || null,
//         },
//         measurementsToday: todayStats._count || 0,
//         activeAlerts: activeAlerts.length,
//         weeklyAnalysis: {
//           ...weeklyAnalysis,
//           normalPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.normal / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//           highPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.high / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//           criticalPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.critical / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//         }
//       },
//       recentEmissions: enhancedRecentEmissions,
//       alerts: activeAlerts,
//       thresholds: EMISSION_THRESHOLDS,
//       timestamp: now.toISOString()
//     })
//   } catch (error) {
//     console.error('Error getting emission dashboard:', error)
//     return res.status(500).json({ error: 'Failed to get emission dashboard' })
//   }
// }

// Helper function to adjust start date to beginning of the day if only a date is given
// const adjustStartTime = date => {
//   const d = new Date(date)
//   if (!date.includes('T')) {
//     d.setHours(0, 0, 0, 0) // Start of the day
//   }
//   return d
// }

// // Helper function to adjust end date to end of the day if only a date is given
// const adjustEndTime = date => {
//   const d = new Date(date)
//   if (!date.includes('T')) {
//     d.setHours(23, 59, 59, 999) // End of the day
//   }
//   return d
// }