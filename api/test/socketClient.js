import { io } from 'socket.io-client'

const DEVICE_CONFIGS = [
  { id: 1, plateNumber: 'RAC101A' },
  { id: 2, plateNumber: 'RAC102B' },
  { id: 3, plateNumber: 'RAC103C' }
]

DEVICE_CONFIGS.forEach(config => {
  const socket = io('https://greenalytic-vehicle-monitoring-api.onrender.com', {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  })

  console.log(`🚗 Device ${config.id} connecting...`)

  socket.on('connect', () => {
    console.log(`✅ Device ${config.id} connected as:`, socket.id)

    // IDENTIFY device
    socket.emit('identify', { trackingDeviceId: config.id })

    // Mock sensor data every 5 seconds
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
        trackingDeviceId: config.id,
        latitude,
        longitude,
        speed,
        accuracy: 5.0,
        plateNumber: config.plateNumber
      })

      socket.emit('fuelData', {
        trackingDeviceId: config.id,
        fuelLevel,
        fuelConsumption,
        plateNumber: config.plateNumber
      })

      socket.emit('emissionData', {
        trackingDeviceId: config.id,
        co2Percentage,
        coPercentage,
        o2Percentage,
        hcPPM,
        noxPPM,
        pm25Level,
        plateNumber: config.plateNumber
      })

      socket.emit('obdData', {
        trackingDeviceId: config.id,
        rpm,
        throttlePosition,
        engineTemperature,
        engineStatus: 'Running',
        faultCodes: ['P0171'],
        plateNumber: config.plateNumber
      })
    }, 5000)
  })

  // Acknowledgment
  socket.on('connected', msg => console.log(`📡 Device ${config.id}:`, msg))

  // Listen to updates
  socket.on('gpsUpdate', data =>
    console.log(`📍 GPS Update [${config.id}]:`, data)
  )
  socket.on('fuelUpdate', data =>
    console.log(`⛽ Fuel Update [${config.id}]:`, data)
  )
  socket.on('emissionUpdate', data =>
    console.log(`💨 Emission Update [${config.id}]:`, data)
  )
  socket.on('obdUpdate', data =>
    console.log(`🔧 OBD Update [${config.id}]:`, data)
  )

  // Errors & Disconnection
  socket.on('error', msg => console.error(`❌ Device ${config.id} error:`, msg))
  socket.on('disconnect', reason =>
    console.warn(`❌ Device ${config.id} disconnected:`, reason)
  )
})
