import { useEffect, useState } from "react";

const useMedia = () => {
  const [media, setMedia] = useState(null);
  useEffect(() => {
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      console.log("streaming:", stream);
      setMedia(stream);
    });
  }, []);
  return {
    media,
  };
};

export default useMedia;
