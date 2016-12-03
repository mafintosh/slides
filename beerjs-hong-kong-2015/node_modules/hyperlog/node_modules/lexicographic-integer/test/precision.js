var lexi = require('../');
var test = require('tape');

test('range precision', function (t) {
    t.plan(2);
    var a = 1e55;
    var b = 1.0000000000001e55;
    var ha = lexi.pack(a, 'hex');
    var hb = lexi.pack(b, 'hex');
    console.log(ha, hb);
    t.notEqual(a, b);
    t.notEqual(ha, hb);
});
