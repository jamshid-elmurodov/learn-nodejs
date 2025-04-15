import fs from "node:fs/promises";

// data - bu ma'lumotlarni kelganda ishlayda ya'ni highWaterMark nechaga teng bo'lsa data da ham undan katta bo'lmagan
// ma'lumot keladi.

(async () => {
    const fileHandleRead = await fs.open('test.txt', 'r');
    const fileHandleWrite = await fs.open('write.txt', 'w');

    const readStream = fileHandleRead.createReadStream();
    const writeStream = fileHandleWrite.createWriteStream();

    // 65kb
    console.log(readStream.readableHighWaterMark)

    // 65kb
    console.log(writeStream.writableHighWaterMark);

    readStream.on('data', (chunk: string) => {
        if (!writeStream.write(chunk)){
            console.log('read stream was paused');
            readStream.pause();
        }
    })

    writeStream.on('drain', () => {
        console.log('write stream drain...');
        readStream.resume();
        console.log('read stream resume...');
    })
})()

// splitting issue - bu ma'lumotlar bizga chunklarda keladi,
// aytaylik readable streamning hihgWaterMark = 10 byte endi biz o'sha 10 ta belgini har safar
// split qilyapmiz. lekin u boshqa raqamning yarmini olib kelgan bo'lishi mumkin
// misol uchun: 11111 11112 11113 11114 11115 11116
// 1 - chunk: 11111 1111
// 2 - chunk: 2 11113 11
// 3 - chunk: 114 11115
// 4 - chunk: 11116
// shu sabaddan muammo bo'lyapti