import express from 'express'
import * as userController from '../controllers/userController.js'
import { validateUserSignup } from '../middlewares/userValidation.js'
import { login, validateLogin } from '../authentication/login.js'
import paginationMiddleware from '../middlewares/paginationMiddleware.js'
import { changepassword } from '../authentication/changepassword.js'
import { isAdmin } from '../middlewares/isadmin.js'
import {
  generateAndSendOTP,
  verifyOTPAndUpdatePassword
} from '../authentication/forgetpassword.js'
import { verifyingtoken } from '../utils/jwtfunctions.js'

const userRouters = express.Router()
userRouters.post('/login', validateLogin, login)
userRouters.post('/signup', validateUserSignup, userController.signup)
userRouters.post('/reset', verifyOTPAndUpdatePassword)

userRouters.get('/', paginationMiddleware, userController.getAllUsers)
userRouters.post('/forget', generateAndSendOTP)
userRouters.use('/reset', verifyOTPAndUpdatePassword)
userRouters.get('/:id', userController.getUserById)
userRouters.use(verifyingtoken)
userRouters.patch('/:id', userController.updateUser)
userRouters.delete('/:id', userController.deleteUser)
userRouters.post('/change', changepassword)


export default userRouters
