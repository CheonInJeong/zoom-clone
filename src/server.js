import express from "express";
import WebSocketServer from "ws";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("video"));
app.get("/*", (req, res) => res.redirect("/"));
//app.listen(3000, handleListen);
const server = http.createServer(app); //http server
const wsServer = new Server(server, {
  cors: {
    origin: ["httpsL//admin.socket.io"],
    credentials: true,
  },
});

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});
const handleListen = () => console.log(`listening on http://localhost:3000`);

server.listen(3000, handleListen);
