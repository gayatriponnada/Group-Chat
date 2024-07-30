import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquareText,
  Info,
} from "lucide-react";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import MeetingInfo from "./Meeting-info";
// eslint-disable-next-line react/prop-types
const Footer = ({
  muted,
  playing,
  toggleAudio,
  toggleVideo,
  leaveRoom,
  visibleAudioOn,
  visibleAudioOff,
  showChat,
  chat,
  MeetingDetails,
  showMeeting,
}) => {
  const { roomId } = useParams();
  const currentTime = new Date().toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="flex justify-evenly">
      <div className="flex gap-4 font-medium ">
        <div> {currentTime}</div>
        <span>|</span>
        <div> {roomId}</div>
      </div>
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
      <div className="flex gap-4">
        <Info
          className="flex justify-center items-center rounded-2xl border-2 border-#dbdad8 bg-[#EEEDEB] p-1 size-[35px] stroke-[1.25px] "
          onClick={showMeeting}
        />
        {MeetingDetails && <MeetingInfo />}
        <MessageSquareText
          className="flex justify-center items-center rounded-2xl border-2 border-#dbdad8 bg-[#EEEDEB] p-1 size-[35px] stroke-[1.25px]"
          onClick={showChat}
        />
        {chat && <Chat className="" />}
      </div>
    </div>
  );
};

export default Footer;
