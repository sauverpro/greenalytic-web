import prisma from '../../prismaClient.js'
import { passComparer, passHashing } from '../utils/passwordfunctions.js'
// Assuming Prisma client instance is imported here

export const changepassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const { userId, userEmail } = req // Extract userId and userEmail from request (e.g., from JWT or session)

    // Fetch user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: {
        id: userId // Assuming the userId is passed in the request
      }
    })

    console.log('The passed userId:', userId)
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Compare the current password with the stored password using passComparer
    let isPasswordCorrect = await passComparer(currentPassword, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'The current password is wrong'
      })
    }

    // Hash the new password
    let hashedPassword = await passHashing(newPassword)

    // Update the password in the database
    await prisma.user.update({
      where: {
        id: userId // Identify the user by userId
      },
      data: {
        password: hashedPassword // Set the new hashed password
      }
    })

    // Return success message
    res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    console.log('Error:', err.message, err.name)
    res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' })
  }
}
