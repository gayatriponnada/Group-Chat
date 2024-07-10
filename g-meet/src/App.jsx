import Header from "./components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const createMeeting = () => {
    axios.get("http://localhost:3000/room-id").then((res) => {
      navigate(`/:${res.data.roomId}`);
      console.log(res.data);
    });
  };

  return (
    <>
      <div className="flex gap-5 flex-col">
        <Header />
        <div className="">
          <p>Video calls and meetings for everyone</p>
          <div>
            <button
              className="text-white border-2 border-blue-500 bg-blue-500 rounded-md p-3"
              type="submit"
              onClick={createMeeting}
            >
              New Meeting
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
