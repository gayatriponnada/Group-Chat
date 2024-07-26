import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const createMeetingId = () => {
    axios.get("http://localhost:3000/room-id").then((response) => {
      navigate(`${response.data.roomId}`);
    });
  };
  const joinMeeting = () => {
    navigate(`${input}`);
  };
  return (
    <div className="flex flex-col items-center   gap-3 border-2 border-black rounded-md p-3 w-1/2  m-auto mt-3">
      <h3 className=" text-3xl  text-blue-800  ">Google Meet</h3>
      <div className="flex justify-center flex-col gap-3">
        <input
          className="p-3 focus:outline-none border-2 border-blue-300 rounded-md"
          placeholder="Enter the roomId"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <div className="flex gap-3">
          <button
            className="text-white bg-blue-500 border-2 border-blue-500 rounded-md p-3"
            onClick={joinMeeting}
          >
            Join Meeting
          </button>
          <button
            className="text-white bg-blue-500 border-2 border-blue-500 rounded-md p-3"
            onClick={createMeetingId}
          >
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
