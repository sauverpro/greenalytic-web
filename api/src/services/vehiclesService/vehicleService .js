import prisma from "../../../prismaClient.js";

  
export const addVehicleToUserService = async (userId, vehicleData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { vehicles: true }, 
    });

    if (!user) {
      throw new Error("User not found");
    }

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

    const updatedUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { vehicles: true },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};



export const getAllVehiclesService = async () => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            phoneNumber: true,
          },
        },
      },
    });


    return {
      success: true,
      vehicles,
      message: "Vehicles fetched successfully",
    };
  } catch (error) {
    throw error;
  }
};


// Service to get vehicles for a given user ID with pagination
export const getVehiclesByUserIdService = async (userId, pagination) => {
  try {
    const { skip, take, page, limit } = pagination

   const user = await prisma.user.findUnique({
     where: { id: parseInt(userId) },
    //  include: { trackingDevices: true },
   });
    
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Fetch the vehicles for a given user with refined data
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: parseInt(userId) 
      },
      skip,
      take,
      include: {
        trackingDevices: {
          select: {
            id: true,
            serialNumber: true,
            type: true,
            isActive: true,
            lastPing: true
          }
        }
      }
    })

    // Get the total count of vehicles for this specific user
    const totalCount = await prisma.vehicle.count({
      where: {
        userId: parseInt(userId) // Count vehicles for the specific user
      }
    })

    return {
      vehicles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        remainingItems: Math.max(0, totalCount - page * limit),
        totalItems: totalCount,
        limit
      }
    }
  } catch (error) {
    throw error
  }
}


export const getVehicleByIdService = async (id) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
      include: {
        // trackingDevice: {
        //   select: {
        //     id: true,
        //     serialNumber: true,
        //     type: true,
        //     isActive: true,
        //   },
        // },
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return vehicle;
  } catch (error) {
    throw error;
  }
};


export const deleteVehicleService = async (vehicleId)=> {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found.");
      }   

      const trackingDevices = await prisma.trackingDevice.findMany({
        where: { vehicleId: vehicleId },
      });

      if (trackingDevices.length > 0) {
        await prisma.trackingDevice.deleteMany({
          where: { vehicleId: vehicleId },
        });
      }

      await prisma.vehicle.delete({
        where: { id: vehicleId },
      });

      return {
        success: true,
        message: "Vehicle deleted successfully.",
      };
    } catch (error) {
      throw new Error(error.message);
    }
}
  
export const updateVehicleByIdService = async (vehicleId, vehicleData) => {
  try {
    // Check if vehicle exists first
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
        deletedAt: null, // Only update non-deleted vehicles
      },
    });

    if (!existingVehicle) {
      throw new Error("Vehicle not found");
    }

    // If updating plateNumber, check if it already exists
    if (
      vehicleData.plateNumber &&
      vehicleData.plateNumber !== existingVehicle.plateNumber
    ) {
      const plateExists = await prisma.vehicle.findUnique({
        where: {
          plateNumber: vehicleData.plateNumber,
        },
      });

      if (plateExists) {
        throw new Error("Vehicle with this plate number already exists");
      }
    }

    // Update the vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: vehicleData,
    });

    return updatedVehicle;
  } catch (error) {
    throw error;
  }
};
