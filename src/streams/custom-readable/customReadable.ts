import { Readable } from "node:stream";
import fs from "fs";
import { Buffer } from "node:buffer";

class CustomReadable extends Readable {
  private highWatermark: number;
  private filePath: string;
  private fd: number;

  constructor(options: { highWatermark: number; filePath: string }) {
    super({ highWaterMark: options.highWatermark });
    this.highWatermark = options.highWatermark;
    this.filePath = options.filePath;
    this.fd = 0;
  }

  _construct(callback: (error?: Error | null) => void): void {
    fs.open(this.filePath, "r", (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _destroy(error: Error | null, callback: (error?: Error | null) => void) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(error || err);
      });
    } else {
      callback(error);
    }
  }

  _read(size: number): void {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }

      // null is indicator of ending stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }
}

const stream = new CustomReadable({ highWatermark: 10, filePath: __dirname + '/text.txt' });

stream.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'));
})