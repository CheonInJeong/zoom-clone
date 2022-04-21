const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server🙆🏻‍♀️");
});

socket.addEventListener("message", (message) => {
  console.log(`from server : ${message.data}`);
});

socket.addEventListener("close", () => {
  console.log("websocket closed🙅🏻‍♀️");
});
