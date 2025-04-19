import net, { Socket } from "net";

type Message = {
  id : number;
  message: string
}

const members: Map<number, Socket> = new Map();

const server = net.createServer();

server.on("connection", (socket) => {
  members.set(members.size + 1, socket);
  console.log(`New member joined id: ${members.size}`);

  socket.write(`your-id-${members.size}`);

  socket.on("data", (data) => {
    const json : Message = JSON.parse(data.toString());

    const msg = `> Member ${json.id}: ${json.message}`;
    console.log(msg);

    members.forEach((c) => {
      c.write(msg);
    });
  });
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Server is listening ", server.address());
});
