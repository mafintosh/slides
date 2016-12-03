var lexi = require('../');
var test = require('tape');

test('big numbers', function (t) {
    t.plan(1);
    
    var prev = lexi.pack(0);
    var skip = 1;
    for (var n = 1; n < Number.MAX_VALUE; n += skip) {
        var cur = lexi.pack(n, 'hex');
        if (cur <= prev) break;
        prev = cur;
        console.log(n, cur);
        skip = 1 + Math.pow(245, Math.ceil(Math.log(n) / Math.log(256)));
    }
    t.equal(n, Infinity);
});
