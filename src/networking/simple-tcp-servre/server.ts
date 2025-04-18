import net from "net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(`Data received: ${data}`);
  });
});

server.listen(3003, "127.0.0.1", () => {
  console.log("Server info", server.address());
});
