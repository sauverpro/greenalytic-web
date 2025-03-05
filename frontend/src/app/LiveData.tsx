import { useEffect, useState } from "react";
import { getSocket } from "../utils/socket"; // ✅ Import the function, not the socket instance

const LiveData: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    const socket = getSocket(); // ✅ Initialize only on the client

    if (!socket) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleDataStatus = (data: { success: boolean; message: string }) => {
      console.log("Live data received:", data);
      setServerMessage(data.message);
    };

    // ✅ Attach event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("dataStatus", handleDataStatus);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("dataStatus", handleDataStatus);
    };
  }, []);

  return (
    <div>
      <h2>Live Vehicle Data</h2>
      <p>{isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
      {serverMessage && <p>{serverMessage}</p>}
    </div>
  );
};

export default LiveData;
