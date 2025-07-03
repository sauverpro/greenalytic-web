 Step-by-Step Integration
1. Connect to the Server
js
Copy
Edit
socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id)
})
2. Identify the Device
Send tracking device ID after connection:

js
Copy
Edit
socket.emit('identify', { trackingDeviceId: YOUR_DEVICE_ID })
⚠️ The trackingDeviceId must already exist in the backend and be assigned to a vehicle.

3. Send Sensor Data to the Server
Each payload is sent as a separate event:

📍 GPS Data
js
Copy
Edit
socket.emit('gpsData', {
  trackingDeviceId: 1,
  latitude: -1.9504,
  longitude: 30.0585,
  speed: 55,
  accuracy: 5.0,
  plateNumber: 'RAC101A'
})
⛽ Fuel Data
js
Copy
Edit
socket.emit('fuelData', {
  trackingDeviceId: 1,
  fuelLevel: 65.4,
  fuelConsumption: 7.1,
  plateNumber: 'RAC101A'
})
💨 Emission Data
js
Copy
Edit
socket.emit('emissionData', {
  trackingDeviceId: 1,
  co2Percentage: 0.04,
  coPercentage: 0.01,
  o2Percentage: 20.8,
  hcPPM: 180,
  noxPPM: 0.03,
  pm25Level: 0.02,
  plateNumber: 'RAC101A'
})
🔧 OBD Data
js
Copy
Edit
socket.emit('obdData', {
  trackingDeviceId: 1,
  rpm: 2200,
  throttlePosition: 40.5,
  engineTemperature: 95,
  engineStatus: 'Running',
  faultCodes: ['P0133'],
  plateNumber: 'RAC101A'
})
4. Listen for Feedback
js
Copy
Edit
socket.on('connected', msg => console.log('✅', msg))
socket.on('error', err => console.error('❌', err))
5. (Optional) Subscribe to Updates

socket.on('gpsUpdate', data => console.log('📍 GPS Update:', data))
socket.on('fuelUpdate', data => console.log('⛽ Fuel Update:', data))
socket.on('emissionUpdate', data => console.log('💨 Emission Update:', data))
socket.on('obdUpdate', data => console.log('🔧 OBD Update:', data))
🛑 Important Guidelines
Identify first before sending any data.

Ensure trackingDeviceId exists in DB and matches a real vehicle.

The plateNumber should match the vehicle's record.

Implement retry logic and connection stability (reconnAttempts).

Expect data on independent channels → clients only receive their device’s updates.

📞 Support
API Lead: Imanariyo Baptiste

API Docs: https://greenalytic-vehicle-monitoring-api.onrender.com/api-docs

Socket.IO Reference: Socket.IO v4 Docs

