import { useEffect, useRef, useState } from "react";

const useMedia = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const isStreamSet = useRef(false);
  useEffect(() => {
    if (isStreamSet.current) return;
    isStreamSet.current = true;
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("streaming:", stream);
        setMediaStream(stream);
      })
      .catch((error) => {
        console.log("error in the media", error);
      });
  }, []);
  return {
    mediaStream,
  };
};

export default useMedia;
