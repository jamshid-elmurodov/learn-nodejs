import net from "net";
import readline from "readline/promises";

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

  conn.write(msg);
};

conn.on("connect", async () => {
  console.log("You connected to server successfully");
  await asker();
});

conn.on("data", async (data) => {
  await lineCleaner();
  await cursorMover();

  console.log("\nNew message: ", data.toString());
  await asker();
});
