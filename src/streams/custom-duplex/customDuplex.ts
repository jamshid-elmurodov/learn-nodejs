import { Duplex } from "stream";
import fs from "fs";

class CustomDuplex extends Duplex {
  private writeHighWaterMark: number;
  private readHighWaterMark: number;
  private readFileName: string;
  private writeFileName: string;
  private writeChunks: Array<Buffer>;
  private writeChunksSize: number;
  private writeFD: number = 0;
  private readFD: number = 0;

  constructor(options: {
    writeHighWaterMark: number;
    readHighWaterMark: number;
    readFileName: string;
    writeFileName: string;
  }) {
    super({
      writableHighWaterMark: options.writeHighWaterMark,
      readableHighWaterMark: options.readHighWaterMark,
    });
    this.writeHighWaterMark = options.writeHighWaterMark;
    this.readHighWaterMark = options.readHighWaterMark;
    this.readFileName = options.readFileName;
    this.writeFileName = options.writeFileName;
    this.writeChunks = [];
    this.writeChunksSize = 0;
  }

  _construct(callback: (error?: Error | null) => void): void {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) {
        callback(err);
        return;
      }

      this.readFD = readFd;

      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) {
          callback(err);
          return;
        }
        this.writeFD = writeFd;

        callback();
      });
    });
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.writeChunks.push(chunk);
    this.writeChunksSize += chunk.length;

    if (this.writeChunksSize > this.writeHighWaterMark) {
        fs.write(this.writeFD, Buffer.concat(this.writeChunks), (error) => {
          this.writeChunks = [];
          this.writeChunksSize = 0;
      
          if (error) {
            callback(error);
          } else {
            callback();
          }
        });
      } else {
        callback(); 
      }      
  }

  _read(size: number): void {
    const buff = Buffer.alloc(size);
    fs.read(this.readFD, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }

      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    callback(error)
  }
}

const stream = new CustomDuplex({
  writeHighWaterMark: 10,
  readHighWaterMark: 10,
  readFileName: './src/streams/custom-duplex/text.txt',
  writeFileName: './src/streams/custom-duplex/test.txt',
});

stream.write(Buffer.from("some string"));
stream.write(Buffer.from("some string"));
stream.write(Buffer.from("some string"));
stream.write(Buffer.from("some string"));

stream.on('data', (chunk) => {
    console.log(`Readed chunk: ${chunk}`);
})