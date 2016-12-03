var lexi = require('../');

for (var n = 0; n < 5; n++) {
    console.log(n, lexi.pack(n, 'hex'));
}

console.log('...');

for (var n = 248; n < 257; n++) {
    console.log(n, lexi.pack(n, 'hex'));
}

console.log('...');

for (var n = 5000; n < 5005; n++) {
    console.log(n, lexi.pack(n, 'hex'));
}

console.log('...');

for (var n = 21378213; n < Number.MAX_VALUE; n *= 1513254198219212) {
    console.log(n, lexi.pack(n, 'hex'));
}
