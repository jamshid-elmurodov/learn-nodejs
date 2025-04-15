import fs from "fs/promises";

(async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/');
        const data = await response.json();
        console.log(data[1].title);
    } catch (error) {}
})();
