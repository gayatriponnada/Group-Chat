import ReactPlayer from "react-player";
import { UserRoundX } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Player = ({ url, muted, playing, Active }) => {
  return (
    <div
      className={`  ${Active ? "active-player" : "inactive-player"}
      `}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width={Active ? "80vw" : "auto"}
          height={Active ? "80vh" : "auto"}
        />
      ) : (
        <UserRoundX
          className=" size-[6rem] bg-slate-600 text-white font-extralight rounded-md p-5 "
          width={Active ? "80vw" : "auto"}
          height={Active ? "80vh" : "auto"}
        />
      )}
    </div>
  );
};

export default Player;
