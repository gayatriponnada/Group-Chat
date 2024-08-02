import { useEffect, useState } from "react";
import { SocketProvider, useSocket } from "./context/socket";
import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import usePlayer from "./hooks/usePlayer";
import Player from "./components/Player";
import Footer from "./components/Footer";
import { cloneDeep } from "lodash";
import CopyUrl from "./components/Copy";
const MeetPage = () => {
  return (
    <SocketProvider>
      <Meet />
    </SocketProvider>
  );
};

const Meet = () => {
  const { peer, peerId } = usePeer();
  const { mediaStream } = useMedia();
  const { socket } = useSocket();
  const {
    players,
    setPlayers,
    nonHighlightedPlayers,
    highlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    screenSharing,
    screenShare,
    visibleAudioOn,
    visibleAudioOff,
  } = usePlayer(peerId, peer);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(false);
  const [MeetingDetails, setMeetingDetails] = useState(false);

  const showChat = () => {
    setChat(!chat);
    console.log("clicked");
    console.log(chat);
  };
  const showMeeting = () => {
    setMeetingDetails(!MeetingDetails);
  };
  useEffect(() => {
    if (!mediaStream || !socket || !peer) return;
    socket.on("userConnected", (newuser) => {
      console.log("new user connected", newuser);
      const call = peer.call(newuser, mediaStream);
      console.log(mediaStream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newuser}`);
        setPlayers((prev) => ({
          ...prev,
          [newuser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newuser]: call,
        }));
      });
      console.log("my screen sharing", screenShare);
      if (screenShare) {
        const screenCall = peer.call(newuser, screenShare);
        screenCall.on("stream", (incomingStream) => {
          console.log(`incoming screen sharing from ${newuser}`);
          setPlayers((prev) => ({
            ...prev,
            [`${newuser}-screenId`]: {
              url: incomingStream,
              muted: true,
              playing: true,
            },
          }));
        });
      }
    });
    return () => {
      socket.off("userConnected");
    };
  }, [mediaStream, socket, peer, setPlayers, screenShare]);

  useEffect(() => {
    if (!mediaStream || !peer) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(mediaStream);
      console.log("yours media stream", mediaStream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
    console.log("yours screen share", screenShare);
    if (screenShare) {
      peer.on("call", (screenCall) => {
        const { peer: screenId } = screenCall;
        console.log("screenId", screenId);
        screenCall.answer();
        screenCall.on("stream", (incomingStream) => {
          console.log(`incoming screen sharing from ${screenId}`);
          setPlayers((prev) => ({
            ...prev,
            [screenId]: {
              url: incomingStream,
              muted: true,
              playing: true,
            },
          }));
        });
      });
    }
  }, [mediaStream, peer, screenShare, setPlayers]);

  useEffect(() => {
    if (screenShare && peerId)
      setPlayers((prev) => ({
        ...prev,
        [peerId]: {
          url: screenShare,
          muted: true,
          playing: true,
        },
      }));
  }, [peerId, screenShare, setPlayers]);

  useEffect(() => {
    if (!mediaStream || !peerId) return;
    setPlayers((prev) => ({
      ...prev,
      [peerId]: {
        url: mediaStream,
        muted: true,
        playing: true,
      },
    }));
  }, [mediaStream, peerId, screenShare, setPlayers]);

  useEffect(() => {
    if (!socket) return;
    socket.on("toggle-audio", (userId) => {
      console.log(`toggled audio ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].muted = !copy[userId].muted;
        } else {
          console.error(`User ${userId} not found in players muted`);
        }
        return { ...copy };
      });
    });
    socket.on("toggle-video", (userId) => {
      console.log(`toggled video ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].playing = !copy[userId].playing;
        } else {
          console.error(`User ${userId} not found in players playing`);
        }
        return { ...copy };
      });
    });
    socket.on("screen-share", (userId) => {
      console.log(`screen is sharing by the ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (copy[userId]) {
          copy[userId].url = copy[userId].url ? screenShare : undefined;
        } else {
          console.error(`User ${userId} not found in players playing with url`);
        }
        return { ...copy };
      });
    });
    socket.on("leave-room", (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    });
    return () => {
      socket.off("toggle-audio");
      socket.off("toggle-video");
      socket.off("leave-room");
    };
  }, [mediaStream, players, screenShare, setPlayers, socket, users]);

  return (
    <main className="relative flex gap-4 flex-col overflow-hidden h-screen">
      <div className="w-[80vw] h-[80vh]">
        {highlightedPlayers && (
          <Player
            url={highlightedPlayers.url}
            // screenurl={highlightedPlayers.screenurl}
            muted={highlightedPlayers.muted}
            playing={highlightedPlayers.playing}
            Active
          />
        )}
      </div>
      <div className="absolute w-[300px] top-0 right-0 flex flex-col items-center justify-center rounded-sm">
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              Active={false}
            />
          );
        })}
      </div>
      <CopyUrl />
      <div>
        <Footer
          muted={highlightedPlayers?.muted}
          playing={highlightedPlayers?.playing}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
          screenSharing={screenSharing}
          visibleAudioOn={visibleAudioOn}
          visibleAudioOff={visibleAudioOff}
          showChat={showChat}
          chat={chat}
          showMeeting={showMeeting}
          MeetingDetails={MeetingDetails}
        />
      </div>
    </main>
  );
};
export default MeetPage;
