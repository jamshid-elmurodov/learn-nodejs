import net from "net";
import readline from "readline/promises";

let id: number;

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const lineCleaner = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(0, () => {
      resolve();
    });
  });
};

const cursorMover = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(0, -1, () => resolve());
  });
};

const conn = net.createConnection({ port: 3001, host: "localhost" });

const asker = async () => {
  const msg = await reader.question("Enter a message > ");

  await cursorMover();

  await lineCleaner();

  conn.write(
    JSON.stringify({
      id,
      message: msg,
    })
  );
};

conn.on("connect", async () => {
  console.log("You connected to server successfully");
  await asker();
});

conn.on("data", async (data) => {
  const msg = data.toString();

  await lineCleaner();
  await cursorMover();

  if (msg.startsWith("your-id-")) {
    id = Number(msg.substring(8));
    console.log(`\nYour id is ${id}`);
  } else {
    console.log("\n", data.toString());
  }

  await asker();
});
