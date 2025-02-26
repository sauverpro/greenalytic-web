import prisma from '../../prismaClient.js'
import { passHashing } from '../utils/passwordfunctions.js'

prisma

// **1️⃣ Create User** - Create a new user
export const createUser = async userData => {
  try {
    // Validate email uniqueness
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userData.email
      }
    })

    if (existingUser) {
      return {
        success: false,
        message: 'Email is already in use.'
      }
    }

    // Hash the password before saving it
    const hashedPassword = await passHashing(userData.password)

    // Prepare user data for creation
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    })

    return {
      success: true,
      user: newUser
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      message: 'Error creating user, please try again.'
    }
  }
}

// **2️⃣ Get All Users** - Retrieve all users
export const getAllUsers = async (page, limit) => {
  try {
    // Get total number of users
    // Get total number of users excluding soft-deleted ones
    const totalItems = await prisma.user.count({
      where: {
        deletedAt: null // Exclude users who have a deletedAt timestamp
      }
    })
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit)

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null // Exclude users who have a deletedAt timestamp
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
            vehicleType: true
          }
        },
        trackingDevices: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            type: true,
            isActive: true
          }
        }
      }
    })

    return {
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages,
        remainingItems: Math.max(0, totalItems - page * limit), // Items left after current page
        totalItems,
        limit
      }
    }
  } catch (error) {
    console.error('Error retrieving users:', error)
    return {
      success: false,
      message: 'Error retrieving users, please try again.'
    }
  }
}

// **3️⃣ Get User By ID** - Retrieve a user by ID
export const getUserById = async id => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    })

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Error retrieving user:', error)
    return {
      success: false,
      message: 'Error retrieving user, please try again.'
    }
  }
}

// **4️⃣ Update User** - Update user details
export const updateUser = async (id, updateData) => {
  const { vehicles, trackingDevices, ...userData } = updateData

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: userData
    })

    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return {
      success: false,
      message: 'Error updating user, please try again.'
    }
  }
}

// **5️⃣ Delete User (Soft Delete)** - Soft delete a user
export const deleteUser = async id => {
  try {
    const deletedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() } // Soft delete
    })

    return {
      success: true,
      message: 'User deleted successfully',
      user: deletedUser
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      message: 'Error deleting user, please try again.'
    }
  }
}
