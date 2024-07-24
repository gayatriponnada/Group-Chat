import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
// eslint-disable-next-line react/prop-types
const Button = ({ muted, playing, toggleAudio, toggleVideo }) => {
  return (
    <div className="flex gap-4 justify-center ">
      {muted ? (
        <MicOff
          className="rounded-2xl bg-red-500 text-white p-2 size-[35px] "
          onClick={toggleAudio}
        />
      ) : (
        <Mic
          className="rounded-2xl bg-slate-600 text-white p-2 size-[35px] "
          onClick={toggleAudio}
        />
      )}
      {playing ? (
        <Video
          className="rounded-2xl bg-slate-600 text-white p-2 size-[35px] "
          onClick={toggleVideo}
        />
      ) : (
        <VideoOff
          className="rounded-2xl bg-red-500 text-white p-2 size-[35px] "
          onClick={toggleVideo}
        />
      )}
      <Phone className="rounded-2xl bg-red-500 text-white p-2 size-[35px] " />
    </div>
  );
};

export default Button;
