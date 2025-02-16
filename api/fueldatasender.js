import WebSocket from 'ws'

// Pre-defined coordinates for cities in Rwanda
const routes = {
  kigaliToNyamagabe: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -2.5883, longitude: 29.5922 } // Nyamagabe
  ],
  kigaliToMusanze: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -1.5022, longitude: 29.6885 } // Musanze
  ],
  kigaliToRubavu: [
    { latitude: -1.9572, longitude: 30.1127 }, // Kigali
    { latitude: -1.6907, longitude: 29.251 } // Rubavu
  ]
}

// Function to interpolate between two coordinates
function interpolateCoordinates (start, end, fraction) {
  const latitude = start.latitude + (end.latitude - start.latitude) * fraction
  const longitude =
    start.longitude + (end.longitude - start.longitude) * fraction
  return { latitude, longitude }
}

export function sendData () {
  const socket = new WebSocket('ws://localhost:8770')

  socket.on('open', () => {
    console.log('WebSocket connection established')

    // Route selection (for example, Kigali to Nyamagabe)
    const selectedRoute = routes.kigaliToNyamagabe

    // Set interval to send data every second
    let fraction = 0 // This will represent the position along the route (0 to 1)
    const interval = setInterval(() => {
      if (fraction > 1) {
        fraction = 0 // Reset to start if we have reached the end
      }

      // Interpolate coordinates between the two cities along the route
      const { latitude, longitude } = interpolateCoordinates(
        selectedRoute[0], // Start point (Kigali)
        selectedRoute[1], // End point (Nyamagabe)
        fraction
      )

      // Random data type selection (fuel, gps, emission)
      const dataTypes = ['fuel', 'gps', 'emission']
      const randomType =
        dataTypes[Math.floor(Math.random() * dataTypes.length)]

      let data
      switch (randomType) {
        case 'fuel':
          data = {
            type: 'fuel',
            fuelLevel: Math.floor(Math.random() * 100), // Random fuel level
            vehicleId: 1
          }
          break
        case 'gps':
          data = {
            type: 'gps',
            latitude,
            longitude,
            speed: Math.floor(Math.random() * 120), // Random speed
            accuracy: Math.floor(Math.random() * 100), // Random accuracy
            vehicleId: 1,
            deviceId: 1
          }
          break
        case 'emission':
          data = {
            type: 'emission',
            co2Percentage: (Math.random() * 100).toFixed(2),
            coPercentage: (Math.random() * 100).toFixed(2),
            o2Percentage: (Math.random() * 100).toFixed(2),
            hcPPM: (Math.random() * 100).toFixed(2),
            vehicleId: 1,
            plateNumber: 'ABC' // Static plate number
          }
          break
        default:
          data = {}
          break
      }

      // Send data if WebSocket is open
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data))
        console.log('Sent data:', data)
      }

      // Increment the fraction to simulate movement
      fraction += 0.01
    }, 1000) // Send data every second

    // Close WebSocket after 10 seconds
    setTimeout(() => {
      clearInterval(interval)
      console.log('Stopped sending data')
      socket.close()
    }, 10000)
  })

  // Handle WebSocket errors
  socket.on('error', error => {
    console.error('WebSocket error:', error)
  })

  // Handle WebSocket connection close
  socket.on('close', () => {
    console.log('WebSocket connection closed')
  })
}

// Start sending data
