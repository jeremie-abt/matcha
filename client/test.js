console.time('var');
for (var i = 0; i < 100000000; i++) {}
console.timeEnd('var'); // now much slower, around 300 ms
console.time('let');
let j // this declaration places j in the same scope as i, spreading the TDZ //performance problems
for (j = 0; j < 100000000; j++) {}
console.timeEnd('let'); // still 300+ ms
