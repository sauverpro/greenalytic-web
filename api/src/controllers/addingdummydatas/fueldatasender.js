import { io } from 'socket.io-client'

// Pre-defined routes (Kigali to other cities)
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
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * fraction,
    longitude: start.longitude + (end.longitude - start.longitude) * fraction
  }
}

// Function to generate random vehicle data
function generateRandomData (vehicleId, latitude, longitude) {
  const dataTypes = ['fuel', 'gps', 'emission']
  const type = dataTypes[Math.floor(Math.random() * dataTypes.length)]
  console.log(`Generating data for Vehicle ${vehicleId} of type ${type}`) // Log action

  switch (type) {
    case 'fuel':
      return {
        type,
        fuelLevel: Math.floor(Math.random() * 100),
        vehicleId
      }
    case 'gps':
      return {
        type,
        latitude,
        longitude,
        speed: Math.floor(Math.random() * 120),
        accuracy: Math.floor(Math.random() * 100),
        vehicleId,
        deviceId: vehicleId
      }
    case 'emission':
      return {
        type,
        co2Percentage: (Math.random() * 100),
        coPercentage: (Math.random() * 100),
        o2Percentage: (Math.random() * 100),
        hcPPM: (Math.random() * 100),
        vehicleId,
        plateNumber: `ABC${vehicleId}`
      }
    default:
      return {}
  }
}

// Function to send data with auto-reconnect
export function sendData (vehicleId = 1, routeName = 'kigaliToNyamagabe') {
  const selectedRoute = routes[routeName] || routes.kigaliToNyamagabe
  let fraction = 0

  function connectWebSocket () {
    const socket = io('http://localhost:4000')

    socket.on('connect', () => {
      console.log(`✅ Connected to WebSocket for Vehicle ${vehicleId}`)

      const interval = setInterval(() => {
        if (fraction > 1) {
          fraction = 0 // Restart movement
        }

        const { latitude, longitude } = interpolateCoordinates(
          selectedRoute[0],
          selectedRoute[1],
          fraction
        )

        const data = generateRandomData(vehicleId, latitude, longitude)

        socket.emit('vehicleData', data) // Send data
        console.log(`🚗 Vehicle ${vehicleId} Sent:`, data)

        fraction += 0.02 // Move forward
      }, 1000)

      // Stop sending after 20 seconds
      setTimeout(() => {
        clearInterval(interval)
        console.log(`⏹️ Stopped sending data for Vehicle ${vehicleId}`)
        socket.disconnect()
      }, 20000)
    })

    // Log received data
    socket.on('vehicleDataResponse', data => {
      console.log(`📩 Vehicle ${vehicleId} Received:`, data)
    })

    socket.on('disconnect', () => {
      console.log(
        `❌ WebSocket disconnected for Vehicle ${vehicleId}. Reconnecting...`
      )
      setTimeout(connectWebSocket, 5000) // Retry in 5 sec
    })

    socket.on('connect_error', error => {
      console.error(`⚠️ Connection error for Vehicle ${vehicleId}:`, error)
    })
  }

  connectWebSocket() // Initial connection
}
