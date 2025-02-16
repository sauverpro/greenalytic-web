import prisma from '../../prismaClient.js'

class TrackingDeviceService {
  /**
   * Add a tracking device to a vehicle and track userId
   */
  static async addTrackingDeviceToVehicle (data) {
    try {
      const { serialNumber, model, type, plateNumber, vehicleId } = data
      console.log('the data----', data)
      // Ensure the vehicle exists and fetch `userId`
      const vehicleData = await prisma.vehicle.findUnique({
        where: { id: vehicleId, plateNumber: plateNumber }
        // select: { id: true, userId: true } // Include userId
      })
      console.log('the vehicleData found----', vehicleData)
      if (!vehicleData) {
        throw new Error('Vehicle not found or plate number mismatch.')
      }

      // Ensure no other tracking device is already assigned to this vehicle
      const existingDevice = await prisma.trackingDevice.findFirst({
        where: { vehicleId }
      })

      if (existingDevice) {
        throw new Error('This vehicle already has a tracking device.')
      }

      // Ensure the serial number is unique
      const existingSerial = await prisma.trackingDevice.findUnique({
        where: { serialNumber }
      })

      if (existingSerial) {
        throw new Error(
          'Tracking device with this serial number already exists.'
        )
      }

      // Create tracking device with `userId`
      const trackingDevice = await prisma.trackingDevice.create({
        data: {
          serialNumber,
          model,
          type,
          plateNumber,
          vehicleId,
          userId: vehicleData.userId // Track userId from vehicle
        }
      })

      return trackingDevice
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get all tracking devices (with userId)
   */
  static async getAllTrackingDevices (page, limit) {
    try {
      const skip = (page - 1) * limit
      const devices = await prisma.trackingDevice.findMany({
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } } // Include user info
      })

      return devices
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get tracking device by ID
   */
  static async getTrackingDeviceById (id) {
    try {
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } } // Include user info
      })

      if (!trackingDevice) {
        throw new Error('Tracking device not found.')
      }

      return trackingDevice
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default TrackingDeviceService
