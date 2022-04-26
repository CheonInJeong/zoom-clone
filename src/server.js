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
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  socket.send("hello from sever");
  socket.on("close", () => {
    console.log("websocket closed from browser"); //브라우저에서 소켓 연결을 끊음.
  });
  socket.on("message", (message) => {
    console.log(JSON.parse(message));
    let parsed = JSON.parse(message);
    switch (parsed.type) {
      case "message":
        sockets.forEach((sk) => {
          sk.send(`${socket.nickname} : ${parsed.payload}`);
        });
        break;
      case "nickname":
        console.log(parsed.payload);
        socket["nickname"] = parsed.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
