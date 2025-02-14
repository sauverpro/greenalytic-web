// api/index.js
import express from 'express'

import prisma from './prismaClient.js'
import userRouters from './src/routes/userRoutes.js'
import VehicleRouter from './src/routes/vehicleRoutes.js'
import trackingRouter from './src/routes/trackingDeviceRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // for parsing application/json
app.use('/users', userRouters) // Use user routes
app.use('/vehicles', VehicleRouter) // Use vehicle routes
app.use('/trackingDevices', trackingRouter) // Use vehicle routes
prisma
  .$connect()
  .then(() => console.log('Connected to the database!'))
  .catch(error => {
    console.error('Database connection error:', error)
    process.exit(1)
  })
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
