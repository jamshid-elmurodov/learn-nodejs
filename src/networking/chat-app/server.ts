import net, { Server, Socket } from "net";

type Message = {
  id : number;
  message: string
}

const members: Map<number, Socket> = new Map();

const server : Server = net.createServer();

server.on("connection", (socket) => {
  let id = members.size + 1;

  members.forEach(member => {
    member.write(`Member ${id} joined!`)
  })

  members.set(id, socket);
  console.log(`New member joined id: ${id}`);

  socket.write(`your-id-${id}`);

  socket.on("data", (data) => {
    const json : Message = JSON.parse(data.toString());

    const msg = `> Member ${json.id}: ${json.message}`;
    console.log(msg);

    members.forEach((c) => {
      c.write(msg);
    });
  });

  socket.on('end', () => {
    members.forEach(member => {
      member.write(`Member ${id} left!`)
    })
  })
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Server is listening ", server.address());
});
