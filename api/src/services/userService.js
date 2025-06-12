import prisma from "../../prismaClient.js";
import { passHashing } from "../utils/passwordfunctions.js";

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
        status: userData.role === 'ADMIN' ? 'ACTIVE' : 'PENDING_APPROVAL',
        language: userData.language || 'English',
        notificationPreferences: userData.notificationPreferences || 'Email',
      },
    });

    return {
      success: true,
      user: {
        ...newUser,
        password: undefined, // Don't return password
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Error creating user, please try again.",
    };
  }
};

export const getAllUsersService = async (page, limit, filters = {}) => {
  try {

    const whereClause = {
      deletedAt: null,
    };

    if (filters.role) {
      whereClause.role = filters.role;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.companyName) {
      whereClause.companyName = {
        contains: filters.companyName,
        mode: 'insensitive'
      };
    }

    const totalItems = await prisma.user.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const users = await prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        fullName: true,
        role: true,
        status: true,
        phoneNumber: true,
        verified: true,
        companyName: true,
        businessSector: true,
        fleetSize: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            plateNumber: true,
            vehicleModel: true,
            vehicleType: true,
            status: true,
            fuelType: true,
          },
        },
        trackingDevices: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            type: true,
            deviceCategory: true,
            status: true,
            isActive: true,
            installationDate: true,
          },
        },
        alerts: {
          where: {
            isRead: false, // Only show unread alerts
          },
          select: {
            id: true,
            type: true,
            title: true,
            createdAt: true,
          },
          take: 5, // Latest 5 alerts
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            vehicles: true,
            trackingDevices: true,
            alerts: {
              where: { isRead: false }
            },
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
        fullName: true,
        nationalId: true,
        gender: true,
        role: true,
        status: true,
        phoneNumber: true,
        verified: true,
        companyName: true,
        companyRegistrationNumber: true,
        businessSector: true,
        fleetSize: true,
        language: true,
        notificationPreferences: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            plateNumber: true,
            registrationNumber: true,
            vehicleModel: true,
            vehicleType: true,
            fuelType: true,
            status: true,
            yearOfManufacture: true,
            lastMaintenanceDate: true,
            _count: {
              select: {
                emissionDatas: true,
                fuelDatas: true,
                gpsDatas: true,
                obdDatas: true,
                alerts: {
                  where: { isRead: false }
                },
              },
            },
          },
        },
        trackingDevices: {
          select: {
            id: true,
            serialNumber: true,
            plateNumber: true,
            model: true,
            type: true,
            deviceCategory: true,
            firmwareVersion: true,
            installationDate: true,
            communicationProtocol: true,
            status: true,
            isActive: true,
            lastPing: true,
            enableOBDMonitoring: true,
            enableGPSTracking: true,
            enableEmissionMonitoring: true,
            _count: {
              select: {
                emissionDatas: true,
                fuelDatas: true,
                gpsDatas: true,
                obdDatas: true,
              },
            },
          },
        },
        alerts: {
          select: {
            id: true,
            type: true,
            title: true,
            message: true,
            isRead: true,
            triggerValue: true,
            triggerThreshold: true,
            createdAt: true,
            vehicle: {
              select: {
                plateNumber: true,
                vehicleModel: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
        reports: {
          select: {
            id: true,
            title: true,
            type: true,
            format: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            vehicles: true,
            trackingDevices: true,
            alerts: {
              where: { isRead: false }
            },
            reports: true,
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

    // Analytics
    let totalEmissions = 0;
    let totalFuelData = 0;
    let totalGpsData = 0;
    let totalOBDData = 0;

    const deviceCounts = {
      motorcycle: 0,
      car: 0,
      truck: 0,
      tricycle: 0,
      other: 0,
      total: user.trackingDevices.length,
      online: 0,
      offline: 0,
    };


    const deviceStatusCounts = {
      active: 0,
      inactive: 0,
      pending: 0,
      disconnected: 0,
      maintenance: 0,
    };

    user.trackingDevices.forEach((device) => {
      totalEmissions += device._count.emissionDatas;
      totalFuelData += device._count.fuelDatas;
      totalGpsData += device._count.gpsDatas;
      totalOBDData += device._count.obdDatas;

      const category = device.deviceCategory.toLowerCase();
      if (deviceCounts.hasOwnProperty(category)) {
        deviceCounts[category]++;
      }

      const status = device.status.toLowerCase();
      if (deviceStatusCounts.hasOwnProperty(status)) {
        deviceStatusCounts[status]++;
      }

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (device.lastPing && new Date(device.lastPing) > fiveMinutesAgo) {
        deviceCounts.online++;
      } else {
        deviceCounts.offline++;
      }
    });

    user.vehicles.forEach((vehicle) => {
      totalEmissions += vehicle._count.emissionDatas;
      totalFuelData += vehicle._count.fuelDatas;
      totalGpsData += vehicle._count.gpsDatas;
      totalOBDData += vehicle._count.obdDatas;
    });

    const vehicleStatusCounts = {
      normalEmission: 0,
      topPolluting: 0,
      inactiveDisconnected: 0,
      underMaintenance: 0,
    };

    user.vehicles.forEach((vehicle) => {
      const status = vehicle.status.toLowerCase().replace('_', '');
      if (status === 'normalemission') vehicleStatusCounts.normalEmission++;
      else if (status === 'toppolluting') vehicleStatusCounts.topPolluting++;
      else if (status === 'inactivedisconnected') vehicleStatusCounts.inactiveDisconnected++;
      else if (status === 'undermaintenance') vehicleStatusCounts.underMaintenance++;
    });

    const userWithCounts = {
      ...user,
      analytics: {
        totalEmissions,
        totalFuelData,
        totalGpsData,
        totalOBDData,
        deviceCounts,
        deviceStatusCounts,
        vehicleStatusCounts,
        unreadAlerts: user._count.alerts,
        totalReports: user._count.reports,
      },
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
  const { vehicles, trackingDevices, alerts, reports, ...userData } = updateData;

  try {
    const {
      password,
      verified,
      otp,
      otpExpiresAt,
      token,
      ...safeUpdateData
    } = userData;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: safeUpdateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        phoneNumber: true,
        companyName: true,
        businessSector: true,
        fleetSize: true,
        language: true,
        notificationPreferences: true,
        verified: true,
        updatedAt: true,
      },
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

export const approveUserService = async (id, adminId) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        status: 'ACTIVE',
        verified: true,
        updatedAt: new Date(),
      },
    });

    console.log(`User ${id} approved by admin ${adminId}`);

    return {
      success: true,
      message: "User approved successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error approving user:", error);
    return {
      success: false,
      message: "Error approving user, please try again.",
    };
  }
};

export const suspendUserService = async (id, reason = '') => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        status: 'SUSPENDED',
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "User suspended successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error suspending user:", error);
    return {
      success: false,
      message: "Error suspending user, please try again.",
    };
  }
};

export const deleteUserService = async (id) => {
  try {
    const deletedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        deletedAt: new Date(),
        status: 'DEACTIVATED', // Update status
      },
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

export const getUsersByRoleService = async (role) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        companyName: true,
        _count: {
          select: {
            vehicles: true,
            trackingDevices: true,
          },
        },
      },
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error retrieving users by role:", error);
    return {
      success: false,
      message: "Error retrieving users by role, please try again.",
    };
  }
};