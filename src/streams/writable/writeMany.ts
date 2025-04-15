const fs = require('node:fs/promises');

(async () => {
    console.time('writeMany')

    const open = await fs.open('test.txt', 'w');

    for (let i = 0; i < 1_000_000; i++) {
        await open.write(`${i}\n`);
    }

    console.timeEnd('writeMany')
    await open.close();
})()

// console.log('File written successfully');
// time 10s



(async () => {
    const open = await fs.open('test.txt', 'w');

    // manda by default 16kb bo'lmadi 65 bo'ldi
    const writeStream = open.createWriteStream({
        highWaterMark: 15
    });

    console.log(writeStream.writableHighWaterMark)

    console.log(writeStream.writableLength)

    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))
    console.log(writeStream.write(Buffer.from("salom")))

    console.log(writeStream.writableLength)
})()



// drain event - bu streamdagi internal buffer to'lgandan keyin ishlaydi,
// bu event ishladimi demak stream to'lgan va bo'shatilgan
(async () => {
    const open = await fs.open("test.txt", 'w');

    const stream = open.createWriteStream(
        {
            highWaterMark: 10
        }
    );

    console.log(stream.write(Buffer.alloc(9, '1')));
    console.log(stream.write(Buffer.alloc(1, '1')));

    stream.on("drain", () => {
        console.log('drain');
    })
})()


// finish event - bu end metodi chaqirilgandan keyin ishga tushadigan event, bu ishlagandan so'ng
// streamga yozish to'xtatiladi
(async () => {
    const open = await fs.open('test.txt', 'w');

    const stream = open.createWriteStream();
    let i = 0;

    const writeMany = () => {
        while (i < 1_000_000) {
            if (i == 999_999) {
                stream.end(Buffer.from(` ${i} `, 'utf8'));
            } else if (!stream.write(` ${i} `, 'utf-8')){
                break;
            }
            i++;
        }
    }

    writeMany();

    stream.on('drain', () => {
        console.log('drained');
        writeMany();
    })

    stream.on('finish', () => {
        console.log('finished');
        open.close();
    });
})()