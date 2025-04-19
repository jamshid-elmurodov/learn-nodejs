import net, { Socket } from "net";

const members: Array<{socket: Socket }> = [];

const server = net.createServer((socket) => {
  members.push({ socket });
  console.log(`New member`);

  socket.on("data", (data) => {
    console.log(`New message: ${data.toString()}`);

    members.forEach((c) => {
      c.socket.write(`${data}`);
    });
  });
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Server is listening ", server.address());
});
