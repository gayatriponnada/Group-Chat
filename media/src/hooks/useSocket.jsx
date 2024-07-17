import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const useSocket = () => {
  const [socket, setSocket] = useState();
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("client connected");
    });
    setSocket(socket);
  }, []);

  return {
    socket,
  };
};

export default useSocket;
