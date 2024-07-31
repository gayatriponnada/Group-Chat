import { useState } from "react";
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
    const constraints = {
      audio: true,
      video: { mediaSource: "screen" },
    };
    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((stream) => {
        console.log("streaming:", stream);
        setScreenShare(stream);
      })
      .catch((error) => {
        console.log("error in the screen sharing", error);
      });
    console.log("toggled the screenshare button");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[peerId].screenurl = copy[peerId].screenurl ? screenShare : undefined;
      return { ...copy };
    });
    // if (nonHighlightedPlayers) {
    //   console.log("screen sharing:", nonHighlightedPlayers);
    //   const call = peer.call(nonHighlightedPlayers, screenShare);
    //   call?.on("stream", (incomingStream) => {
    //     console.log(`incoming stream from ${peerId}`);
    //     setPlayers((prev) => {
    //       const copy = cloneDeep(prev);
    //       copy[nonHighlightedPlayers] = {
    //         url: incomingStream,
    //         muted: true,
    //         playing: true,
    //       };
    //       return { ...copy };
    //     });
    //   });
    // } else {
    //   console.error(`User not found with peerid ${nonHighlightedPlayers} `);
    // }

    // peer.on("call", (call) => {
    //   const { peer: peerId } = call;
    //   call.answer(screenShare);
    //   call.on("stream", (incomingStream) => {
    //     console.log(`incoming stream from ${peerId}`);
    //     setPlayers((prev) => ({
    //       ...prev,
    //       [peerId]: {
    //         url: incomingStream,
    //         muted: true,
    //         playing: true,
    //       },
    //     }));
    //   });
    // });
    socket.emit("screen-share", roomId, peerId);
  };
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
