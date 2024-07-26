import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "../context/socket";
import { useNavigate, useParams } from "react-router-dom";

const usePlayer = (peerId, peer) => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const [visibleAudioOff, setVisibleAudioOff] = useState(false);
  const [visibleAudioOn, setVisibleAudioOn] = useState(false);
  const [players, setPlayers] = useState({});
  const navigate = useNavigate();
  const playersClone = cloneDeep(players);
  const highlightedPlayers = playersClone[peerId];
  delete playersClone[peerId];
  const nonHighlightedPlayers = playersClone;

  const leaveRoom = () => {
    socket.emit("leave-room", roomId, peerId);
    peer?.disconnect();
    navigate("/");
  };
  const toggleAudio = () => {
    setVisibleAudioOn(true);
    console.log(visibleAudioOn);
    setTimeout(() => {
      setVisibleAudioOn(false);
      console.log(visibleAudioOn);
    }, 3000);
    setVisibleAudioOff(true);
    console.log(visibleAudioOff);
    setTimeout(() => {
      setVisibleAudioOff(false);
      console.log(visibleAudioOff);
    }, 3000);
    setPlayers((prev) => {
      console.log("toggled the audio button");
      setTimeout(() => {
        setVisibleAudioOn(false);
        console.log(visibleAudioOn);
      }, 3000);
      const copy = cloneDeep(prev);
      copy[peerId].muted = !copy[peerId].muted;
      return { ...copy };
    });
    socket.emit("toggle-audio", roomId, peerId);
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
    leaveRoom,
    visibleAudioOff,
    visibleAudioOn,
  };
};

export default usePlayer;
