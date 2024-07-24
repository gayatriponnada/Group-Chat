import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "../context/socket";
import { useParams } from "react-router-dom";

const usePlayer = (peerId) => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const [players, setPlayers] = useState({});
  const playersClone = cloneDeep(players);
  const highlightedPlayers = playersClone[peerId];
  delete playersClone[peerId];
  const nonHighlightedPlayers = playersClone;
  const toggleAudio = () => {
    setPlayers((prev) => {
      console.log("toggled the audio button");
      const copy = cloneDeep(prev);
      copy[peerId].muted = !copy[peerId].muted;
      return { ...copy };
    });
    socket.emit("toggle-video", roomId, peerId);
  };
  const toggleVideo = () => {
    console.log("toggled the video button");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[peerId].playing = !copy[peerId].playing;
      return { ...copy };
    });
    socket.emit("toggle-video", roomId, peerId);
  };

  return {
    players,
    setPlayers,
    highlightedPlayers,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
  };
};

export default usePlayer;
