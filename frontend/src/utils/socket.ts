let socket: any = null;

if (typeof window !== "undefined") {
  // Ensure this runs only on the client side
  const { io } = require("socket.io-client");

  socket = io("http://localhost:4000", {
    transports: ["websocket"]
  });
}

export { socket };
