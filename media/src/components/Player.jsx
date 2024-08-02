import ReactPlayer from "react-player";
import { UserRound, Mic, MicOff } from "lucide-react";
// eslint-disable-next-line react/prop-types
const Player = ({ url, muted, playing, Active }) => {
  return (
    <div className="relative">
      {playing ? (
        <div
          className={`  ${Active ? "active-player" : "inactive-player"}
      `}
        >
          <ReactPlayer
            url={url}
            muted={muted}
            playing={playing}
            width={Active ? "80vw" : "auto"}
            height={Active ? "80vh" : "auto"}
          />
        </div>
      ) : (
        <div
          className={`  ${
            Active ? "usericon-active-player" : "usericon-inactive-player"
          }
      `}
        >
          <UserRound
            className="  bg-slate-600 text-white p-[2rem] rounded-md stroke-[0.1px]  "
            width={Active ? "70vw" : "auto"}
            height={Active ? "70vh" : "auto"}
          />
        </div>
      )}
      <div className="mute-icon">
        {!Active ? (
          muted ? (
            <MicOff className="text-white" />
          ) : (
            <Mic className="text-white" />
          )
        ) : undefined}
      </div>
    </div>
  );
};

export default Player;
