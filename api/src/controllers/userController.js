import { catchAsync } from '../middlewares/globaleerorshandling.js'
import * as userService from '../services/userService.js'

// **1️⃣ Create User** - Signup controller function
export const signup = catchAsync(async (req, res, next) => {
  const { email, password, username, phoneNumber, location } = req.body

  // Ensure required fields are present (location and picture are optional)
  if (!email || !password || !username || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide all required fields: email, password, name, phoneNumber.'
    })
  }

  // Call the service to create the user
  const result = await userService.createUser({
    email,
    password,
    username,
    username,
    phoneNumber
  })

  // If service returns failure, send error response
  if (!result.success) {
    return res.status(400).json(result)
  }

  // Respond with success and user data
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userInformation: {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username, // Optional username

      phoneNumber: result.user.phoneNumber,

      role: result.user.role
    }
  })
})

// **2️⃣ Get All Users** - Retrieve all users
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.pagination // Get pagination from middleware
    const usersData = await userService.getAllUsers(page, limit)

    res.status(200).json(usersData)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// **3️⃣ Get User By ID** - Retrieve a user by ID
export const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.status(200).json({
      success: true,
      user: result.user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// **4️⃣ Update User** - Update user details
export const updateUser = async (req, res) => {
  try {
    // Exclude the password from the request body to prevent updating becuase  the whole process of password  making i long and   only need to br updated by their owners
    const { password, ...updatedData } = req.body
    const result = await userService.updateUser(req.params.id, req.body)
    if (!result.success) {
      return res.status(400).json(result)
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: result.user
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

// **5️⃣ Delete User (Soft Delete)** - Soft delete a user
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.status(200).json({
      success: true,
      message: 'User deleted (soft delete)'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
