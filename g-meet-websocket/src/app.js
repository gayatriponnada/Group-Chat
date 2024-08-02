const express = require("express");
const app = express();
const server = require("http").createServer(app);
const crypto = require("crypto");
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.use(cors());
const port = 3000;
io.on("connection", (socket) => {
  console.log("server connected");
  socket.on("room-id", (url, newuserId) => {
    socket.join(url);
    console.log("room joined", url);
    console.log("peerid", newuserId);
    socket.to(url).emit("userConnected", newuserId);

    socket.on("message-sent", (message) => {
      socket.to(url).emit("message-received", message);
    });
  });
  socket.on("toggle-audio", (url, userId) => {
    console.log("room joined:audio", url);
    console.log("peerid:audio", userId);
    socket.join(url);
    socket.to(url).emit("toggle-audio", userId);
  });
  socket.on("toggle-video", (url, userId) => {
    socket.join(url);
    socket.to(url).emit("toggle-video", userId);
  });
  socket.on("leave-room", (url, userId) => {
    socket.join(url);
    socket.to(url).emit("leave-room", userId);
  });
  socket.on("screen-share", (url, userId) => {
    socket.join(url);
    socket.to(url).emit("screen-share", userId);
  });
});

app.get("/room-id", (req, res) => {
  const id = crypto.randomUUID();
  return res.status(200).json({
    roomId: id,
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
