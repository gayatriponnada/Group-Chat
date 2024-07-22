import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socket";
const usePeer = () => {
  const { roomId } = useParams();
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("My peer ID is:" + id);
      socket.emit("room-id", roomId, id);
      setPeerId(id);
    });
    setPeer(peer);
  }, [roomId, socket]);
  return {
    peer,
    peerId,
  };
};

export default usePeer;
