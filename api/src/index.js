// Import required packages
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Get port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

//  routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})
//error  handling middle ware

// server running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
