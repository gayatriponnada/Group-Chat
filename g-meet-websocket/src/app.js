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
  socket.on("room-id", (url) => {
    socket.join(url);
    console.log("room joined", url);
    socket.on("message-sent", (message) => {
      socket.to(url).emit("message-received", message);
    });
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
