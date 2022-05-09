const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;
let roomName = "";

let showRoom = (_roomName) => {
  roomName = _roomName;
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName}방에 오신걸 환영합니다.`;

  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNameSubmit);
};

let handleNameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value);
};

let handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`you : ${value}`);
  });
  input.value = "";
};
let handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  // socket.emit("enter_room", input.value, function (msg) {
  //   console.log("서버에서 호출되어 실행되는 함수");
  //   console.log(`서버로부터 받은 메세지 : ${msg}`);
  // });
  //emit의  1st argument : custom message, 2nd argument : payload, 3nd : function that will be excute at the server
  //emit으로 여러개의 메세지를 보낼 수 있음 예)6개 7개 등등
  //그러나 함수는 맨마지막 인자로 넣어줘야함
  input.value = "";
};
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname, count) => {
  addMessage(`${nickname} joined! ${count}`);
});

let addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

socket.on("bye", (nickname, count) => {
  addMessage(`${nickname} leaved the room!(${count})`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
