import prisma from "../../../prismaClient.js";

// ✅ 1️⃣ Add Vehicle to User
export const addVehicleToUser = async (userId, vehicleData) => {
  try {
    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { vehicles: true }, // Include vehicles in the user response
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2️⃣ Check if the vehicle is already registered (system-wide)
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: vehicleData.plateNumber.trim() },
    });

    if (existingVehicle) {
      if (existingVehicle.userId !== parseInt(userId)) {
        throw new Error(
          "This vehicle is already registered under another user"
        );
      }
      throw new Error("This vehicle is already registered under your account");
    }

    // 3️⃣ Register the vehicle
    await prisma.vehicle.create({
      data: {
        plateNumber: vehicleData.plateNumber,
        chassisNumber: vehicleData.chassisNumber,
        vehicleType: vehicleData.vehicleType,
        vehicleModel: vehicleData.vehicleModel,
        yearOfManufacture: vehicleData.yearOfManufacture,
        usage: vehicleData.usage,
        userId: parseInt(userId),
      },
    });

    // 4️⃣ Return the updated user with their vehicles
    const updatedUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { vehicles: true },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
