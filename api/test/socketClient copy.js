import { io } from 'socket.io-client'

// const socket = io('http://localhost:5000', {
const socket = io(
  'https://greenalytic-vehicle-monitoring-api.onrender.com',
  {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  }
)

console.log('Connecting to server...')

const TRACKING_DEVICE_ID = 1 // Make sure this exists and is assigned

socket.on('connect', () => {
  console.log('✅ Connected to server as:', socket.id)

  // IDENTIFY the device
  socket.emit('identify', { trackingDeviceId: TRACKING_DEVICE_ID })

  // Send changing mock data every 5 seconds
  setInterval(() => {
    const latitude = -1.95 + Math.random() * 0.01
    const longitude = 30.037 + Math.random() * 0.01
    const speed = Math.floor(Math.random() * 120)
    const fuelLevel = Math.random() * 100
    const fuelConsumption = Math.random() * 10
    const rpm = Math.floor(Math.random() * 3000)
    const throttlePosition = Math.random() * 100
    const engineTemperature = 70 + Math.random() * 30
    const co2Percentage = Math.random() * 0.1
    const coPercentage = Math.random() * 0.05
    const o2Percentage = 20 + Math.random()
    const hcPPM = Math.floor(Math.random() * 300)
    const noxPPM = Math.random() * 0.05
    const pm25Level = Math.random() * 0.05

    socket.emit('gpsData', {
      trackingDeviceId: TRACKING_DEVICE_ID,
      latitude,
      longitude,
      speed,
      accuracy: 5.0,
      plateNumber: 'RAC101A'
    })

    socket.emit('fuelData', {
      trackingDeviceId: TRACKING_DEVICE_ID,
      fuelLevel,
      fuelConsumption,
      plateNumber: 'RAC101A'
    })

    socket.emit('emissionData', {
      trackingDeviceId: TRACKING_DEVICE_ID,
      co2Percentage,
      coPercentage,
      o2Percentage,
      hcPPM,
      noxPPM,
      pm25Level,
      plateNumber: 'RAC101A'
    })

    socket.emit('obdData', {
      trackingDeviceId: TRACKING_DEVICE_ID,
      rpm,
      throttlePosition,
      engineTemperature,
      engineStatus: 'Running',
      faultCodes: ['P0171'],
      plateNumber: 'RAC101A'
    })
  }, 5000) // Every 5 milliseconds
})

// ✅ Server acknowledgment
socket.on('connected', msg => {
  console.log('✅ Server acknowledgment:', msg)
})

// Listen to updates from server
socket.on('gpsUpdate', data => console.log('📍 GPS Update:', data))
socket.on('fuelUpdate', data => console.log('⛽ Fuel Update:', data))
socket.on('emissionUpdate', data => console.log('💨 Emission Update:', data))
socket.on('obdUpdate', data => console.log('🔧 OBD Update:', data))

// ❌ Errors
socket.on('error', msg => console.error('❌ Server error:', msg))

// 🔌 Disconnected
socket.on('disconnect', reason => console.log('❌ Disconnected:', reason))
