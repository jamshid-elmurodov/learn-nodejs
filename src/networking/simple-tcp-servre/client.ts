import net from "net";

const conn = net.createConnection({ host: "127.0.0.1", port: 3003 }, () => {
  console.log("Connection opened");
  conn.write("Connection opened");
});

conn.write("Salom, yaxshimisilar");