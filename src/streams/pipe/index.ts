import fs from 'node:fs/promises';
import {pipeline} from "stream";

// pipe method - bu readable streamni avtomatik writablega yo'naltiradi
(async () => {
    console.log('Started');
    console.time('time');

    const read = await fs.open('./test.txt', 'r');
    const write = await fs.open('text.txt', 'w');

    const readStream = read.createReadStream();
    const writeStream = write.createWriteStream();

    readStream.pipe(writeStream);

    readStream.on('end', () => {
        console.log("Read stream was end");
    })

    console.timeEnd('time');
})();


// unpipe - bu bog'langan streamlarni uzadi
// (async () => {
//     console.log('pipe started');
//
//     const read = await fs.open('test.txt', 'r');
//     const write = await fs.open('text.txt', 'w');
//
//     const readStream = read.createReadStream();
//     const writeStream = write.createWriteStream();
//
//     readStream.pipe(writeStream);
//
//     setTimeout(() => {
//         console.log('pipe finished');
//         readStream.unpipe(writeStream);
//     }, 10)
// })()


// pipeline method - bu pipe() ning yangi va yaxshiroq varianti, afzalliklar async/await, error handling
(async () => {
    const read = await fs.open('test.txt', 'r');
    const write = await fs.open('text.txt', 'w');

    const readStream = read.createReadStream();
    const writeStream = write.createWriteStream();

    pipeline(
        readStream,
        writeStream,
        (err) => {
            console.error(err);
        }
    )
})();