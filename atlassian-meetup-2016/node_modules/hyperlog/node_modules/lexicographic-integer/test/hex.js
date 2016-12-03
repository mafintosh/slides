var lexi = require('../');
var test = require('tape');

test('hex encoding + decoding', function (t) {
    var num = 555;
    var encoded = lexi.pack(num, 'hex');
    var decoded = lexi.unpack(encoded);
    t.equal(num, decoded, 'decoded correctly');
    t.end();
});
