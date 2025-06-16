import { catchAsync } from '../middlewares/globaleerorshandling.js'
import * as userService from '../services/userService.js'

// **1️⃣ Create User** - Signup controller function
export const signup = catchAsync(async (req, res, next) => {
  const { 
    email, 
    password, 
    username, 
    phoneNumber, 
    fullName,
    role,
    companyName,
    businessSector,
    fleetSize,
    language,
    notificationPreference
  } = req.body

  // Validate required fields
  if (!email || !password || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: email, password, and phoneNumber.'
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    })
  }

  // Validate role enum if provided
  if (role) {
    const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      })
    }
  }

  // Validate language if provided
  if (language) {
    const validLanguages = ['English', 'French', 'Kinyarwanda']
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Must be one of: ${validLanguages.join(', ')}`
      })
    }
  }

  // Validate notification preferences if provided
  if (notificationPreference) {
    const validPreferences = ['Email', 'SMS', 'WhatsApp']
    if (!validPreferences.includes(notificationPreference)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification preference. Must be one of: ${validPreferences.join(', ')}`
      })
    }
  }

  // Validate fleet size if provided
  if (fleetSize !== undefined) {
    const parsedFleetSize = parseInt(fleetSize, 10)
    if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
      return res.status(400).json({
        success: false,
        message: 'Fleet size must be a non-negative number.'
      })
    }
  }

  // Call the service to create the user
  const result = await userService.createUserService(req.body)

  // If service returns failure, send error response
  if (!result.success) {
    return res.status(400).json(result)
  }

  // Respond with success and user data (including new schema fields)
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userInformation: {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
      fullName: result.user.fullName,
      phoneNumber: result.user.phoneNumber,
      role: result.user.role,
      status: result.user.status,
      companyName: result.user.companyName,
      businessSector: result.user.businessSector,
      fleetSize: result.user.fleetSize,
      language: result.user.language,
      notificationPreference: result.user.notificationPreference,
      verified: result.user.verified
    }
  })
})

// **2️⃣ Get All Users** - Retrieve all users with pagination and filtering
export const getAllUsers = catchAsync(async (req, res) => {
  const { page, limit } = req.pagination
  const { role, status, companyName, businessSector } = req.query

  // Build filters
  const filters = {}

  // Validate and add role filter
  if (role) {
    const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role filter. Must be one of: ${validRoles.join(', ')}`
      })
    }
    filters.role = role
  }

  // Validate and add status filter
  if (status) {
    const validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`
      })
    }
    filters.status = status
  }

  // Add company name filter
  if (companyName) {
    filters.companyName = companyName
  }

  // Add business sector filter
  if (businessSector) {
    filters.businessSector = businessSector
  }

  const usersData = await userService.getAllUsersService(page, limit, filters)

  return res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: usersData.users,
    meta: usersData.pagination
  })
})

// **3️⃣ Get User By ID** - Retrieve a user by ID
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const result = await userService.getUserByIdService(parsedUserId)
  
  if (!result.success) {
    return res.status(404).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: result.user
  })
})

// **4️⃣ Update User** - Update user details
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  // Exclude sensitive fields from update
  const { password, otp, otpExpiresAt, token, ...safeUpdateData } = updateData

  // Validate role if being updated
  if (safeUpdateData.role) {
    const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT']
    if (!validRoles.includes(safeUpdateData.role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      })
    }
  }

  // Validate status if being updated
  if (safeUpdateData.status) {
    const validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED']
    if (!validStatuses.includes(safeUpdateData.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }
  }

  // Validate language if being updated
  if (safeUpdateData.language) {
    const validLanguages = ['English', 'French', 'Kinyarwanda']
    if (!validLanguages.includes(safeUpdateData.language)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Must be one of: ${validLanguages.join(', ')}`
      })
    }
  }

  // Validate notification preferences if being updated
  if (safeUpdateData.notificationPreference) {
    const validPreferences = ['Email', 'SMS', 'WhatsApp']
    if (!validPreferences.includes(safeUpdateData.notificationPreference)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification preference. Must be one of: ${validPreferences.join(', ')}`
      })
    }
  }

  // Validate fleet size if being updated
  if (safeUpdateData.fleetSize !== undefined) {
    const parsedFleetSize = parseInt(safeUpdateData.fleetSize, 10)
    if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
      return res.status(400).json({
        success: false,
        message: 'Fleet size must be a non-negative number.'
      })
    }
    safeUpdateData.fleetSize = parsedFleetSize
  }

  const result = await userService.updateUserService(parsedUserId, safeUpdateData)
  
  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: result.user
  })
})

// **5️⃣ Delete User (Soft Delete)** - Soft delete a user
export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const result = await userService.deleteUserService(parsedUserId)
  
  if (!result.success) {
    return res.status(404).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully (soft delete)'
  })
})

// Delete User (Hard Delete) - Uncomment if needed
export const deleteUserPermanent = catchAsync(async (req, res) => {
  const { id } = req.params

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const result = await userService.hardDeleteUserService(parsedUserId)

  if (!result.success) {
    return res.status(404).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully (hard delete)'
  })
})


// **6️⃣ Approve User** - Admin approval workflow
export const approveUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const { adminId } = req.body // Should come from authenticated admin

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  // Validate admin ID
  const parsedAdminId = parseInt(adminId, 10)
  if (isNaN(parsedAdminId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid admin ID'
    })
  }

  const result = await userService.approveUserService(parsedUserId, parsedAdminId)
  
  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User approved successfully',
    data: result.user
  })
})

// **7️⃣ Suspend User** - User suspension
export const suspendUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const result = await userService.suspendUserService(parsedUserId, reason)
  
  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User suspended successfully',
    data: result.user
  })
})

// **8️⃣ Get Users by Role** - Helper function for admin dashboard
export const getUsersByRole = catchAsync(async (req, res) => {
  const { role } = req.params

  // Validate role
  const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT']
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    })
  }

  const result = await userService.getUsersByRoleService(role)
  
  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.status(200).json({
    success: true,
    message: `${role} users retrieved successfully`,
    data: result.users
  })
})

// **9️⃣ Get User vehicles** - Retrieve user vehicles
export const getUserVehicles = catchAsync(async (req, res) => {
  const { id } = req.params

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const { page, limit } = req.pagination
  const result = await userService.getUserVehiclesService(parsedUserId, page, limit)
  
  if (!result.success) {
    return res.status(404).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User vehicles retrieved successfully',
    data: result.vehicles
  })
})

// **🔟 Get User devices** - Retrieve devices
export const getUserDevices = catchAsync(async (req, res) => {
  const { id } = req.params

  // Validate user ID
  const parsedUserId = parseInt(id, 10)
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    })
  }

  const { page, limit } = req.pagination
  const result = await userService.getUserDevicesService(parsedUserId, page, limit)
  
  if (!result.success) {
    return res.status(404).json(result)
  }

  return res.status(200).json({
    success: true,
    message: 'User devices retrieved successfully',
    data: result.devices
  })
})