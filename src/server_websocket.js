import express from "express";
import WebSocketServer from "ws";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
const handleListen = () => {
  console.log("jello!");
};

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

instrument(wsServer, {
  auth: false,
});

function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
wsServer.on("connection", (socket) => {
  console.log(wsServer.sockets.adapter);
  socket.onAny((event) => {
    console.log(`socket Event : ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket["nickname"] = "Anonynous";
    socket.join(roomName);
    done(roomName); //화면 roomname입력창에서 채팅창으로 변경

    socket.to(roomName).emit("welcome", socket.nickname, countUser(roomName)); //welcome 이벤트를 보내줌, 프론트엔드에서 이 이벤트에 반응해야함

    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) =>
        socket.to(room).emit("bye", socket.nickname, countUser(roomName) - 1)
      );
    });

    socket.on("disconnect", () => {
      wsServer.sockets.emit("room_change", getPublicRooms(roomName));
    });

    wsServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
  //   socket.on("enter_room", (roomName, fnc) => {
  //     //프론트에서 emit의 세번째 인수로 함수를 보내줬을 때 받기 위해서 두번째 인자로 함수를 받음
  //     fnc(roomName); //front에서 보낸 함수를 백엔드에서 호출하지만 실행은 front에서! tip : setTimeout을 걸어보면 확실히 알 수 있음
  //     socket.join(roomName);
  //     //함수에 인자를 넣고 호출 하면 프론트에서 그 인자를 받을 수도 있음.
  //     // 예 ) 백엔드에서 fnc(msg)를 넣고 호출하면 프론트에서 보낸 함수에 인자를 넣어서 백엔드가 보낸 msg를 받을 수 잇음
  //   });
});

function countUser(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}
/*
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
});*/

server.listen(3000, handleListen);
