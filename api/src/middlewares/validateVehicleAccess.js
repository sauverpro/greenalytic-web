import { PrismaClient } from "@prisma/client";
import { AppError, catchAsync } from "./globaleerorshandling.js";

const prisma = new PrismaClient();
export const validateVehicleAccess = catchAsync(async (req, res, next) => {
  let id = req.params.id;

    if (!id || isNaN(parseInt(id))) {
    id = req.params.vehicleId;
    }
  const requestingUserId = req.userId; // From token middleware
  
  // Check if the requesting user is an admin first
  const parsedRequestingUserId = parseInt(requestingUserId);
  const user = await prisma.user.findUnique({
    where: { 
      id: parsedRequestingUserId,
      deletedAt: null 
    },
    select: {
      id: true,
      role: true,
      status: true
    }
  });
  
  // Allow access if user is admin and account is active
  if (user && user.role === 'ADMIN' && user.status === 'ACTIVE') {
    return next();
  }
  
  // Check if user owns the vehicle
  const vehicle = await prisma.vehicle.findUnique({
    where: { 
      id: parseInt(id),
      deletedAt: null 
    },
    select: {
      userId: true
    }
  });
  
  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }
  
  if (vehicle.userId === parsedRequestingUserId) {
    return next();
  }
  
  return next(new AppError('Access denied. You can only access your own vehicles.', 403));
});