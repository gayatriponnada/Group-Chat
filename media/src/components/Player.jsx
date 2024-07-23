import ReactPlayer from "react-player";
// eslint-disable-next-line react/prop-types
const Player = ({ url, muted, playing, Active }) => {
  return (
    <div
      className={`  ${Active ? "active-player" : "inactive-player"}
      `}
    >
      <ReactPlayer
        url={url}
        muted={muted}
        playing={playing}
        width={Active ? "100vw" : "auto"}
        height={Active ? "100vh" : "auto"}
      />
    </div>
  );
};

export default Player;
