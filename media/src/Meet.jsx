import usePeer from "./hooks/usePeer";
import useMedia from "./hooks/useMedia";
import Player from "./components/Player";
import useSocket from "./hooks/useSocket";

const Meet = () => {
  useSocket();
  const { peerId } = usePeer();
  const { media } = useMedia();
  return (
    <div>
      <Player playerId={peerId} url={media} muted={true} playing={true} />
    </div>
  );
};

export default Meet;
