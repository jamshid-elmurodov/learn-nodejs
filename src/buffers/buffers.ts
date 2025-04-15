const { Buffer } = require("buffer");

// alloc
// const alloc = Buffer.alloc(3);
// alloc[0] = 0x123;
// alloc[1] = 0xfff;
// alloc[2] = 0xcfc;
//
// console.log(alloc);
// console.log(alloc.toString());

// from string
// const from = Buffer.from("hello world");
// console.log(from.toString());

// const from = Buffer.from([0x48, 0x69, 0x21]);
// console.log(from);
// console.log(from.toString())

// fill method
// const alloc = Buffer.alloc(1000);
// alloc.fill(50);
// console.log(alloc.toString())

// huge buffers
// const alloc = Buffer.alloc(0.5e5);
// console.log(alloc.length)
//
// for (let i = 0; i < alloc.length; i++) {
//     console.log(alloc[i]);
// }

// allocUnsafe
// console.log(Date.now())
// const alloc = Buffer.alloc(1_000_000);
// const allocUnsafe = Buffer.allocUnsafe(1_000_000);
// console.log(Date.now())

// const allocUnsafe = Buffer.allocUnsafe(1_000_000);
//
// for (let i = 0; i < 1_000_000; i++) {
//     if (allocUnsafe[i] !== 0) {
//         console.log(allocUnsafe[i]);
//     }
// }

// allocUnsafeSlow
// const buff = Buffer.allocUnsafeSlow(1_000_000);
