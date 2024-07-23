import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socket";
const usePeer = () => {
  const { roomId } = useParams();
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState();
  const { socket } = useSocket();
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;
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
