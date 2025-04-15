import EventEmitter from "events";

class MyE extends EventEmitter {}

const myE = new MyE();

myE.on("start", (a: string) => {
    console.log("Start: " + a);
})

myE.addListener("process", () => console.log("Processing"))

myE.on("finish", () => console.log("Finished"))

// console.log(myE.eventNames())
// console.log(myE.removeAllListeners())

myE.emit("start", "Hello world");
myE.emit("process");
myE.emit("finish");