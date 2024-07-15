import Peer from "peerjs";
import { useEffect, useState } from "react";
const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState();
  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      console.log("My peer ID is:" + id);
      setPeerId(id);
    });
    setPeer(peer);
  }, []);
  return {
    peer,
    peerId,
  };
};

export default usePeer;
