import prisma from '../../prismaClient.js'

class TrackingDeviceService {
  /**
   * Add a tracking device to a vehicle and track userId
   */

  static async addTrackingDeviceToVehicle (data) {
    try {
      const { serialNumber, model, type, plateNumber, vehicleId } = data

      // Ensure the vehicle exists and fetch `userId`
      const vehicleData = await prisma.vehicle.findUnique({
        where: { id: vehicleId, plateNumber: plateNumber },
        select: { id: true, userId: true }
      })

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
      console.log('the data here --------------------------------++')
      // Create the tracking device with `userId`
      const trackingDevice = await prisma.trackingDevice.create({
        data: {
          serialNumber,
          model,
          type,
          plateNumber,
          vehicleId,
          userId: vehicleData.userId, // Track userId from vehicle
          // trackingStatus: true 
        }
      })

      // **Update the vehicle to reference the new tracking device**
      const updatedVehicle = await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { trackingDevice: { connect: { id: trackingDevice.id } } },
        include: { trackingDevice: true } // Fetch updated tracking device info
      })

      // Log to confirm the update
      console.log('Updated Vehicle:', updatedVehicle)

      return { trackingDevice, updatedVehicle } // Return both for confirmation
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async removeTrackingDeviceFromVehicle (deviceId, vehicleId) {
    try {
      // First, find the tracking device
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id: deviceId },
        include: { vehicle: true }
      })

      if (!trackingDevice) {
        throw new Error('Tracking device not found.')
      }

      // If the device is linked to a vehicle, set trackingStatus to false
      if (trackingDevice.vehicleId === vehicleId) {
        await prisma.trackingDevice.update({
          where: { id: deviceId },
          data: { trackingStatus: false, vehicleId: null } // Set status to false and disconnect the vehicle
        })

        // Update the vehicle to remove the tracking device
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { trackingDevice: { disconnect: true } }
        })

        return {
          success: true,
          message: 'Tracking device removed from the vehicle.'
        }
      } else {
        throw new Error('Tracking device is not assigned to this vehicle.')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async deleteVehicleAndTrackingDevice (vehicleId) {
    try {
      // Find the tracking device associated with the vehicle
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { vehicleId }
      })

      if (trackingDevice) {
        // Set the tracking status to false and disconnect the device from the vehicle
        await prisma.trackingDevice.update({
          where: { vehicleId },
          data: { trackingStatus: false, vehicleId: null }
        })
      }

      // Delete the vehicle
      await prisma.vehicle.delete({
        where: { id: vehicleId }
      })

      return { success: true, message: 'Vehicle and tracking device deleted.' }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async getTrackingDeviceStatus (deviceId) {
    try {
      const trackingDevice = await prisma.trackingDevice.findUnique({
        where: { id: deviceId },
        select: { trackingStatus: true }
      })

      if (!trackingDevice) {
        throw new Error('Tracking device not found.')
      }

      return trackingDevice.trackingStatus
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
