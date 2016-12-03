var lexi = require('../');
var test = require('tape');

test('range precision', function (t) {
    var prev = lexi.pack(0);
    var skip = 0.000000001e55;
    for (var i = 0, n = 1e55; i < 1000; n = 1e55 + skip * ++i) {
        var cur = lexi.pack(n, 'hex');
        if (cur <= prev) t.fail('cur <= prev');
        prev = cur;
    }
    t.end();
});
