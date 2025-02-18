// Define the cars inside the simulation file

import io from 'socket.io-client'

const socket = io('http://localhost:4000') // Replace with your actual server URL

// Define the routes with coordinates
const routes = {
  kigaliToGaborone: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -24.6282, longitude: 25.9231 } // Gaborone, Botswana
  ],
  kigaliToSouthAfrica: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -30.5595, longitude: 22.9375 } // Somewhere in South Africa (coordinates for general area)
  ],
  kigaliToNairobi: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -1.286389, longitude: 36.817223 } // Nairobi, Kenya
  ]
}

// Example vehicles with their respective routes
const cars = [
  {
    vehicleId: 1,
    plateNumber: 'ABC123',
    serialNumber: 'SN001',
    route: routes.kigaliToGaborone
  },
  {
    vehicleId: 2,
    plateNumber: 'XYZ456',
    serialNumber: 'SN002',
    route: routes.kigaliToSouthAfrica
  },
  {
    vehicleId: 3,
    plateNumber: 'LMN789',
    serialNumber: 'SN003',
    route: routes.kigaliToNairobi
  }
]

// Simulation code remains the same as previously defined

// The simulation function no longer takes a parameter
export function manySimulation () {
  // Loop through all cars
  cars.forEach(car => {
    let routeIndex = 0
    const totalDistance = car.route.length
    let distanceCovered = 0

    const simulationInterval = setInterval(() => {
      if (routeIndex >= totalDistance) {
        clearInterval(simulationInterval)
        console.log(`${car.plateNumber} has reached its destination`)
      } else {
        // Get current position from the route
        const { latitude, longitude } = car.route[routeIndex]

        // Simulate random emissions data
        const co2Percentage = Math.random() * 100
        const coPercentage = Math.random() * 100
        const o2Percentage = 21.0 - Math.random() * 5 // Assume a decrease in O2
        const hcPPM = Math.random() * 1000

        // Simulate fuel level and vehicle speed
        const fuelLevel = Math.max(0, 100 - Math.random() * 10) // Random fuel level
        const speed = Math.random() * (120 - 30) + 30 // Random speed between 30-120 km/h

        // Emit the data via Socket.IO to the server
        socket.emit('sendData', {
          type: 'emission',
          serialNumber: car.serialNumber,
          vehicleId: car.vehicleId,
          dataPayload: {
            co2Percentage,
            coPercentage,
            o2Percentage,
            hcPPM,
            plateNumber: car.plateNumber
          }
        })
        socket.emit('sendData', {
          type: 'fuel',
          serialNumber: car.serialNumber,
          vehicleId: car.vehicleId,
          dataPayload: {
            fuelLevel,
            plateNumber: car.plateNumber
          }
        })
        socket.emit('sendData', {
          type: 'gps',
          serialNumber: car.serialNumber,
          vehicleId: car.vehicleId,
          dataPayload: {
            latitude,
            longitude,
            speed,
            accuracy: 5, // Assume constant accuracy
            plateNumber: car.plateNumber
          }
        })

        console.log(`${car.plateNumber} - Simulated Data Sent:`, {
          emission: { co2Percentage, coPercentage, o2Percentage, hcPPM },
          fuel: { fuelLevel },
          gps: { latitude, longitude, speed }
        })

        // Move to the next position in the route
        routeIndex += 1
        distanceCovered += speed / 60 // Update distance covered
      }
    }, 5000) // Emit data every 5 seconds
  })
}

// Call the simulation function directly in index.js without parameters
