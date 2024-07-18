import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import Player from "./components/Player";
import { SocketProvider } from "./context/socket";

const MeetPage = () => {
  return (
    <SocketProvider>
      <Meet />
    </SocketProvider>
  );
};

const Meet = () => {
  const { peerId } = usePeer();
  const { media } = useMedia();
  return (
    <div>
      <Player playerId={peerId} url={media} muted={true} playing={true} />
    </div>
  );
};
export default MeetPage;
