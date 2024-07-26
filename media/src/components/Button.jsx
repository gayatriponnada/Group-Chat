import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
// eslint-disable-next-line react/prop-types
const Button = ({
  muted,
  playing,
  toggleAudio,
  toggleVideo,
  leaveRoom,
  visibleAudioOn,
  visibleAudioOff,
}) => {
  return (
    <div className="flex gap-4 justify-center ">
      {muted ? (
        <div>
          <MicOff
            className="rounded-2xl bg-red-500 text-white p-2 size-[35px] cursor-pointer"
            onClick={toggleAudio}
          />
          <p className={`${visibleAudioOff ? "p-mute" : "hidden"}`}>
            <MicOff className="stroke-[1px]" /> Microphone Off
          </p>
        </div>
      ) : (
        <div>
          <Mic
            className="rounded-2xl bg-slate-600 text-white p-2 size-[35px] cursor-pointer "
            onClick={toggleAudio}
          />
          <p className={`${visibleAudioOn ? "p-mute" : "hidden"}`}>
            <Mic className="stroke-[1px]" />
            Microphone On
          </p>
        </div>
      )}
      {playing ? (
        <Video
          className="rounded-2xl bg-slate-600 text-white p-2 size-[35px] cursor-pointer "
          onClick={toggleVideo}
        />
      ) : (
        <VideoOff
          className="rounded-2xl bg-red-500 text-white p-2 size-[35px] cursor-pointer"
          onClick={toggleVideo}
        />
      )}
      <Phone
        className="rounded-2xl bg-red-500 text-white p-2 size-[35px] cursor-pointer "
        onClick={leaveRoom}
      />
    </div>
  );
};

export default Button;
