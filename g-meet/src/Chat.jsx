import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState();
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("client connected");
      socket.emit("room-id", id);
      socket.on("message-received", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      setSocket(socket);
    });
  }, [id]);

  const send = useCallback(
    (input) => {
      const currentTime = new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      socket.emit("message-sent", { input, time: currentTime });
      setMessages((prevMessages) => [
        ...prevMessages,
        { input, time: currentTime },
      ]);
      setInput("");
    },
    [socket]
  );
  return (
    <>
      <div className="bg-red-500 h-1/2">
        {messages.map(({ input, time }) => {
          return (
            <div key={time} className="bg-red-300">
              <div>{input}</div>
              <div>{time}</div>
            </div>
          );
        })}
      </div>

      <footer className="absolute bottom-5 p-2 flex focus-within:border-2 border-blue-300 rounded-md">
        <div>
          <input
            type="text"
            placeholder="Message...."
            className=" p-2 focus:outline-none  "
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            className="bg-blue-500 text-white border-blue-500 p-2 rounded-md "
            onClick={() => {
              send(input);
            }}
          >
            Send
          </button>
        </div>
      </footer>
    </>
  );
};

export default Chat;
