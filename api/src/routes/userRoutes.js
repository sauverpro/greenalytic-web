import express from 'express'
import * as userController from '../controllers/userController.js'
import { validateUserSignup } from '../middlewares/userValidation.js'
import { login, validateLogin } from '../authentication/login.js'

const userRouters = express.Router()
userRouters.post('/login',validateLogin, login)
userRouters.post('/signup', validateUserSignup, userController.signup)

userRouters.get('/', userController.getAllUsers)
userRouters.get('/:id', userController.getUserById)
userRouters.put('/:id', userController.updateUser)
userRouters.delete('/:id', userController.deleteUser)
export default userRouters
