const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickname = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server🙆🏻‍♀️");
});

socket.addEventListener("message", (message) => {
  console.log(message);
  console.log(`from server : ${message.data}`);
  const li = document.createElement("li");
  li.innerHTML = message.data;
  msgList.append(li);
});

socket.addEventListener("close", () => {
  console.log("websocket closed🙅🏻‍♀️");
});

nickname.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickname.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
});

msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  socket.send(makeMessage("message", input.value));
  input.value = "";
});

let makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};
