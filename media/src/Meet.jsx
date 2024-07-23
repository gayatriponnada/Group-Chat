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
  const { players, setPlayers, nonHighlightedPlayers, highlightedPlayers } =
    usePlayer(peerId);
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
      });
    });
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

  return (
    <>
      <main className="relative overflow-hidden">
        <div className="    w-screen h-screen   ">
          {highlightedPlayers && (
            <Player
              url={highlightedPlayers.url}
              muted={highlightedPlayers.muted}
              playing={highlightedPlayers.playing}
              Active
            />
          )}
        </div>

        <div className="absolute w-[300px] top-0 right-0 flex flex-col items-start justify-start ">
          {Object.keys(nonHighlightedPlayers).map((playerId) => {
            const {
              url: incomingStream,
              muted,
              playing,
            } = nonHighlightedPlayers[playerId];
            return (
              <Player
                key={playerId}
                url={incomingStream}
                muted={muted}
                playing={playing}
                Active={false}
              />
            );
          })}
        </div>
      </main>
    </>
  );
};
export default MeetPage;
