// Import Prisma client and error handling
import prisma from "../../prismaClient.js";
import { AppError, catchAsync } from "./globaleerorshandling.js";

// Enhanced isAdmin middleware - specifically for admin access only
export const isAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req;

  // Validate userId exists
  if (!userId) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  // Parse and validate userId
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return next(new AppError('Invalid user ID format.', 400));
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { 
      id: parsedUserId,
      deletedAt: null // Ensure user is not soft deleted
    },
    select: {
      id: true,
      role: true,
      status: true,
      email: true
    }
  });

  // Check if user exists
  if (!user) {
    return next(new AppError('User not found or has been deactivated.', 401));
  }

  // Check if user account is active
  if (user.status !== 'ACTIVE') {
    return next(new AppError('User account is not active. Please contact support.', 403));
  }

  // Check if user is admin
  if (user.role !== 'ADMIN') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  // Attach user info to request for downstream use
  req.adminUser = {
    id: user.id,
    role: user.role,
    email: user.email
  };

  next();
});

// Optional: Super admin check (if you have multiple admin levels)
export const isSuperAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return next(new AppError('Invalid user ID format.', 400));
  }

  const user = await prisma.user.findUnique({
    where: { 
      id: parsedUserId,
      deletedAt: null
    },
    select: {
      id: true,
      role: true,
      status: true,
      email: true,
      // Add super admin flag if you have one in your schema
      // isSuperAdmin: true
    }
  });

  if (!user) {
    return next(new AppError('User not found or has been deactivated.', 401));
  }

  if (user.status !== 'ACTIVE') {
    return next(new AppError('User account is not active. Please contact support.', 403));
  }

  // For now, checking if user is admin (extend this if you add super admin field)
  if (user.role !== 'ADMIN') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  req.adminUser = {
    id: user.id,
    role: user.role,
    email: user.email
  };

  next();
});