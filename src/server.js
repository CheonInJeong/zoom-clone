import express from "express";
import WebSocketServer from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
const handleListen = () => {
  console.log("jello!");
};

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
//app.listen(3000, handleListen);
const server = http.createServer(app); //http server
const wss = new WebSocketServer.Server({ server }); //websocket server : http 서버 위에 ws서버를 올림

wss.on("connection", (socket) => {
  console.log(socket);
  socket.send("hello from sever");
  socket.on("close", () => {
    console.log("websocket closed from browser"); //브라우저에서 소켓 연결을 끊음.
  });
});
server.listen(3000, handleListen);
