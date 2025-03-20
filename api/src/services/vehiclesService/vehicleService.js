import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class VehicleService {
  /**
   * Check if a vehicle exists and belongs to the user
   * @param {number} vehicleId - The ID of the vehicle to check
   * @param {number} userId - The ID of the user making the request
   * @returns {Promise<boolean>} - True if the vehicle exists and belongs to the user, false otherwise
   */
  static async vehicleExistsAndBelongsToUser(vehicleId, userId) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId: userId },
    });
    return !!vehicle;
  }
  /**
   * Get all vehicles belonging to a user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} - List of vehicles belonging to the user
   */
  static async getVehiclesByUserId(userId) {
    return prisma.vehicle.findMany({
      where: { userId: userId },
    });
  }
}
