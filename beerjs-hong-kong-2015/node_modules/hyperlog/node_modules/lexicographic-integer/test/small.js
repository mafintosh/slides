var lexi = require('../');
var test = require('tape');

test('small numbers', function (t) {
    var prev = lexi.pack(0);
    for (var n = 1; n < 256*256*16; n ++) {
        var cur = lexi.pack(n, 'hex');
        if (cur <= prev) t.fail('cur <= prev');
        prev = cur;
    }
    t.end();
});
