exports.pack = pack;
exports.unpack = unpack;

function pack (n, enc) {
    n = Math.floor(n);
    if (n < 0 || n === Infinity) return undefined;
    
    var bytes;
    var max = 251;
    var x = n - max;
    
    if (n < max) {
        bytes = [ n ];
    }
    else if (x < 256) {
        bytes = [ max, x ];
    }
    else if (x < 256*256) {
        bytes = [ max + 1, Math.floor(x / 256), x % 256 ];
    }
    else if (x < 256*256*256) {
        bytes = [
            max + 2,
            Math.floor(x / 256 / 256),
            Math.floor(x / 256) % 256,
            x % 256
        ];
    }
    else if (x < 256*256*256*256) {
        bytes = [
            max + 3,
            Math.floor(x / 256 / 256 / 256),
            Math.floor(x / 256 / 256) % 256,
            Math.floor(x / 256) % 256,
            x % 256
        ];
    }
    else {
        var exp = Math.floor(Math.log(x) / Math.log(2)) - 32;
        bytes = [ 255 ];
        bytes.push.apply(bytes, pack(exp));
        var res = x / Math.pow(2, exp - 11);
        bytes.push.apply(bytes, bytesOf(x / Math.pow(2, exp - 11)));
    }
    if (enc === undefined || enc === 'array') return bytes;
    if (enc === 'hex') return encodeHex(bytes);
};

function unpack (xs) {
    if (typeof xs === 'string') xs = decodeHex(xs);
    if (!Array.isArray(xs)) return undefined;
    
    if (xs.length === 1 && xs[0] < 251) {
        return xs[0];
    }
    if (xs.length === 2 && xs[0] === 251) {
        return 251 + xs[1];
    }
    if (xs.length === 3 && xs[0] === 252) {
        return 251 + 256 * xs[1] + xs[2];
    }
    if (xs.length === 4 && xs[0] === 253) {
        return 251 + 256 * 256 * xs[1] + 256 * xs[2] + xs[3];
    }
    if (xs.length === 5 && xs[0] === 254) {
        return 251 + 256 * 256 * 256 * xs[1]
            + 256 * 256 * xs[2] + 256 * xs[3] + xs[4]
        ;
    }
    if (xs.length > 5 && xs[0] === 255) {
        var m = 0, x = 1;
        var pivot = Math.max(2, xs.length - 6);
        for (var i = xs.length - 1; i >= pivot; i--) {
            m += x * xs[i];
            x *= 256;
        }
        if (xs[1] + 32 < 251) {
            var n = unpack([ xs[1] + 32 ]) - 11;
        }
        else if (xs[0] === 255 && xs[1] < 251) {
            var n = xs[1] + 21;
        }
        else if (pivot === 3) {
            var n = unpack([ xs[1], xs[2] + 21 ]);
        }
        else if (pivot === 4) {
            var n = unpack([ xs[1], xs[2], xs[3] + 21 ]);
        }
        return 251 + m / Math.pow(2, 32 - n);
    }
    return undefined;
}

function encodeHex(bytes) {
    var s = '';
    for (var i = 0, l = bytes.length; i < l; i++) {
        var b = bytes[i];
        var c = b.toString(16);
        if (b < 16) c = '0' + c;
        s += c;
    }
    return s;
}

function decodeHex(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i = i+2) {
        bytes.push(parseInt(hex[i] + hex[i+1], 16));
    }
    return bytes;
}

function bytesOf (x) {
    x = Math.floor(x);
    var bytes = [];
    for (var i = 0, d = 1; i < 6; i++, d *= 256) {
        bytes.unshift(Math.floor(x / d) % 256);
    }
    return bytes;
}
