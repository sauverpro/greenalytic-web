"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendData = sendData;
var _socket = require("socket.io-client");
// Pre-defined routes (Kigali to other cities)
var routes = {
  kigaliToNyamagabe: [{
    latitude: -1.9572,
    longitude: 30.1127
  },
  // Kigali
  {
    latitude: -2.5883,
    longitude: 29.5922
  } // Nyamagabe
  ],
  kigaliToMusanze: [{
    latitude: -1.9572,
    longitude: 30.1127
  },
  // Kigali
  {
    latitude: -1.5022,
    longitude: 29.6885
  } // Musanze
  ],
  kigaliToRubavu: [{
    latitude: -1.9572,
    longitude: 30.1127
  },
  // Kigali
  {
    latitude: -1.6907,
    longitude: 29.251
  } // Rubavu
  ]
};

// Function to interpolate between two coordinates
function interpolateCoordinates(start, end, fraction) {
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * fraction,
    longitude: start.longitude + (end.longitude - start.longitude) * fraction
  };
}

// Function to generate random vehicle data
function generateRandomData(vehicleId, latitude, longitude) {
  var dataTypes = ['fuel', 'gps', 'emission'];
  var type = dataTypes[Math.floor(Math.random() * dataTypes.length)];
  console.log("Generating data for Vehicle ".concat(vehicleId, " of type ").concat(type)); // Log action

  switch (type) {
    case 'fuel':
      return {
        type: type,
        fuelLevel: Math.floor(Math.random() * 100),
        vehicleId: vehicleId
      };
    case 'gps':
      return {
        type: type,
        latitude: latitude,
        longitude: longitude,
        speed: Math.floor(Math.random() * 120),
        accuracy: Math.floor(Math.random() * 100),
        vehicleId: vehicleId,
        deviceId: vehicleId
      };
    case 'emission':
      return {
        type: type,
        co2Percentage: Math.random() * 100,
        coPercentage: Math.random() * 100,
        o2Percentage: Math.random() * 100,
        hcPPM: Math.random() * 100,
        vehicleId: vehicleId,
        plateNumber: "ABC".concat(vehicleId)
      };
    default:
      return {};
  }
}

// Function to send data with auto-reconnect
function sendData() {
  var vehicleId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var routeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'kigaliToNyamagabe';
  var selectedRoute = routes[routeName] || routes.kigaliToNyamagabe;
  var fraction = 0;
  function connectWebSocket() {
    var socket = (0, _socket.io)('http://localhost:4000');
    socket.on('connect', function () {
      console.log("\u2705 Connected to WebSocket for Vehicle ".concat(vehicleId));
      var interval = setInterval(function () {
        if (fraction > 1) {
          fraction = 0; // Restart movement
        }
        var _interpolateCoordinat = interpolateCoordinates(selectedRoute[0], selectedRoute[1], fraction),
          latitude = _interpolateCoordinat.latitude,
          longitude = _interpolateCoordinat.longitude;
        var data = generateRandomData(vehicleId, latitude, longitude);
        socket.emit('vehicleData', data); // Send data
        console.log("\uD83D\uDE97 Vehicle ".concat(vehicleId, " Sent:"), data);
        fraction += 0.02; // Move forward
      }, 1000);

      // Stop sending after 20 seconds
      setTimeout(function () {
        clearInterval(interval);
        console.log("\u23F9\uFE0F Stopped sending data for Vehicle ".concat(vehicleId));
        socket.disconnect();
      }, 20000);
    });

    // Log received data
    socket.on('vehicleDataResponse', function (data) {
      console.log("\uD83D\uDCE9 Vehicle ".concat(vehicleId, " Received:"), data);
    });
    socket.on('disconnect', function () {
      console.log("\u274C WebSocket disconnected for Vehicle ".concat(vehicleId, ". Reconnecting..."));
      setTimeout(connectWebSocket, 5000); // Retry in 5 sec
    });
    socket.on('connect_error', function (error) {
      console.error("\u26A0\uFE0F Connection error for Vehicle ".concat(vehicleId, ":"), error);
    });
  }
  connectWebSocket(); // Initial connection
}