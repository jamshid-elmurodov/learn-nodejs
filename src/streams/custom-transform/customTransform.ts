import { Transform, TransformCallback } from "stream";
import fs from "fs";

class CustomTransform extends Transform {
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const buff = Buffer.from(chunk);

    const str: string = buff.toString("utf-8");

    callback(null, Buffer.from(str.toUpperCase()));
  }
}

const readStream = fs.createReadStream(__dirname + "/text.txt");
const writeStream = fs.createWriteStream(__dirname + "/test.txt");

const transformStream = new CustomTransform();

readStream.pipe(transformStream).pipe(writeStream);
