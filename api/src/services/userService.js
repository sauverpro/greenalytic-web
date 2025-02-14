
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
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany()

    return {
      users
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
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData
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
