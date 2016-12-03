# lexicographic-integer

create lexicographic string keys for positive integers without zero-padding

At most, a number will take 10 bytes to store (2 more bytes than a regular
double) but all numbers less than 251 only take a single byte.

[![build status](https://secure.travis-ci.org/substack/lexicographic-integer.png)](http://travis-ci.org/substack/lexicographic-integer)

# example

## pack

``` js
var lexi = require('lexicographic-integer');
console.log(lexi.pack(12345));
```

output:

```
[ 252, 47, 62 ]
```

## unpack

To convert the arrays back into integers, just do `.unpack()`:

``` js
var lexi = require('lexicographic-integer');
console.log(lexi.unpack([ 252, 47, 62 ]));
```

output:

```
12345
```

## hex list

``` js
var lexi = require('lexicographic-integer');

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
```

output:

```
0 '00'
1 '01'
2 '02'
3 '03'
4 '04'
...
248 'f8'
249 'f9'
250 'fa'
251 'fb00'
252 'fb01'
253 'fb02'
254 'fb03'
255 'fb04'
256 'fb05'
...
5000 'fc128d'
5001 'fc128e'
5002 'fc128f'
5003 'fc1290'
5004 'fc1291'
...
21378213 'fe014633aa'
3.2350670572674536e+22 'ff2a0db3777bb94c'
4.895478805930646e+37 'ff5d09351659b187'
7.408103855367726e+52 'ff8f0c6004db1f28'
1.121034425997914e+68 'ffc20850f8bf332a'
1.696410051489608e+83 'fff40b2d6c283bb4'
2.5670996323179187e+98 'fffb2b0f05dd909879'
3.884674295852086e+113 'fffb5e0a187f7c58cd'
5.87849968691243e+128 'fffb900d91aaff96fe'
8.895664330450558e+143 'fffbc3091e5fb56b0c'
1.3461401394003201e+159 'fffbf50c417dbf1c6c'
2.03705221733893e+174 'fffc0128083c74d68fa0'
3.08257781987989e+189 'fffc015a0b11d96218aa'
4.6647238272706696e+204 'fffc018c0ee0ce4aceb6'
7.058912915150531e+219 'fffc01bf09ff97d9a0a7'
1.0681929603715358e+235 'fffc01f10d7031e40fc8'
1.6164474817904348e+250 'fffc02240907e1192454'
2.4460959380202488e+265 'fffc02560c2341f2013d'
3.701564947456103e+280 'fffc028908282389ba9c'
5.601408696719025e+295 'fffc02bb0af68aa1140f'
```

# methods

``` js
var lexi = require('lexicographic-integer')
```

## lexi.pack(n, encoding='array')

If `encoding` is `undefined` or `'array'`, return an array of byte values
between 0 and 255, inclusive for the integer `n`.

If `encoding` is `'hex'`, return a lexicographic hex string for the integer `n`.

## lexi.unpack(bytes)

Convert an array of `bytes` returned by `.pack()` back into the original
javascript number.

# install

With [npm](https://npmjs.org) do:

```
npm install lexicographic-integer
```

# license

MIT
