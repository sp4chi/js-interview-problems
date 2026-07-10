const buffer = Buffer.from('Hello');

console.log(buffer);

const p1 = Promise.resolve(4);
console.log(await p1);
p1.then(console.log);
