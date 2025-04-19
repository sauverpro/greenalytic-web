import prisma from "../../prismaClient.js";
import { passHashing } from "../utils/passwordfunctions.js";

prisma;

export const createUserService = async (userData) => {
  console.log("Creating user:", userData);
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already in use.",
      };
    }

    const hashedPassword = await passHashing(userData.password);

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Error creating user, please try again.",
    };
  }
};

export const getAllUsersService = async (page, limit) => {
  try {
    const totalItems = await prisma.user.count({
      where: {
        deletedAt: null,
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        role: true,
        phoneNumber: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            plateNumber: true,
            vehicleModel: true,
            vehicleType: true,
          },
        },
        trackingDevices: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            type: true,
            isActive: true,
          },
        },
      },
    });

    return {
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages,
        remainingItems: Math.max(0, totalItems - page * limit),
        totalItems,
        limit,
      },
    };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return {
      success: false,
      message: "Error retrieving users, please try again.",
    };
  }
};

export const getUserByIdService = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        role: true,
        phoneNumber: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            plateNumber: true,
            vehicleModel: true,
            vehicleType: true,
            _count: {
              select: {
                emissionDatas: true,
                fuelDatas: true,
                gpsDatas: true,
              },
            },
          },
        },
        trackingDevices: {
          select: {
            id: true,
            plateNumber: true,
            model: true,
            type: true,
            isActive: true,
            _count: {
              select: {
                emissionDatas: true,
                fuelDatas: true,
                gpsDatas: true,
              },
            },
          },
        },
        _count: {
          select: {
            vehicles: true,
            trackingDevices: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    let totalEmissions = 0;
    let totalFuelData = 0;
    let totalGpsData = 0;

    const deviceCounts = {
      gps: 0,
      fuel: 0,
      emissions: 0,
      total: user.trackingDevices.length,
    };

    user.trackingDevices.forEach((device) => {
      totalEmissions += device._count.emissionDatas;
      totalFuelData += device._count.fuelDatas;
      totalGpsData += device._count.gpsDatas;

      const deviceType = device.type.toLowerCase();
      if (deviceType === "gps") {
        deviceCounts.gps++;
      } else if (deviceType === "fuel") {
        deviceCounts.fuel++;
      } else if (deviceType === "emission") {
        deviceCounts.emissions++;
      }
    });

    user.vehicles.forEach((vehicle) => {
      totalEmissions += vehicle._count.emissionDatas;
      totalFuelData += vehicle._count.fuelDatas;
      totalGpsData += vehicle._count.gpsDatas;
    });

    const vehiclesWithDevices = user.vehicles.map((vehicle) => {
      const connectedDevices = user.trackingDevices.filter(
        (device) => device.vehicleId === vehicle.id
      );
      const vehicleDeviceTypes = {
        gps: connectedDevices.filter((d) => d.type.toLowerCase() === "gps")
          .length,
        fuel: connectedDevices.filter((d) => d.type.toLowerCase() === "fuel")
          .length,
        emission: connectedDevices.filter(
          (d) => d.type.toLowerCase() === "emission"
        ).length,
        total: connectedDevices.length,
      };
      return {
        ...vehicle,
        deviceTypes: vehicleDeviceTypes,
        connectedDevices: connectedDevices.map((d) => ({
          id: d.id,
          serialNumber: d.serialNumber,
          type: d.type,
          model: d.model,
          status: d.isActive ? "active" : "inactive",
        })),
      };
    });

    const userWithCounts = {
      ...user,
      totalEmissions,
      totalFuelData,
      totalGpsData,
      deviceCounts,
      vehiclesWithDevices,
    };

    return {
      success: true,
      user: userWithCounts,
    };
  } catch (error) {
    console.error("Error retrieving user:", error);
    return {
      success: false,
      message: "Error retrieving user, please try again.",
    };
  }
};

export const updateUserService = async (id, updateData) => {
  const { vehicles, trackingDevices, ...userData } = updateData;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: userData,
    });

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Error updating user, please try again.",
    };
  }
};

export const deleteUserService = async (id) => {
  try {
    const deletedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Error deleting user, please try again.",
    };
  }
};
