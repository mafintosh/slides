var lexi = require('../');
var test = require('tape');

test('unpack', function (t) {
    var skip = 1;
    for (var n = 1; n < Number.MAX_VALUE; n += skip) {
        var cur = lexi.pack(n);
        compare(n, lexi.unpack(cur));
        skip = 1 + Math.pow(245, Math.ceil(Math.log(n) / Math.log(256)));
    }
    t.equal(n, Infinity);
    t.end();
    
    function compare (a, b) {
        var desc = a + ' !=~ ' + b
        if (/e\+\d+$/.test(a) || /e\+\d+$/.test(b)) {
            t.equal(String(a).slice(0,8), String(b).slice(0,8), desc);
            t.equal(/e\+(\d+)$/.exec(a)[1], /e\+(\d+)$/.exec(b)[1], desc);
        }
        else {
            t.equal(String(a).slice(0,8), String(b).slice(0,8), desc);
            t.equal(String(a).length, String(b).length, desc);
        }
    }
});
