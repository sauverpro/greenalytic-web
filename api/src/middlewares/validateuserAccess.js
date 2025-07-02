import { PrismaClient } from "@prisma/client";
import { AppError, catchAsync } from "./globaleerorshandling.js"; // Import these

const prisma = new PrismaClient();

export const validateUserAccess = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const requestingUserId = req.userId; // From token middleware
  
  // Check if user is accessing their own data
  if (parseInt(userId) === parseInt(requestingUserId)) {
    return next();
  }
  
  // Check if the requesting user is an admin
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
  
  return next(new AppError('Access denied. You can only access your own vehicles.', 403));
});