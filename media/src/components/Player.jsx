import ReactPlayer from "react-player";
// eslint-disable-next-line react/prop-types
const Player = ({ url, muted, playing }) => {
  return (
    <div>
      <ReactPlayer url={url} muted={muted} playing={playing} />
    </div>
  );
};

export default Player;
