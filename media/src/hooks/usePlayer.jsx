import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "../context/socket";
import { useNavigate, useParams } from "react-router-dom";

const usePlayer = (peerId, peer) => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const [visibleAudioOff, setVisibleAudioOff] = useState(false);
  const [visibleAudioOn, setVisibleAudioOn] = useState(false);
  const [screenShare, setScreenShare] = useState(null);
  const [players, setPlayers] = useState({});
  const navigate = useNavigate();
  const playersClone = cloneDeep(players);
  const highlightedPlayers = playersClone[peerId];
  delete playersClone[peerId];
  const nonHighlightedPlayers = playersClone;

  //  ----- for reference -------
  // console.log("peerId", peerId);
  // console.log("highlightedPlayers", highlightedPlayers);
  // console.log("nonHighlightedPlayers", nonHighlightedPlayers);
  // console.log("players", players);

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

  const screenSharing = () => {
    console.log("toggled the screenshare button");
    const constraints = {
      audio: true,
      video: { mediaSource: "screen" },
    };
    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((stream) => {
        console.log("ScreenSharing:", stream);
        setScreenShare(stream);
      })
      .catch((error) => {
        console.log("error in the screen sharing", error);
      });
  };
  useEffect(() => {
    if (!socket) return;
    if (!screenShare)
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        // copy[peerId].url = copy[peerId].url ? screenShare : undefined;
        console.log("hi", screenShare);
        return { ...copy };
      });
    socket.emit("screen-share", roomId, peerId);
  }, [peerId, roomId, screenShare, socket]);
  return {
    players,
    setPlayers,
    highlightedPlayers,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    screenSharing,
    screenShare,
    visibleAudioOff,
    visibleAudioOn,
  };
};

export default usePlayer;
