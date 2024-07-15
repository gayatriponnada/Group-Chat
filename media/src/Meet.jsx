import { useEffect } from "react";
import { io } from "socket.io-client";
import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import Player from "./components/Player";
const Meet = () => {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("client connected");
    });
  }, []);
  const { peerId } = usePeer();
  const { media } = useMedia();
  return (
    <div>
      <Player playerId={peerId} url={media} muted={true} playing={true} />
    </div>
  );
};

export default Meet;
