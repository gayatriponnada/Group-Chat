import { useEffect, useState } from "react";
import { SocketProvider, useSocket } from "./context/socket";
import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import usePlayer from "./hooks/usePlayer";
import Player from "./components/Player";
import Button from "./components/Button";
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
    visibleAudioOn,
    visibleAudioOff,
  } = usePlayer(peerId, peer);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!mediaStream || !socket || !peer) return;
    socket.on("userConnected", (newuser) => {
      console.log("new user connected", newuser);
      const call = peer.call(newuser, mediaStream);
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
    });
    return () => {
      socket.off("userConnected");
    };
  }, [mediaStream, socket, peer, setPlayers]);

  useEffect(() => {
    if (!mediaStream || !peer) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(mediaStream);
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
  }, [mediaStream, peer, setPlayers]);

  useEffect(() => {
    if (!mediaStream || !peerId) return;
    console.log(`Effect is running${peerId}`);
    setPlayers((prev) => ({
      ...prev,
      [peerId]: {
        url: mediaStream,
        muted: true,
        playing: true,
      },
    }));
  }, [mediaStream, peerId, setPlayers]);

  useEffect(() => {
    if (!socket) return;
    console.log("useEffect is running in useplayer");
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
  }, [players, setPlayers, socket, users]);

  return (
    <main className="relative flex gap-4 flex-col">
      <div className="w-[80vw] h-[80vh]">
        {highlightedPlayers && (
          <Player
            url={highlightedPlayers.url}
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
        <Button
          muted={highlightedPlayers?.muted}
          playing={highlightedPlayers?.playing}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
          visibleAudioOn={visibleAudioOn}
          visibleAudioOff={visibleAudioOff}
        />
      </div>
    </main>
  );
};
export default MeetPage;
