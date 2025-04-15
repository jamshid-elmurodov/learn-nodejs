import { Writable } from "node:stream";
import fs from "fs";
import { Buffer } from "node:buffer";

class CustomWritable extends Writable {
  private filePath: string;
  private fd: number = 0;
  private chunks: Array<Buffer>;
  private chunksLength: number;
  private highWaterMark: number;
  private numberOfWrites: number;

  constructor(options: { highWaterMark: number; filePath: string }) {
    super(options);
    this.highWaterMark = options.highWaterMark;
    this.filePath = __dirname + "/" + options.filePath;
    this.chunks = [];
    this.chunksLength = 0;
    this.numberOfWrites = 0;
  }

  // this method run after created object
  _construct(callback: (error?: Error | null) => void) {
    fs.open(this.filePath, "w", (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: any | null) => void
  ): void {
    this.chunks.push(chunk);
    this.chunksLength += chunk.length;

    if (this.chunksLength > this.highWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
        if (error) {
          callback(error);
        }
      });

      ++this.numberOfWrites;
      this.chunks = [];
      this.chunksLength = 0;
    } else {
      callback();
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
      if (error) return callback(error);

      ++this.numberOfWrites;
      this.chunks = [];
      callback();
    });
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    console.log(this.numberOfWrites);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(error || err);
      });
    } else {
      callback(error);
    }
  }
}

const write = new CustomWritable({
  highWaterMark: 20,
  filePath: "test.txt",
});

write.write(Buffer.from("salom nima gap"));
write.end();
write.write(Buffer.from("salom nima gap"));
