import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import Player from "./components/Player";
import { SocketProvider, useSocket } from "./context/socket";
import { useEffect } from "react";
import usePlayer from "./hooks/usePlayer";

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
  const { players, setPlayers } = usePlayer();
  useEffect(() => {
    if (!socket || !peer || !mediaStream) return;
    socket.on("userConnected", (newuser) => {
      console.log("new user connected", newuser);
      const call = peer.call(newuser, mediaStream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newuser}`);
        console.log("server");
        setPlayers((prev) => ({
          ...prev,
          [newuser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
      });
    });
  }, [mediaStream, socket, peer, setPlayers]);

  useEffect(() => {
    if (!peer || !mediaStream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(mediaStream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        console.log("client");
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
      });
    });
  }, [mediaStream, peer, setPlayers]);

  useEffect(() => {
    if (!peerId) return;
    setPlayers((prev) => ({
      ...prev,
      [peerId]: {
        url: mediaStream,
        muted: true,
        playing: true,
      },
    }));
  }, [mediaStream, peerId, setPlayers]);

  return (
    <div>
      {Object.keys(players).map((playerId) => {
        const { url, muted, playing } = players[playerId];
        return (
          <Player key={playerId} url={url} muted={muted} playing={playing} />
        );
      })}
    </div>
  );
};
export default MeetPage;
