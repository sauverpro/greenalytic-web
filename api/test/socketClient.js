import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
})

console.log('Connecting to server...')

const TRACKING_DEVICE_ID = 2 // Make sure this exists in your DB and is assigned to a vehicle

socket.on('connect', () => {
  console.log('✅ Connected to server as:', socket.id)

  // IDENTIFY the device
  socket.emit('identify', { trackingDeviceId: TRACKING_DEVICE_ID })

  // Simulate sending real-time data (you can remove this after testing)
  socket.emit('gpsData', {
    trackingDeviceId: TRACKING_DEVICE_ID,
    latitude: -1.95,
    longitude: 30.06,
    speed: 55,
    accuracy: 5.0,
    plateNumber: 'RAC101A'
  })

  socket.emit('fuelData', {
    trackingDeviceId: TRACKING_DEVICE_ID,
    fuelLevel: 78.5,
    fuelConsumption: 4.2,
    plateNumber: 'RAC101A'
  })

  socket.emit('emissionData', {
    trackingDeviceId: TRACKING_DEVICE_ID,
    co2Percentage: 0.06,
    coPercentage: 0.01,
    o2Percentage: 20.9,
    hcPPM: 160,
    noxPPM: 0.04,
    pm25Level: 0.01,
    plateNumber: 'RAC101A'
  })

  socket.emit('obdData', {
    trackingDeviceId: TRACKING_DEVICE_ID,
    rpm: 2100,
    throttlePosition: 40.5,
    engineTemperature: 88,
    engineStatus: 'Running',
    faultCodes: ['P0171'],
    plateNumber: 'RAC101A'
  })
})

// ✅ Server acknowledgment after identification
socket.on('connected', msg => {
  console.log('✅ Server acknowledgment:', msg)
})

// 📍 GPS Update
socket.on('gpsUpdate', data => {
  console.log('📍 GPS Update:', data)
})

// ⛽ Fuel Update
socket.on('fuelUpdate', data => {
  console.log('⛽ Fuel Update:', data)
})

// 💨 Emission Update
socket.on('emissionUpdate', data => {
  console.log('💨 Emission Update:', data)
})

// 🔧 OBD Update
socket.on('obdUpdate', data => {
  console.log('🔧 OBD Update:', data)
})

// ❌ Error
socket.on('error', msg => {
  console.error('❌ Server error:', msg)
})

// 🔌 Disconnect
socket.on('disconnect', reason => {
  console.log('❌ Disconnected from server:', reason)
})
