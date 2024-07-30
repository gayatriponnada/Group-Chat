import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socket";
const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.emit("room-id", roomId);
    socket.on("message-received", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [roomId, socket]);

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
      <div className="w-[30%] h-[80%] rounded-md border-2  border-#dbdad8 bg-[#EEEDEB] absolute top-2 right-2 p-4">
        {messages.map(({ input, time }, index) => {
          return (
            <div key={index} className="bg-red-300">
              <div>{input}</div>
              <div>{time}</div>
            </div>
          );
        })}

        <footer className="absolute bottom-3 gap-4  p-2 flex focus-within:border-2 border-blue-300 rounded-md">
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
      </div>
    </>
  );
};

export default Chat;
