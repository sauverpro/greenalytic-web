import io from 'socket.io-client'

const socket = io('http://localhost:4000') // Replace with your actual server URL

// Car's initial data
let carData = {
  vehicleId: 1,
  plateNumber: 'ABC',
  serialNumber: 'SN78945',
  longitude: 29.746,
  latitude: -2.626,
  speed: 20,
  fuelLevel: 50,
  fuelConsumption: 0.1,
  co2Percentage: 0.5,
  coPercentage: 0.2,
  o2Percentage: 21.0,
  hcPPM: 0.02,
  accuracy: 5
}

// Function to simulate and send data
export function startSimulation () {
  let distanceCovered = 0
  const totalDistance = 60
  const interval = 1000

  const simulationInterval = setInterval(() => {
    if (distanceCovered >= totalDistance) {
      clearInterval(simulationInterval)
      console.log('Car has reached Kigali')
    } else {
      // Simulate GPS movement
      carData.longitude += 0.001
      carData.latitude += 0.001
      if (isNaN(carData.latitude) || isNaN(carData.longitude)) {
        console.error(
          'Invalid coordinates detected:',
          carData.latitude,
          carData.longitude
        )
        return // Skip emitting if invalid
      }
      // Simulate emissions
      carData.co2Percentage += 0.01
      carData.coPercentage += 0.005
      carData.o2Percentage -= 0.01
      carData.hcPPM += 0.001

      // Simulate fuel consumption
      carData.fuelLevel -= carData.fuelConsumption

      // Emit data
      socket.emit('sendData', {
        type: 'emission',
        serialNumber: carData.serialNumber,
        vehicleId: carData.vehicleId,
        dataPayload: {
          co2Percentage: carData.co2Percentage,
          coPercentage: carData.coPercentage,
          o2Percentage: carData.o2Percentage,
          hcPPM: carData.hcPPM,
          plateNumber: carData.plateNumber
        }
      })
      socket.emit('sendData', {
        type: 'fuel',
        serialNumber: carData.serialNumber,
        vehicleId: carData.vehicleId,
        dataPayload: {
          fuelLevel: carData.fuelLevel,
          fuelConsumption: carData.fuelConsumption,
          plateNumber: carData.plateNumber
        }
      })
      socket.emit('sendData', {
        type: 'gps',
        serialNumber: carData.serialNumber,
        vehicleId: carData.vehicleId,
        dataPayload: {
          latitude: carData.latitude,
          longitude: carData.longitude,
          speed: carData.speed,
          accuracy: carData.accuracy,
          plateNumber: carData.plateNumber
        }
      })

      console.log('Simulated Data Sent:', {
        emission: {
          co2Percentage: carData.co2Percentage,
          coPercentage: carData.coPercentage,
          o2Percentage: carData.o2Percentage,
          hcPPM: carData.hcPPM
        },
        fuel: {
          fuelLevel: carData.fuelLevel,
          fuelConsumption: carData.fuelConsumption
        },
        gps: {
          latitude: carData.latitude,
          longitude: carData.longitude,
          speed: carData.speed,
          accuracy: carData.accuracy
        }
      })

      distanceCovered += carData.speed / 60
    }
  }, interval)
}

// Handle connection
socket.on('connect', () => {
  console.log('Connected to the Socket.IO server')
})

// Handle server response
socket.on('dataStatus', response => {
  console.log('Server response:', response)
})

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})
