var $fxX3C$elliptic = require("elliptic");
var $fxX3C$hashjs = require("hash.js");
var $fxX3C$crypto = require("crypto");
var $fxX3C$bs58 = require("bs58");
var $fxX3C$assert = require("assert");
var $fxX3C$inherits = require("inherits");
var $fxX3C$aesjs = require("aes-js");
var $fxX3C$unorm = require("unorm");
var $fxX3C$bnjs = require("bn.js");


      var $parcel$global =
        typeof globalThis !== 'undefined'
          ? globalThis
          : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
          ? global
          : {};
  
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire76f9"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire76f9"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("e1FbD", function(module, exports) {
module.exports = JSON.parse('{"name":"@scrypt-inc/bsv","version":"1.0.1","description":"A pure and powerful JavaScript Bitcoin SV (BSV) library.","author":"sCrypt.Inc","source":"./index.js","main":"dist/main.js","module":"dist/module.js","browser":"dist/browser.js","types":"./index.d.ts","scripts":{"lint":"standard --fix","build":"parcel build --no-cache","dev":"mocha -g \'BIP32\' ","test":"standard && mocha","coverage":"nyc --reporter=text npm run test","prepublishOnly":"yarn build","release":"npm publish --access public"},"targets":{"types":false},"keywords":["bitcoin","bsv","scrypt","transaction","address","p2p","ecies","cryptocurrency","blockchain","payment","bip21","bip32","bip37","bip69","bip70","multisig"],"repository":{"type":"git","url":"https://github.com/sCrypt-Inc/bsv"},"dependencies":{"aes-js":"^3.1.2","assert":"^2.1.0","bn.js":"=4.11.9","bs58":"=4.0.1","buffer":"^6.0.3","clone-deep":"^4.0.1","elliptic":"6.5.4","hash.js":"^1.1.7","inherits":"2.0.3","unorm":"1.4.1"},"devDependencies":{"brfs":"2.0.1","chai":"4.2.0","mocha":"^8.4.0","nyc":"^14.1.1","parcel":"latest","sinon":"7.2.3","standard":"12.0.1"},"license":"MIT","standard":{"globals":["afterEach","beforeEach","describe","it"],"ignore":["dist/**"]}}');

});

parcelRegister("lM2TS", function(module, exports) {
"use strict";

var $fHjyd = parcelRequire("fHjyd");

var $e34gf = parcelRequire("e34gf");

var $iUxHD = parcelRequire("iUxHD");
var $fda0549de5595c4b$var$reversebuf = function(buf) {
    var buf2 = Buffer.alloc(buf.length);
    for(var i = 0; i < buf.length; i++)buf2[i] = buf[buf.length - 1 - i];
    return buf2;
};
$fHjyd.Zero = new $fHjyd(0);
$fHjyd.One = new $fHjyd(1);
$fHjyd.Minus1 = new $fHjyd(-1);
/**
 * Convert a number into a big number.
 *
 * @param {number} n Any positive or negative integer.
 */ $fHjyd.fromNumber = function(n) {
    $e34gf.checkArgument($iUxHD.isNumber(n));
    return new $fHjyd(n);
};
/**
 * Convert a string number into a big number.
 *
 * @param {string} str Any positive or negative integer formatted as a string.
 * @param {number} base The base of the number, defaults to 10.
 */ $fHjyd.fromString = function(str, base) {
    $e34gf.checkArgument($iUxHD.isString(str));
    return new $fHjyd(str, base);
};
/**
 * Convert a buffer (such as a 256 bit binary private key) into a big number.
 * Sometimes these numbers can be formatted either as 'big endian' or 'little
 * endian', and so there is an opts parameter that lets you specify which
 * endianness is specified.
 *
 * @param {Buffer} buf A buffer number, such as a 256 bit hash or key.
 * @param {Object} opts With a property 'endian' that can be either 'big' or 'little'. Defaults big endian (most significant digit first).
 */ $fHjyd.fromBuffer = function(buf, opts) {
    if (typeof opts !== "undefined" && opts.endian === "little") buf = $fda0549de5595c4b$var$reversebuf(buf);
    var hex = buf.toString("hex");
    var bn = new $fHjyd(hex, 16);
    return bn;
};
/**
 * Instantiate a BigNumber from a "signed magnitude buffer". (a buffer where the
 * most significant bit represents the sign (0 = positive, 1 = negative)
 *
 * @param {Buffer} buf A buffer number, such as a 256 bit hash or key.
 * @param {Object} opts With a property 'endian' that can be either 'big' or 'little'. Defaults big endian (most significant digit first).
 */ $fHjyd.fromSM = function(buf, opts) {
    var ret;
    if (buf.length === 0) return $fHjyd.fromBuffer(Buffer.from([
        0
    ]));
    var endian = "big";
    if (opts) endian = opts.endian;
    if (endian === "little") buf = $fda0549de5595c4b$var$reversebuf(buf);
    if (buf[0] & 0x80) {
        buf[0] = buf[0] & 0x7f;
        ret = $fHjyd.fromBuffer(buf);
        ret.neg().copy(ret);
    } else ret = $fHjyd.fromBuffer(buf);
    return ret;
};
/**
 * Convert a big number into a number.
 */ $fHjyd.prototype.toNumber = function() {
    return parseInt(this.toString(10), 10);
};
/**
 * Convert a big number into a buffer. This is somewhat ambiguous, so there is
 * an opts parameter that let's you specify the endianness or the size.
 * opts.endian can be either 'big' or 'little' and opts.size can be any
 * sufficiently large number of bytes. If you always want to create a 32 byte
 * big endian number, then specify opts = { endian: 'big', size: 32 }
 *
 * @param {Object} opts Defaults to { endian: 'big', size: 32 }
 */ $fHjyd.prototype.toBuffer = function(opts) {
    var buf, hex;
    if (opts && opts.size) {
        hex = this.toString(16, 2);
        var natlen = hex.length / 2;
        buf = Buffer.from(hex, "hex");
        if (natlen === opts.size) ;
        else if (natlen > opts.size) buf = $fHjyd.trim(buf, natlen);
        else if (natlen < opts.size) buf = $fHjyd.pad(buf, natlen, opts.size);
    } else {
        hex = this.toString(16, 2);
        buf = Buffer.from(hex, "hex");
    }
    if (typeof opts !== "undefined" && opts.endian === "little") buf = $fda0549de5595c4b$var$reversebuf(buf);
    return buf;
};
/**
 * For big numbers that are either positive or negative, you can convert to
 * "sign magnitude" format whereby the first bit specifies whether the number is
 * positive or negative.
 */ $fHjyd.prototype.toSMBigEndian = function() {
    var buf;
    if (this.cmp($fHjyd.Zero) === -1) {
        buf = this.neg().toBuffer();
        if (buf[0] & 0x80) buf = Buffer.concat([
            Buffer.from([
                0x80
            ]),
            buf
        ]);
        else buf[0] = buf[0] | 0x80;
    } else {
        buf = this.toBuffer();
        if (buf[0] & 0x80) buf = Buffer.concat([
            Buffer.from([
                0x00
            ]),
            buf
        ]);
    }
    if (buf.length === 1 & buf[0] === 0) buf = Buffer.from([]);
    return buf;
};
/**
 * For big numbers that are either positive or negative, you can convert to
 * "sign magnitude" format whereby the first bit specifies whether the number is
 * positive or negative.
 *
 * @param {Object} opts Defaults to { endian: 'big' }
 */ $fHjyd.prototype.toSM = function(opts) {
    var endian = opts ? opts.endian : "big";
    var buf = this.toSMBigEndian();
    if (endian === "little") buf = $fda0549de5595c4b$var$reversebuf(buf);
    return buf;
};
/**
 * Create a BN from a "ScriptNum": This is analogous to the constructor for
 * CScriptNum in bitcoind. Many ops in bitcoind's script interpreter use
 * CScriptNum, which is not really a proper bignum. Instead, an error is thrown
 * if trying to input a number bigger than 4 bytes. We copy that behavior here.
 * A third argument, `size`, is provided to extend the hard limit of 4 bytes, as
 * some usages require more than 4 bytes.
 *
 * @param {Buffer} buf A buffer of a number.
 * @param {boolean} fRequireMinimal Whether to require minimal size encoding.
 * @param {number} size The maximum size.
 */ $fHjyd.fromScriptNumBuffer = function(buf, fRequireMinimal, size) {
    var nMaxNumSize = size || Number.MAX_SAFE_INTEGER;
    $e34gf.checkArgument(buf.length <= nMaxNumSize, new Error("script number overflow"));
    if (fRequireMinimal && buf.length > 0) // Check that the number is encoded with the minimum possible
    // number of bytes.
    //
    // If the most-significant-byte - excluding the sign bit - is zero
    // then we're not minimal. Note how this test also rejects the
    // negative-zero encoding, 0x80.
    {
        if ((buf[buf.length - 1] & 0x7f) === 0) {
            // One exception: if there's more than one byte and the most
            // significant bit of the second-most-significant-byte is set
            // it would conflict with the sign bit. An example of this case
            // is +-255, which encode to 0xff00 and 0xff80 respectively.
            // (big-endian).
            if (buf.length <= 1 || (buf[buf.length - 2] & 0x80) === 0) throw new Error("non-minimally encoded script number");
        }
    }
    return $fHjyd.fromSM(buf, {
        endian: "little"
    });
};
/**
 * The corollary to the above, with the notable exception that we do not throw
 * an error if the output is larger than four bytes. (Which can happen if
 * performing a numerical operation that results in an overflow to more than 4
 * bytes).
 */ $fHjyd.prototype.toScriptNumBuffer = function() {
    return this.toSM({
        endian: "little"
    });
};
/**
 * Trims a buffer if it starts with zeros.
 *
 * @param {Buffer} buf A buffer formatted number.
 * @param {number} natlen The natural length of the number.
 */ $fHjyd.trim = function(buf, natlen) {
    return buf.slice(natlen - buf.length, buf.length);
};
/**
 * Adds extra zeros to the start of a number.
 *
 * @param {Buffer} buf A buffer formatted number.
 * @param {number} natlen The natural length of the number.
 * @param {number} size How big to pad the number in bytes.
 */ $fHjyd.pad = function(buf, natlen, size) {
    var rbuf = Buffer.alloc(size);
    for(var i = 0; i < buf.length; i++)rbuf[rbuf.length - 1 - i] = buf[buf.length - 1 - i];
    for(i = 0; i < size - natlen; i++)rbuf[i] = 0;
    return rbuf;
};
/**
 * Convert a big number into a hex string. This is somewhat ambiguous, so there
 * is an opts parameter that let's you specify the endianness or the size.
 * opts.endian can be either 'big' or 'little' and opts.size can be any
 * sufficiently large number of bytes. If you always want to create a 32 byte
 * big endian number, then specify opts = { endian: 'big', size: 32 }
 *
 * @param {Object} opts Defaults to { endian: 'big', size: 32 }
 */ $fHjyd.prototype.toHex = function(...args) {
    return this.toBuffer(...args).toString("hex");
};
/**
 * Convert a hex string (such as a 256 bit binary private key) into a big
 * number. Sometimes these numbers can be formatted either as 'big endian' or
 * 'little endian', and so there is an opts parameter that lets you specify
 * which endianness is specified.
 *
 * @param {Buffer} buf A buffer number, such as a 256 bit hash or key.
 * @param {Object} opts With a property 'endian' that can be either 'big' or 'little'. Defaults big endian (most significant digit first).
 */ $fHjyd.fromHex = function(hex, ...args) {
    return $fHjyd.fromBuffer(Buffer.from(hex, "hex"), ...args);
};
module.exports = $fHjyd;

});
parcelRegister("fHjyd", function(module, exports) {
(function(module1, exports) {
    "use strict";
    // Utils
    function assert(val, msg) {
        if (!val) throw new Error(msg || "Assertion failed");
    }
    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
    }
    // BN
    function BN(number, base, endian) {
        if (BN.isBN(number)) return number;
        this.negative = 0;
        this.words = null;
        this.length = 0;
        // Reduction context
        this.red = null;
        if (number !== null) {
            if (base === "le" || base === "be") {
                endian = base;
                base = 10;
            }
            this._init(number || 0, base || 10, endian || "be");
        }
    }
    if (typeof module1 === "object") module1.exports = BN;
    else exports.BN = BN;
    BN.BN = BN;
    BN.wordSize = 26;
    BN.isBN = function isBN(num) {
        if (num instanceof BN) return true;
        return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };
    BN.max = function max(left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
    };
    BN.min = function min(left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
    };
    BN.prototype._init = function init(number, base, endian) {
        if (typeof number === "number") return this._initNumber(number, base, endian);
        if (typeof number === "object") return this._initArray(number, base, endian);
        if (base === "hex") base = 16;
        assert(base === (base | 0) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start = 0;
        if (number[0] === "-") start++;
        if (base === 16) this._parseHex(number, start);
        else this._parseBase(number, base, start);
        if (number[0] === "-") this.negative = 1;
        this.strip();
        if (endian !== "le") return;
        this._initArray(this.toArray(), base, endian);
    };
    BN.prototype._initNumber = function _initNumber(number, base, endian) {
        if (number < 0) {
            this.negative = 1;
            number = -number;
        }
        if (number < 0x4000000) {
            this.words = [
                number & 0x3ffffff
            ];
            this.length = 1;
        } else if (number < 0x10000000000000) {
            this.words = [
                number & 0x3ffffff,
                number / 0x4000000 & 0x3ffffff
            ];
            this.length = 2;
        } else {
            assert(number < 0x20000000000000) // 2 ^ 53 (unsafe)
            ;
            this.words = [
                number & 0x3ffffff,
                number / 0x4000000 & 0x3ffffff,
                1
            ];
            this.length = 3;
        }
        if (endian !== "le") return;
        // Reverse the bytes
        this._initArray(this.toArray(), base, endian);
    };
    BN.prototype._initArray = function _initArray(number, base, endian) {
        // Perhaps a Uint8Array
        assert(typeof number.length === "number");
        if (number.length <= 0) {
            this.words = [
                0
            ];
            this.length = 1;
            return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for(var i = 0; i < this.length; i++)this.words[i] = 0;
        var j, w;
        var off = 0;
        if (endian === "be") for(i = number.length - 1, j = 0; i >= 0; i -= 3){
            w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
            off += 24;
            if (off >= 26) {
                off -= 26;
                j++;
            }
        }
        else if (endian === "le") for(i = 0, j = 0; i < number.length; i += 3){
            w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
            off += 24;
            if (off >= 26) {
                off -= 26;
                j++;
            }
        }
        return this.strip();
    };
    function parseHex(str, start, end) {
        var r = 0;
        var len = Math.min(str.length, end);
        for(var i = start; i < len; i++){
            var c = str.charCodeAt(i) - 48;
            r <<= 4;
            // 'a' - 'f'
            if (c >= 49 && c <= 54) r |= c - 49 + 0xa;
            else if (c >= 17 && c <= 22) r |= c - 17 + 0xa;
            else r |= c & 0xf;
        }
        return r;
    }
    BN.prototype._parseHex = function _parseHex(number, start) {
        // Create possibly bigger array to ensure that it fits the number
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for(var i = 0; i < this.length; i++)this.words[i] = 0;
        var j, w;
        // Scan 24-bit chunks and add them to the number
        var off = 0;
        for(i = number.length - 6, j = 0; i >= start; i -= 6){
            w = parseHex(number, i, i + 6);
            this.words[j] |= w << off & 0x3ffffff;
            // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
            this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
            off += 24;
            if (off >= 26) {
                off -= 26;
                j++;
            }
        }
        if (i + 6 !== start) {
            w = parseHex(number, start, i + 6);
            this.words[j] |= w << off & 0x3ffffff;
            this.words[j + 1] |= w >>> 26 - off & 0x3fffff;
        }
        this.strip();
    };
    function parseBase(str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);
        for(var i = start; i < len; i++){
            var c = str.charCodeAt(i) - 48;
            r *= mul;
            // 'a'
            if (c >= 49) r += c - 49 + 0xa;
            else if (c >= 17) r += c - 17 + 0xa;
            else r += c;
        }
        return r;
    }
    BN.prototype._parseBase = function _parseBase(number, base, start) {
        // Initialize as zero
        this.words = [
            0
        ];
        this.length = 1;
        // Find length of limb in base
        for(var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base)limbLen++;
        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for(var i = start; i < end; i += limbLen){
            word = parseBase(number, i, i + limbLen, base);
            this.imuln(limbPow);
            if (this.words[0] + word < 0x4000000) this.words[0] += word;
            else this._iaddn(word);
        }
        if (mod !== 0) {
            var pow = 1;
            word = parseBase(number, i, number.length, base);
            for(i = 0; i < mod; i++)pow *= base;
            this.imuln(pow);
            if (this.words[0] + word < 0x4000000) this.words[0] += word;
            else this._iaddn(word);
        }
    };
    BN.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);
        for(var i = 0; i < this.length; i++)dest.words[i] = this.words[i];
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
    };
    BN.prototype.clone = function clone() {
        var r = new BN(null);
        this.copy(r);
        return r;
    };
    BN.prototype._expand = function _expand(size) {
        while(this.length < size)this.words[this.length++] = 0;
        return this;
    };
    // Remove leading `0` from `this`
    BN.prototype.strip = function strip() {
        while(this.length > 1 && this.words[this.length - 1] === 0)this.length--;
        return this._normSign();
    };
    BN.prototype._normSign = function _normSign() {
        // -0 = 0
        if (this.length === 1 && this.words[0] === 0) this.negative = 0;
        return this;
    };
    BN.prototype.inspect = function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    /*

    var zeros = [];
    var groupSizes = [];
    var groupBases = [];

    var s = '';
    var i = -1;
    while (++i < BN.wordSize) {
      zeros[i] = s;
      s += '0';
    }
    groupSizes[0] = 0;
    groupSizes[1] = 0;
    groupBases[0] = 0;
    groupBases[1] = 0;
    var base = 2 - 1;
    while (++base < 36 + 1) {
      var groupSize = 0;
      var groupBase = 1;
      while (groupBase < (1 << BN.wordSize) / base) {
        groupBase *= base;
        groupSize += 1;
      }
      groupSizes[base] = groupSize;
      groupBases[base] = groupBase;
    }

    */ var zeros = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
    ];
    var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
    ];
    var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        10000000,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64000000,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        24300000,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
    ];
    BN.prototype.toString = function toString(base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;
        var out;
        if (base === 16 || base === "hex") {
            out = "";
            var off = 0;
            var carry = 0;
            for(var i = 0; i < this.length; i++){
                var w = this.words[i];
                var word = ((w << off | carry) & 0xffffff).toString(16);
                carry = w >>> 24 - off & 0xffffff;
                off += 2;
                if (off >= 26) {
                    off -= 26;
                    i--;
                }
                if (carry !== 0 || i !== this.length - 1) out = zeros[6 - word.length] + word + out;
                else out = word + out;
            }
            if (carry !== 0) out = carry.toString(16) + out;
            while(out.length % padding !== 0)out = "0" + out;
            if (this.negative !== 0) out = "-" + out;
            return out;
        }
        if (base === (base | 0) && base >= 2 && base <= 36) {
            // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
            var groupSize = groupSizes[base];
            // var groupBase = Math.pow(base, groupSize);
            var groupBase = groupBases[base];
            out = "";
            var c = this.clone();
            c.negative = 0;
            while(!c.isZero()){
                var r = c.modn(groupBase).toString(base);
                c = c.idivn(groupBase);
                if (!c.isZero()) out = zeros[groupSize - r.length] + r + out;
                else out = r + out;
            }
            if (this.isZero()) out = "0" + out;
            while(out.length % padding !== 0)out = "0" + out;
            if (this.negative !== 0) out = "-" + out;
            return out;
        }
        assert(false, "Base should be between 2 and 36");
    };
    BN.prototype.toNumber = function toNumber() {
        var ret = this.words[0];
        if (this.length === 2) ret += this.words[1] * 0x4000000;
        else if (this.length === 3 && this.words[2] === 0x01) // NOTE: at this stage it is known that the top bit is set
        ret += 0x10000000000000 + this.words[1] * 0x4000000;
        else if (this.length > 2) assert(false, "Number can only safely store up to 53 bits");
        return this.negative !== 0 ? -ret : ret;
    };
    BN.prototype.toJSON = function toJSON() {
        return this.toString(16);
    };
    BN.prototype.toBuffer = function toBuffer(endian, length) {
        assert(typeof Buffer !== "undefined");
        return this.toArrayLike(Buffer, endian, length);
    };
    BN.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
    };
    BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, "byte array longer than desired length");
        assert(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = endian === "le";
        var res = new ArrayType(reqLength);
        var b, i;
        var q = this.clone();
        if (!littleEndian) {
            // Assume big-endian
            for(i = 0; i < reqLength - byteLength; i++)res[i] = 0;
            for(i = 0; !q.isZero(); i++){
                b = q.andln(0xff);
                q.iushrn(8);
                res[reqLength - i - 1] = b;
            }
        } else {
            for(i = 0; !q.isZero(); i++){
                b = q.andln(0xff);
                q.iushrn(8);
                res[i] = b;
            }
            for(; i < reqLength; i++)res[i] = 0;
        }
        return res;
    };
    if (Math.clz32) BN.prototype._countBits = function _countBits(w) {
        return 32 - Math.clz32(w);
    };
    else BN.prototype._countBits = function _countBits(w) {
        var t = w;
        var r = 0;
        if (t >= 0x1000) {
            r += 13;
            t >>>= 13;
        }
        if (t >= 0x40) {
            r += 7;
            t >>>= 7;
        }
        if (t >= 0x8) {
            r += 4;
            t >>>= 4;
        }
        if (t >= 0x02) {
            r += 2;
            t >>>= 2;
        }
        return r + t;
    };
    BN.prototype._zeroBits = function _zeroBits(w) {
        // Short-cut
        if (w === 0) return 26;
        var t = w;
        var r = 0;
        if ((t & 0x1fff) === 0) {
            r += 13;
            t >>>= 13;
        }
        if ((t & 0x7f) === 0) {
            r += 7;
            t >>>= 7;
        }
        if ((t & 0xf) === 0) {
            r += 4;
            t >>>= 4;
        }
        if ((t & 0x3) === 0) {
            r += 2;
            t >>>= 2;
        }
        if ((t & 0x1) === 0) r++;
        return r;
    };
    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
    };
    function toBitArray(num) {
        var w = new Array(num.bitLength());
        for(var bit = 0; bit < w.length; bit++){
            var off = bit / 26 | 0;
            var wbit = bit % 26;
            w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w;
    }
    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits() {
        if (this.isZero()) return 0;
        var r = 0;
        for(var i = 0; i < this.length; i++){
            var b = this._zeroBits(this.words[i]);
            r += b;
            if (b !== 26) break;
        }
        return r;
    };
    BN.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
    };
    BN.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) return this.abs().inotn(width).iaddn(1);
        return this.clone();
    };
    BN.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) return this.notn(width).iaddn(1).ineg();
        return this.clone();
    };
    BN.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
    };
    // Return negative clone of `this`
    BN.prototype.neg = function neg() {
        return this.clone().ineg();
    };
    BN.prototype.ineg = function ineg() {
        if (!this.isZero()) this.negative ^= 1;
        return this;
    };
    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor(num) {
        while(this.length < num.length)this.words[this.length++] = 0;
        for(var i = 0; i < num.length; i++)this.words[i] = this.words[i] | num.words[i];
        return this.strip();
    };
    BN.prototype.ior = function ior(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
    };
    // Or `num` with `this`
    BN.prototype.or = function or(num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
    };
    BN.prototype.uor = function uor(num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
    };
    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand(num) {
        // b = min-length(num, this)
        var b;
        if (this.length > num.length) b = num;
        else b = this;
        for(var i = 0; i < b.length; i++)this.words[i] = this.words[i] & num.words[i];
        this.length = b.length;
        return this.strip();
    };
    BN.prototype.iand = function iand(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
    };
    // And `num` with `this`
    BN.prototype.and = function and(num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
    };
    BN.prototype.uand = function uand(num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
    };
    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor(num) {
        // a.length > b.length
        var a;
        var b;
        if (this.length > num.length) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        for(var i = 0; i < b.length; i++)this.words[i] = a.words[i] ^ b.words[i];
        if (this !== a) for(; i < a.length; i++)this.words[i] = a.words[i];
        this.length = a.length;
        return this.strip();
    };
    BN.prototype.ixor = function ixor(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
    };
    // Xor `num` with `this`
    BN.prototype.xor = function xor(num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
    };
    BN.prototype.uxor = function uxor(num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
    };
    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn(width) {
        assert(typeof width === "number" && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        // Extend the buffer with leading zeroes
        this._expand(bytesNeeded);
        if (bitsLeft > 0) bytesNeeded--;
        // Handle complete words
        for(var i = 0; i < bytesNeeded; i++)this.words[i] = ~this.words[i] & 0x3ffffff;
        // Handle the residue
        if (bitsLeft > 0) this.words[i] = ~this.words[i] & 0x3ffffff >> 26 - bitsLeft;
        // And remove leading zeroes
        return this.strip();
    };
    BN.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
    };
    // Set `bit` of `this`
    BN.prototype.setn = function setn(bit, val) {
        assert(typeof bit === "number" && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) this.words[off] = this.words[off] | 1 << wbit;
        else this.words[off] = this.words[off] & ~(1 << wbit);
        return this.strip();
    };
    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd(num) {
        var r;
        // negative + positive
        if (this.negative !== 0 && num.negative === 0) {
            this.negative = 0;
            r = this.isub(num);
            this.negative ^= 1;
            return this._normSign();
        // positive + negative
        } else if (this.negative === 0 && num.negative !== 0) {
            num.negative = 0;
            r = this.isub(num);
            num.negative = 1;
            return r._normSign();
        }
        // a.length > b.length
        var a, b;
        if (this.length > num.length) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        var carry = 0;
        for(var i = 0; i < b.length; i++){
            r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
        }
        for(; carry !== 0 && i < a.length; i++){
            r = (a.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
        }
        this.length = a.length;
        if (carry !== 0) {
            this.words[this.length] = carry;
            this.length++;
        // Copy the rest of the words
        } else if (a !== this) for(; i < a.length; i++)this.words[i] = a.words[i];
        return this;
    };
    // Add `num` to `this`
    BN.prototype.add = function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
            num.negative = 0;
            res = this.sub(num);
            num.negative ^= 1;
            return res;
        } else if (num.negative === 0 && this.negative !== 0) {
            this.negative = 0;
            res = num.sub(this);
            this.negative = 1;
            return res;
        }
        if (this.length > num.length) return this.clone().iadd(num);
        return num.clone().iadd(this);
    };
    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub(num) {
        // this - (-num) = this + num
        if (num.negative !== 0) {
            num.negative = 0;
            var r = this.iadd(num);
            num.negative = 1;
            return r._normSign();
        // -this - num = -(this + num)
        } else if (this.negative !== 0) {
            this.negative = 0;
            this.iadd(num);
            this.negative = 1;
            return this._normSign();
        }
        // At this point both numbers are positive
        var cmp = this.cmp(num);
        // Optimization - zeroify
        if (cmp === 0) {
            this.negative = 0;
            this.length = 1;
            this.words[0] = 0;
            return this;
        }
        // a > b
        var a, b;
        if (cmp > 0) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        var carry = 0;
        for(var i = 0; i < b.length; i++){
            r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
        }
        for(; carry !== 0 && i < a.length; i++){
            r = (a.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
        }
        // Copy rest of the words
        if (carry === 0 && i < a.length && a !== this) for(; i < a.length; i++)this.words[i] = a.words[i];
        this.length = Math.max(this.length, i);
        if (a !== this) this.negative = 1;
        return this.strip();
    };
    // Subtract `num` from `this`
    BN.prototype.sub = function sub(num) {
        return this.clone().isub(num);
    };
    function smallMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = self.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        // Peel one iteration (compiler can't do it, because of code complexity)
        var a = self.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;
        var lo = r & 0x3ffffff;
        var carry = r / 0x4000000 | 0;
        out.words[0] = lo;
        for(var k = 1; k < len; k++){
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = carry >>> 26;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for(var j = Math.max(0, k - self.length + 1); j <= maxJ; j++){
                var i = k - j | 0;
                a = self.words[i] | 0;
                b = num.words[j] | 0;
                r = a * b + rword;
                ncarry += r / 0x4000000 | 0;
                rword = r & 0x3ffffff;
            }
            out.words[k] = rword | 0;
            carry = ncarry | 0;
        }
        if (carry !== 0) out.words[k] = carry | 0;
        else out.length--;
        return out.strip();
    }
    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo(self, num, out) {
        var a = self.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 0x1fff;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 0x1fff;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 0x1fff;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 0x1fff;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 0x1fff;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 0x1fff;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 0x1fff;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 0x1fff;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 0x1fff;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 0x1fff;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 0x1fff;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 0x1fff;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 0x1fff;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 0x1fff;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 0x1fff;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 0x1fff;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 0x1fff;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 0x1fff;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 0x1fff;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 0x1fff;
        var bh9 = b9 >>> 13;
        out.negative = self.negative ^ num.negative;
        out.length = 19;
        /* k = 0 */ lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 0x3ffffff;
        /* k = 1 */ lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 0x3ffffff;
        /* k = 2 */ lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 0x3ffffff;
        /* k = 3 */ lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 0x3ffffff;
        /* k = 4 */ lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 0x3ffffff;
        /* k = 5 */ lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 0x3ffffff;
        /* k = 6 */ lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 0x3ffffff;
        /* k = 7 */ lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 0x3ffffff;
        /* k = 8 */ lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 0x3ffffff;
        /* k = 9 */ lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 0x3ffffff;
        /* k = 10 */ lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 0x3ffffff;
        /* k = 11 */ lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 0x3ffffff;
        /* k = 12 */ lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 0x3ffffff;
        /* k = 13 */ lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 0x3ffffff;
        /* k = 14 */ lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 0x3ffffff;
        /* k = 15 */ lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 0x3ffffff;
        /* k = 16 */ lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 0x3ffffff;
        /* k = 17 */ lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 0x3ffffff;
        /* k = 18 */ lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 0x3ffffff;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
            o[19] = c;
            out.length++;
        }
        return out;
    };
    // Polyfill comb
    if (!Math.imul) comb10MulTo = smallMulTo;
    function bigMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for(var k = 0; k < out.length - 1; k++){
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = hncarry;
            hncarry = 0;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for(var j = Math.max(0, k - self.length + 1); j <= maxJ; j++){
                var i = k - j;
                var a = self.words[i] | 0;
                var b = num.words[j] | 0;
                var r = a * b;
                var lo = r & 0x3ffffff;
                ncarry = ncarry + (r / 0x4000000 | 0) | 0;
                lo = lo + rword | 0;
                rword = lo & 0x3ffffff;
                ncarry = ncarry + (lo >>> 26) | 0;
                hncarry += ncarry >>> 26;
                ncarry &= 0x3ffffff;
            }
            out.words[k] = rword;
            carry = ncarry;
            ncarry = hncarry;
        }
        if (carry !== 0) out.words[k] = carry;
        else out.length--;
        return out.strip();
    }
    function jumboMulTo(self, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self, num, out);
    }
    BN.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) res = comb10MulTo(this, num, out);
        else if (len < 63) res = smallMulTo(this, num, out);
        else if (len < 1024) res = bigMulTo(this, num, out);
        else res = jumboMulTo(this, num, out);
        return res;
    };
    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion
    function FFTM(x, y) {
        this.x = x;
        this.y = y;
    }
    FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;
        for(var i = 0; i < N; i++)t[i] = this.revBin(i, l, N);
        return t;
    };
    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1) return x;
        var rb = 0;
        for(var i = 0; i < l; i++){
            rb |= (x & 1) << l - i - 1;
            x >>= 1;
        }
        return rb;
    };
    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for(var i = 0; i < N; i++){
            rtws[i] = rws[rbt[i]];
            itws[i] = iws[rbt[i]];
        }
    };
    FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for(var s = 1; s < N; s <<= 1){
            var l = s << 1;
            var rtwdf = Math.cos(2 * Math.PI / l);
            var itwdf = Math.sin(2 * Math.PI / l);
            for(var p = 0; p < N; p += l){
                var rtwdf_ = rtwdf;
                var itwdf_ = itwdf;
                for(var j = 0; j < s; j++){
                    var re = rtws[p + j];
                    var ie = itws[p + j];
                    var ro = rtws[p + j + s];
                    var io = itws[p + j + s];
                    var rx = rtwdf_ * ro - itwdf_ * io;
                    io = rtwdf_ * io + itwdf_ * ro;
                    ro = rx;
                    rtws[p + j] = re + ro;
                    itws[p + j] = ie + io;
                    rtws[p + j + s] = re - ro;
                    itws[p + j + s] = ie - io;
                    /* jshint maxdepth : false */ if (j !== l) {
                        rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                        itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                        rtwdf_ = rx;
                    }
                }
            }
        }
    };
    FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;
        for(N = N / 2 | 0; N; N = N >>> 1)i++;
        return 1 << i + 1 + odd;
    };
    FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1) return;
        for(var i = 0; i < N / 2; i++){
            var t = rws[i];
            rws[i] = rws[N - i - 1];
            rws[N - i - 1] = t;
            t = iws[i];
            iws[i] = -iws[N - i - 1];
            iws[N - i - 1] = -t;
        }
    };
    FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for(var i = 0; i < N / 2; i++){
            var w = Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;
            ws[i] = w & 0x3ffffff;
            if (w < 0x4000000) carry = 0;
            else carry = w / 0x4000000 | 0;
        }
        return ws;
    };
    FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;
        for(var i = 0; i < len; i++){
            carry = carry + (ws[i] | 0);
            rws[2 * i] = carry & 0x1fff;
            carry = carry >>> 13;
            rws[2 * i + 1] = carry & 0x1fff;
            carry = carry >>> 13;
        }
        // Pad with zeroes
        for(i = 2 * len; i < N; ++i)rws[i] = 0;
        assert(carry === 0);
        assert((carry & -8192) === 0);
    };
    FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for(var i = 0; i < N; i++)ph[i] = 0;
        return ph;
    };
    FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for(var i = 0; i < N; i++){
            var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
            iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
            rwst[i] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
    };
    // Multiply `this` by `num`
    BN.prototype.mul = function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
    };
    // Multiply employing FFT
    BN.prototype.mulf = function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
    };
    // In-place Multiplication
    BN.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
    };
    BN.prototype.imuln = function imuln(num) {
        assert(typeof num === "number");
        assert(num < 0x4000000);
        // Carry
        var carry = 0;
        for(var i = 0; i < this.length; i++){
            var w = (this.words[i] | 0) * num;
            var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
            carry >>= 26;
            carry += w / 0x4000000 | 0;
            // NOTE: lo is 27bit maximum
            carry += lo >>> 26;
            this.words[i] = lo & 0x3ffffff;
        }
        if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
        }
        return this;
    };
    BN.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
    };
    // `this` * `this`
    BN.prototype.sqr = function sqr() {
        return this.mul(this);
    };
    // `this` * `this` in-place
    BN.prototype.isqr = function isqr() {
        return this.imul(this.clone());
    };
    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0) return new BN(1);
        // Skip leading zeroes
        var res = this;
        for(var i = 0; i < w.length; i++, res = res.sqr()){
            if (w[i] !== 0) break;
        }
        if (++i < w.length) for(var q = res.sqr(); i < w.length; i++, q = q.sqr()){
            if (w[i] === 0) continue;
            res = res.mul(q);
        }
        return res;
    };
    // Shift-left in-place
    BN.prototype.iushln = function iushln(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 0x3ffffff >>> 26 - r << 26 - r;
        var i;
        if (r !== 0) {
            var carry = 0;
            for(i = 0; i < this.length; i++){
                var newCarry = this.words[i] & carryMask;
                var c = (this.words[i] | 0) - newCarry << r;
                this.words[i] = c | carry;
                carry = newCarry >>> 26 - r;
            }
            if (carry) {
                this.words[i] = carry;
                this.length++;
            }
        }
        if (s !== 0) {
            for(i = this.length - 1; i >= 0; i--)this.words[i + s] = this.words[i];
            for(i = 0; i < s; i++)this.words[i] = 0;
            this.length += s;
        }
        return this.strip();
    };
    BN.prototype.ishln = function ishln(bits) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushln(bits);
    };
    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert(typeof bits === "number" && bits >= 0);
        var h;
        if (hint) h = (hint - hint % 26) / 26;
        else h = 0;
        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h);
        // Extended mode, copy masked part
        if (maskedWords) {
            for(var i = 0; i < s; i++)maskedWords.words[i] = this.words[i];
            maskedWords.length = s;
        }
        if (s === 0) ;
        else if (this.length > s) {
            this.length -= s;
            for(i = 0; i < this.length; i++)this.words[i] = this.words[i + s];
        } else {
            this.words[0] = 0;
            this.length = 1;
        }
        var carry = 0;
        for(i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--){
            var word = this.words[i] | 0;
            this.words[i] = carry << 26 - r | word >>> r;
            carry = word & mask;
        }
        // Push carried bits as a mask
        if (maskedWords && carry !== 0) maskedWords.words[maskedWords.length++] = carry;
        if (this.length === 0) {
            this.words[0] = 0;
            this.length = 1;
        }
        return this.strip();
    };
    BN.prototype.ishrn = function ishrn(bits, hint, extended) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
    };
    // Shift-left
    BN.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
    };
    BN.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
    };
    // Shift-right
    BN.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
    };
    BN.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
    };
    // Test if n bit is set
    BN.prototype.testn = function testn(bit) {
        assert(typeof bit === "number" && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        // Fast case: bit is much higher than all existing words
        if (this.length <= s) return false;
        // Check bit and return
        var w = this.words[s];
        return !!(w & q);
    };
    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn(bits) {
        assert(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert(this.negative === 0, "imaskn works only with positive numbers");
        if (this.length <= s) return this;
        if (r !== 0) s++;
        this.length = Math.min(s, this.length);
        if (r !== 0) {
            var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
            this.words[this.length - 1] &= mask;
        }
        return this.strip();
    };
    // Return only lowers bits of number
    BN.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
    };
    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn(num) {
        assert(typeof num === "number");
        assert(num < 0x4000000);
        if (num < 0) return this.isubn(-num);
        // Possible sign change
        if (this.negative !== 0) {
            if (this.length === 1 && (this.words[0] | 0) < num) {
                this.words[0] = num - (this.words[0] | 0);
                this.negative = 0;
                return this;
            }
            this.negative = 0;
            this.isubn(num);
            this.negative = 1;
            return this;
        }
        // Add without checks
        return this._iaddn(num);
    };
    BN.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        // Carry
        for(var i = 0; i < this.length && this.words[i] >= 0x4000000; i++){
            this.words[i] -= 0x4000000;
            if (i === this.length - 1) this.words[i + 1] = 1;
            else this.words[i + 1]++;
        }
        this.length = Math.max(this.length, i + 1);
        return this;
    };
    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn(num) {
        assert(typeof num === "number");
        assert(num < 0x4000000);
        if (num < 0) return this.iaddn(-num);
        if (this.negative !== 0) {
            this.negative = 0;
            this.iaddn(num);
            this.negative = 1;
            return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
            this.words[0] = -this.words[0];
            this.negative = 1;
        } else // Carry
        for(var i = 0; i < this.length && this.words[i] < 0; i++){
            this.words[i] += 0x4000000;
            this.words[i + 1] -= 1;
        }
        return this.strip();
    };
    BN.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
    };
    BN.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
    };
    BN.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
    };
    BN.prototype.abs = function abs() {
        return this.clone().iabs();
    };
    BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;
        this._expand(len);
        var w;
        var carry = 0;
        for(i = 0; i < num.length; i++){
            w = (this.words[i + shift] | 0) + carry;
            var right = (num.words[i] | 0) * mul;
            w -= right & 0x3ffffff;
            carry = (w >> 26) - (right / 0x4000000 | 0);
            this.words[i + shift] = w & 0x3ffffff;
        }
        for(; i < this.length - shift; i++){
            w = (this.words[i + shift] | 0) + carry;
            carry = w >> 26;
            this.words[i + shift] = w & 0x3ffffff;
        }
        if (carry === 0) return this.strip();
        // Subtraction overflow
        assert(carry === -1);
        carry = 0;
        for(i = 0; i < this.length; i++){
            w = -(this.words[i] | 0) + carry;
            carry = w >> 26;
            this.words[i] = w & 0x3ffffff;
        }
        this.negative = 1;
        return this.strip();
    };
    BN.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        // Normalize
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
            b = b.ushln(shift);
            a.iushln(shift);
            bhi = b.words[b.length - 1] | 0;
        }
        // Initialize quotient
        var m = a.length - b.length;
        var q;
        if (mode !== "mod") {
            q = new BN(null);
            q.length = m + 1;
            q.words = new Array(q.length);
            for(var i = 0; i < q.length; i++)q.words[i] = 0;
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
            a = diff;
            if (q) q.words[m] = 1;
        }
        for(var j = m - 1; j >= 0; j--){
            var qj = (a.words[b.length + j] | 0) * 0x4000000 + (a.words[b.length + j - 1] | 0);
            // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
            // (0x7ffffff)
            qj = Math.min(qj / bhi | 0, 0x3ffffff);
            a._ishlnsubmul(b, qj, j);
            while(a.negative !== 0){
                qj--;
                a.negative = 0;
                a._ishlnsubmul(b, 1, j);
                if (!a.isZero()) a.negative ^= 1;
            }
            if (q) q.words[j] = qj;
        }
        if (q) q.strip();
        a.strip();
        // Denormalize
        if (mode !== "div" && shift !== 0) a.iushrn(shift);
        return {
            div: q || null,
            mod: a
        };
    };
    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod(num, mode, positive) {
        assert(!num.isZero());
        if (this.isZero()) return {
            div: new BN(0),
            mod: new BN(0)
        };
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
            res = this.neg().divmod(num, mode);
            if (mode !== "mod") div = res.div.neg();
            if (mode !== "div") {
                mod = res.mod.neg();
                if (positive && mod.negative !== 0) mod.iadd(num);
            }
            return {
                div: div,
                mod: mod
            };
        }
        if (this.negative === 0 && num.negative !== 0) {
            res = this.divmod(num.neg(), mode);
            if (mode !== "mod") div = res.div.neg();
            return {
                div: div,
                mod: res.mod
            };
        }
        if ((this.negative & num.negative) !== 0) {
            res = this.neg().divmod(num.neg(), mode);
            if (mode !== "div") {
                mod = res.mod.neg();
                if (positive && mod.negative !== 0) mod.isub(num);
            }
            return {
                div: res.div,
                mod: mod
            };
        }
        // Both numbers are positive at this point
        // Strip both numbers to approximate shift value
        if (num.length > this.length || this.cmp(num) < 0) return {
            div: new BN(0),
            mod: this
        };
        // Very short reduction
        if (num.length === 1) {
            if (mode === "div") return {
                div: this.divn(num.words[0]),
                mod: null
            };
            if (mode === "mod") return {
                div: null,
                mod: new BN(this.modn(num.words[0]))
            };
            return {
                div: this.divn(num.words[0]),
                mod: new BN(this.modn(num.words[0]))
            };
        }
        return this._wordDiv(num, mode);
    };
    // Find `this` / `num`
    BN.prototype.div = function div(num) {
        return this.divmod(num, "div", false).div;
    };
    // Find `this` % `num`
    BN.prototype.mod = function mod(num) {
        return this.divmod(num, "mod", false).mod;
    };
    BN.prototype.umod = function umod(num) {
        return this.divmod(num, "mod", true).mod;
    };
    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        // Fast case - exact division
        if (dm.mod.isZero()) return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        // Round down
        if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
        // Round up
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };
    BN.prototype.modn = function modn(num) {
        assert(num <= 0x3ffffff);
        var p = 67108864 % num;
        var acc = 0;
        for(var i = this.length - 1; i >= 0; i--)acc = (p * acc + (this.words[i] | 0)) % num;
        return acc;
    };
    // In-place division by number
    BN.prototype.idivn = function idivn(num) {
        assert(num <= 0x3ffffff);
        var carry = 0;
        for(var i = this.length - 1; i >= 0; i--){
            var w = (this.words[i] | 0) + carry * 0x4000000;
            this.words[i] = w / num | 0;
            carry = w % num;
        }
        return this.strip();
    };
    BN.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
    };
    BN.prototype.egcd = function egcd(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var x = this;
        var y = p.clone();
        if (x.negative !== 0) x = x.umod(p);
        else x = x.clone();
        // A * x + B * y = x
        var A = new BN(1);
        var B = new BN(0);
        // C * x + D * y = y
        var C = new BN(0);
        var D = new BN(1);
        var g = 0;
        while(x.isEven() && y.isEven()){
            x.iushrn(1);
            y.iushrn(1);
            ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while(!x.isZero()){
            for(var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
            if (i > 0) {
                x.iushrn(i);
                while(i-- > 0){
                    if (A.isOdd() || B.isOdd()) {
                        A.iadd(yp);
                        B.isub(xp);
                    }
                    A.iushrn(1);
                    B.iushrn(1);
                }
            }
            for(var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
            if (j > 0) {
                y.iushrn(j);
                while(j-- > 0){
                    if (C.isOdd() || D.isOdd()) {
                        C.iadd(yp);
                        D.isub(xp);
                    }
                    C.iushrn(1);
                    D.iushrn(1);
                }
            }
            if (x.cmp(y) >= 0) {
                x.isub(y);
                A.isub(C);
                B.isub(D);
            } else {
                y.isub(x);
                C.isub(A);
                D.isub(B);
            }
        }
        return {
            a: C,
            b: D,
            gcd: y.iushln(g)
        };
    };
    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var a = this;
        var b = p.clone();
        if (a.negative !== 0) a = a.umod(p);
        else a = a.clone();
        var x1 = new BN(1);
        var x2 = new BN(0);
        var delta = b.clone();
        while(a.cmpn(1) > 0 && b.cmpn(1) > 0){
            for(var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
            if (i > 0) {
                a.iushrn(i);
                while(i-- > 0){
                    if (x1.isOdd()) x1.iadd(delta);
                    x1.iushrn(1);
                }
            }
            for(var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
            if (j > 0) {
                b.iushrn(j);
                while(j-- > 0){
                    if (x2.isOdd()) x2.iadd(delta);
                    x2.iushrn(1);
                }
            }
            if (a.cmp(b) >= 0) {
                a.isub(b);
                x1.isub(x2);
            } else {
                b.isub(a);
                x2.isub(x1);
            }
        }
        var res;
        if (a.cmpn(1) === 0) res = x1;
        else res = x2;
        if (res.cmpn(0) < 0) res.iadd(p);
        return res;
    };
    BN.prototype.gcd = function gcd(num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        // Remove common factor of two
        for(var shift = 0; a.isEven() && b.isEven(); shift++){
            a.iushrn(1);
            b.iushrn(1);
        }
        do {
            while(a.isEven())a.iushrn(1);
            while(b.isEven())b.iushrn(1);
            var r = a.cmp(b);
            if (r < 0) {
                // Swap `a` and `b` to make `a` always bigger than `b`
                var t = a;
                a = b;
                b = t;
            } else if (r === 0 || b.cmpn(1) === 0) break;
            a.isub(b);
        }while (true);
        return b.iushln(shift);
    };
    // Invert number in the field F(num)
    BN.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
    };
    BN.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
    };
    BN.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
    };
    // And first word and num
    BN.prototype.andln = function andln(num) {
        return this.words[0] & num;
    };
    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn(bit) {
        assert(typeof bit === "number");
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        // Fast case: bit is much higher than all existing words
        if (this.length <= s) {
            this._expand(s + 1);
            this.words[s] |= q;
            return this;
        }
        // Add bit and propagate, if needed
        var carry = q;
        for(var i = s; carry !== 0 && i < this.length; i++){
            var w = this.words[i] | 0;
            w += carry;
            carry = w >>> 26;
            w &= 0x3ffffff;
            this.words[i] = w;
        }
        if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
        }
        return this;
    };
    BN.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
    };
    BN.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative) return -1;
        if (this.negative === 0 && negative) return 1;
        this.strip();
        var res;
        if (this.length > 1) res = 1;
        else {
            if (negative) num = -num;
            assert(num <= 0x3ffffff, "Number is too big");
            var w = this.words[0] | 0;
            res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0) return -res | 0;
        return res;
    };
    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0) return -1;
        if (this.negative === 0 && num.negative !== 0) return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0) return -res | 0;
        return res;
    };
    // Unsigned comparison
    BN.prototype.ucmp = function ucmp(num) {
        // At this point both numbers have the same sign
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;
        var res = 0;
        for(var i = this.length - 1; i >= 0; i--){
            var a = this.words[i] | 0;
            var b = num.words[i] | 0;
            if (a === b) continue;
            if (a < b) res = -1;
            else if (a > b) res = 1;
            break;
        }
        return res;
    };
    BN.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
    };
    BN.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
    };
    BN.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
    };
    BN.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
    };
    BN.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
    };
    BN.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
    };
    BN.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
    };
    BN.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
    };
    BN.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
    };
    BN.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
    };
    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red(num) {
        return new Red(num);
    };
    BN.prototype.toRed = function toRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        assert(this.negative === 0, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
    };
    BN.prototype.fromRed = function fromRed() {
        assert(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
    };
    BN.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
    };
    BN.prototype.forceRed = function forceRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
    };
    BN.prototype.redAdd = function redAdd(num) {
        assert(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
    };
    BN.prototype.redIAdd = function redIAdd(num) {
        assert(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
    };
    BN.prototype.redSub = function redSub(num) {
        assert(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
    };
    BN.prototype.redISub = function redISub(num) {
        assert(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
    };
    BN.prototype.redShl = function redShl(num) {
        assert(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
    };
    BN.prototype.redMul = function redMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
    };
    BN.prototype.redIMul = function redIMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
    };
    BN.prototype.redSqr = function redSqr() {
        assert(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
    };
    BN.prototype.redISqr = function redISqr() {
        assert(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
    };
    // Square root over p
    BN.prototype.redSqrt = function redSqrt() {
        assert(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
    };
    BN.prototype.redInvm = function redInvm() {
        assert(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
    };
    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg() {
        assert(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
    };
    BN.prototype.redPow = function redPow(num) {
        assert(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
    };
    // Prime numbers with efficient reduction
    var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
    };
    // Pseudo-Mersenne prime
    function MPrime(name, p) {
        // P = 2 ^ N - K
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
    }
    MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
    };
    MPrime.prototype.ireduce = function ireduce(num) {
        // Assumes that `num` is less than `P^2`
        // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
        var r = num;
        var rlen;
        do {
            this.split(r, this.tmp);
            r = this.imulK(r);
            r = r.iadd(this.tmp);
            rlen = r.bitLength();
        }while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (cmp === 0) {
            r.words[0] = 0;
            r.length = 1;
        } else if (cmp > 0) r.isub(this.p);
        else if (r.strip !== undefined) // r is BN v4 instance
        r.strip();
        else // r is BN v5 instance
        r._strip();
        return r;
    };
    MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
    };
    MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
    };
    function K256() {
        MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    inherits(K256, MPrime);
    K256.prototype.split = function split(input, output) {
        // 256 = 9 * 26 + 22
        var mask = 0x3fffff;
        var outLen = Math.min(input.length, 9);
        for(var i = 0; i < outLen; i++)output.words[i] = input.words[i];
        output.length = outLen;
        if (input.length <= 9) {
            input.words[0] = 0;
            input.length = 1;
            return;
        }
        // Shift by 9 limbs
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for(i = 10; i < input.length; i++){
            var next = input.words[i] | 0;
            input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
            prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        if (prev === 0 && input.length > 10) input.length -= 10;
        else input.length -= 9;
    };
    K256.prototype.imulK = function imulK(num) {
        // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
        var lo = 0;
        for(var i = 0; i < num.length; i++){
            var w = num.words[i] | 0;
            lo += w * 0x3d1;
            num.words[i] = lo & 0x3ffffff;
            lo = w * 0x40 + (lo / 0x4000000 | 0);
        }
        // Fast length reduction
        if (num.words[num.length - 1] === 0) {
            num.length--;
            if (num.words[num.length - 1] === 0) num.length--;
        }
        return num;
    };
    function P224() {
        MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    inherits(P224, MPrime);
    function P192() {
        MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    inherits(P192, MPrime);
    function P25519() {
        // 2 ^ 255 - 19
        MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    inherits(P25519, MPrime);
    P25519.prototype.imulK = function imulK(num) {
        // K = 0x13
        var carry = 0;
        for(var i = 0; i < num.length; i++){
            var hi = (num.words[i] | 0) * 0x13 + carry;
            var lo = hi & 0x3ffffff;
            hi >>>= 26;
            num.words[i] = lo;
            carry = hi;
        }
        if (carry !== 0) num.words[num.length++] = carry;
        return num;
    };
    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime(name) {
        // Cached version of prime
        if (primes[name]) return primes[name];
        var prime;
        if (name === "k256") prime = new K256();
        else if (name === "p224") prime = new P224();
        else if (name === "p192") prime = new P192();
        else if (name === "p25519") prime = new P25519();
        else throw new Error("Unknown prime " + name);
        primes[name] = prime;
        return prime;
    };
    //
    // Base reduction engine
    //
    function Red(m) {
        if (typeof m === "string") {
            var prime = BN._prime(m);
            this.m = prime.p;
            this.prime = prime;
        } else {
            assert(m.gtn(1), "modulus must be greater than 1");
            this.m = m;
            this.prime = null;
        }
    }
    Red.prototype._verify1 = function _verify1(a) {
        assert(a.negative === 0, "red works only with positives");
        assert(a.red, "red works only with red numbers");
    };
    Red.prototype._verify2 = function _verify2(a, b) {
        assert((a.negative | b.negative) === 0, "red works only with positives");
        assert(a.red && a.red === b.red, "red works only with red numbers");
    };
    Red.prototype.imod = function imod(a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
    };
    Red.prototype.neg = function neg(a) {
        if (a.isZero()) return a.clone();
        return this.m.sub(a)._forceRed(this);
    };
    Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        if (res.cmp(this.m) >= 0) res.isub(this.m);
        return res._forceRed(this);
    };
    Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) res.isub(this.m);
        return res;
    };
    Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        if (res.cmpn(0) < 0) res.iadd(this.m);
        return res._forceRed(this);
    };
    Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        if (res.cmpn(0) < 0) res.iadd(this.m);
        return res;
    };
    Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
    };
    Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
    };
    Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
    };
    Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
    };
    Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
    };
    Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero()) return a.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);
        // Fast case
        if (mod3 === 3) {
            var pow = this.m.add(new BN(1)).iushrn(2);
            return this.pow(a, pow);
        }
        // Tonelli-Shanks algorithm (Totally unoptimized and slow)
        //
        // Find Q and S, that Q * 2 ^ S = (P - 1)
        var q = this.m.subn(1);
        var s = 0;
        while(!q.isZero() && q.andln(1) === 0){
            s++;
            q.iushrn(1);
        }
        assert(!q.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();
        // Find quadratic non-residue
        // NOTE: Max is such because of generalized Riemann hypothesis.
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);
        while(this.pow(z, lpow).cmp(nOne) !== 0)z.redIAdd(nOne);
        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while(t.cmp(one) !== 0){
            var tmp = t;
            for(var i = 0; tmp.cmp(one) !== 0; i++)tmp = tmp.redSqr();
            assert(i < m);
            var b = this.pow(c, new BN(1).iushln(m - i - 1));
            r = r.redMul(b);
            c = b.redSqr();
            t = t.redMul(c);
            m = i;
        }
        return r;
    };
    Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
            inv.negative = 0;
            return this.imod(inv).redNeg();
        } else return this.imod(inv);
    };
    Red.prototype.pow = function pow(a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (num.cmpn(1) === 0) return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;
        for(var i = 2; i < wnd.length; i++)wnd[i] = this.mul(wnd[i - 1], a);
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) start = 26;
        for(i = num.length - 1; i >= 0; i--){
            var word = num.words[i];
            for(var j = start - 1; j >= 0; j--){
                var bit = word >> j & 1;
                if (res !== wnd[0]) res = this.sqr(res);
                if (bit === 0 && current === 0) {
                    currentLen = 0;
                    continue;
                }
                current <<= 1;
                current |= bit;
                currentLen++;
                if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
                res = this.mul(res, wnd[current]);
                currentLen = 0;
                current = 0;
            }
            start = 26;
        }
        return res;
    };
    Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
    };
    Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
    };
    //
    // Montgomery method engine
    //
    BN.mont = function mont(num) {
        return new Mont(num);
    };
    function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) this.shift += 26 - this.shift % 26;
        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);
    Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
    };
    Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
    };
    Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
            a.words[0] = 0;
            a.length = 1;
            return a;
        }
        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) res = u.isub(this.m);
        else if (u.cmpn(0) < 0) res = u.iadd(this.m);
        return res._forceRed(this);
    };
    Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) res = u.isub(this.m);
        else if (u.cmpn(0) < 0) res = u.iadd(this.m);
        return res._forceRed(this);
    };
    Mont.prototype.invm = function invm(a) {
        // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
    };
})(module, this);

});

parcelRegister("e34gf", function(module, exports) {
"use strict";

var $lOQ1c = parcelRequire("lOQ1c");

var $iUxHD = parcelRequire("iUxHD");
module.exports = {
    checkState: function(condition, message) {
        if (!condition) throw new $lOQ1c.InvalidState(message);
    },
    checkArgument: function(condition, argumentName, message, docsPath) {
        if (!condition) throw new $lOQ1c.InvalidArgument(argumentName, message, docsPath);
    },
    checkArgumentType: function(argument, type, argumentName) {
        argumentName = argumentName || "(unknown name)";
        if ($iUxHD.isString(type)) {
            if (type === "Buffer") {
                if (!Buffer.isBuffer(argument)) throw new $lOQ1c.InvalidArgumentType(argument, type, argumentName);
            } else if (typeof argument !== type) throw new $lOQ1c.InvalidArgumentType(argument, type, argumentName);
        } else {
            if (!(argument instanceof type)) throw new $lOQ1c.InvalidArgumentType(argument, type.name, argumentName);
        }
    }
};

});
parcelRegister("lOQ1c", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");
function $fe269e41b241ce67$var$format(message, args) {
    return message.replace("{0}", args[0]).replace("{1}", args[1]).replace("{2}", args[2]);
}
var $fe269e41b241ce67$var$traverseNode = function(parent, errorDefinition) {
    var NodeError = function() {
        if ($iUxHD.isString(errorDefinition.message)) this.message = $fe269e41b241ce67$var$format(errorDefinition.message, arguments);
        else if ($iUxHD.isFunction(errorDefinition.message)) this.message = errorDefinition.message.apply(null, arguments);
        else throw new Error("Invalid error definition for " + errorDefinition.name);
        this.stack = this.message + "\n" + new Error().stack;
    };
    NodeError.prototype = Object.create(parent.prototype);
    NodeError.prototype.name = parent.prototype.name + errorDefinition.name;
    parent[errorDefinition.name] = NodeError;
    if (errorDefinition.errors) $fe269e41b241ce67$var$childDefinitions(NodeError, errorDefinition.errors);
    return NodeError;
};
var $fe269e41b241ce67$var$childDefinitions = function(parent, childDefinitions) {
    $iUxHD.each(childDefinitions, function(childDefinition) {
        $fe269e41b241ce67$var$traverseNode(parent, childDefinition);
    });
};
var $fe269e41b241ce67$var$traverseRoot = function(parent, errorsDefinition) {
    $fe269e41b241ce67$var$childDefinitions(parent, errorsDefinition);
    return parent;
};
var $fe269e41b241ce67$var$bsv = {};
$fe269e41b241ce67$var$bsv.Error = function() {
    this.message = "Internal error";
    this.stack = this.message + "\n" + new Error().stack;
};
$fe269e41b241ce67$var$bsv.Error.prototype = Object.create(Error.prototype);
$fe269e41b241ce67$var$bsv.Error.prototype.name = "bsv.Error";

var $jXsep = parcelRequire("jXsep");
$fe269e41b241ce67$var$traverseRoot($fe269e41b241ce67$var$bsv.Error, $jXsep);
module.exports = $fe269e41b241ce67$var$bsv.Error;
module.exports.extend = function(spec) {
    return $fe269e41b241ce67$var$traverseNode($fe269e41b241ce67$var$bsv.Error, spec);
};

});
parcelRegister("iUxHD", function(module, exports) {
"use strict";
var $dc47999b7c15ab58$var$_ = {};
$dc47999b7c15ab58$var$_.isArray = (t)=>Array.isArray(t);
$dc47999b7c15ab58$var$_.isNumber = (t)=>typeof t === "number";
$dc47999b7c15ab58$var$_.isObject = (t)=>t && typeof t === "object";
$dc47999b7c15ab58$var$_.isString = (t)=>typeof t === "string";
$dc47999b7c15ab58$var$_.isUndefined = (t)=>typeof t === "undefined";
$dc47999b7c15ab58$var$_.isFunction = (t)=>typeof t === "function";
$dc47999b7c15ab58$var$_.isNull = (t)=>t === null;
$dc47999b7c15ab58$var$_.isDate = (t)=>t instanceof Date;
$dc47999b7c15ab58$var$_.extend = (a, b)=>Object.assign(a, b);
$dc47999b7c15ab58$var$_.noop = ()=>{};
$dc47999b7c15ab58$var$_.every = (a, f)=>a.every(f || ((t)=>t));
$dc47999b7c15ab58$var$_.map = (a, f)=>Array.from(a).map(f || ((t)=>t));
$dc47999b7c15ab58$var$_.includes = (a, e)=>a.includes(e);
$dc47999b7c15ab58$var$_.each = (a, f)=>a.forEach(f);
$dc47999b7c15ab58$var$_.clone = (o)=>Object.assign({}, o);
$dc47999b7c15ab58$var$_.pick = (object, keys)=>{
    const obj = {};
    keys.forEach((key)=>{
        if (typeof object[key] !== "undefined") obj[key] = object[key];
    });
    return obj;
};
$dc47999b7c15ab58$var$_.values = (o)=>Object.values(o);
$dc47999b7c15ab58$var$_.filter = (a, f)=>a.filter(f);
$dc47999b7c15ab58$var$_.reduce = (a, f, s)=>a.reduce(f, s);
$dc47999b7c15ab58$var$_.without = (a, n)=>a.filter((t)=>t !== n);
$dc47999b7c15ab58$var$_.shuffle = (a)=>{
    const result = a.slice(0);
    for(let i = result.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [
            result[j],
            result[i]
        ];
    }
    return result;
};
$dc47999b7c15ab58$var$_.difference = (a, b)=>a.filter((t)=>!b.includes(t));
$dc47999b7c15ab58$var$_.findIndex = (a, f)=>a.findIndex(f);
$dc47999b7c15ab58$var$_.some = (a, f)=>a.some(f);
$dc47999b7c15ab58$var$_.range = (n)=>[
        ...Array(n).keys()
    ];
$dc47999b7c15ab58$var$_.isPositiveNumber = (n)=>n < 0x7e;
module.exports = $dc47999b7c15ab58$var$_;

});

parcelRegister("jXsep", function(module, exports) {
"use strict";
var $e8796d2de9914f82$var$docsURL = "https://docs.moneybutton.com/";
module.exports = [
    {
        name: "InvalidB58Char",
        message: "Invalid Base58 character: {0} in {1}"
    },
    {
        name: "InvalidB58Checksum",
        message: "Invalid Base58 checksum for {0}"
    },
    {
        name: "InvalidNetwork",
        message: "Invalid version for network: got {0}"
    },
    {
        name: "InvalidState",
        message: "Invalid state: {0}"
    },
    {
        name: "NotImplemented",
        message: "Function {0} was not implemented yet"
    },
    {
        name: "InvalidNetworkArgument",
        message: 'Invalid network: must be "livenet" or "testnet", got {0}'
    },
    {
        name: "InvalidArgument",
        message: function() {
            return "Invalid Argument" + (arguments[0] ? ": " + arguments[0] : "") + (arguments[1] ? " Documentation: " + $e8796d2de9914f82$var$docsURL + arguments[1] : "");
        }
    },
    {
        name: "AbstractMethodInvoked",
        message: "Abstract Method Invocation: {0}"
    },
    {
        name: "InvalidArgumentType",
        message: function() {
            return "Invalid Argument for " + arguments[2] + ", expected " + arguments[1] + " but got " + typeof arguments[0];
        }
    },
    {
        name: "Unit",
        message: "Internal Error on Unit {0}",
        errors: [
            {
                "name": "UnknownCode",
                "message": "Unrecognized unit code: {0}"
            },
            {
                "name": "InvalidRate",
                "message": "Invalid exchange rate: {0}"
            }
        ]
    },
    {
        name: "MerkleBlock",
        message: "Internal Error on MerkleBlock {0}",
        errors: [
            {
                "name": "InvalidMerkleTree",
                "message": "This MerkleBlock contain an invalid Merkle Tree"
            }
        ]
    },
    {
        name: "Transaction",
        message: "Internal Error on Transaction {0}",
        errors: [
            {
                name: "Input",
                message: "Internal Error on Input {0}",
                errors: [
                    {
                        name: "MissingScript",
                        message: "Need a script to create an input"
                    },
                    {
                        name: "UnsupportedScript",
                        message: "Unsupported input script type: {0}"
                    },
                    {
                        name: "MissingPreviousOutput",
                        message: "No previous output information."
                    },
                    {
                        name: "MissingInput",
                        message: "Invalid inputIndex."
                    }
                ]
            },
            {
                name: "NeedMoreInfo",
                message: "{0}"
            },
            {
                name: "InvalidSorting",
                message: "The sorting function provided did not return the change output as one of the array elements"
            },
            {
                name: "InvalidOutputAmountSum",
                message: "{0}"
            },
            {
                name: "MissingSignatures",
                message: "Some inputs have not been fully signed"
            },
            {
                name: "InvalidIndex",
                message: "Invalid index: {0} is not between 0, {1}"
            },
            {
                name: "UnableToVerifySignature",
                message: "Unable to verify signature: {0}"
            },
            {
                name: "DustOutputs",
                message: "Dust amount detected in one output"
            },
            {
                name: "MissingOutput",
                message: "Output not found"
            },
            {
                name: "InvalidSatoshis",
                message: "Output satoshis are invalid"
            },
            {
                name: "FeeError",
                message: "Internal Error on Fee {0}",
                errors: [
                    {
                        name: "TooSmall",
                        message: "Fee is too small: {0}"
                    },
                    {
                        name: "TooLarge",
                        message: "Fee is too large: {0}"
                    },
                    {
                        name: "Different",
                        message: "Unspent value is different from specified fee: {0}"
                    }
                ]
            },
            {
                name: "ChangeAddressMissing",
                message: "Change address is missing"
            },
            {
                name: "BlockHeightTooHigh",
                message: "Block Height can be at most 2^32 -1"
            },
            {
                name: "NLockTimeOutOfRange",
                message: "Block Height can only be between 0 and 499 999 999"
            },
            {
                name: "LockTimeTooEarly",
                message: "Lock Time can't be earlier than UNIX date 500 000 000"
            },
            {
                name: "TransactionAlreadySealed",
                message: "Cannot update sealed transaction"
            }
        ]
    },
    {
        name: "Script",
        message: "Internal Error on Script {0}",
        errors: [
            {
                name: "UnrecognizedAddress",
                message: "Expected argument {0} to be an address"
            },
            {
                name: "CantDeriveAddress",
                message: "Can't derive address associated with script {0}, needs to be p2pkh in, p2pkh out, p2sh in, or p2sh out."
            },
            {
                name: "InvalidBuffer",
                message: "Invalid script buffer: can't parse valid script from given buffer {0}"
            },
            {
                name: "InvalidOpcode",
                message: 'Invalid Opcode: got "{0}"'
            }
        ]
    },
    {
        name: "HDPrivateKey",
        message: "Internal Error on HDPrivateKey {0}",
        errors: [
            {
                name: "InvalidDerivationArgument",
                message: "Invalid derivation argument {0}, expected string, or number and boolean"
            },
            {
                name: "InvalidEntropyArgument",
                message: "Invalid entropy: must be an hexa string or binary buffer, got {0}",
                errors: [
                    {
                        name: "TooMuchEntropy",
                        message: 'Invalid entropy: more than 512 bits is non standard, got "{0}"'
                    },
                    {
                        name: "NotEnoughEntropy",
                        message: 'Invalid entropy: at least 128 bits needed, got "{0}"'
                    }
                ]
            },
            {
                name: "InvalidLength",
                message: "Invalid length for xprivkey string in {0}"
            },
            {
                name: "InvalidPath",
                message: "Invalid derivation path: {0}"
            },
            {
                name: "UnrecognizedArgument",
                message: 'Invalid argument: creating a HDPrivateKey requires a string, buffer, json or object, got "{0}"'
            }
        ]
    },
    {
        name: "HDPublicKey",
        message: "Internal Error on HDPublicKey {0}",
        errors: [
            {
                name: "ArgumentIsPrivateExtended",
                message: "Argument is an extended private key: {0}"
            },
            {
                name: "InvalidDerivationArgument",
                message: "Invalid derivation argument: got {0}"
            },
            {
                name: "InvalidLength",
                message: 'Invalid length for xpubkey: got "{0}"'
            },
            {
                name: "InvalidPath",
                message: 'Invalid derivation path, it should look like: "m/1/100", got "{0}"'
            },
            {
                name: "InvalidIndexCantDeriveHardened",
                message: "Invalid argument: creating a hardened path requires an HDPrivateKey"
            },
            {
                name: "MustSupplyArgument",
                message: "Must supply an argument to create a HDPublicKey"
            },
            {
                name: "UnrecognizedArgument",
                message: "Invalid argument for creation, must be string, json, buffer, or object"
            }
        ]
    },
    {
        name: "ECIES",
        message: "Internal Error on bsv-ecies Module {0}",
        errors: [
            {
                name: "DecryptionError",
                message: "Invalid Message: {0}"
            },
            {
                name: "UnsupportAlgorithm",
                message: "Unsupport Algorithm: {0}"
            }
        ]
    },
    {
        name: "Mnemonic",
        message: "Internal Error on bsv-mnemonic module {0}",
        errors: [
            {
                name: "InvalidEntropy",
                message: "Entropy length must be an even multiple of 11 bits: {0}"
            },
            {
                name: "UnknownWordlist",
                message: "Could not detect the used word list: {0}"
            },
            {
                name: "InvalidMnemonic",
                message: "Mnemonic string is invalid: {0}"
            }
        ]
    }
];

});




parcelRegister("2p5rz", function(module, exports) {
"use strict";

var $lM2TS = parcelRequire("lM2TS");

var $japbZ = parcelRequire("japbZ");

var $km2cb = parcelRequire("km2cb");

var $hbQdz = parcelRequire("hbQdz");

var $b3rcQ = parcelRequire("b3rcQ");

var $aScoK = parcelRequire("aScoK");

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");
var $1c0223906a91e974$var$ECDSA = function ECDSA(obj) {
    if (!(this instanceof ECDSA)) return new ECDSA(obj);
    if (obj) this.set(obj);
};
$1c0223906a91e974$var$ECDSA.prototype.set = function(obj) {
    this.hashbuf = obj.hashbuf || this.hashbuf;
    this.endian = obj.endian || this.endian // the endianness of hashbuf
    ;
    this.privkey = obj.privkey || this.privkey;
    this.pubkey = obj.pubkey || (this.privkey ? this.privkey.publicKey : this.pubkey);
    this.sig = obj.sig || this.sig;
    this.k = obj.k || this.k;
    this.verified = obj.verified || this.verified;
    return this;
};
$1c0223906a91e974$var$ECDSA.prototype.privkey2pubkey = function() {
    this.pubkey = this.privkey.toPublicKey();
};
$1c0223906a91e974$var$ECDSA.prototype.calci = function() {
    for(var i = 0; i < 4; i++){
        this.sig.i = i;
        var Qprime;
        try {
            Qprime = this.toPublicKey();
        } catch (e) {
            console.error(e);
            continue;
        }
        if (Qprime.point.eq(this.pubkey.point)) {
            this.sig.compressed = this.pubkey.compressed;
            return this;
        }
    }
    this.sig.i = undefined;
    throw new Error("Unable to find valid recovery factor");
};
$1c0223906a91e974$var$ECDSA.fromString = function(str) {
    var obj = JSON.parse(str);
    return new $1c0223906a91e974$var$ECDSA(obj);
};
$1c0223906a91e974$var$ECDSA.prototype.randomK = function() {
    var N = $japbZ.getN();
    var k;
    do k = $lM2TS.fromBuffer($b3rcQ.getRandomBuffer(32));
    while (!(k.lt(N) && k.gt($lM2TS.Zero)));
    this.k = k;
    return this;
};
// https://tools.ietf.org/html/rfc6979#section-3.2
$1c0223906a91e974$var$ECDSA.prototype.deterministicK = function(badrs) {
    // if r or s were invalid when this function was used in signing,
    // we do not want to actually compute r, s here for efficiency, so,
    // we can increment badrs. explained at end of RFC 6979 section 3.2
    if ($iUxHD.isUndefined(badrs)) badrs = 0;
    var v = Buffer.alloc(32);
    v.fill(0x01);
    var k = Buffer.alloc(32);
    k.fill(0x00);
    var x = this.privkey.bn.toBuffer({
        size: 32
    });
    var hashbuf = this.endian === "little" ? Buffer.from(this.hashbuf).reverse() : this.hashbuf;
    k = $aScoK.sha256hmac(Buffer.concat([
        v,
        Buffer.from([
            0x00
        ]),
        x,
        hashbuf
    ]), k);
    v = $aScoK.sha256hmac(v, k);
    k = $aScoK.sha256hmac(Buffer.concat([
        v,
        Buffer.from([
            0x01
        ]),
        x,
        hashbuf
    ]), k);
    v = $aScoK.sha256hmac(v, k);
    v = $aScoK.sha256hmac(v, k);
    var T = $lM2TS.fromBuffer(v);
    var N = $japbZ.getN();
    // also explained in 3.2, we must ensure T is in the proper range (0, N)
    for(var i = 0; i < badrs || !(T.lt(N) && T.gt($lM2TS.Zero)); i++){
        k = $aScoK.sha256hmac(Buffer.concat([
            v,
            Buffer.from([
                0x00
            ])
        ]), k);
        v = $aScoK.sha256hmac(v, k);
        v = $aScoK.sha256hmac(v, k);
        T = $lM2TS.fromBuffer(v);
    }
    this.k = T;
    return this;
};
// Information about public key recovery:
// https://bitcointalk.org/index.php?topic=6430.0
// http://stackoverflow.com/questions/19665491/how-do-i-get-an-ecdsa-public-key-from-just-a-bitcoin-signature-sec1-4-1-6-k
$1c0223906a91e974$var$ECDSA.prototype.toPublicKey = function() {
    var i = this.sig.i;
    $e34gf.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, new Error("i must be equal to 0, 1, 2, or 3"));
    var e = $lM2TS.fromBuffer(this.hashbuf);
    var r = this.sig.r;
    var s = this.sig.s;
    // A set LSB signifies that the y-coordinate is odd
    var isYOdd = i & 1;
    // The more significant bit specifies whether we should use the
    // first or second candidate key.
    var isSecondKey = i >> 1;
    var n = $japbZ.getN();
    var G = $japbZ.getG();
    // 1.1 Let x = r + jn
    var x = isSecondKey ? r.add(n) : r;
    var R = $japbZ.fromX(isYOdd, x);
    // 1.4 Check that nR is at infinity
    var nR = R.mul(n);
    if (!nR.isInfinity()) throw new Error("nR is not a valid curve point");
    // Compute -e from e
    var eNeg = e.neg().umod(n);
    // 1.6.1 Compute Q = r^-1 (sR - eG)
    // Q = r^-1 (sR + -eG)
    var rInv = r.invm(n);
    // var Q = R.multiplyTwo(s, G, eNeg).mul(rInv);
    var Q = R.mul(s).add(G.mul(eNeg)).mul(rInv);
    var pubkey = $hbQdz.fromPoint(Q, this.sig.compressed);
    return pubkey;
};
$1c0223906a91e974$var$ECDSA.prototype.sigError = function() {
    if (!Buffer.isBuffer(this.hashbuf) || this.hashbuf.length !== 32) return "hashbuf must be a 32 byte buffer";
    var r = this.sig.r;
    var s = this.sig.s;
    if (!(r.gt($lM2TS.Zero) && r.lt($japbZ.getN())) || !(s.gt($lM2TS.Zero) && s.lt($japbZ.getN()))) return "r and s not in range";
    var e = $lM2TS.fromBuffer(this.hashbuf, this.endian ? {
        endian: this.endian
    } : undefined);
    var n = $japbZ.getN();
    var sinv = s.invm(n);
    var u1 = sinv.mul(e).umod(n);
    var u2 = sinv.mul(r).umod(n);
    var p = $japbZ.getG().mulAdd(u1, this.pubkey.point, u2);
    if (p.isInfinity()) return "p is infinity";
    if (p.getX().umod(n).cmp(r) !== 0) return "Invalid signature";
    else return false;
};
$1c0223906a91e974$var$ECDSA.toLowS = function(s) {
    // enforce low s
    // see BIP 62, "low S values in signatures"
    if (s.gt($lM2TS.fromBuffer(Buffer.from("7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0", "hex")))) s = $japbZ.getN().sub(s);
    return s;
};
$1c0223906a91e974$var$ECDSA.prototype._findSignature = function(d, e) {
    var N = $japbZ.getN();
    var G = $japbZ.getG();
    // try different values of k until r, s are valid
    var badrs = 0;
    var k, Q, r, s;
    do {
        if (!this.k || badrs > 0) this.deterministicK(badrs);
        badrs++;
        k = this.k;
        Q = G.mul(k);
        r = new $lM2TS(1).mul(Q.x.umod(N));
        s = k.invm(N).mul(e.add(d.mul(r))).umod(N);
    }while (r.cmp($lM2TS.Zero) <= 0 || s.cmp($lM2TS.Zero) <= 0);
    s = $1c0223906a91e974$var$ECDSA.toLowS(s);
    return {
        s: s,
        r: r
    };
};
$1c0223906a91e974$var$ECDSA.prototype.sign = function() {
    var hashbuf = this.hashbuf;
    var privkey = this.privkey;
    var d = privkey.bn;
    $e34gf.checkState(hashbuf && privkey && d, new Error("invalid parameters"));
    $e34gf.checkState(Buffer.isBuffer(hashbuf) && hashbuf.length === 32, new Error("hashbuf must be a 32 byte buffer"));
    var e = $lM2TS.fromBuffer(hashbuf, this.endian ? {
        endian: this.endian
    } : undefined);
    var obj = this._findSignature(d, e);
    obj.compressed = this.pubkey.compressed;
    this.sig = new $km2cb(obj);
    return this;
};
$1c0223906a91e974$var$ECDSA.prototype.signRandomK = function() {
    this.randomK();
    return this.sign();
};
$1c0223906a91e974$var$ECDSA.prototype.toString = function() {
    var obj = {};
    if (this.hashbuf) obj.hashbuf = this.hashbuf.toString("hex");
    if (this.privkey) obj.privkey = this.privkey.toString();
    if (this.pubkey) obj.pubkey = this.pubkey.toString();
    if (this.sig) obj.sig = this.sig.toString();
    if (this.k) obj.k = this.k.toString();
    return JSON.stringify(obj);
};
$1c0223906a91e974$var$ECDSA.prototype.verify = function() {
    if (!this.sigError()) this.verified = true;
    else this.verified = false;
    return this;
};
$1c0223906a91e974$var$ECDSA.sign = function(hashbuf, privkey, endian) {
    return $1c0223906a91e974$var$ECDSA().set({
        hashbuf: hashbuf,
        endian: endian,
        privkey: privkey
    }).sign().sig;
};
$1c0223906a91e974$var$ECDSA.signWithCalcI = function(hashbuf, privkey, endian) {
    return $1c0223906a91e974$var$ECDSA().set({
        hashbuf: hashbuf,
        endian: endian,
        privkey: privkey
    }).sign().calci().sig;
};
$1c0223906a91e974$var$ECDSA.signRandomK = function(hashbuf, privkey, endian) {
    return $1c0223906a91e974$var$ECDSA().set({
        hashbuf: hashbuf,
        endian: endian,
        privkey: privkey
    }).signRandomK().sig;
};
$1c0223906a91e974$var$ECDSA.verify = function(hashbuf, sig, pubkey, endian) {
    return $1c0223906a91e974$var$ECDSA().set({
        hashbuf: hashbuf,
        endian: endian,
        sig: sig,
        pubkey: pubkey
    }).verify().verified;
};
module.exports = $1c0223906a91e974$var$ECDSA;

});
parcelRegister("japbZ", function(module, exports) {
"use strict";

var $lM2TS = parcelRequire("lM2TS");

var $df427e31d9019d34$var$EC = $fxX3C$elliptic.ec;
var $df427e31d9019d34$var$ec = new $df427e31d9019d34$var$EC("secp256k1");
var $df427e31d9019d34$var$ecPoint = $df427e31d9019d34$var$ec.curve.point.bind($df427e31d9019d34$var$ec.curve);
var $df427e31d9019d34$var$ecPointFromX = $df427e31d9019d34$var$ec.curve.pointFromX.bind($df427e31d9019d34$var$ec.curve);
/**
 * Instantiate a valid secp256k1 Point from the X and Y coordinates. This class
 * is just an extension of the secp256k1 code from the library "elliptic" by
 * Fedor Indutny. It includes a few extra features that are useful in Bitcoin.
 *
 * @param {BN|String} x - The X coordinate
 * @param {BN|String} y - The Y coordinate
 * @link https://github.com/indutny/elliptic
 * @augments elliptic.curve.point
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of Point
 * @constructor
 */ var $df427e31d9019d34$var$Point = function Point(x, y, isRed) {
    try {
        var point = $df427e31d9019d34$var$ecPoint(x, y, isRed);
    } catch (e) {
        throw new Error("Invalid Point");
    }
    point.validate();
    return point;
};
$df427e31d9019d34$var$Point.prototype = Object.getPrototypeOf($df427e31d9019d34$var$ec.curve.point());
/**
 *
 * Instantiate a valid secp256k1 Point from only the X coordinate. This is
 * useful to rederive a full point from the compressed form of a point.
 *
 * @param {boolean} odd - If the Y coordinate is odd
 * @param {BN|String} x - The X coordinate
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of Point
 */ $df427e31d9019d34$var$Point.fromX = function fromX(odd, x) {
    try {
        var point = $df427e31d9019d34$var$ecPointFromX(x, odd);
    } catch (e) {
        throw new Error("Invalid X");
    }
    point.validate();
    return point;
};
/**
 *
 * Will return a secp256k1 ECDSA base point.
 *
 * @link https://en.bitcoin.it/wiki/Secp256k1
 * @returns {Point} An instance of the base point.
 */ $df427e31d9019d34$var$Point.getG = function getG() {
    return $df427e31d9019d34$var$ec.curve.g;
};
/**
 *
 * Will return the max of range of valid private keys as governed by the
 * secp256k1 ECDSA standard.
 *
 * @link https://en.bitcoin.it/wiki/Private_key#Range_of_valid_ECDSA_private_keys
 * @returns {BN} A BN instance of the number of points on the curve
 */ $df427e31d9019d34$var$Point.getN = function getN() {
    return new $lM2TS($df427e31d9019d34$var$ec.curve.n.toArray());
};
if (!$df427e31d9019d34$var$Point.prototype._getX) $df427e31d9019d34$var$Point.prototype._getX = $df427e31d9019d34$var$Point.prototype.getX;
/**
 * Will return the X coordinate of the Point.
 *
 * @returns {BN} A BN instance of the X coordinate
 */ $df427e31d9019d34$var$Point.prototype.getX = function getX() {
    return new $lM2TS(this._getX().toArray());
};
if (!$df427e31d9019d34$var$Point.prototype._getY) $df427e31d9019d34$var$Point.prototype._getY = $df427e31d9019d34$var$Point.prototype.getY;
/**
 * Will return the Y coordinate of the Point.
 *
 * @returns {BN} A BN instance of the Y coordinate
 */ $df427e31d9019d34$var$Point.prototype.getY = function getY() {
    return new $lM2TS(this._getY().toArray());
};
/**
 * Will determine if the point is valid.
 *
 * @link https://www.iacr.org/archive/pkc2003/25670211/25670211.pdf
 * @throws {Error} A validation error if exists
 * @returns {Point} An instance of the same Point
 */ $df427e31d9019d34$var$Point.prototype.validate = function validate() {
    if (this.isInfinity()) throw new Error("Point cannot be equal to Infinity");
    var p2;
    try {
        p2 = $df427e31d9019d34$var$ecPointFromX(this.getX(), this.getY().isOdd());
    } catch (e) {
        throw new Error("Point does not lie on the curve");
    }
    if (p2.y.cmp(this.y) !== 0) throw new Error("Invalid y value for curve.");
    // todo: needs test case
    if (!this.mul($df427e31d9019d34$var$Point.getN()).isInfinity()) throw new Error("Point times N must be infinity");
    return this;
};
/**
 * A "compressed" format point is the X part of the (X, Y) point plus an extra
 * bit (which takes an entire byte) to indicate whether the Y value is odd or
 * not. Storing points this way takes a bit less space, but requires a bit more
 * computation to rederive the full point.
 *
 * @param {Point} point An instance of Point.
 * @returns {Buffer} A compressed point in the form of a buffer.
 */ $df427e31d9019d34$var$Point.pointToCompressed = function pointToCompressed(point) {
    var xbuf = point.getX().toBuffer({
        size: 32
    });
    var ybuf = point.getY().toBuffer({
        size: 32
    });
    var prefix;
    var odd = ybuf[ybuf.length - 1] % 2;
    if (odd) prefix = Buffer.from([
        0x03
    ]);
    else prefix = Buffer.from([
        0x02
    ]);
    return Buffer.concat([
        prefix,
        xbuf
    ]);
};
/**
 * Converts a compressed buffer into a point.
 *
 * @param {Buffer} buf A compressed point.
 * @returns {Point} A Point.
 */ $df427e31d9019d34$var$Point.pointFromCompressed = function(buf) {
    if (buf.length !== 33) throw new Error("invalid buffer length");
    let prefix = buf[0];
    let odd;
    if (prefix === 0x03) odd = true;
    else if (prefix === 0x02) odd = false;
    else throw new Error("invalid value of compressed prefix");
    let xbuf = buf.slice(1, 33);
    let x = $lM2TS.fromBuffer(xbuf);
    return $df427e31d9019d34$var$Point.fromX(odd, x);
};
/**
 * Convert point to a compressed buffer.
 *
 * @returns {Buffer} A compressed point.
 */ $df427e31d9019d34$var$Point.prototype.toBuffer = function() {
    return $df427e31d9019d34$var$Point.pointToCompressed(this);
};
/**
 * Convert point to a compressed hex string.
 *
 * @returns {string} A compressed point as a hex string.
 */ $df427e31d9019d34$var$Point.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
/**
 * Converts a compressed buffer into a point.
 *
 * @param {Buffer} buf A compressed point.
 * @returns {Point} A Point.
 */ $df427e31d9019d34$var$Point.fromBuffer = function(buf) {
    return $df427e31d9019d34$var$Point.pointFromCompressed(buf);
};
/**
 * Converts a compressed buffer into a point.
 *
 * @param {Buffer} hex A compressed point as a hex string.
 * @returns {Point} A Point.
 */ $df427e31d9019d34$var$Point.fromHex = function(hex) {
    return $df427e31d9019d34$var$Point.fromBuffer(Buffer.from(hex, "hex"));
};
module.exports = $df427e31d9019d34$var$Point;

});

parcelRegister("km2cb", function(module, exports) {
"use strict";

var $lM2TS = parcelRequire("lM2TS");

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $bbk3w = parcelRequire("bbk3w");
var $ed1790aef905a6e1$var$Signature = function Signature(r, s) {
    if (!(this instanceof Signature)) return new Signature(r, s);
    if (r instanceof $lM2TS) this.set({
        r: r,
        s: s
    });
    else if (r) {
        var obj = r;
        this.set(obj);
    }
};
$ed1790aef905a6e1$var$Signature.prototype.set = function(obj) {
    this.r = obj.r || this.r || undefined;
    this.s = obj.s || this.s || undefined;
    this.i = typeof obj.i !== "undefined" ? obj.i : this.i // public key recovery parameter in range [0, 3]
    ;
    this.compressed = typeof obj.compressed !== "undefined" ? obj.compressed : this.compressed // whether the recovered pubkey is compressed
    ;
    this.nhashtype = obj.nhashtype || this.nhashtype || undefined;
    return this;
};
$ed1790aef905a6e1$var$Signature.fromCompact = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf), "Argument is expected to be a Buffer");
    var sig = new $ed1790aef905a6e1$var$Signature();
    var compressed = true;
    var i = buf.slice(0, 1)[0] - 27 - 4;
    if (i < 0) {
        compressed = false;
        i = i + 4;
    }
    var b2 = buf.slice(1, 33);
    var b3 = buf.slice(33, 65);
    $e34gf.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, new Error("i must be 0, 1, 2, or 3"));
    $e34gf.checkArgument(b2.length === 32, new Error("r must be 32 bytes"));
    $e34gf.checkArgument(b3.length === 32, new Error("s must be 32 bytes"));
    sig.compressed = compressed;
    sig.i = i;
    sig.r = $lM2TS.fromBuffer(b2);
    sig.s = $lM2TS.fromBuffer(b3);
    return sig;
};
$ed1790aef905a6e1$var$Signature.fromDER = $ed1790aef905a6e1$var$Signature.fromBuffer = function(buf, strict) {
    var obj = $ed1790aef905a6e1$var$Signature.parseDER(buf, strict);
    var sig = new $ed1790aef905a6e1$var$Signature();
    sig.r = obj.r;
    sig.s = obj.s;
    return sig;
};
// The format used in a tx
$ed1790aef905a6e1$var$Signature.fromTxFormat = function(buf) {
    var nhashtype = buf.readUInt8(buf.length - 1);
    var derbuf = buf.slice(0, buf.length - 1);
    var sig = $ed1790aef905a6e1$var$Signature.fromDER(derbuf, false);
    sig.nhashtype = nhashtype;
    return sig;
};
$ed1790aef905a6e1$var$Signature.fromString = function(str) {
    var buf = Buffer.from(str, "hex");
    return $ed1790aef905a6e1$var$Signature.fromDER(buf);
};
/**
 * In order to mimic the non-strict DER encoding of OpenSSL, set strict = false.
 */ $ed1790aef905a6e1$var$Signature.parseDER = function(buf, strict) {
    $e34gf.checkArgument(Buffer.isBuffer(buf), new Error("DER formatted signature should be a buffer"));
    if ($iUxHD.isUndefined(strict)) strict = true;
    var header = buf[0];
    $e34gf.checkArgument(header === 0x30, new Error("Header byte should be 0x30"));
    var length = buf[1];
    var buflength = buf.slice(2).length;
    $e34gf.checkArgument(!strict || length === buflength, new Error("Length byte should length of what follows"));
    length = length < buflength ? length : buflength;
    var rheader = buf[2];
    $e34gf.checkArgument(rheader === 0x02, new Error("Integer byte for r should be 0x02"));
    var rlength = buf[3];
    var rbuf = buf.slice(4, 4 + rlength);
    var r = $lM2TS.fromBuffer(rbuf);
    var rneg = buf[4] === 0x00;
    $e34gf.checkArgument(rlength === rbuf.length, new Error("Length of r incorrect"));
    var sheader = buf[4 + rlength + 0];
    $e34gf.checkArgument(sheader === 0x02, new Error("Integer byte for s should be 0x02"));
    var slength = buf[4 + rlength + 1];
    var sbuf = buf.slice(4 + rlength + 2, 4 + rlength + 2 + slength);
    var s = $lM2TS.fromBuffer(sbuf);
    var sneg = buf[4 + rlength + 2 + 2] === 0x00;
    $e34gf.checkArgument(slength === sbuf.length, new Error("Length of s incorrect"));
    var sumlength = 4 + rlength + 2 + slength;
    $e34gf.checkArgument(length === sumlength - 2, new Error("Length of signature incorrect"));
    var obj = {
        header: header,
        length: length,
        rheader: rheader,
        rlength: rlength,
        rneg: rneg,
        rbuf: rbuf,
        r: r,
        sheader: sheader,
        slength: slength,
        sneg: sneg,
        sbuf: sbuf,
        s: s
    };
    return obj;
};
$ed1790aef905a6e1$var$Signature.prototype.toCompact = function(i, compressed) {
    i = typeof i === "number" ? i : this.i;
    compressed = typeof compressed === "boolean" ? compressed : this.compressed;
    if (!(i === 0 || i === 1 || i === 2 || i === 3)) throw new Error("i must be equal to 0, 1, 2, or 3");
    var val = i + 27 + 4;
    if (compressed === false) val = val - 4;
    var b1 = Buffer.from([
        val
    ]);
    var b2 = this.r.toBuffer({
        size: 32
    });
    var b3 = this.s.toBuffer({
        size: 32
    });
    return Buffer.concat([
        b1,
        b2,
        b3
    ]);
};
$ed1790aef905a6e1$var$Signature.prototype.toBuffer = $ed1790aef905a6e1$var$Signature.prototype.toDER = function() {
    var rnbuf = this.r.toBuffer();
    var snbuf = this.s.toBuffer();
    var rneg = !!(rnbuf[0] & 0x80);
    var sneg = !!(snbuf[0] & 0x80);
    var rbuf = rneg ? Buffer.concat([
        Buffer.from([
            0x00
        ]),
        rnbuf
    ]) : rnbuf;
    var sbuf = sneg ? Buffer.concat([
        Buffer.from([
            0x00
        ]),
        snbuf
    ]) : snbuf;
    var rlength = rbuf.length;
    var slength = sbuf.length;
    var length = 2 + rlength + 2 + slength;
    var rheader = 0x02;
    var sheader = 0x02;
    var header = 0x30;
    var der = Buffer.concat([
        Buffer.from([
            header,
            length,
            rheader,
            rlength
        ]),
        rbuf,
        Buffer.from([
            sheader,
            slength
        ]),
        sbuf
    ]);
    return der;
};
$ed1790aef905a6e1$var$Signature.prototype.toString = function() {
    var buf = this.toDER();
    return buf.toString("hex");
};
/**
 * This function is translated from bitcoind's IsDERSignature and is used in
 * the script interpreter.  This "DER" format actually includes an extra byte,
 * the nhashtype, at the end. It is really the tx format, not DER format.
 *
 * A canonical signature exists of: [30] [total len] [02] [len R] [R] [02] [len S] [S] [hashtype]
 * Where R and S are not negative (their first byte has its highest bit not set), and not
 * excessively padded (do not start with a 0 byte, unless an otherwise negative number follows,
 * in which case a single 0 byte is necessary and even required).
 *
 * See https://bitcointalk.org/index.php?topic=8392.msg127623#msg127623
 */ $ed1790aef905a6e1$var$Signature.isTxDER = function(buf) {
    if (buf.length < 9) //  Non-canonical signature: too short
    return false;
    if (buf.length > 73) // Non-canonical signature: too long
    return false;
    if (buf[0] !== 0x30) //  Non-canonical signature: wrong type
    return false;
    if (buf[1] !== buf.length - 3) //  Non-canonical signature: wrong length marker
    return false;
    var nLenR = buf[3];
    if (5 + nLenR >= buf.length) //  Non-canonical signature: S length misplaced
    return false;
    var nLenS = buf[5 + nLenR];
    if (nLenR + nLenS + 7 !== buf.length) //  Non-canonical signature: R+S length mismatch
    return false;
    var R = buf.slice(4);
    if (buf[2] !== 0x02) //  Non-canonical signature: R value type mismatch
    return false;
    if (nLenR === 0) //  Non-canonical signature: R length is zero
    return false;
    if (R[0] & 0x80) //  Non-canonical signature: R value negative
    return false;
    if (nLenR > 1 && R[0] === 0x00 && !(R[1] & 0x80)) //  Non-canonical signature: R value excessively padded
    return false;
    var S = buf.slice(6 + nLenR);
    if (buf[6 + nLenR - 2] !== 0x02) //  Non-canonical signature: S value type mismatch
    return false;
    if (nLenS === 0) //  Non-canonical signature: S length is zero
    return false;
    if (S[0] & 0x80) //  Non-canonical signature: S value negative
    return false;
    if (nLenS > 1 && S[0] === 0x00 && !(S[1] & 0x80)) //  Non-canonical signature: S value excessively padded
    return false;
    return true;
};
/**
 * Compares to bitcoind's IsLowDERSignature
 * See also ECDSA signature algorithm which enforces this.
 * See also BIP 62, "low S values in signatures"
 */ $ed1790aef905a6e1$var$Signature.prototype.hasLowS = function() {
    if (this.s.lt(new $lM2TS(1)) || this.s.gt(new $lM2TS("7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0", "hex"))) return false;
    return true;
};
/**
 * @returns true if the nhashtype is exactly equal to one of the standard options or combinations thereof.
 * Translated from bitcoind's IsDefinedHashtypeSignature
 */ $ed1790aef905a6e1$var$Signature.prototype.hasDefinedHashtype = function() {
    if (!$bbk3w.isNaturalNumber(this.nhashtype)) return false;
    // accept with or without Signature.SIGHASH_ANYONECANPAY by ignoring the bit
    var temp = this.nhashtype & 0x1F;
    if (temp < $ed1790aef905a6e1$var$Signature.SIGHASH_ALL || temp > $ed1790aef905a6e1$var$Signature.SIGHASH_SINGLE) return false;
    return true;
};
$ed1790aef905a6e1$var$Signature.prototype.toTxFormat = function() {
    var derbuf = this.toDER();
    var buf = Buffer.alloc(1);
    buf.writeUInt8(this.nhashtype, 0);
    return Buffer.concat([
        derbuf,
        buf
    ]);
};
$ed1790aef905a6e1$var$Signature.SIGHASH_ALL = 0x01;
$ed1790aef905a6e1$var$Signature.SIGHASH_NONE = 0x02;
$ed1790aef905a6e1$var$Signature.SIGHASH_SINGLE = 0x03;
$ed1790aef905a6e1$var$Signature.SIGHASH_FORKID = 0x40;
$ed1790aef905a6e1$var$Signature.SIGHASH_ANYONECANPAY = 0x80;
$ed1790aef905a6e1$var$Signature.ALL = 0x41;
$ed1790aef905a6e1$var$Signature.NONE = 0x42;
$ed1790aef905a6e1$var$Signature.SINGLE = 0x43;
$ed1790aef905a6e1$var$Signature.ANYONECANPAY_ALL = 0xc1;
$ed1790aef905a6e1$var$Signature.ANYONECANPAY_NONE = 0xc2;
$ed1790aef905a6e1$var$Signature.ANYONECANPAY_SINGLE = 0xc3;
module.exports = $ed1790aef905a6e1$var$Signature;

});
parcelRegister("bbk3w", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");
/**
 * Determines whether a string contains only hexadecimal values
 *
 * @name JSUtil.isHexa
 * @param {string} value
 * @return {boolean} true if the string is the hexa representation of a number
 */ var $8240476edc032618$var$isHexa = function isHexa(value) {
    if (!$iUxHD.isString(value)) return false;
    return /^[0-9a-fA-F]+$/.test(value);
};
/**
 * @namespace JSUtil
 */ module.exports = {
    /**
   * Test if an argument is a valid JSON object. If it is, returns a truthy
   * value (the json object decoded), so no double JSON.parse call is necessary
   *
   * @param {string} arg
   * @return {Object|boolean} false if the argument is not a JSON string.
   */ isValidJSON: function isValidJSON(arg) {
        var parsed;
        if (!$iUxHD.isString(arg)) return false;
        try {
            parsed = JSON.parse(arg);
        } catch (e) {
            return false;
        }
        if (typeof parsed === "object") return true;
        return false;
    },
    isHexa: $8240476edc032618$var$isHexa,
    isHexaString: $8240476edc032618$var$isHexa,
    /**
   * Define immutable properties on a target object
   *
   * @param {Object} target - An object to be extended
   * @param {Object} values - An object of properties
   * @return {Object} The target object
   */ defineImmutable: function defineImmutable(target, values) {
        Object.keys(values).forEach(function(key) {
            Object.defineProperty(target, key, {
                configurable: false,
                enumerable: true,
                value: values[key]
            });
        });
        return target;
    },
    /**
   * Checks that a value is a natural number, a positive integer or zero.
   *
   * @param {*} value
   * @return {Boolean}
   */ isNaturalNumber: function isNaturalNumber(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value && value >= 0;
    },
    /**
   * Transform a 4-byte integer (unsigned value) into a Buffer of length 4 (Big Endian Byte Order)
   *
   * @param {number} integer
   * @return {Buffer}
   */ integerAsBuffer: function integerAsBuffer(integer) {
        $e34gf.checkArgumentType(integer, "number", "integer");
        const buf = Buffer.allocUnsafe(4);
        buf.writeUInt32BE(integer, 0);
        return buf;
    }
};

});


parcelRegister("hbQdz", function(module, exports) {
"use strict";

var $lM2TS = parcelRequire("lM2TS");

var $japbZ = parcelRequire("japbZ");

var $aScoK = parcelRequire("aScoK");

var $bbk3w = parcelRequire("bbk3w");

var $92x2d = parcelRequire("92x2d");

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");
/**
 * Instantiate a PublicKey from a {@link PrivateKey}, {@link Point}, `string`, or `Buffer`.
 *
 * There are two internal properties, `network` and `compressed`, that deal with importing
 * a PublicKey from a PrivateKey in WIF format. More details described on {@link PrivateKey}
 *
 * @example
 * ```javascript
 * // instantiate from a private key
 * var key = PublicKey(privateKey, true);
 *
 * // export to as a DER hex encoded string
 * var exported = key.toString();
 *
 * // import the public key
 * var imported = PublicKey.fromString(exported);
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Object} extra - additional options
 * @param {Network=} extra.network - Which network should the address for this public key be for
 * @param {String=} extra.compressed - If the public key is compressed
 * @returns {PublicKey} A new valid instance of an PublicKey
 * @constructor
 */ function $c83bf824e415d77e$var$PublicKey(data, extra) {
    if (!(this instanceof $c83bf824e415d77e$var$PublicKey)) return new $c83bf824e415d77e$var$PublicKey(data, extra);
    $e34gf.checkArgument(data, "First argument is required, please include public key data.");
    if (data instanceof $c83bf824e415d77e$var$PublicKey) // Return copy, but as it's an immutable object, return same argument
    return data;
    extra = extra || {};
    var info = this._classifyArgs(data, extra);
    // validation
    info.point.validate();
    $bbk3w.defineImmutable(this, {
        point: info.point,
        compressed: info.compressed,
        network: info.network || $92x2d.defaultNetwork
    });
    return this;
}
/**
 * Internal function to differentiate between arguments passed to the constructor
 * @param {*} data
 * @param {Object} extra
 */ $c83bf824e415d77e$var$PublicKey.prototype._classifyArgs = function(data, extra) {
    var info = {
        compressed: $iUxHD.isUndefined(extra.compressed) || extra.compressed
    };
    // detect type of data
    if (data instanceof $japbZ) info.point = data;
    else if (data.x && data.y) info = $c83bf824e415d77e$var$PublicKey._transformObject(data);
    else if (typeof data === "string") info = $c83bf824e415d77e$var$PublicKey._transformDER(Buffer.from(data, "hex"));
    else if ($c83bf824e415d77e$var$PublicKey._isBuffer(data)) info = $c83bf824e415d77e$var$PublicKey._transformDER(data);
    else if ($c83bf824e415d77e$var$PublicKey._isPrivateKey(data)) info = $c83bf824e415d77e$var$PublicKey._transformPrivateKey(data);
    else throw new TypeError("First argument is an unrecognized data format.");
    if (!info.network) info.network = $iUxHD.isUndefined(extra.network) ? undefined : $92x2d.get(extra.network);
    return info;
};

/**
 * Internal function to detect if an object is a {@link PrivateKey}
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */ $c83bf824e415d77e$var$PublicKey._isPrivateKey = function(param) {
    var PrivateKey = (parcelRequire("eB3ON"));
    return param instanceof PrivateKey;
};
/**
 * Internal function to detect if an object is a Buffer
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */ $c83bf824e415d77e$var$PublicKey._isBuffer = function(param) {
    return param instanceof Buffer || param instanceof Uint8Array;
};
/**
 * Internal function to transform a private key into a public key point
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {Object} An object with keys: point and compressed
 * @private
 */ $c83bf824e415d77e$var$PublicKey._transformPrivateKey = function(privkey) {
    $e34gf.checkArgument($c83bf824e415d77e$var$PublicKey._isPrivateKey(privkey), "Must be an instance of PrivateKey");
    var info = {};
    info.point = $japbZ.getG().mul(privkey.bn);
    info.compressed = privkey.compressed;
    info.network = privkey.network;
    return info;
};
/**
 * Internal function to transform DER into a public key point
 *
 * @param {Buffer} buf - An DER buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {Object} An object with keys: point and compressed
 * @private
 */ $c83bf824e415d77e$var$PublicKey._transformDER = function(buf, strict) {
    $e34gf.checkArgument($c83bf824e415d77e$var$PublicKey._isBuffer(buf), "Must be a buffer of DER encoded public key");
    var info = {};
    strict = $iUxHD.isUndefined(strict) ? true : strict;
    var x;
    var y;
    var xbuf;
    var ybuf;
    if (buf[0] === 0x04 || !strict && (buf[0] === 0x06 || buf[0] === 0x07)) {
        xbuf = buf.slice(1, 33);
        ybuf = buf.slice(33, 65);
        if (xbuf.length !== 32 || ybuf.length !== 32 || buf.length !== 65) throw new TypeError("Length of x and y must be 32 bytes");
        x = new $lM2TS(xbuf);
        y = new $lM2TS(ybuf);
        info.point = new $japbZ(x, y);
        info.compressed = false;
    } else if (buf[0] === 0x03) {
        xbuf = buf.slice(1);
        x = new $lM2TS(xbuf);
        info = $c83bf824e415d77e$var$PublicKey._transformX(true, x);
        info.compressed = true;
    } else if (buf[0] === 0x02) {
        xbuf = buf.slice(1);
        x = new $lM2TS(xbuf);
        info = $c83bf824e415d77e$var$PublicKey._transformX(false, x);
        info.compressed = true;
    } else throw new TypeError("Invalid DER format public key");
    return info;
};
/**
 * Internal function to transform X into a public key point
 *
 * @param {Boolean} odd - If the point is above or below the x axis
 * @param {Point} x - The x point
 * @returns {Object} An object with keys: point and compressed
 * @private
 */ $c83bf824e415d77e$var$PublicKey._transformX = function(odd, x) {
    $e34gf.checkArgument(typeof odd === "boolean", "Must specify whether y is odd or not (true or false)");
    var info = {};
    info.point = $japbZ.fromX(odd, x);
    return info;
};
/**
 * Internal function to transform a JSON into a public key point
 *
 * @param {String|Object} json - a JSON string or plain object
 * @returns {Object} An object with keys: point and compressed
 * @private
 */ $c83bf824e415d77e$var$PublicKey._transformObject = function(json) {
    var x = new $lM2TS(json.x, "hex");
    var y = new $lM2TS(json.y, "hex");
    var point = new $japbZ(x, y);
    return new $c83bf824e415d77e$var$PublicKey(point, {
        compressed: json.compressed
    });
};
/**
 * Instantiate a PublicKey from a PrivateKey
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {PublicKey} A new valid instance of PublicKey
 */ $c83bf824e415d77e$var$PublicKey.fromPrivateKey = function(privkey) {
    $e34gf.checkArgument($c83bf824e415d77e$var$PublicKey._isPrivateKey(privkey), "Must be an instance of PrivateKey");
    var info = $c83bf824e415d77e$var$PublicKey._transformPrivateKey(privkey);
    return new $c83bf824e415d77e$var$PublicKey(info.point, {
        compressed: info.compressed,
        network: info.network
    });
};
/**
 * Instantiate a PublicKey from a Buffer
 * @param {Buffer} buf - A DER buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {PublicKey} A new valid instance of PublicKey
 */ $c83bf824e415d77e$var$PublicKey.fromDER = $c83bf824e415d77e$var$PublicKey.fromBuffer = function(buf, strict) {
    $e34gf.checkArgument($c83bf824e415d77e$var$PublicKey._isBuffer(buf), "Must be a buffer of DER encoded public key");
    var info = $c83bf824e415d77e$var$PublicKey._transformDER(buf, strict);
    return new $c83bf824e415d77e$var$PublicKey(info.point, {
        compressed: info.compressed
    });
};
/**
 * Instantiate a PublicKey from a Point
 *
 * @param {Point} point - A Point instance
 * @param {boolean=} compressed - whether to store this public key as compressed format
 * @returns {PublicKey} A new valid instance of PublicKey
 */ $c83bf824e415d77e$var$PublicKey.fromPoint = function(point, compressed) {
    $e34gf.checkArgument(point instanceof $japbZ, "First argument must be an instance of Point.");
    return new $c83bf824e415d77e$var$PublicKey(point, {
        compressed: compressed
    });
};
/**
 * Instantiate a PublicKey from a DER hex encoded string
 *
 * @param {string} str - A DER hex string
 * @param {String=} encoding - The type of string encoding
 * @returns {PublicKey} A new valid instance of PublicKey
 */ $c83bf824e415d77e$var$PublicKey.fromHex = $c83bf824e415d77e$var$PublicKey.fromString = function(str, encoding) {
    var buf = Buffer.from(str, encoding || "hex");
    var info = $c83bf824e415d77e$var$PublicKey._transformDER(buf);
    return new $c83bf824e415d77e$var$PublicKey(info.point, {
        compressed: info.compressed
    });
};
/**
 * Instantiate a PublicKey from an X Point
 *
 * @param {Boolean} odd - If the point is above or below the x axis
 * @param {Point} x - The x point
 * @returns {PublicKey} A new valid instance of PublicKey
 */ $c83bf824e415d77e$var$PublicKey.fromX = function(odd, x) {
    var info = $c83bf824e415d77e$var$PublicKey._transformX(odd, x);
    return new $c83bf824e415d77e$var$PublicKey(info.point, {
        compressed: info.compressed
    });
};
/**
 * Check if there would be any errors when initializing a PublicKey
 *
 * @param {string} data - The encoded data in various formats
 * @returns {null|Error} An error if exists
 */ $c83bf824e415d77e$var$PublicKey.getValidationError = function(data) {
    var error;
    try {
        new $c83bf824e415d77e$var$PublicKey(data) // eslint-disable-line
        ;
    } catch (e) {
        error = e;
    }
    return error;
};
/**
 * Check if the parameters are valid
 *
 * @param {string} data - The encoded data in various formats
 * @returns {Boolean} If the public key would be valid
 */ $c83bf824e415d77e$var$PublicKey.isValid = function(data) {
    return !$c83bf824e415d77e$var$PublicKey.getValidationError(data);
};
/**
 * @returns {Object} A plain object of the PublicKey
 */ $c83bf824e415d77e$var$PublicKey.prototype.toObject = $c83bf824e415d77e$var$PublicKey.prototype.toJSON = function toObject() {
    return {
        x: this.point.getX().toString("hex", 2),
        y: this.point.getY().toString("hex", 2),
        compressed: this.compressed
    };
};
/**
 * Will output the PublicKey to a DER Buffer
 *
 * @returns {Buffer} A DER hex encoded buffer
 */ $c83bf824e415d77e$var$PublicKey.prototype.toBuffer = $c83bf824e415d77e$var$PublicKey.prototype.toDER = function() {
    var x = this.point.getX();
    var y = this.point.getY();
    var xbuf = x.toBuffer({
        size: 32
    });
    var ybuf = y.toBuffer({
        size: 32
    });
    var prefix;
    if (!this.compressed) {
        prefix = Buffer.from([
            0x04
        ]);
        return Buffer.concat([
            prefix,
            xbuf,
            ybuf
        ]);
    } else {
        var odd = ybuf[ybuf.length - 1] % 2;
        if (odd) prefix = Buffer.from([
            0x03
        ]);
        else prefix = Buffer.from([
            0x02
        ]);
        return Buffer.concat([
            prefix,
            xbuf
        ]);
    }
};
/**
 * Will return a sha256 + ripemd160 hash of the serialized public key
 * @see https://github.com/bitcoin/bitcoin/blob/master/src/pubkey.h#L141
 * @returns {Buffer}
 */ $c83bf824e415d77e$var$PublicKey.prototype._getID = function _getID() {
    return $aScoK.sha256ripemd160(this.toBuffer());
};

/**
 * Will return an address for the public key
 *
 * @param {String|Network=} network - Which network should the address be for
 * @returns {Address} An address generated from the public key
 */ $c83bf824e415d77e$var$PublicKey.prototype.toAddress = function(network) {
    var Address = (parcelRequire("dOZs9"));
    return Address.fromPublicKey(this, network || this.network);
};
/**
 * Will output the PublicKey to a DER encoded hex string
 *
 * @returns {string} A DER hex encoded string
 */ $c83bf824e415d77e$var$PublicKey.prototype.toString = $c83bf824e415d77e$var$PublicKey.prototype.toHex = function() {
    return this.toDER().toString("hex");
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Public key
 */ $c83bf824e415d77e$var$PublicKey.prototype.inspect = function() {
    return "<PublicKey: " + this.toHex() + (this.compressed ? "" : ", uncompressed") + ">";
};
module.exports = $c83bf824e415d77e$var$PublicKey;

});
parcelRegister("aScoK", function(module, exports) {


if (process.browser) module.exports = (parcelRequire("5J4E8"));
else module.exports = (parcelRequire("jKXoM"));

});
parcelRegister("5J4E8", function(module, exports) {
"use strict";


var $e34gf = parcelRequire("e34gf");
var $42b4c2649ab23dcc$var$Hash = module.exports;
/**
 * A SHA or SHA1 hash, which is always 160 bits or 20 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/SHA-1
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha1 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return Buffer.from($fxX3C$hashjs.sha1().update(buf).digest("hex"), "hex");
};
$42b4c2649ab23dcc$var$Hash.sha1.blocksize = 512;
/**
 * A SHA256 hash, which is always 256 bits or 32 bytes long.
 *
 * See:
 * https://www.movable-type.co.uk/scripts/sha256.html
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha256 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return Buffer.from($fxX3C$hashjs.sha256().update(buf).digest("hex"), "hex");
};
$42b4c2649ab23dcc$var$Hash.sha256.blocksize = 512;
/**
 * A double SHA256 hash, which is always 256 bits or 32 bytes bytes long. This
 * hash function is commonly used inside Bitcoin, particularly for the hash of a
 * block and the hash of a transaction.
 *
 * See:
 * https://www.movable-type.co.uk/scripts/sha256.html
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha256sha256 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $42b4c2649ab23dcc$var$Hash.sha256($42b4c2649ab23dcc$var$Hash.sha256(buf));
};
/**
 * A RIPEMD160 hash, which is always 160 bits or 20 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/RIPEMD
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.ripemd160 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return Buffer.from($fxX3C$hashjs.ripemd160().update(buf).digest("hex"), "hex");
};
/**
 * A RIPEMD160 hash of a SHA256 hash, which is always 160 bits or 20 bytes long.
 * This value is commonly used inside Bitcoin, particularly for Bitcoin
 * addresses.
 *
 * See:
 * https://en.wikipedia.org/wiki/RIPEMD
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha256ripemd160 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $42b4c2649ab23dcc$var$Hash.ripemd160($42b4c2649ab23dcc$var$Hash.sha256(buf));
};
/**
 * A SHA512 hash, which is always 512 bits or 64 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/SHA-2
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha512 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return Buffer.from($fxX3C$hashjs.sha512().update(buf).digest("hex"), "hex");
};
$42b4c2649ab23dcc$var$Hash.sha512.blocksize = 1024;
/**
 * A way to do HMAC using any underlying hash function. If you ever find that
 * you want to hash two pieces of data together, you should use HMAC instead of
 * just using a hash function. Rather than doing hash(data1 + data2) you should
 * do HMAC(data1, data2). Actually, rather than use HMAC directly, we recommend
 * you use either sha256hmac or sha515hmac provided below.
 *
 * See:
 * https://en.wikipedia.org/wiki/Length_extension_attack
 * https://blog.skullsecurity.org/2012/everything-you-need-to-know-about-hash-length-extension-attacks
 *
 * @param {function} hashf Which hash function to use.
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.hmac = function(hashf, data, key) {
    // http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
    // http://tools.ietf.org/html/rfc4868#section-2
    $e34gf.checkArgument(Buffer.isBuffer(data));
    $e34gf.checkArgument(Buffer.isBuffer(key));
    $e34gf.checkArgument(hashf.blocksize);
    var blocksize = hashf.blocksize / 8;
    if (key.length > blocksize) key = hashf(key);
    else if (key < blocksize) {
        var fill = Buffer.alloc(blocksize);
        fill.fill(0);
        key.copy(fill);
        key = fill;
    }
    var oKey = Buffer.alloc(blocksize);
    oKey.fill(0x5c);
    var iKey = Buffer.alloc(blocksize);
    iKey.fill(0x36);
    var oKeyPad = Buffer.alloc(blocksize);
    var iKeyPad = Buffer.alloc(blocksize);
    for(var i = 0; i < blocksize; i++){
        oKeyPad[i] = oKey[i] ^ key[i];
        iKeyPad[i] = iKey[i] ^ key[i];
    }
    return hashf(Buffer.concat([
        oKeyPad,
        hashf(Buffer.concat([
            iKeyPad,
            data
        ]))
    ]));
};
/**
 * A SHA256 HMAC.
 *
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha256hmac = function(data, key) {
    return $42b4c2649ab23dcc$var$Hash.hmac($42b4c2649ab23dcc$var$Hash.sha256, data, key);
};
/**
 * A SHA512 HMAC.
 *
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $42b4c2649ab23dcc$var$Hash.sha512hmac = function(data, key) {
    return $42b4c2649ab23dcc$var$Hash.hmac($42b4c2649ab23dcc$var$Hash.sha512, data, key);
};

});

parcelRegister("jKXoM", function(module, exports) {
"use strict";


var $e34gf = parcelRequire("e34gf");
var $e620638ab511e0b2$var$Hash = module.exports;
/**
 * A SHA or SHA1 hash, which is always 160 bits or 20 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/SHA-1
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha1 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $fxX3C$crypto.createHash("sha1").update(buf).digest();
};
$e620638ab511e0b2$var$Hash.sha1.blocksize = 512;
/**
 * A SHA256 hash, which is always 256 bits or 32 bytes long.
 *
 * See:
 * https://www.movable-type.co.uk/scripts/sha256.html
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha256 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $fxX3C$crypto.createHash("sha256").update(buf).digest();
};
$e620638ab511e0b2$var$Hash.sha256.blocksize = 512;
/**
 * A double SHA256 hash, which is always 256 bits or 32 bytes bytes long. This
 * hash function is commonly used inside Bitcoin, particularly for the hash of a
 * block and the hash of a transaction.
 *
 * See:
 * https://www.movable-type.co.uk/scripts/sha256.html
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha256sha256 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $e620638ab511e0b2$var$Hash.sha256($e620638ab511e0b2$var$Hash.sha256(buf));
};
/**
 * A RIPEMD160 hash, which is always 160 bits or 20 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/RIPEMD
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.ripemd160 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $fxX3C$crypto.createHash("ripemd160").update(buf).digest();
};
/**
 * A RIPEMD160 hash of a SHA256 hash, which is always 160 bits or 20 bytes long.
 * This value is commonly used inside Bitcoin, particularly for Bitcoin
 * addresses.
 *
 * See:
 * https://en.wikipedia.org/wiki/RIPEMD
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha256ripemd160 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $e620638ab511e0b2$var$Hash.ripemd160($e620638ab511e0b2$var$Hash.sha256(buf));
};
/**
 * A SHA512 hash, which is always 512 bits or 64 bytes long.
 *
 * See:
 * https://en.wikipedia.org/wiki/SHA-2
 *
 * @param {Buffer} buf Data, a.k.a. pre-image, which can be any size.
 * @returns {Buffer} The hash in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha512 = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return $fxX3C$crypto.createHash("sha512").update(buf).digest();
};
$e620638ab511e0b2$var$Hash.sha512.blocksize = 1024;
/**
 * A way to do HMAC using any underlying hash function. If you ever find that
 * you want to hash two pieces of data together, you should use HMAC instead of
 * just using a hash function. Rather than doing hash(data1 + data2) you should
 * do HMAC(data1, data2). Actually, rather than use HMAC directly, we recommend
 * you use either sha256hmac or sha515hmac provided below.
 *
 * See:
 * https://en.wikipedia.org/wiki/Length_extension_attack
 * https://blog.skullsecurity.org/2012/everything-you-need-to-know-about-hash-length-extension-attacks
 *
 * @param {function} hashf Which hash function to use.
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.hmac = function(hashf, data, key) {
    // http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
    // http://tools.ietf.org/html/rfc4868#section-2
    $e34gf.checkArgument(Buffer.isBuffer(data));
    $e34gf.checkArgument(Buffer.isBuffer(key));
    $e34gf.checkArgument(hashf.blocksize);
    var blocksize = hashf.blocksize / 8;
    if (key.length > blocksize) key = hashf(key);
    else if (key < blocksize) {
        var fill = Buffer.alloc(blocksize);
        fill.fill(0);
        key.copy(fill);
        key = fill;
    }
    var oKey = Buffer.alloc(blocksize);
    oKey.fill(0x5c);
    var iKey = Buffer.alloc(blocksize);
    iKey.fill(0x36);
    var oKeyPad = Buffer.alloc(blocksize);
    var iKeyPad = Buffer.alloc(blocksize);
    for(var i = 0; i < blocksize; i++){
        oKeyPad[i] = oKey[i] ^ key[i];
        iKeyPad[i] = iKey[i] ^ key[i];
    }
    return hashf(Buffer.concat([
        oKeyPad,
        hashf(Buffer.concat([
            iKeyPad,
            data
        ]))
    ]));
};
/**
 * A SHA256 HMAC.
 *
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha256hmac = function(data, key) {
    return $e620638ab511e0b2$var$Hash.hmac($e620638ab511e0b2$var$Hash.sha256, data, key);
};
/**
 * A SHA512 HMAC.
 *
 * @param {Buffer} data Data, which can be any size.
 * @param {Buffer} key Key, which can be any size.
 * @returns {Buffer} The HMAC in the form of a buffer.
 */ $e620638ab511e0b2$var$Hash.sha512hmac = function(data, key) {
    return $e620638ab511e0b2$var$Hash.hmac($e620638ab511e0b2$var$Hash.sha512, data, key);
};

});


parcelRegister("92x2d", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $bbk3w = parcelRequire("bbk3w");
var $694decf9cb4039cc$var$networks = [];
var $694decf9cb4039cc$var$networkMaps = {};
/**
 * A network is merely a map containing values that correspond to version
 * numbers for each bitcoin network. Currently only supporting "livenet"
 * (a.k.a. "mainnet"), "testnet", "regtest" and "stn".
 * @constructor
 */ function $694decf9cb4039cc$var$Network() {}
$694decf9cb4039cc$var$Network.prototype.toString = function toString() {
    return this.name;
};
/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name matches
 * @return Network
 */ function $694decf9cb4039cc$var$get(arg, keys) {
    if (~$694decf9cb4039cc$var$networks.indexOf(arg)) return arg;
    if (keys) {
        if (!$iUxHD.isArray(keys)) keys = [
            keys
        ];
        for(var i = 0; i < $694decf9cb4039cc$var$networks.length; i++){
            var network = $694decf9cb4039cc$var$networks[i];
            var filteredNet = $iUxHD.pick(network, keys);
            var netValues = $iUxHD.values(filteredNet);
            if (~netValues.indexOf(arg)) return network;
        }
        return undefined;
    }
    return $694decf9cb4039cc$var$networkMaps[arg];
}
/***
 * Derives an array from the given cashAddrPrefix to be used in the computation
 * of the address' checksum.
 *
 * @param {string} cashAddrPrefix Network cashAddrPrefix. E.g.: 'bitcoincash'.
 */ function $694decf9cb4039cc$var$cashAddrPrefixToArray(cashAddrPrefix) {
    var result = [];
    for(var i = 0; i < cashAddrPrefix.length; i++)result.push(cashAddrPrefix.charCodeAt(i) & 31);
    return result;
}
/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash cashAddrPrefix
 * @param {Number} data.privatekey - The privatekey cashAddrPrefix
 * @param {Number} data.scripthash - The scripthash cashAddrPrefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */ function $694decf9cb4039cc$var$addNetwork(data) {
    var network = new $694decf9cb4039cc$var$Network();
    $bbk3w.defineImmutable(network, {
        name: data.name,
        alias: data.alias,
        pubkeyhash: data.pubkeyhash,
        privatekey: data.privatekey,
        scripthash: data.scripthash,
        xpubkey: data.xpubkey,
        xprivkey: data.xprivkey
    });
    var indexBy = data.indexBy || Object.keys(data);
    if (data.cashAddrPrefix) $iUxHD.extend(network, {
        cashAddrPrefix: data.cashAddrPrefix,
        cashAddrPrefixArray: $694decf9cb4039cc$var$cashAddrPrefixToArray(data.cashAddrPrefix)
    });
    if (data.networkMagic) $iUxHD.extend(network, {
        networkMagic: $bbk3w.integerAsBuffer(data.networkMagic)
    });
    if (data.port) $iUxHD.extend(network, {
        port: data.port
    });
    if (data.dnsSeeds) $iUxHD.extend(network, {
        dnsSeeds: data.dnsSeeds
    });
    $694decf9cb4039cc$var$networks.push(network);
    $694decf9cb4039cc$var$indexNetworkBy(network, indexBy);
    return network;
}
function $694decf9cb4039cc$var$indexNetworkBy(network, keys) {
    for(var i = 0; i < keys.length; i++){
        var key = keys[i];
        var networkValue = network[key];
        if (!$iUxHD.isUndefined(networkValue) && !$iUxHD.isObject(networkValue)) $694decf9cb4039cc$var$networkMaps[networkValue] = network;
    }
}
function $694decf9cb4039cc$var$unindexNetworkBy(network, values) {
    for(var index = 0; index < values.length; index++){
        var value = values[index];
        if ($694decf9cb4039cc$var$networkMaps[value] === network) delete $694decf9cb4039cc$var$networkMaps[value];
    }
}
/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */ function $694decf9cb4039cc$var$removeNetwork(network) {
    for(var i = 0; i < $694decf9cb4039cc$var$networks.length; i++)if ($694decf9cb4039cc$var$networks[i] === network) $694decf9cb4039cc$var$networks.splice(i, 1);
    $694decf9cb4039cc$var$unindexNetworkBy(network, Object.keys($694decf9cb4039cc$var$networkMaps));
}
var $694decf9cb4039cc$var$networkMagic = {
    livenet: 0xe3e1f3e8,
    testnet: 0xf4e5f3f4,
    regtest: 0xdab5bffa,
    stn: 0xfbcec4f9
};
var $694decf9cb4039cc$var$dnsSeeds = [
    "seed.bitcoinsv.org",
    "seed.bitcoinunlimited.info"
];
var $694decf9cb4039cc$var$TESTNET = {
    PORT: 18333,
    NETWORK_MAGIC: $694decf9cb4039cc$var$networkMagic.testnet,
    DNS_SEEDS: $694decf9cb4039cc$var$dnsSeeds,
    PREFIX: "testnet",
    CASHADDRPREFIX: "bchtest"
};
var $694decf9cb4039cc$var$REGTEST = {
    PORT: 18444,
    NETWORK_MAGIC: $694decf9cb4039cc$var$networkMagic.regtest,
    DNS_SEEDS: [],
    PREFIX: "regtest",
    CASHADDRPREFIX: "bchreg"
};
var $694decf9cb4039cc$var$STN = {
    PORT: 9333,
    NETWORK_MAGIC: $694decf9cb4039cc$var$networkMagic.stn,
    DNS_SEEDS: [
        "stn-seed.bitcoinsv.io"
    ],
    PREFIX: "stn",
    CASHADDRPREFIX: "bsvstn"
};
var $694decf9cb4039cc$var$liveNetwork = {
    name: "livenet",
    alias: "mainnet",
    prefix: "bitcoin",
    cashAddrPrefix: "bitcoincash",
    pubkeyhash: 0x00,
    privatekey: 0x80,
    scripthash: 0x05,
    xpubkey: 0x0488b21e,
    xprivkey: 0x0488ade4,
    networkMagic: $694decf9cb4039cc$var$networkMagic.livenet,
    port: 8333,
    dnsSeeds: $694decf9cb4039cc$var$dnsSeeds
};
// network magic, port, cashAddrPrefix, and dnsSeeds are overloaded by enableRegtest
var $694decf9cb4039cc$var$testNetwork = {
    name: "testnet",
    prefix: $694decf9cb4039cc$var$TESTNET.PREFIX,
    cashAddrPrefix: $694decf9cb4039cc$var$TESTNET.CASHADDRPREFIX,
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: $694decf9cb4039cc$var$TESTNET.NETWORK_MAGIC
};
var $694decf9cb4039cc$var$regtestNetwork = {
    name: "regtest",
    prefix: $694decf9cb4039cc$var$REGTEST.PREFIX,
    cashAddrPrefix: $694decf9cb4039cc$var$REGTEST.CASHADDRPREFIX,
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: $694decf9cb4039cc$var$REGTEST.NETWORK_MAGIC,
    port: $694decf9cb4039cc$var$REGTEST.PORT,
    dnsSeeds: [],
    indexBy: [
        "port",
        "name",
        "cashAddrPrefix",
        "networkMagic"
    ]
};
var $694decf9cb4039cc$var$stnNetwork = {
    name: "stn",
    prefix: $694decf9cb4039cc$var$STN.PREFIX,
    cashAddrPrefix: $694decf9cb4039cc$var$STN.CASHADDRPREFIX,
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: $694decf9cb4039cc$var$STN.NETWORK_MAGIC,
    indexBy: [
        "port",
        "name",
        "cashAddrPrefix",
        "networkMagic"
    ]
};
// Add configurable values for testnet/regtest
$694decf9cb4039cc$var$addNetwork($694decf9cb4039cc$var$testNetwork);
$694decf9cb4039cc$var$addNetwork($694decf9cb4039cc$var$stnNetwork);
$694decf9cb4039cc$var$addNetwork($694decf9cb4039cc$var$regtestNetwork);
$694decf9cb4039cc$var$addNetwork($694decf9cb4039cc$var$liveNetwork);
var $694decf9cb4039cc$var$livenet = $694decf9cb4039cc$var$get("livenet");
var $694decf9cb4039cc$var$regtest = $694decf9cb4039cc$var$get("regtest");
var $694decf9cb4039cc$var$testnet = $694decf9cb4039cc$var$get("testnet");
var $694decf9cb4039cc$var$stn = $694decf9cb4039cc$var$get("stn");
Object.defineProperty($694decf9cb4039cc$var$testnet, "port", {
    enumerable: true,
    configurable: false,
    get: function() {
        if (this.regtestEnabled) return $694decf9cb4039cc$var$REGTEST.PORT;
        else if (this.stnEnabled) return $694decf9cb4039cc$var$STN.PORT;
        else return $694decf9cb4039cc$var$TESTNET.PORT;
    }
});
Object.defineProperty($694decf9cb4039cc$var$testnet, "networkMagic", {
    enumerable: true,
    configurable: false,
    get: function() {
        if (this.regtestEnabled) return $bbk3w.integerAsBuffer($694decf9cb4039cc$var$REGTEST.NETWORK_MAGIC);
        else if (this.stnEnabled) return $bbk3w.integerAsBuffer($694decf9cb4039cc$var$STN.NETWORK_MAGIC);
        else return $bbk3w.integerAsBuffer($694decf9cb4039cc$var$TESTNET.NETWORK_MAGIC);
    }
});
Object.defineProperty($694decf9cb4039cc$var$testnet, "dnsSeeds", {
    enumerable: true,
    configurable: false,
    get: function() {
        if (this.regtestEnabled) return $694decf9cb4039cc$var$REGTEST.DNS_SEEDS;
        else if (this.stnEnabled) return $694decf9cb4039cc$var$STN.DNS_SEEDS;
        else return $694decf9cb4039cc$var$TESTNET.DNS_SEEDS;
    }
});
Object.defineProperty($694decf9cb4039cc$var$testnet, "cashAddrPrefix", {
    enumerable: true,
    configurable: false,
    get: function() {
        if (this.regtestEnabled) return $694decf9cb4039cc$var$REGTEST.CASHADDRPREFIX;
        else if (this.stnEnabled) return $694decf9cb4039cc$var$STN.CASHADDRPREFIX;
        else return $694decf9cb4039cc$var$TESTNET.CASHADDRPREFIX;
    }
});
Object.defineProperty($694decf9cb4039cc$var$testnet, "cashAddrPrefixArray", {
    enumerable: true,
    configurable: false,
    get: function() {
        if (this.regtestEnabled) return $694decf9cb4039cc$var$cashAddrPrefixToArray($694decf9cb4039cc$var$REGTEST.CASHADDRPREFIX);
        else if (this.stnEnabled) return $694decf9cb4039cc$var$STN.cashAddrPrefixToArray($694decf9cb4039cc$var$STN.CASHADDRPREFIX);
        else return $694decf9cb4039cc$var$cashAddrPrefixToArray($694decf9cb4039cc$var$TESTNET.CASHADDRPREFIX);
    }
});
/**
 * @function
 * @member Networks#enableRegtest
 * Will enable regtest features for testnet
 */ function $694decf9cb4039cc$var$enableRegtest() {
    $694decf9cb4039cc$var$testnet.regtestEnabled = true;
}
/**
 * @function
 * @member Networks#disableRegtest
 * Will disable regtest features for testnet
 */ function $694decf9cb4039cc$var$disableRegtest() {
    $694decf9cb4039cc$var$testnet.regtestEnabled = false;
}
/**
 * @function
 * @member Networks#enableStn
 * Will enable stn features for testnet
 */ function $694decf9cb4039cc$var$enableStn() {
    $694decf9cb4039cc$var$testnet.stnEnabled = true;
}
/**
 * @function
 * @member Networks#disableStn
 * Will disable stn features for testnet
 */ function $694decf9cb4039cc$var$disableStn() {
    $694decf9cb4039cc$var$testnet.stnEnabled = false;
}
/**
 * @namespace Networks
 */ module.exports = {
    add: $694decf9cb4039cc$var$addNetwork,
    remove: $694decf9cb4039cc$var$removeNetwork,
    defaultNetwork: $694decf9cb4039cc$var$livenet,
    livenet: $694decf9cb4039cc$var$livenet,
    mainnet: $694decf9cb4039cc$var$livenet,
    testnet: $694decf9cb4039cc$var$testnet,
    regtest: $694decf9cb4039cc$var$regtest,
    stn: $694decf9cb4039cc$var$stn,
    get: $694decf9cb4039cc$var$get,
    enableRegtest: $694decf9cb4039cc$var$enableRegtest,
    disableRegtest: $694decf9cb4039cc$var$disableRegtest,
    enableStn: $694decf9cb4039cc$var$enableStn,
    disableStn: $694decf9cb4039cc$var$disableStn
};

});

parcelRegister("eB3ON", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $dOZs9 = parcelRequire("dOZs9");

var $9AjNa = parcelRequire("9AjNa");

var $lM2TS = parcelRequire("lM2TS");

var $bbk3w = parcelRequire("bbk3w");

var $92x2d = parcelRequire("92x2d");

var $japbZ = parcelRequire("japbZ");

var $hbQdz = parcelRequire("hbQdz");

var $b3rcQ = parcelRequire("b3rcQ");

var $e34gf = parcelRequire("e34gf");
/**
 * Instantiate a PrivateKey from a BN, Buffer or WIF string.
 *
 * @param {string} data - The encoded data in various formats
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {PrivateKey} A new valid instance of an PrivateKey
 * @constructor
 */ function $aa077b9a3a0dcdd7$var$PrivateKey(data, network) {
    if (!(this instanceof $aa077b9a3a0dcdd7$var$PrivateKey)) return new $aa077b9a3a0dcdd7$var$PrivateKey(data, network);
    if (data instanceof $aa077b9a3a0dcdd7$var$PrivateKey) return data;
    var info = this._classifyArguments(data, network);
    // validation
    if (!info.bn || info.bn.cmp(new $lM2TS(0)) === 0) throw new TypeError("Number can not be equal to zero, undefined, null or false");
    if (!info.bn.lt($japbZ.getN())) throw new TypeError("Number must be less than N");
    if (typeof info.network === "undefined") throw new TypeError('Must specify the network ("livenet" or "testnet")');
    $bbk3w.defineImmutable(this, {
        bn: info.bn,
        compressed: info.compressed,
        network: info.network
    });
    Object.defineProperty(this, "publicKey", {
        configurable: false,
        enumerable: true,
        get: this.toPublicKey.bind(this)
    });
    return this;
}
/**
 * Internal helper to instantiate PrivateKey internal `info` object from
 * different kinds of arguments passed to the constructor.
 *
 * @param {*} data
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @return {Object}
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype._classifyArguments = function(data, network) {
    var info = {
        compressed: true,
        network: network ? $92x2d.get(network) : $92x2d.defaultNetwork
    };
    // detect type of data
    if ($iUxHD.isUndefined(data) || $iUxHD.isNull(data)) info.bn = $aa077b9a3a0dcdd7$var$PrivateKey._getRandomBN();
    else if (data instanceof $lM2TS) info.bn = data;
    else if (data instanceof Buffer || data instanceof Uint8Array) info = $aa077b9a3a0dcdd7$var$PrivateKey._transformBuffer(data, network);
    else if (data.bn && data.network) info = $aa077b9a3a0dcdd7$var$PrivateKey._transformObject(data);
    else if (!network && $92x2d.get(data)) {
        info.bn = $aa077b9a3a0dcdd7$var$PrivateKey._getRandomBN();
        info.network = $92x2d.get(data);
    } else if (typeof data === "string") {
        if ($bbk3w.isHexa(data)) info.bn = new $lM2TS(Buffer.from(data, "hex"));
        else info = $aa077b9a3a0dcdd7$var$PrivateKey._transformWIF(data, network);
    } else throw new TypeError("First argument is an unrecognized data type.");
    return info;
};
/**
 * Internal function to get a random Big Number (BN)
 *
 * @returns {BN} A new randomly generated BN
 * @private
 */ $aa077b9a3a0dcdd7$var$PrivateKey._getRandomBN = function() {
    var condition;
    var bn;
    do {
        var privbuf = $b3rcQ.getRandomBuffer(32);
        bn = $lM2TS.fromBuffer(privbuf);
        condition = bn.lt($japbZ.getN());
    }while (!condition);
    return bn;
};
/**
 * Internal function to transform a WIF Buffer into a private key
 *
 * @param {Buffer} buf - An WIF string
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */ $aa077b9a3a0dcdd7$var$PrivateKey._transformBuffer = function(buf, network) {
    var info = {};
    if (buf.length === 32) return $aa077b9a3a0dcdd7$var$PrivateKey._transformBNBuffer(buf, network);
    info.network = $92x2d.get(buf[0], "privatekey");
    if (!info.network) throw new Error("Invalid network");
    if (network && info.network !== $92x2d.get(network)) throw new TypeError("Private key network mismatch");
    if (buf.length === 34 && buf[33] === 1) info.compressed = true;
    else if (buf.length === 33) info.compressed = false;
    else throw new Error("Length of buffer must be 33 (uncompressed) or 34 (compressed)");
    info.bn = $lM2TS.fromBuffer(buf.slice(1, 33));
    return info;
};
/**
 * Internal function to transform a BN buffer into a private key
 *
 * @param {Buffer} buf
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {object} an Object with keys: bn, network, and compressed
 * @private
 */ $aa077b9a3a0dcdd7$var$PrivateKey._transformBNBuffer = function(buf, network) {
    var info = {};
    info.network = $92x2d.get(network) || $92x2d.defaultNetwork;
    info.bn = $lM2TS.fromBuffer(buf);
    info.compressed = false;
    return info;
};
/**
 * Internal function to transform a WIF string into a private key
 *
 * @param {string} buf - An WIF string
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */ $aa077b9a3a0dcdd7$var$PrivateKey._transformWIF = function(str, network) {
    return $aa077b9a3a0dcdd7$var$PrivateKey._transformBuffer($9AjNa.decode(str), network);
};
/**
 * Instantiate a PrivateKey from a Buffer with the DER or WIF representation
 *
 * @param {Buffer} buf
 * @param {Network} network
 * @return {PrivateKey}
 */ $aa077b9a3a0dcdd7$var$PrivateKey.fromBuffer = function(buf, network) {
    return new $aa077b9a3a0dcdd7$var$PrivateKey(buf, network);
};
$aa077b9a3a0dcdd7$var$PrivateKey.fromHex = function(hex, network) {
    return $aa077b9a3a0dcdd7$var$PrivateKey.fromBuffer(Buffer.from(hex, "hex"), network);
};
/**
 * Internal function to transform a JSON string on plain object into a private key
 * return this.
 *
 * @param {string} json - A JSON string or plain object
 * @returns {Object} An object with keys: bn, network and compressed
 * @private
 */ $aa077b9a3a0dcdd7$var$PrivateKey._transformObject = function(json) {
    var bn = new $lM2TS(json.bn, "hex");
    var network = $92x2d.get(json.network);
    return {
        bn: bn,
        network: network,
        compressed: json.compressed
    };
};
/**
 * Instantiate a PrivateKey from a WIF string
 *
 * @param {string} str - The WIF encoded private key string
 * @returns {PrivateKey} A new valid instance of PrivateKey
 */ $aa077b9a3a0dcdd7$var$PrivateKey.fromString = $aa077b9a3a0dcdd7$var$PrivateKey.fromWIF = function(str) {
    $e34gf.checkArgument($iUxHD.isString(str), "First argument is expected to be a string.");
    return new $aa077b9a3a0dcdd7$var$PrivateKey(str);
};
/**
 * Instantiate a PrivateKey from a plain JavaScript object
 *
 * @param {Object} obj - The output from privateKey.toObject()
 */ $aa077b9a3a0dcdd7$var$PrivateKey.fromObject = $aa077b9a3a0dcdd7$var$PrivateKey.fromJSON = function(obj) {
    $e34gf.checkArgument($iUxHD.isObject(obj), "First argument is expected to be an object.");
    return new $aa077b9a3a0dcdd7$var$PrivateKey(obj);
};
/**
 * Instantiate a PrivateKey from random bytes
 *
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {PrivateKey} A new valid instance of PrivateKey
 */ $aa077b9a3a0dcdd7$var$PrivateKey.fromRandom = function(network) {
    var bn = $aa077b9a3a0dcdd7$var$PrivateKey._getRandomBN();
    return new $aa077b9a3a0dcdd7$var$PrivateKey(bn, network);
};
/**
 * Check if there would be any errors when initializing a PrivateKey
 *
 * @param {string} data - The encoded data in various formats
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {null|Error} An error if exists
 */ $aa077b9a3a0dcdd7$var$PrivateKey.getValidationError = function(data, network) {
    var error;
    try {
        new $aa077b9a3a0dcdd7$var$PrivateKey(data, network) // eslint-disable-line
        ;
    } catch (e) {
        error = e;
    }
    return error;
};
/**
 * Check if the parameters are valid
 *
 * @param {string} data - The encoded data in various formats
 * @param {string=} network - Either "livenet" or "testnet"
 * @returns {Boolean} If the private key is would be valid
 */ $aa077b9a3a0dcdd7$var$PrivateKey.isValid = function(data, network) {
    if (!data) return false;
    return !$aa077b9a3a0dcdd7$var$PrivateKey.getValidationError(data, network);
};
/**
 * Will output the PrivateKey in WIF
 *
 * @returns {string}
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toString = function() {
    return this.toWIF();
};
/**
 * Will output the PrivateKey to a WIF string
 *
 * @returns {string} A WIP representation of the private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toWIF = function() {
    var network = this.network;
    var compressed = this.compressed;
    var buf;
    if (compressed) buf = Buffer.concat([
        Buffer.from([
            network.privatekey
        ]),
        this.bn.toBuffer({
            size: 32
        }),
        Buffer.from([
            0x01
        ])
    ]);
    else buf = Buffer.concat([
        Buffer.from([
            network.privatekey
        ]),
        this.bn.toBuffer({
            size: 32
        })
    ]);
    return $9AjNa.encode(buf);
};
/**
 * Will return the private key as a BN instance
 *
 * @returns {BN} A BN instance of the private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toBigNumber = function() {
    return this.bn;
};
/**
 * Will return the private key as a BN buffer
 *
 * @returns {Buffer} A buffer of the private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toBuffer = function() {
    return this.bn.toBuffer({
        size: 32
    });
};
$aa077b9a3a0dcdd7$var$PrivateKey.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
/**
 * Will return the corresponding public key
 *
 * @returns {PublicKey} A public key generated from the private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toPublicKey = function() {
    if (!this._pubkey) this._pubkey = $hbQdz.fromPrivateKey(this);
    return this._pubkey;
};
/**
 * Will return an address for the private key
 * @param {Network=} network - optional parameter specifying
 * the desired network for the address
 *
 * @returns {Address} An address generated from the private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toAddress = function(network) {
    var pubkey = this.toPublicKey();
    return $dOZs9.fromPublicKey(pubkey, network || this.network);
};
/**
 * @returns {Object} A plain object representation
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toObject = $aa077b9a3a0dcdd7$var$PrivateKey.prototype.toJSON = function toObject() {
    return {
        bn: this.bn.toString("hex"),
        compressed: this.compressed,
        network: this.network.toString()
    };
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Private key
 */ $aa077b9a3a0dcdd7$var$PrivateKey.prototype.inspect = function() {
    var uncompressed = !this.compressed ? ", uncompressed" : "";
    return "<PrivateKey: " + this.toHex() + ", network: " + this.network + uncompressed + ">";
};
module.exports = $aa077b9a3a0dcdd7$var$PrivateKey;

});
parcelRegister("dOZs9", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lOQ1c = parcelRequire("lOQ1c");

var $9AjNa = parcelRequire("9AjNa");

var $92x2d = parcelRequire("92x2d");

var $aScoK = parcelRequire("aScoK");

var $bbk3w = parcelRequire("bbk3w");

var $hbQdz = parcelRequire("hbQdz");
/**
 * Instantiate an address from an address String or Buffer, a public key or script hash Buffer,
 * or an instance of {@link PublicKey} or {@link Script}.
 *
 * This is an immutable class, and if the first parameter provided to this constructor is an
 * `Address` instance, the same argument will be returned.
 *
 * An address has two key properties: `network` and `type`. The type is either
 * `Address.PayToPublicKeyHash` (value is the `'pubkeyhash'` string)
 * or `Address.PayToScriptHash` (the string `'scripthash'`). The network is an instance of {@link Network}.
 * You can quickly check whether an address is of a given kind by using the methods
 * `isPayToPublicKeyHash` and `isPayToScriptHash`
 *
 * @example
 * ```javascript
 * // validate that an input field is valid
 * var error = Address.getValidationError(input, 'testnet');
 * if (!error) {
 *   var address = Address(input, 'testnet');
 * } else {
 *   // invalid network or checksum (typo?)
 *   var message = error.messsage;
 * }
 *
 * // get an address from a public key
 * var address = Address(publicKey, 'testnet').toString();
 * ```
 *
 * @param {*} data - The encoded data in various formats
 * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 * @constructor
 */ function $a0ff9d29b009ccd9$var$Address(data, network, type) {
    if (!(this instanceof $a0ff9d29b009ccd9$var$Address)) return new $a0ff9d29b009ccd9$var$Address(data, network, type);
    if ($iUxHD.isArray(data) && $iUxHD.isNumber(network)) return $a0ff9d29b009ccd9$var$Address.createMultisig(data, network, type);
    if (data instanceof $a0ff9d29b009ccd9$var$Address) // Immutable instance
    return data;
    $e34gf.checkArgument(data, "First argument is required, please include address data.", "guide/address.html");
    if (network && !$92x2d.get(network)) throw new TypeError('Second argument must be "livenet", "testnet", or "regtest".');
    if (type && type !== $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash && type !== $a0ff9d29b009ccd9$var$Address.PayToScriptHash) throw new TypeError('Third argument must be "pubkeyhash" or "scripthash".');
    var info = this._classifyArguments(data, network, type);
    // set defaults if not set
    info.network = info.network || $92x2d.get(network) || $92x2d.defaultNetwork;
    info.type = info.type || type || $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash;
    $bbk3w.defineImmutable(this, {
        hashBuffer: info.hashBuffer,
        network: info.network,
        type: info.type
    });
    return this;
}

/**
 * Internal function used to split different kinds of arguments of the constructor
 * @param {*} data - The encoded data in various formats
 * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Object} An "info" object with "type", "network", and "hashBuffer"
 */ $a0ff9d29b009ccd9$var$Address.prototype._classifyArguments = function(data, network, type) {
    var Script = (parcelRequire("3LdBG"));
    // transform and validate input data
    if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 20) return $a0ff9d29b009ccd9$var$Address._transformHash(data);
    else if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 21) return $a0ff9d29b009ccd9$var$Address._transformBuffer(data, network, type);
    else if (data instanceof $hbQdz) return $a0ff9d29b009ccd9$var$Address._transformPublicKey(data);
    else if (data instanceof Script) return $a0ff9d29b009ccd9$var$Address._transformScript(data, network);
    else if (typeof data === "string") return $a0ff9d29b009ccd9$var$Address._transformString(data, network, type);
    else if ($iUxHD.isObject(data)) return $a0ff9d29b009ccd9$var$Address._transformObject(data);
    else throw new TypeError("First argument is an unrecognized data format.");
};
/** @static */ $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash = "pubkeyhash";
/** @static */ $a0ff9d29b009ccd9$var$Address.PayToScriptHash = "scripthash";
/**
 * @param {Buffer} hash - An instance of a hash Buffer
 * @returns {Object} An object with keys: hashBuffer
 * @private
 */ $a0ff9d29b009ccd9$var$Address._transformHash = function(hash) {
    var info = {};
    if (!(hash instanceof Buffer) && !(hash instanceof Uint8Array)) throw new TypeError("Address supplied is not a buffer.");
    if (hash.length !== 20) throw new TypeError("Address hashbuffers must be exactly 20 bytes.");
    info.hashBuffer = hash;
    return info;
};
/**
 * Deserializes an address serialized through `Address#toObject()`
 * @param {Object} data
 * @param {string} data.hash - the hash that this address encodes
 * @param {string} data.type - either 'pubkeyhash' or 'scripthash'
 * @param {Network=} data.network - the name of the network associated
 * @return {Address}
 */ $a0ff9d29b009ccd9$var$Address._transformObject = function(data) {
    $e34gf.checkArgument(data.hash || data.hashBuffer, "Must provide a `hash` or `hashBuffer` property");
    $e34gf.checkArgument(data.type, "Must provide a `type` property");
    return {
        hashBuffer: data.hash ? Buffer.from(data.hash, "hex") : data.hashBuffer,
        network: $92x2d.get(data.network) || $92x2d.defaultNetwork,
        type: data.type
    };
};
/**
 * Internal function to discover the network and type based on the first data byte
 *
 * @param {Buffer} buffer - An instance of a hex encoded address Buffer
 * @returns {Object} An object with keys: network and type
 * @private
 */ $a0ff9d29b009ccd9$var$Address._classifyFromVersion = function(buffer) {
    var version = {};
    var pubkeyhashNetwork = $92x2d.get(buffer[0], "pubkeyhash");
    var scripthashNetwork = $92x2d.get(buffer[0], "scripthash");
    if (pubkeyhashNetwork) {
        version.network = pubkeyhashNetwork;
        version.type = $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash;
    } else if (scripthashNetwork) {
        version.network = scripthashNetwork;
        version.type = $a0ff9d29b009ccd9$var$Address.PayToScriptHash;
    }
    return version;
};
/**
 * Internal function to transform a bitcoin address buffer
 *
 * @param {Buffer} buffer - An instance of a hex encoded address Buffer
 * @param {string=} network - The network: 'livenet' or 'testnet'
 * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
 * @returns {Object} An object with keys: hashBuffer, network and type
 * @private
 */ $a0ff9d29b009ccd9$var$Address._transformBuffer = function(buffer, network, type) {
    var info = {};
    if (!(buffer instanceof Buffer) && !(buffer instanceof Uint8Array)) throw new TypeError("Address supplied is not a buffer.");
    if (buffer.length !== 21) throw new TypeError("Address buffers must be exactly 21 bytes.");
    var networkObj = $92x2d.get(network);
    var bufferVersion = $a0ff9d29b009ccd9$var$Address._classifyFromVersion(buffer);
    if (network && !networkObj) throw new TypeError("Unknown network");
    if (!bufferVersion.network || networkObj && networkObj !== bufferVersion.network) // console.log(bufferVersion)
    throw new TypeError("Address has mismatched network type.");
    if (!bufferVersion.type || type && type !== bufferVersion.type) throw new TypeError("Address has mismatched type.");
    info.hashBuffer = buffer.slice(1);
    info.network = bufferVersion.network;
    info.type = bufferVersion.type;
    return info;
};
/**
 * Internal function to transform a {@link PublicKey}
 *
 * @param {PublicKey} pubkey - An instance of PublicKey
 * @returns {Object} An object with keys: hashBuffer, type
 * @private
 */ $a0ff9d29b009ccd9$var$Address._transformPublicKey = function(pubkey) {
    var info = {};
    if (!(pubkey instanceof $hbQdz)) throw new TypeError("Address must be an instance of PublicKey.");
    info.hashBuffer = $aScoK.sha256ripemd160(pubkey.toBuffer());
    info.type = $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash;
    return info;
};

/**
 * Internal function to transform a {@link Script} into a `info` object.
 *
 * @param {Script} script - An instance of Script
 * @returns {Object} An object with keys: hashBuffer, type
 * @private
 */ $a0ff9d29b009ccd9$var$Address._transformScript = function(script, network) {
    var Script = (parcelRequire("3LdBG"));
    $e34gf.checkArgument(script instanceof Script, "script must be a Script instance");
    var info = script.getAddressInfo(network);
    if (!info) throw new $lOQ1c.Script.CantDeriveAddress(script);
    return info;
};

/**
 * Creates a P2SH address from a set of public keys and a threshold.
 *
 * The addresses will be sorted lexicographically, as that is the trend in bitcoin.
 * To create an address from unsorted public keys, use the {@link Script#buildMultisigOut}
 * interface.
 *
 * @param {Array} publicKeys - a set of public keys to create an address
 * @param {number} threshold - the number of signatures needed to release the funds
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @return {Address}
 */ $a0ff9d29b009ccd9$var$Address.createMultisig = function(publicKeys, threshold, network) {
    var Script = (parcelRequire("3LdBG"));
    network = network || publicKeys[0].network || $92x2d.defaultNetwork;
    return $a0ff9d29b009ccd9$var$Address.payingTo(Script.buildMultisigOut(publicKeys, threshold), network);
};
/**
 * Internal function to transform a bitcoin cash address string
 *
 * @param {string} data
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
 * @returns {Object} An object with keys: hashBuffer, network and type
 * @private
 */ $a0ff9d29b009ccd9$var$Address._transformString = function(data, network, type) {
    if (typeof data !== "string") throw new TypeError("data parameter supplied is not a string.");
    if (data.length < 27) throw new Error("Invalid Address string provided");
    data = data.trim();
    var networkObj = $92x2d.get(network);
    if (network && !networkObj) throw new TypeError("Unknown network");
    var addressBuffer = $9AjNa.decode(data);
    return $a0ff9d29b009ccd9$var$Address._transformBuffer(addressBuffer, network, type);
};
/**
 * Instantiate an address from a PublicKey instance
 *
 * @param {PublicKey} data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromPublicKey = function(data, network) {
    var info = $a0ff9d29b009ccd9$var$Address._transformPublicKey(data);
    network = network || $92x2d.defaultNetwork;
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, network, info.type);
};
/**
 * Instantiate an address from a PrivateKey instance
 *
 * @param {PrivateKey} privateKey
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromPrivateKey = function(privateKey, network) {
    let publicKey = $hbQdz.fromPrivateKey(privateKey);
    network = network || privateKey.network || $92x2d.defaultNetwork;
    return $a0ff9d29b009ccd9$var$Address.fromPublicKey(publicKey, network);
};
/**
 * Instantiate an address from a ripemd160 public key hash
 *
 * @param {Buffer} hash - An instance of buffer of the hash
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromPublicKeyHash = function(hash, network) {
    var info = $a0ff9d29b009ccd9$var$Address._transformHash(hash);
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, network, $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash);
};
/**
 * Instantiate an address from a ripemd160 script hash
 *
 * @param {Buffer} hash - An instance of buffer of the hash
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromScriptHash = function(hash, network) {
    $e34gf.checkArgument(hash, "hash parameter is required");
    var info = $a0ff9d29b009ccd9$var$Address._transformHash(hash);
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, network, $a0ff9d29b009ccd9$var$Address.PayToScriptHash);
};

/**
 * Builds a p2sh address paying to script. This will hash the script and
 * use that to create the address.
 * If you want to extract an address associated with a script instead,
 * see {{Address#fromScript}}
 *
 * @param {Script} script - An instance of Script
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.payingTo = function(script, network) {
    var Script = (parcelRequire("3LdBG"));
    $e34gf.checkArgument(script, "script is required");
    $e34gf.checkArgument(script instanceof Script, "script must be instance of Script");
    return $a0ff9d29b009ccd9$var$Address.fromScriptHash($aScoK.sha256ripemd160(script.toBuffer()), network);
};

/**
 * Extract address from a Script. The script must be of one
 * of the following types: p2pkh input, p2pkh output, p2sh input
 * or p2sh output.
 * This will analyze the script and extract address information from it.
 * If you want to transform any script to a p2sh Address paying
 * to that script's hash instead, use {{Address#payingTo}}
 *
 * @param {Script} script - An instance of Script
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromScript = function(script, network) {
    var Script = (parcelRequire("3LdBG"));
    $e34gf.checkArgument(script instanceof Script, "script must be a Script instance");
    var info = $a0ff9d29b009ccd9$var$Address._transformScript(script, network);
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, network, info.type);
};
/**
 * Instantiate an address from a buffer of the address
 *
 * @param {Buffer} buffer - An instance of buffer of the address
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromBuffer = function(buffer, network, type) {
    var info = $a0ff9d29b009ccd9$var$Address._transformBuffer(buffer, network, type);
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, info.network, info.type);
};
$a0ff9d29b009ccd9$var$Address.fromHex = function(hex, network, type) {
    return $a0ff9d29b009ccd9$var$Address.fromBuffer(Buffer.from(hex, "hex"), network, type);
};
/**
 * Instantiate an address from an address string
 *
 * @param {string} str - An string of the bitcoin address
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromString = function(str, network, type) {
    var info = $a0ff9d29b009ccd9$var$Address._transformString(str, network, type);
    return new $a0ff9d29b009ccd9$var$Address(info.hashBuffer, info.network, info.type);
};
/**
 * Instantiate an address from an Object
 *
 * @param {string} json - An JSON string or Object with keys: hash, network and type
 * @returns {Address} A new valid instance of an Address
 */ $a0ff9d29b009ccd9$var$Address.fromObject = function fromObject(obj) {
    $e34gf.checkState($bbk3w.isHexa(obj.hash), 'Unexpected hash property, "' + obj.hash + '", expected to be hex.');
    var hashBuffer = Buffer.from(obj.hash, "hex");
    return new $a0ff9d29b009ccd9$var$Address(hashBuffer, obj.network, obj.type);
};
/**
 * Will return a validation error if exists
 *
 * @example
 * ```javascript
 * // a network mismatch error
 * var error = Address.getValidationError('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'testnet');
 * ```
 *
 * @param {string} data - The encoded data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string} type - The type of address: 'script' or 'pubkey'
 * @returns {null|Error} The corresponding error message
 */ $a0ff9d29b009ccd9$var$Address.getValidationError = function(data, network, type) {
    var error;
    try {
        new $a0ff9d29b009ccd9$var$Address(data, network, type) // eslint-disable-line
        ;
    } catch (e) {
        error = e;
    }
    return error;
};
/**
 * Will return a boolean if an address is valid
 *
 * @example
 * ```javascript
 * assert(Address.isValid('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'livenet'));
 * ```
 *
 * @param {string} data - The encoded data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string} type - The type of address: 'script' or 'pubkey'
 * @returns {boolean} The corresponding error message
 */ $a0ff9d29b009ccd9$var$Address.isValid = function(data, network, type) {
    return !$a0ff9d29b009ccd9$var$Address.getValidationError(data, network, type);
};
/**
 * Returns true if an address is of pay to public key hash type
 * @return boolean
 */ $a0ff9d29b009ccd9$var$Address.prototype.isPayToPublicKeyHash = function() {
    return this.type === $a0ff9d29b009ccd9$var$Address.PayToPublicKeyHash;
};
/**
 * Returns true if an address is of pay to script hash type
 * @return boolean
 */ $a0ff9d29b009ccd9$var$Address.prototype.isPayToScriptHash = function() {
    return this.type === $a0ff9d29b009ccd9$var$Address.PayToScriptHash;
};
/**
 * Will return a buffer representation of the address
 *
 * @returns {Buffer} Bitcoin address buffer
 */ $a0ff9d29b009ccd9$var$Address.prototype.toBuffer = function() {
    var version = Buffer.from([
        this.network[this.type]
    ]);
    var buf = Buffer.concat([
        version,
        this.hashBuffer
    ]);
    return buf;
};
$a0ff9d29b009ccd9$var$Address.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
/**
 * @returns {Object} A plain object with the address information
 */ $a0ff9d29b009ccd9$var$Address.prototype.toObject = $a0ff9d29b009ccd9$var$Address.prototype.toJSON = function toObject() {
    return {
        hash: this.hashBuffer.toString("hex"),
        type: this.type,
        network: this.network.toString()
    };
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Bitcoin address
 */ $a0ff9d29b009ccd9$var$Address.prototype.inspect = function() {
    return "<Address: " + this.toString() + ", type: " + this.type + ", network: " + this.network + ">";
};
/**
 * Will return a the base58 string representation of the address
 *
 * @returns {string} Bitcoin address
 */ $a0ff9d29b009ccd9$var$Address.prototype.toString = function() {
    return $9AjNa.encode(this.toBuffer());
};
module.exports = $a0ff9d29b009ccd9$var$Address;

});
parcelRegister("9AjNa", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $6BAsE = parcelRequire("6BAsE");

var $aScoK = parcelRequire("aScoK");
var $6fa6d4241424ae1a$require$sha256sha256 = $aScoK.sha256sha256;
/**
 * A Base58check object can encode/decodd Base 58, which is used primarily for
 * string-formatted Bitcoin addresses and private keys. This is the same as
 * Base58, except that it includes a checksum to prevent accidental mistypings.
 *
 * @param {object} obj Can be a string or buffer.
 */ var $6fa6d4241424ae1a$var$Base58Check = function Base58Check(obj) {
    if (!(this instanceof Base58Check)) return new Base58Check(obj);
    if (Buffer.isBuffer(obj)) {
        var buf = obj;
        this.fromBuffer(buf);
    } else if (typeof obj === "string") {
        var str = obj;
        this.fromString(str);
    }
};
$6fa6d4241424ae1a$var$Base58Check.prototype.set = function(obj) {
    this.buf = obj.buf || this.buf || undefined;
    return this;
};
$6fa6d4241424ae1a$var$Base58Check.validChecksum = function validChecksum(data, checksum) {
    if ($iUxHD.isString(data)) data = Buffer.from($6BAsE.decode(data));
    if ($iUxHD.isString(checksum)) checksum = Buffer.from($6BAsE.decode(checksum));
    if (!checksum) {
        checksum = data.slice(-4);
        data = data.slice(0, -4);
    }
    return $6fa6d4241424ae1a$var$Base58Check.checksum(data).toString("hex") === checksum.toString("hex");
};
$6fa6d4241424ae1a$var$Base58Check.decode = function(s) {
    if (typeof s !== "string") throw new Error("Input must be a string");
    var buf = Buffer.from($6BAsE.decode(s));
    if (buf.length < 4) throw new Error("Input string too short");
    var data = buf.slice(0, -4);
    var csum = buf.slice(-4);
    var hash = $6fa6d4241424ae1a$require$sha256sha256(data);
    var hash4 = hash.slice(0, 4);
    if (csum.toString("hex") !== hash4.toString("hex")) throw new Error("Checksum mismatch");
    return data;
};
$6fa6d4241424ae1a$var$Base58Check.checksum = function(buffer) {
    return $6fa6d4241424ae1a$require$sha256sha256(buffer).slice(0, 4);
};
$6fa6d4241424ae1a$var$Base58Check.encode = function(buf) {
    if (!Buffer.isBuffer(buf)) throw new Error("Input must be a buffer");
    var checkedBuf = Buffer.alloc(buf.length + 4);
    var hash = $6fa6d4241424ae1a$var$Base58Check.checksum(buf);
    buf.copy(checkedBuf);
    hash.copy(checkedBuf, buf.length);
    return $6BAsE.encode(checkedBuf);
};
$6fa6d4241424ae1a$var$Base58Check.prototype.fromBuffer = function(buf) {
    this.buf = buf;
    return this;
};
$6fa6d4241424ae1a$var$Base58Check.fromBuffer = function(buf) {
    return new $6fa6d4241424ae1a$var$Base58Check().fromBuffer(buf);
};
$6fa6d4241424ae1a$var$Base58Check.fromHex = function(hex) {
    return $6fa6d4241424ae1a$var$Base58Check.fromBuffer(Buffer.from(hex, "hex"));
};
$6fa6d4241424ae1a$var$Base58Check.prototype.fromString = function(str) {
    var buf = $6fa6d4241424ae1a$var$Base58Check.decode(str);
    this.buf = buf;
    return this;
};
$6fa6d4241424ae1a$var$Base58Check.fromString = function(str) {
    var buf = $6fa6d4241424ae1a$var$Base58Check.decode(str);
    return new $6BAsE(buf);
};
$6fa6d4241424ae1a$var$Base58Check.prototype.toBuffer = function() {
    return this.buf;
};
$6fa6d4241424ae1a$var$Base58Check.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
$6fa6d4241424ae1a$var$Base58Check.prototype.toString = function() {
    return $6fa6d4241424ae1a$var$Base58Check.encode(this.buf);
};
module.exports = $6fa6d4241424ae1a$var$Base58Check;

});
parcelRegister("6BAsE", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

/**
 * The alphabet for the Bitcoin-specific Base 58 encoding distinguishes between
 * lower case L and upper case i - neither of those characters are allowed to
 * prevent accidentaly miscopying of letters.
 */ var $4cf27b3386a13273$var$ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".split("");
/**
 * A Base58 object can encode/decoded Base 58, which is used primarily for
 * string-formatted Bitcoin addresses and private keys. Addresses and private
 * keys actually use an additional checksum, and so they actually use the
 * Base58Check class.
 *
 * @param {object} obj Can be a string or buffer.
 */ var $4cf27b3386a13273$var$Base58 = function Base58(obj) {
    if (!(this instanceof Base58)) return new Base58(obj);
    if (Buffer.isBuffer(obj)) {
        var buf = obj;
        this.fromBuffer(buf);
    } else if (typeof obj === "string") {
        var str = obj;
        this.fromString(str);
    }
};
$4cf27b3386a13273$var$Base58.validCharacters = function validCharacters(chars) {
    if (Buffer.isBuffer(chars)) chars = chars.toString();
    return $iUxHD.every($iUxHD.map(chars, function(char) {
        return $iUxHD.includes($4cf27b3386a13273$var$ALPHABET, char);
    }));
};
$4cf27b3386a13273$var$Base58.prototype.set = function(obj) {
    this.buf = obj.buf || this.buf || undefined;
    return this;
};
/**
 * Encode a buffer to Bsae 58.
 *
 * @param {Buffer} buf Any buffer to be encoded.
 * @returns {string} A Base 58 encoded string.
 */ $4cf27b3386a13273$var$Base58.encode = function(buf) {
    if (!Buffer.isBuffer(buf)) throw new Error("Input should be a buffer");
    return $fxX3C$bs58.encode(buf);
};
/**
 * Decode a Base 58 string to a buffer.
 *
 * @param {string} str A Base 58 encoded string.
 * @returns {Buffer} The decoded buffer.
 */ $4cf27b3386a13273$var$Base58.decode = function(str) {
    if (typeof str !== "string") throw new Error("Input should be a string");
    return Buffer.from($fxX3C$bs58.decode(str));
};
$4cf27b3386a13273$var$Base58.prototype.fromBuffer = function(buf) {
    this.buf = buf;
    return this;
};
$4cf27b3386a13273$var$Base58.fromBuffer = function(buf) {
    return new $4cf27b3386a13273$var$Base58().fromBuffer(buf);
};
$4cf27b3386a13273$var$Base58.fromHex = function(hex) {
    return $4cf27b3386a13273$var$Base58.fromBuffer(Buffer.from(hex, "hex"));
};
$4cf27b3386a13273$var$Base58.prototype.fromString = function(str) {
    var buf = $4cf27b3386a13273$var$Base58.decode(str);
    this.buf = buf;
    return this;
};
$4cf27b3386a13273$var$Base58.fromString = function(str) {
    return new $4cf27b3386a13273$var$Base58().fromString(str);
};
$4cf27b3386a13273$var$Base58.prototype.toBuffer = function() {
    return this.buf;
};
$4cf27b3386a13273$var$Base58.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
$4cf27b3386a13273$var$Base58.prototype.toString = function() {
    return $4cf27b3386a13273$var$Base58.encode(this.buf);
};
module.exports = $4cf27b3386a13273$var$Base58;

});


parcelRegister("3LdBG", function(module, exports) {

module.exports = (parcelRequire("jQNLW"));

module.exports.Interpreter = (parcelRequire("9uoiU"));

module.exports.Stack = (parcelRequire("2ijCr"));

});
parcelRegister("jQNLW", function(module, exports) {
"use strict";

var $dOZs9 = parcelRequire("dOZs9");

var $fvPTe = parcelRequire("fvPTe");

var $aScoK = parcelRequire("aScoK");

var $5pTcb = parcelRequire("5pTcb");

var $hbQdz = parcelRequire("hbQdz");

var $km2cb = parcelRequire("km2cb");

var $92x2d = parcelRequire("92x2d");

var $e34gf = parcelRequire("e34gf");

var $iUxHD = parcelRequire("iUxHD");

var $lOQ1c = parcelRequire("lOQ1c");

var $bbk3w = parcelRequire("bbk3w");

var $hcB6V = parcelRequire("hcB6V");

var $5kRlf = parcelRequire("5kRlf");

var $eY7IQ = parcelRequire("eY7IQ");
// These WeakMap caches allow the objects themselves to maintain their immutability
const $e7397b60177a40bf$var$SCRIPT_TO_CHUNKS_CACHE = new WeakMap();
/**
 * A bitcoin transaction script. Each transaction's inputs and outputs
 * has a script that is evaluated to validate it's spending.
 *
 * See https://en.bitcoin.it/wiki/Script
 *
 * @constructor
 * @param {Object|string|Buffer=} from optional data to populate script
 */ var $e7397b60177a40bf$var$Script = function Script(from) {
    if (!(this instanceof Script)) return new Script(from);
    this.buffer = Buffer.from([]);
    if (Buffer.isBuffer(from)) return Script.fromBuffer(from);
    else if (from instanceof $dOZs9) return Script.fromAddress(from);
    else if (from instanceof Script) return Script.fromBuffer(from.toBuffer());
    else if ($iUxHD.isString(from)) return Script.fromString(from);
    else if ($iUxHD.isObject(from) && $iUxHD.isArray(from.chunks)) return Script.fromChunks(from.chunks);
    else if ($iUxHD.isObject(from) && Buffer.isBuffer(from.buffer)) return Script.fromBuffer(from.buffer);
};
$e7397b60177a40bf$var$Script.prototype.set = function(obj) {
    $e34gf.checkArgument($iUxHD.isObject(obj));
    if (obj.chunks && $iUxHD.isArray(obj.chunks)) {
        var s = $e7397b60177a40bf$var$Script.fromChunks(obj.chunks);
        this.buffer = s.buffer;
        return this;
    }
    $e34gf.checkArgument(Buffer.isBuffer(obj.buffer));
    this.buffer = obj.buffer;
    return this;
};
$e7397b60177a40bf$var$Script.fromBuffer = function(buffer) {
    $e34gf.checkArgument(Buffer.isBuffer(buffer));
    var script = new $e7397b60177a40bf$var$Script();
    script.buffer = buffer;
    return script;
};
$e7397b60177a40bf$var$Script.fromChunks = function(chunks) {
    var script = new $e7397b60177a40bf$var$Script();
    const bw = new $fvPTe();
    for(let index = 0; index < chunks.length; index++){
        const chunk = chunks[index];
        bw.writeUInt8(chunk.opcodenum);
        if (chunk.buf) {
            if (chunk.opcodenum < $5pTcb.OP_PUSHDATA1) bw.write(chunk.buf);
            else if (chunk.opcodenum === $5pTcb.OP_PUSHDATA1) {
                bw.writeUInt8(chunk.len);
                bw.write(chunk.buf);
            } else if (chunk.opcodenum === $5pTcb.OP_PUSHDATA2) {
                bw.writeUInt16LE(chunk.len);
                bw.write(chunk.buf);
            } else if (chunk.opcodenum === $5pTcb.OP_PUSHDATA4) {
                bw.writeUInt32LE(chunk.len);
                bw.write(chunk.buf);
            }
        }
    }
    script.buffer = bw.toBuffer();
    return script;
};
$e7397b60177a40bf$var$Script.prototype.toBuffer = function() {
    return this.buffer;
};
$e7397b60177a40bf$var$Script.fromASM = function(str) {
    return $e7397b60177a40bf$var$Script.fromBuffer($5kRlf(str));
};
$e7397b60177a40bf$var$Script.fromHex = function(str) {
    return new $e7397b60177a40bf$var$Script(Buffer.from(str, "hex"));
};
$e7397b60177a40bf$var$Script.fromString = function(str) {
    if ($bbk3w.isHexa(str) || str.length === 0) return new $e7397b60177a40bf$var$Script(Buffer.from(str, "hex"));
    var chunks = [];
    var tokens = str.split(" ");
    var i = 0;
    while(i < tokens.length){
        var token = tokens[i];
        var opcode = $5pTcb(token);
        var opcodenum = opcode.toNumber();
        if ($iUxHD.isUndefined(opcodenum)) {
            opcodenum = parseInt(token);
            if (opcodenum > 0 && opcodenum < $5pTcb.OP_PUSHDATA1) {
                var buf = Buffer.from(tokens[i + 1].slice(2), "hex");
                if (buf.length !== opcodenum) throw new Error("Invalid script buf len: " + JSON.stringify(str));
                chunks.push({
                    buf: Buffer.from(tokens[i + 1].slice(2), "hex"),
                    len: opcodenum,
                    opcodenum: opcodenum
                });
                i = i + 2;
            } else throw new Error("Invalid script: " + JSON.stringify(str));
        } else if (opcodenum === $5pTcb.OP_PUSHDATA1 || opcodenum === $5pTcb.OP_PUSHDATA2 || opcodenum === $5pTcb.OP_PUSHDATA4) {
            if (tokens[i + 2].slice(0, 2) !== "0x") throw new Error("Pushdata data must start with 0x");
            chunks.push({
                buf: Buffer.from(tokens[i + 2].slice(2), "hex"),
                len: parseInt(tokens[i + 1]),
                opcodenum: opcodenum
            });
            i = i + 3;
        } else {
            chunks.push({
                opcodenum: opcodenum
            });
            i = i + 1;
        }
    }
    return $e7397b60177a40bf$var$Script.fromChunks(chunks);
};
$e7397b60177a40bf$var$Script.prototype.slice = function(start, end) {
    return this.buffer.slice(start, end);
};
Object.defineProperty($e7397b60177a40bf$var$Script.prototype, "chunks", {
    get () {
        if ($e7397b60177a40bf$var$SCRIPT_TO_CHUNKS_CACHE.has(this)) return $e7397b60177a40bf$var$SCRIPT_TO_CHUNKS_CACHE.get(this);
        const chunks = $hcB6V(this.buffer);
        $e7397b60177a40bf$var$SCRIPT_TO_CHUNKS_CACHE.set(this, chunks);
        return chunks;
    }
});
Object.defineProperty($e7397b60177a40bf$var$Script.prototype, "length", {
    get () {
        return this.buffer.length;
    }
});
$e7397b60177a40bf$var$Script.prototype._chunkToString = function(chunk, type) {
    var opcodenum = chunk.opcodenum;
    var asm = type === "asm";
    var str = "";
    if (!chunk.buf) {
        // no data chunk
        if (typeof $5pTcb.reverseMap[opcodenum] !== "undefined") {
            if (asm) {
                // A few cases where the opcode name differs from reverseMap
                // aside from 1 to 16 data pushes.
                if (opcodenum === 0) // OP_0 -> 0
                str = str + " 0";
                else if (opcodenum === 79) // OP_1NEGATE -> 1
                str = str + " -1";
                else str = str + " " + $5pTcb(opcodenum).toString();
            } else str = str + " " + $5pTcb(opcodenum).toString();
        } else {
            var numstr = opcodenum.toString(16);
            if (numstr.length % 2 !== 0) numstr = "0" + numstr;
            if (asm) str = str + " " + numstr;
            else str = str + " " + "0x" + numstr;
        }
    } else {
        // data chunk
        if (!asm && (opcodenum === $5pTcb.OP_PUSHDATA1 || opcodenum === $5pTcb.OP_PUSHDATA2 || opcodenum === $5pTcb.OP_PUSHDATA4)) str = str + " " + $5pTcb(opcodenum).toString();
        if (chunk.len > 0) {
            if (asm) str = str + " " + chunk.buf.toString("hex");
            else str = str + " " + chunk.len + " " + "0x" + chunk.buf.toString("hex");
        }
    }
    return str;
};
$e7397b60177a40bf$var$Script.prototype.toASM = function() {
    var str = "";
    var chunks = this.chunks;
    for(var i = 0; i < chunks.length; i++){
        var chunk = this.chunks[i];
        str += this._chunkToString(chunk, "asm");
    }
    return str.substr(1);
};
$e7397b60177a40bf$var$Script.prototype.toString = function() {
    var str = "";
    for(var i = 0; i < this.chunks.length; i++){
        var chunk = this.chunks[i];
        str += this._chunkToString(chunk);
    }
    return str.substr(1);
};
$e7397b60177a40bf$var$Script.prototype.toHex = function() {
    return $eY7IQ(this.buffer);
};
$e7397b60177a40bf$var$Script.prototype.inspect = function() {
    return "<Script: " + this.toString() + ">";
};
// script classification methods
/**
 * @returns {boolean} if this is a pay to pubkey hash output script
 */ $e7397b60177a40bf$var$Script.prototype.isPublicKeyHashOut = function() {
    return !!(this.chunks.length === 5 && this.chunks[0].opcodenum === $5pTcb.OP_DUP && this.chunks[1].opcodenum === $5pTcb.OP_HASH160 && this.chunks[2].buf && this.chunks[2].buf.length === 20 && this.chunks[3].opcodenum === $5pTcb.OP_EQUALVERIFY && this.chunks[4].opcodenum === $5pTcb.OP_CHECKSIG);
};
/**
 * @returns {boolean} if this is a pay to public key hash input script
 */ $e7397b60177a40bf$var$Script.prototype.isPublicKeyHashIn = function() {
    if (this.chunks.length === 2) {
        var signatureBuf = this.chunks[0].buf;
        var pubkeyBuf = this.chunks[1].buf;
        if (signatureBuf && signatureBuf.length && signatureBuf[0] === 0x30 && pubkeyBuf && pubkeyBuf.length) {
            var version = pubkeyBuf[0];
            if ((version === 0x04 || version === 0x06 || version === 0x07) && pubkeyBuf.length === 65) return true;
            else if ((version === 0x03 || version === 0x02) && pubkeyBuf.length === 33) return true;
        }
    }
    return false;
};
$e7397b60177a40bf$var$Script.prototype.getPublicKey = function() {
    $e34gf.checkState(this.isPublicKeyOut(), "Can't retrieve PublicKey from a non-PK output");
    return this.chunks[0].buf;
};
$e7397b60177a40bf$var$Script.prototype.getPublicKeyHash = function() {
    $e34gf.checkState(this.isPublicKeyHashOut(), "Can't retrieve PublicKeyHash from a non-PKH output");
    return this.chunks[2].buf;
};
/**
 * @returns {boolean} if this is a public key output script
 */ $e7397b60177a40bf$var$Script.prototype.isPublicKeyOut = function() {
    if (this.chunks.length === 2 && this.chunks[0].buf && this.chunks[0].buf.length && this.chunks[1].opcodenum === $5pTcb.OP_CHECKSIG) {
        var pubkeyBuf = this.chunks[0].buf;
        var version = pubkeyBuf[0];
        var isVersion = false;
        if ((version === 0x04 || version === 0x06 || version === 0x07) && pubkeyBuf.length === 65) isVersion = true;
        else if ((version === 0x03 || version === 0x02) && pubkeyBuf.length === 33) isVersion = true;
        if (isVersion) return $hbQdz.isValid(pubkeyBuf);
    }
    return false;
};
/**
 * @returns {boolean} if this is a pay to public key input script
 */ $e7397b60177a40bf$var$Script.prototype.isPublicKeyIn = function() {
    if (this.chunks.length === 1) {
        var signatureBuf = this.chunks[0].buf;
        if (signatureBuf && signatureBuf.length && signatureBuf[0] === 0x30) return true;
    }
    return false;
};
/**
 * @returns {boolean} if this is a p2sh output script
 */ $e7397b60177a40bf$var$Script.prototype.isScriptHashOut = function() {
    var buf = this.toBuffer();
    return buf.length === 23 && buf[0] === $5pTcb.OP_HASH160 && buf[1] === 0x14 && buf[buf.length - 1] === $5pTcb.OP_EQUAL;
};
/**
 * @returns {boolean} if this is a p2sh input script
 * Note that these are frequently indistinguishable from pubkeyhashin
 */ $e7397b60177a40bf$var$Script.prototype.isScriptHashIn = function() {
    if (this.chunks.length <= 1) return false;
    var redeemChunk = this.chunks[this.chunks.length - 1];
    var redeemBuf = redeemChunk.buf;
    if (!redeemBuf) return false;
    var redeemScript;
    try {
        redeemScript = $e7397b60177a40bf$var$Script.fromBuffer(redeemBuf);
    } catch (e) {
        if (e instanceof $lOQ1c.Script.InvalidBuffer) return false;
        throw e;
    }
    var type = redeemScript.classify();
    return type !== $e7397b60177a40bf$var$Script.types.UNKNOWN;
};
/**
 * @returns {boolean} if this is a mutlsig output script
 */ $e7397b60177a40bf$var$Script.prototype.isMultisigOut = function() {
    return this.chunks.length > 3 && $5pTcb.isSmallIntOp(this.chunks[0].opcodenum) && this.chunks.slice(1, this.chunks.length - 2).every(function(obj) {
        return obj.buf && Buffer.isBuffer(obj.buf);
    }) && $5pTcb.isSmallIntOp(this.chunks[this.chunks.length - 2].opcodenum) && this.chunks[this.chunks.length - 1].opcodenum === $5pTcb.OP_CHECKMULTISIG;
};
/**
 * @returns {boolean} if this is a multisig input script
 */ $e7397b60177a40bf$var$Script.prototype.isMultisigIn = function() {
    return this.chunks.length >= 2 && this.chunks[0].opcodenum === 0 && this.chunks.slice(1, this.chunks.length).every(function(obj) {
        return obj.buf && Buffer.isBuffer(obj.buf) && $km2cb.isTxDER(obj.buf);
    });
};
/**
 * @returns {boolean} true if this is a valid standard OP_RETURN output
 */ $e7397b60177a40bf$var$Script.prototype.isDataOut = function() {
    var step1 = this.buffer.length >= 1 && this.buffer[0] === $5pTcb.OP_RETURN;
    if (!step1) return false;
    var buffer = this.buffer.slice(1);
    var script2 = new $e7397b60177a40bf$var$Script({
        buffer: buffer
    });
    return script2.isPushOnly();
};
$e7397b60177a40bf$var$Script.prototype.isSafeDataOut = function() {
    if (this.buffer.length < 2) return false;
    if (this.buffer[0] !== $5pTcb.OP_FALSE) return false;
    var buffer = this.buffer.slice(1);
    var script2 = new $e7397b60177a40bf$var$Script({
        buffer: buffer
    });
    return script2.isDataOut();
};
/**
 * Retrieve the associated data for this script.
 * In the case of a pay to public key hash or P2SH, return the hash.
 * In the case of safe OP_RETURN data, return an array of buffers
 * In the case of a standard deprecated OP_RETURN, return the data
 * @returns {Buffer}
 */ $e7397b60177a40bf$var$Script.prototype.getData = function() {
    if (this.isSafeDataOut()) {
        var chunks = this.chunks.slice(2);
        var buffers = chunks.map((chunk)=>chunk.buf);
        return buffers;
    }
    if (this.isDataOut() || this.isScriptHashOut()) {
        if ($iUxHD.isUndefined(this.chunks[1])) return Buffer.alloc(0);
        else return Buffer.from(this.chunks[1].buf);
    }
    if (this.isPublicKeyHashOut()) return Buffer.from(this.chunks[2].buf);
    throw new Error("Unrecognized script type to get data from");
};
/**
 * @returns {boolean} if the script is only composed of data pushing
 * opcodes or small int opcodes (OP_0, OP_1, ..., OP_16)
 */ $e7397b60177a40bf$var$Script.prototype.isPushOnly = function() {
    return $iUxHD.every(this.chunks, function(chunk) {
        return chunk.opcodenum <= $5pTcb.OP_16 || chunk.opcodenum === $5pTcb.OP_PUSHDATA1 || chunk.opcodenum === $5pTcb.OP_PUSHDATA2 || chunk.opcodenum === $5pTcb.OP_PUSHDATA4;
    });
};
$e7397b60177a40bf$var$Script.types = {};
$e7397b60177a40bf$var$Script.types.UNKNOWN = "Unknown";
$e7397b60177a40bf$var$Script.types.PUBKEY_OUT = "Pay to public key";
$e7397b60177a40bf$var$Script.types.PUBKEY_IN = "Spend from public key";
$e7397b60177a40bf$var$Script.types.PUBKEYHASH_OUT = "Pay to public key hash";
$e7397b60177a40bf$var$Script.types.PUBKEYHASH_IN = "Spend from public key hash";
$e7397b60177a40bf$var$Script.types.SCRIPTHASH_OUT = "Pay to script hash";
$e7397b60177a40bf$var$Script.types.SCRIPTHASH_IN = "Spend from script hash";
$e7397b60177a40bf$var$Script.types.MULTISIG_OUT = "Pay to multisig";
$e7397b60177a40bf$var$Script.types.MULTISIG_IN = "Spend from multisig";
$e7397b60177a40bf$var$Script.types.DATA_OUT = "Data push";
$e7397b60177a40bf$var$Script.types.SAFE_DATA_OUT = "Safe data push";
$e7397b60177a40bf$var$Script.OP_RETURN_STANDARD_SIZE = 220;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */ $e7397b60177a40bf$var$Script.prototype.classify = function() {
    if (this._isInput) return this.classifyInput();
    else if (this._isOutput) return this.classifyOutput();
    else {
        var outputType = this.classifyOutput();
        return outputType !== $e7397b60177a40bf$var$Script.types.UNKNOWN ? outputType : this.classifyInput();
    }
};
$e7397b60177a40bf$var$Script.outputIdentifiers = {};
$e7397b60177a40bf$var$Script.outputIdentifiers.PUBKEY_OUT = $e7397b60177a40bf$var$Script.prototype.isPublicKeyOut;
$e7397b60177a40bf$var$Script.outputIdentifiers.PUBKEYHASH_OUT = $e7397b60177a40bf$var$Script.prototype.isPublicKeyHashOut;
$e7397b60177a40bf$var$Script.outputIdentifiers.MULTISIG_OUT = $e7397b60177a40bf$var$Script.prototype.isMultisigOut;
$e7397b60177a40bf$var$Script.outputIdentifiers.SCRIPTHASH_OUT = $e7397b60177a40bf$var$Script.prototype.isScriptHashOut;
$e7397b60177a40bf$var$Script.outputIdentifiers.DATA_OUT = $e7397b60177a40bf$var$Script.prototype.isDataOut;
$e7397b60177a40bf$var$Script.outputIdentifiers.SAFE_DATA_OUT = $e7397b60177a40bf$var$Script.prototype.isSafeDataOut;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */ $e7397b60177a40bf$var$Script.prototype.classifyOutput = function() {
    for(var type in $e7397b60177a40bf$var$Script.outputIdentifiers){
        if ($e7397b60177a40bf$var$Script.outputIdentifiers[type].bind(this)()) return $e7397b60177a40bf$var$Script.types[type];
    }
    return $e7397b60177a40bf$var$Script.types.UNKNOWN;
};
$e7397b60177a40bf$var$Script.inputIdentifiers = {};
$e7397b60177a40bf$var$Script.inputIdentifiers.PUBKEY_IN = $e7397b60177a40bf$var$Script.prototype.isPublicKeyIn;
$e7397b60177a40bf$var$Script.inputIdentifiers.PUBKEYHASH_IN = $e7397b60177a40bf$var$Script.prototype.isPublicKeyHashIn;
$e7397b60177a40bf$var$Script.inputIdentifiers.MULTISIG_IN = $e7397b60177a40bf$var$Script.prototype.isMultisigIn;
$e7397b60177a40bf$var$Script.inputIdentifiers.SCRIPTHASH_IN = $e7397b60177a40bf$var$Script.prototype.isScriptHashIn;
/**
 * @returns {object} The Script type if it is a known form,
 * or Script.UNKNOWN if it isn't
 */ $e7397b60177a40bf$var$Script.prototype.classifyInput = function() {
    for(var type in $e7397b60177a40bf$var$Script.inputIdentifiers){
        if ($e7397b60177a40bf$var$Script.inputIdentifiers[type].bind(this)()) return $e7397b60177a40bf$var$Script.types[type];
    }
    return $e7397b60177a40bf$var$Script.types.UNKNOWN;
};
/**
 * @returns {boolean} if script is one of the known types
 */ $e7397b60177a40bf$var$Script.prototype.isStandard = function() {
    // TODO: Add BIP62 compliance
    return this.classify() !== $e7397b60177a40bf$var$Script.types.UNKNOWN;
};
// Script construction methods
/**
 * Adds a script element at the start of the script.
 * @param {*} obj a string, number, Opcode, Buffer, or object to add
 * @returns {Script} this script instance
 */ $e7397b60177a40bf$var$Script.prototype.prepend = function(obj) {
    this._addByType(obj, true);
    return this;
};
/**
 * Compares a script with another script
 */ $e7397b60177a40bf$var$Script.prototype.equals = function(script) {
    $e34gf.checkState(script instanceof $e7397b60177a40bf$var$Script, "Must provide another script");
    if (this.buffer.length !== script.buffer.length) return false;
    var i;
    for(i = 0; i < this.buffer.length; i++){
        if (this.buffer[i] !== script.buffer[i]) return false;
    }
    return true;
};
/**
 * Adds a script element to the end of the script.
 *
 * @param {*} obj a string, number, Opcode, Buffer, or object to add
 * @returns {Script} this script instance
 *
 */ $e7397b60177a40bf$var$Script.prototype.add = function(obj) {
    this._addByType(obj, false);
    return this;
};
$e7397b60177a40bf$var$Script.prototype._addByType = function(obj, prepend) {
    if (typeof obj === "string") this._addOpcode(obj, prepend);
    else if (typeof obj === "number") this._addOpcode(obj, prepend);
    else if (obj instanceof $5pTcb) this._addOpcode(obj, prepend);
    else if (Buffer.isBuffer(obj)) this._addBuffer(obj, prepend);
    else if (obj instanceof $e7397b60177a40bf$var$Script) this._insertAtPosition(obj.buffer, prepend);
    else if (typeof obj === "object") {
        var s = $e7397b60177a40bf$var$Script.fromChunks([
            obj
        ]);
        this._insertAtPosition(s.toBuffer(), prepend);
    } else throw new Error("Invalid script chunk");
};
$e7397b60177a40bf$var$Script.prototype._insertAtPosition = function(buf, prepend) {
    var bw = new $fvPTe();
    if (prepend) {
        bw.write(buf);
        bw.write(this.buffer);
    } else {
        bw.write(this.buffer);
        bw.write(buf);
    }
    this.buffer = bw.toBuffer();
};
$e7397b60177a40bf$var$Script.prototype._addOpcode = function(opcode, prepend) {
    var op;
    if (typeof opcode === "number") op = opcode;
    else if (opcode instanceof $5pTcb) op = opcode.toNumber();
    else op = $5pTcb(opcode).toNumber();
    // OP_INVALIDOPCODE
    if (op > 255) throw new $lOQ1c.Script.InvalidOpcode(op);
    this._insertAtPosition($e7397b60177a40bf$var$Script.fromChunks([
        {
            opcodenum: op
        }
    ]).toBuffer(), prepend);
    return this;
};
$e7397b60177a40bf$var$Script.prototype._addBuffer = function(buf, prepend) {
    var bw = new $fvPTe();
    var opcodenum;
    var len = buf.length;
    if (len === 0) {
        opcodenum = 0;
        bw.writeUInt8(opcodenum);
    } else if (len > 0 && len < $5pTcb.OP_PUSHDATA1) {
        opcodenum = len;
        bw.writeUInt8(opcodenum);
        bw.write(buf);
    } else if (len < Math.pow(2, 8)) {
        opcodenum = $5pTcb.OP_PUSHDATA1;
        bw.writeUInt8(opcodenum);
        bw.writeUInt8(len);
        bw.write(buf);
    } else if (len < Math.pow(2, 16)) {
        opcodenum = $5pTcb.OP_PUSHDATA2;
        bw.writeUInt8(opcodenum);
        bw.writeUInt16LE(len);
        bw.write(buf);
    } else if (len < Math.pow(2, 32)) {
        opcodenum = $5pTcb.OP_PUSHDATA4;
        bw.writeUInt8(opcodenum);
        bw.writeUInt32LE(len);
        bw.write(buf);
    } else throw new Error("You can't push that much data");
    this._insertAtPosition(bw.toBuffer(), prepend);
    return this;
};
$e7397b60177a40bf$var$Script.prototype.clone = function() {
    return $e7397b60177a40bf$var$Script.fromBuffer(this.buffer.slice());
};
$e7397b60177a40bf$var$Script.prototype.removeCodeseparators = function() {
    var chunks = [];
    for(var i = 0; i < this.chunks.length; i++)if (this.chunks[i].opcodenum !== $5pTcb.OP_CODESEPARATOR) chunks.push(this.chunks[i]);
    $e7397b60177a40bf$var$SCRIPT_TO_CHUNKS_CACHE.delete(this);
    this.buffer = $e7397b60177a40bf$var$Script.fromChunks(chunks).toBuffer();
    return this;
};
/**
 * If the script does not contain any OP_CODESEPARATOR, Return all scripts
 * If the script contains any OP_CODESEPARATOR, the scriptCode is the script but removing everything up to and including the last executed OP_CODESEPARATOR before the signature checking opcode being executed
 * @param {n} The {n}th codeseparator in the script
 *
 * @returns {Script} Subset of script starting at the {n}th codeseparator
 */ $e7397b60177a40bf$var$Script.prototype.subScript = function(n) {
    var idx = 0;
    for(var i = 0; i < this.chunks.length; i++)if (this.chunks[i].opcodenum === $5pTcb.OP_CODESEPARATOR) {
        if (idx === n) return $e7397b60177a40bf$var$Script.fromChunks(this.chunks.slice(i + 1));
        else idx++;
    }
    return this;
};
// high level script builder methods
/**
 * @returns {Script} a new Multisig output script for given public keys,
 * requiring m of those public keys to spend
 * @param {PublicKey[]} publicKeys - list of all public keys controlling the output
 * @param {number} threshold - amount of required signatures to spend the output
 * @param {Object=} opts - Several options:
 *        - noSorting: defaults to false, if true, don't sort the given
 *                      public keys before creating the script
 */ $e7397b60177a40bf$var$Script.buildMultisigOut = function(publicKeys, threshold, opts) {
    $e34gf.checkArgument(threshold <= publicKeys.length, "Number of required signatures must be less than or equal to the number of public keys");
    opts = opts || {};
    var script = new $e7397b60177a40bf$var$Script();
    script.add($5pTcb.smallInt(threshold));
    publicKeys = $iUxHD.map(publicKeys, $hbQdz);
    var sorted = publicKeys;
    if (!opts.noSorting) sorted = publicKeys.map((k)=>k.toString("hex")).sort().map((k)=>new $hbQdz(k));
    for(var i = 0; i < sorted.length; i++){
        var publicKey = sorted[i];
        script.add(publicKey.toBuffer());
    }
    script.add($5pTcb.smallInt(publicKeys.length));
    script.add($5pTcb.OP_CHECKMULTISIG);
    return script;
};
/**
 * A new Multisig input script for the given public keys, requiring m of those public keys to spend
 *
 * @param {PublicKey[]} pubkeys list of all public keys controlling the output
 * @param {number} threshold amount of required signatures to spend the output
 * @param {Array} signatures and array of signature buffers to append to the script
 * @param {Object=} opts
 * @param {boolean=} opts.noSorting don't sort the given public keys before creating the script (false by default)
 * @param {Script=} opts.cachedMultisig don't recalculate the redeemScript
 *
 * @returns {Script}
 */ $e7397b60177a40bf$var$Script.buildMultisigIn = function(pubkeys, threshold, signatures, opts) {
    $e34gf.checkArgument($iUxHD.isArray(pubkeys));
    $e34gf.checkArgument($iUxHD.isNumber(threshold));
    $e34gf.checkArgument($iUxHD.isArray(signatures));
    opts = opts || {};
    var s = new $e7397b60177a40bf$var$Script();
    s.add($5pTcb.OP_0);
    $iUxHD.each(signatures, function(signature) {
        $e34gf.checkArgument(Buffer.isBuffer(signature), "Signatures must be an array of Buffers");
        // TODO: allow signatures to be an array of Signature objects
        s.add(signature);
    });
    return s;
};
/**
 * A new P2SH Multisig input script for the given public keys, requiring m of those public keys to spend
 *
 * @param {PublicKey[]} pubkeys list of all public keys controlling the output
 * @param {number} threshold amount of required signatures to spend the output
 * @param {Array} signatures and array of signature buffers to append to the script
 * @param {Object=} opts
 * @param {boolean=} opts.noSorting don't sort the given public keys before creating the script (false by default)
 * @param {Script=} opts.cachedMultisig don't recalculate the redeemScript
 *
 * @returns {Script}
 */ $e7397b60177a40bf$var$Script.buildP2SHMultisigIn = function(pubkeys, threshold, signatures, opts) {
    $e34gf.checkArgument($iUxHD.isArray(pubkeys));
    $e34gf.checkArgument($iUxHD.isNumber(threshold));
    $e34gf.checkArgument($iUxHD.isArray(signatures));
    opts = opts || {};
    var s = new $e7397b60177a40bf$var$Script();
    s.add($5pTcb.OP_0);
    $iUxHD.each(signatures, function(signature) {
        $e34gf.checkArgument(Buffer.isBuffer(signature), "Signatures must be an array of Buffers");
        // TODO: allow signatures to be an array of Signature objects
        s.add(signature);
    });
    s.add((opts.cachedMultisig || $e7397b60177a40bf$var$Script.buildMultisigOut(pubkeys, threshold, opts)).toBuffer());
    return s;
};
/**
 * @returns {Script} a new pay to public key hash output for the given
 * address or public key
 * @param {(Address|PublicKey)} to - destination address or public key
 */ $e7397b60177a40bf$var$Script.buildPublicKeyHashOut = function(to) {
    $e34gf.checkArgument(!$iUxHD.isUndefined(to));
    $e34gf.checkArgument(to instanceof $hbQdz || to instanceof $dOZs9 || $iUxHD.isString(to));
    if (to instanceof $hbQdz) to = to.toAddress();
    else if ($iUxHD.isString(to)) to = new $dOZs9(to);
    var s = new $e7397b60177a40bf$var$Script();
    s.add($5pTcb.OP_DUP).add($5pTcb.OP_HASH160).add(to.hashBuffer).add($5pTcb.OP_EQUALVERIFY).add($5pTcb.OP_CHECKSIG);
    s._network = to.network;
    return s;
};
/**
 * @returns {Script} a new pay to public key output for the given
 *  public key
 */ $e7397b60177a40bf$var$Script.buildPublicKeyOut = function(pubkey) {
    $e34gf.checkArgument(pubkey instanceof $hbQdz);
    var s = new $e7397b60177a40bf$var$Script();
    s.add(pubkey.toBuffer()).add($5pTcb.OP_CHECKSIG);
    return s;
};
/**
 * @returns {Script} a new OP_RETURN script with data
 * @param {(string|Buffer|Array)} data - the data to embed in the output - it is a string, buffer, or array of strings or buffers
 * @param {(string)} encoding - the type of encoding of the string(s)
 */ $e7397b60177a40bf$var$Script.buildDataOut = function(data, encoding) {
    $e34gf.checkArgument($iUxHD.isUndefined(data) || $iUxHD.isString(data) || $iUxHD.isArray(data) || Buffer.isBuffer(data));
    var datas = data;
    if (!$iUxHD.isArray(datas)) datas = [
        data
    ];
    var s = new $e7397b60177a40bf$var$Script();
    s.add($5pTcb.OP_RETURN);
    for (let data of datas){
        $e34gf.checkArgument($iUxHD.isUndefined(data) || $iUxHD.isString(data) || Buffer.isBuffer(data));
        if ($iUxHD.isString(data)) data = Buffer.from(data, encoding);
        if (!$iUxHD.isUndefined(data)) s.add(data);
    }
    return s;
};
/**
 * @returns {Script} a new OP_RETURN script with data
 * @param {(string|Buffer|Array)} data - the data to embed in the output - it is a string, buffer, or array of strings or buffers
 * @param {(string)} encoding - the type of encoding of the string(s)
 */ $e7397b60177a40bf$var$Script.buildSafeDataOut = function(data, encoding) {
    var s2 = $e7397b60177a40bf$var$Script.buildDataOut(data, encoding);
    var s1 = new $e7397b60177a40bf$var$Script();
    s1.add($5pTcb.OP_FALSE);
    s1.add(s2);
    return s1;
};
/**
 * @param {Script|Address} script - the redeemScript for the new p2sh output.
 *    It can also be a p2sh address
 * @returns {Script} new pay to script hash script for given script
 */ $e7397b60177a40bf$var$Script.buildScriptHashOut = function(script) {
    $e34gf.checkArgument(script instanceof $e7397b60177a40bf$var$Script || script instanceof $dOZs9 && script.isPayToScriptHash());
    var s = new $e7397b60177a40bf$var$Script();
    s.add($5pTcb.OP_HASH160).add(script instanceof $dOZs9 ? script.hashBuffer : $aScoK.sha256ripemd160(script.toBuffer())).add($5pTcb.OP_EQUAL);
    s._network = script._network || script.network;
    return s;
};
/**
 * Builds a scriptSig (a script for an input) that signs a public key output script.
 *
 * @param {Signature|Buffer} signature - a Signature object, or the signature in DER canonical encoding
 * @param {number=} sigtype - the type of the signature (defaults to SIGHASH_ALL)
 */ $e7397b60177a40bf$var$Script.buildPublicKeyIn = function(signature, sigtype) {
    $e34gf.checkArgument(signature instanceof $km2cb || Buffer.isBuffer(signature));
    $e34gf.checkArgument($iUxHD.isUndefined(sigtype) || $iUxHD.isNumber(sigtype));
    if (signature instanceof $km2cb) signature = signature.toBuffer();
    var script = new $e7397b60177a40bf$var$Script();
    script.add(Buffer.concat([
        signature,
        Buffer.from([
            (sigtype || $km2cb.SIGHASH_ALL) & 0xff
        ])
    ]));
    return script;
};
/**
 * Builds a scriptSig (a script for an input) that signs a public key hash
 * output script.
 *
 * @param {Buffer|string|PublicKey} publicKey
 * @param {Signature|Buffer} signature - a Signature object, or the signature in DER canonical encoding
 * @param {number=} sigtype - the type of the signature (defaults to SIGHASH_ALL)
 */ $e7397b60177a40bf$var$Script.buildPublicKeyHashIn = function(publicKey, signature, sigtype) {
    $e34gf.checkArgument(signature instanceof $km2cb || Buffer.isBuffer(signature));
    $e34gf.checkArgument($iUxHD.isUndefined(sigtype) || $iUxHD.isNumber(sigtype));
    if (signature instanceof $km2cb) signature = signature.toBuffer();
    var script = new $e7397b60177a40bf$var$Script().add(Buffer.concat([
        signature,
        Buffer.from([
            (sigtype || $km2cb.SIGHASH_ALL) & 0xff
        ])
    ])).add(new $hbQdz(publicKey).toBuffer());
    return script;
};
/**
 * @returns {Script} an empty script
 */ $e7397b60177a40bf$var$Script.empty = function() {
    return new $e7397b60177a40bf$var$Script();
};
/**
 * @returns {Script} a new pay to script hash script that pays to this script
 */ $e7397b60177a40bf$var$Script.prototype.toScriptHashOut = function() {
    return $e7397b60177a40bf$var$Script.buildScriptHashOut(this);
};
/**
 * @return {Script} an output script built from the address
 */ $e7397b60177a40bf$var$Script.fromAddress = function(address) {
    address = $dOZs9(address);
    if (address.isPayToScriptHash()) return $e7397b60177a40bf$var$Script.buildScriptHashOut(address);
    else if (address.isPayToPublicKeyHash()) return $e7397b60177a40bf$var$Script.buildPublicKeyHashOut(address);
    throw new $lOQ1c.Script.UnrecognizedAddress(address);
};
/**
 * Will return the associated address information object
 * @return {Address|boolean}
 */ $e7397b60177a40bf$var$Script.prototype.getAddressInfo = function(opts) {
    if (this._isInput) return this._getInputAddressInfo();
    else if (this._isOutput) return this._getOutputAddressInfo();
    else {
        var info = this._getOutputAddressInfo();
        if (!info) return this._getInputAddressInfo();
        return info;
    }
};
/**
 * Will return the associated output scriptPubKey address information object
 * @return {Address|boolean}
 * @private
 */ $e7397b60177a40bf$var$Script.prototype._getOutputAddressInfo = function() {
    var info = {};
    if (this.isScriptHashOut()) {
        info.hashBuffer = this.getData();
        info.type = $dOZs9.PayToScriptHash;
    } else if (this.isPublicKeyHashOut()) {
        info.hashBuffer = this.getData();
        info.type = $dOZs9.PayToPublicKeyHash;
    } else return false;
    return info;
};
/**
 * Will return the associated input scriptSig address information object
 * @return {Address|boolean}
 * @private
 */ $e7397b60177a40bf$var$Script.prototype._getInputAddressInfo = function() {
    var info = {};
    if (this.isPublicKeyHashIn()) {
        // hash the publickey found in the scriptSig
        info.hashBuffer = $aScoK.sha256ripemd160(this.chunks[1].buf);
        info.type = $dOZs9.PayToPublicKeyHash;
    } else if (this.isScriptHashIn()) {
        // hash the redeemscript found at the end of the scriptSig
        info.hashBuffer = $aScoK.sha256ripemd160(this.chunks[this.chunks.length - 1].buf);
        info.type = $dOZs9.PayToScriptHash;
    } else return false;
    return info;
};
/**
 * @param {Network=} network
 * @return {Address|boolean} the associated address for this script if possible, or false
 */ $e7397b60177a40bf$var$Script.prototype.toAddress = function(network) {
    var info = this.getAddressInfo();
    if (!info) return false;
    info.network = $92x2d.get(network) || this._network || $92x2d.defaultNetwork;
    return new $dOZs9(info);
};
/**
 * Analogous to bitcoind's FindAndDelete. Find and delete equivalent chunks,
 * typically used with push data chunks.  Note that this will find and delete
 * not just the same data, but the same data with the same push data op as
 * produced by default. i.e., if a pushdata in a tx does not use the minimal
 * pushdata op, then when you try to remove the data it is pushing, it will not
 * be removed, because they do not use the same pushdata op.
 */ $e7397b60177a40bf$var$Script.prototype.findAndDelete = function(script) {
    var buf = script.toBuffer();
    var hex = buf.toString("hex");
    var chunks = this.chunks;
    for(var i = 0; i < chunks.length; i++){
        var script2 = $e7397b60177a40bf$var$Script.fromChunks([
            chunks[i]
        ]);
        var buf2 = script2.toBuffer();
        var hex2 = buf2.toString("hex");
        if (hex === hex2) {
            chunks.splice(i, 1);
            this.buffer = $e7397b60177a40bf$var$Script.fromChunks(chunks).toBuffer();
        }
    }
    return this;
};
/**
 * Comes from bitcoind's script interpreter CheckMinimalPush function
 * @returns {boolean} if the chunk {i} is the smallest way to push that particular data.
 */ $e7397b60177a40bf$var$Script.prototype.checkMinimalPush = function(i) {
    var chunk = this.chunks[i];
    var buf = chunk.buf;
    var opcodenum = chunk.opcodenum;
    if (!buf) return true;
    if (buf.length === 0) // Could have used OP_0.
    return opcodenum === $5pTcb.OP_0;
    else if (buf.length === 1 && buf[0] >= 1 && buf[0] <= 16) // Could have used OP_1 .. OP_16.
    return opcodenum === $5pTcb.OP_1 + (buf[0] - 1);
    else if (buf.length === 1 && buf[0] === 0x81) // Could have used OP_1NEGATE
    return opcodenum === $5pTcb.OP_1NEGATE;
    else if (buf.length <= 75) // Could have used a direct push (opcode indicating number of bytes pushed + those bytes).
    return opcodenum === buf.length;
    else if (buf.length <= 255) // Could have used OP_PUSHDATA.
    return opcodenum === $5pTcb.OP_PUSHDATA1;
    else if (buf.length <= 65535) // Could have used OP_PUSHDATA2.
    return opcodenum === $5pTcb.OP_PUSHDATA2;
    return true;
};
/**
 * Comes from bitcoind's script DecodeOP_N function
 * @param {number} opcode
 * @returns {number} numeric value in range of 0 to 16
 */ $e7397b60177a40bf$var$Script.prototype._decodeOP_N = function(opcode) {
    if (opcode === $5pTcb.OP_0) return 0;
    else if (opcode >= $5pTcb.OP_1 && opcode <= $5pTcb.OP_16) return opcode - ($5pTcb.OP_1 - 1);
    else throw new Error("Invalid opcode: " + JSON.stringify(opcode));
};
/**
 * Comes from bitcoind's script GetSigOpCount(boolean) function
 * @param {boolean} use current (true) or pre-version-0.6 (false) logic
 * @returns {number} number of signature operations required by this script
 */ $e7397b60177a40bf$var$Script.prototype.getSignatureOperationsCount = function(accurate) {
    accurate = $iUxHD.isUndefined(accurate) ? true : accurate;
    var self = this;
    var n = 0;
    var lastOpcode = $5pTcb.OP_INVALIDOPCODE;
    $iUxHD.each(self.chunks, function getChunk(chunk) {
        var opcode = chunk.opcodenum;
        if (opcode === $5pTcb.OP_CHECKSIG || opcode === $5pTcb.OP_CHECKSIGVERIFY) n++;
        else if (opcode === $5pTcb.OP_CHECKMULTISIG || opcode === $5pTcb.OP_CHECKMULTISIGVERIFY) {
            if (accurate && lastOpcode >= $5pTcb.OP_1 && lastOpcode <= $5pTcb.OP_16) n += self._decodeOP_N(lastOpcode);
            else n += 20;
        }
        lastOpcode = opcode;
    });
    return n;
};
module.exports = $e7397b60177a40bf$var$Script;

});
parcelRegister("fvPTe", function(module, exports) {
"use strict";


var $iPNRo = parcelRequire("iPNRo");

var $acKBR = parcelRequire("acKBR");

var $5DrP1 = parcelRequire("5DrP1");

var $3THmi = parcelRequire("3THmi");

var $66R9M = parcelRequire("66R9M");
class $b4b20081d1d22dbe$var$BufferWriter {
    constructor(obj){
        if (obj) this.set(obj);
        else {
            this.buffers = [];
            this.length = 0;
        }
    }
    write(buffer) {
        this.buffers.push(buffer);
        this.length += buffer.length;
        return this;
    }
    set(obj) {
        this.buffers = obj.buffers || obj.bufs || this.buffers || [];
        this.length = this.buffers.reduce(function(prev, buf) {
            return prev + buf.length;
        }, 0);
        return this;
    }
    concat() {
        return this.toBuffer();
    }
    toBuffer() {
        if (this.buffers.length === 1) return Buffer.from(this.buffers[0]);
        const whole = new Uint8Array(this.length);
        let offset = 0;
        this.buffers.forEach((part)=>{
            whole.set(part, offset);
            offset += part.length;
        });
        return Buffer.from(whole);
    }
    writeReverse(buf) {
        $fxX3C$assert(Buffer.isBuffer(buf));
        this.write(Buffer.from(buf).reverse());
        return this;
    }
    writeUInt16LE(n) {
        $acKBR(this, n);
        return this;
    }
    writeUInt16BE(n) {
        var bw = new $b4b20081d1d22dbe$var$BufferWriter();
        bw.writeUInt16LE(n);
        this.writeReverse(bw.toBuffer());
        return this;
    }
    writeUInt32LE(n) {
        $5DrP1(this, n);
        return this;
    }
    writeUInt32BE(n) {
        var bw = new $b4b20081d1d22dbe$var$BufferWriter();
        bw.writeUInt32LE(n);
        this.writeReverse(bw.toBuffer());
        return this;
    }
    writeUInt8(n) {
        $iPNRo(this, n);
        return this;
    }
    writeUInt64LEBN(bn) {
        var buf = bn.toBuffer({
            size: 8
        });
        this.writeReverse(buf);
        return this;
    }
    writeUInt64BEBN(bn) {
        var bw = new $b4b20081d1d22dbe$var$BufferWriter();
        bw.writeUInt64LEBN(bn);
        this.writeReverse(bw.toBuffer());
        return this;
    }
    writeVarintNum(n) {
        $66R9M(this, n);
        return this;
    }
    writeInt32LE(n) {
        $3THmi(this, n);
        return this;
    }
    static varintBufNum(n) {
        var bw = new $b4b20081d1d22dbe$var$BufferWriter();
        bw.writeVarintNum(n);
        return bw.toBuffer();
    }
    writeVarintBN(bn) {
        var n = bn.toNumber();
        if (n < 253) $iPNRo(this, n);
        else if (n < 0x10000) {
            $iPNRo(this, 253);
            $acKBR(this, n);
        } else if (n < 0x100000000) {
            $iPNRo(this, 254);
            $5DrP1(this, n);
        } else {
            var bw = new $b4b20081d1d22dbe$var$BufferWriter();
            bw.writeUInt8(255);
            bw.writeUInt64LEBN(bn);
            var buf = bw.toBuffer();
            this.write(buf);
        }
        return this;
    }
}
module.exports = $b4b20081d1d22dbe$var$BufferWriter;

});
parcelRegister("iPNRo", function(module, exports) {
function $db63aa94ecc1290b$var$writeU8LE(writer, n) {
    if (n > 0xff) throw new Error("number too large");
    const buffer = new Uint8Array(1);
    buffer[0] = n;
    return writer.write(buffer);
}
module.exports = $db63aa94ecc1290b$var$writeU8LE;

});

parcelRegister("acKBR", function(module, exports) {
function $76df2e16dc52cc69$var$writeU16LE(writer, n) {
    if (n > 0xffff) throw new Error("number too large");
    const buffer = new Uint8Array(2);
    buffer[0] = n % 256;
    n = n >> 8;
    buffer[1] = n % 256;
    return writer.write(buffer);
}
module.exports = $76df2e16dc52cc69$var$writeU16LE;

});

parcelRegister("5DrP1", function(module, exports) {
function $41a62d25e9033b98$var$writeU32LE(writer, n) {
    if (n > 0xffffffff) throw new Error("number too large");
    const buffer = new Uint8Array(4);
    buffer[0] = n % 256;
    n = Math.floor(n / 256);
    buffer[1] = n % 256;
    n = n >> 8;
    buffer[2] = n % 256;
    n = n >> 8;
    buffer[3] = n;
    return writer.write(buffer);
}
module.exports = $41a62d25e9033b98$var$writeU32LE;

});

parcelRegister("3THmi", function(module, exports) {
function $2d68244520bbe259$var$writeI32LE(writer, n) {
    if (n < -2147483648 || n > 2147483647) throw new Error("Out of range. It must be >= -2147483648 and <= 2147483647.");
    const buffer = new Uint8Array(4);
    buffer[0] = n % 256;
    n = Math.floor(n / 256);
    buffer[1] = n % 256;
    n = n >> 8;
    buffer[2] = n % 256;
    n = n >> 8;
    buffer[3] = n;
    return writer.write(buffer);
}
module.exports = $2d68244520bbe259$var$writeI32LE;

});

parcelRegister("66R9M", function(module, exports) {
function $472c896a4e6838c4$var$writeVarint(writer, n) {
    if (n > Number.MAX_SAFE_INTEGER) throw new Error("varint too large");
    if (n <= 0xfc) return writer.write([
        n
    ]);
    if (n <= 0xffff) return writer.write([
        0xfd,
        n % 256,
        Math.floor(n / 256)
    ]);
    if (n <= 0xffffffff) {
        const buffer = new Uint8Array(5);
        buffer[0] = 0xfe;
        buffer[1] = n % 256;
        n = Math.floor(n / 256);
        buffer[2] = n % 256;
        n = Math.floor(n / 256);
        buffer[3] = n % 256;
        n = Math.floor(n / 256);
        buffer[4] = n;
        return writer.write(buffer);
    }
    // n <= 0xffffffffffffffff
    const buffer = new Uint8Array(9);
    buffer[0] = 0xff;
    buffer[1] = n % 256;
    n = Math.floor(n / 256);
    buffer[2] = n % 256;
    n = Math.floor(n / 256);
    buffer[3] = n % 256;
    n = Math.floor(n / 256);
    buffer[4] = n % 256;
    n = Math.floor(n / 256);
    buffer[5] = n % 256;
    n = Math.floor(n / 256);
    buffer[6] = n % 256;
    n = Math.floor(n / 256);
    buffer[7] = n % 256;
    n = Math.floor(n / 256);
    buffer[8] = n;
    return writer.write(buffer);
}
module.exports = $472c896a4e6838c4$var$writeVarint;

});


parcelRegister("5pTcb", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $bbk3w = parcelRequire("bbk3w");
function $3f1a1a396beff35c$var$Opcode(num) {
    if (!(this instanceof $3f1a1a396beff35c$var$Opcode)) return new $3f1a1a396beff35c$var$Opcode(num);
    var value;
    if ($iUxHD.isNumber(num)) value = num;
    else if ($iUxHD.isString(num)) value = $3f1a1a396beff35c$var$Opcode.map[num];
    else throw new TypeError('Unrecognized num type: "' + typeof num + '" for Opcode');
    $bbk3w.defineImmutable(this, {
        num: value
    });
    return this;
}
$3f1a1a396beff35c$var$Opcode.fromBuffer = function(buf) {
    $e34gf.checkArgument(Buffer.isBuffer(buf));
    return new $3f1a1a396beff35c$var$Opcode(Number("0x" + buf.toString("hex")));
};
$3f1a1a396beff35c$var$Opcode.fromNumber = function(num) {
    $e34gf.checkArgument($iUxHD.isNumber(num));
    return new $3f1a1a396beff35c$var$Opcode(num);
};
$3f1a1a396beff35c$var$Opcode.fromString = function(str) {
    $e34gf.checkArgument($iUxHD.isString(str));
    var value = $3f1a1a396beff35c$var$Opcode.map[str];
    if (typeof value === "undefined") throw new TypeError("Invalid opcodestr");
    return new $3f1a1a396beff35c$var$Opcode(value);
};
$3f1a1a396beff35c$var$Opcode.prototype.toHex = function() {
    return this.num.toString(16);
};
$3f1a1a396beff35c$var$Opcode.prototype.toBuffer = function() {
    return Buffer.from(this.toHex(), "hex");
};
$3f1a1a396beff35c$var$Opcode.prototype.toNumber = function() {
    return this.num;
};
$3f1a1a396beff35c$var$Opcode.prototype.toString = function() {
    var str = $3f1a1a396beff35c$var$Opcode.reverseMap[this.num];
    if (typeof str === "undefined") throw new Error("Opcode does not have a string representation");
    return str;
};
$3f1a1a396beff35c$var$Opcode.prototype.toSafeString = function() {
    var str = $3f1a1a396beff35c$var$Opcode.reverseMap[this.num];
    if (typeof str === "undefined") return this.toHex();
    return str;
};
$3f1a1a396beff35c$var$Opcode.smallInt = function(n) {
    $e34gf.checkArgument($iUxHD.isNumber(n), "Invalid Argument: n should be number");
    $e34gf.checkArgument(n >= 0 && n <= 16, "Invalid Argument: n must be between 0 and 16");
    if (n === 0) return $3f1a1a396beff35c$var$Opcode("OP_0");
    return new $3f1a1a396beff35c$var$Opcode($3f1a1a396beff35c$var$Opcode.map.OP_1 + n - 1);
};
$3f1a1a396beff35c$var$Opcode.map = {
    // push value
    OP_FALSE: 0,
    OP_0: 0,
    OP_PUSHDATA1: 76,
    OP_PUSHDATA2: 77,
    OP_PUSHDATA4: 78,
    OP_1NEGATE: 79,
    OP_RESERVED: 80,
    OP_TRUE: 81,
    OP_1: 81,
    OP_2: 82,
    OP_3: 83,
    OP_4: 84,
    OP_5: 85,
    OP_6: 86,
    OP_7: 87,
    OP_8: 88,
    OP_9: 89,
    OP_10: 90,
    OP_11: 91,
    OP_12: 92,
    OP_13: 93,
    OP_14: 94,
    OP_15: 95,
    OP_16: 96,
    // control
    OP_NOP: 97,
    OP_VER: 98,
    OP_IF: 99,
    OP_NOTIF: 100,
    OP_VERIF: 101,
    OP_VERNOTIF: 102,
    OP_ELSE: 103,
    OP_ENDIF: 104,
    OP_VERIFY: 105,
    OP_RETURN: 106,
    // stack ops
    OP_TOALTSTACK: 107,
    OP_FROMALTSTACK: 108,
    OP_2DROP: 109,
    OP_2DUP: 110,
    OP_3DUP: 111,
    OP_2OVER: 112,
    OP_2ROT: 113,
    OP_2SWAP: 114,
    OP_IFDUP: 115,
    OP_DEPTH: 116,
    OP_DROP: 117,
    OP_DUP: 118,
    OP_NIP: 119,
    OP_OVER: 120,
    OP_PICK: 121,
    OP_ROLL: 122,
    OP_ROT: 123,
    OP_SWAP: 124,
    OP_TUCK: 125,
    // splice ops
    OP_CAT: 126,
    OP_SPLIT: 127,
    OP_NUM2BIN: 128,
    OP_BIN2NUM: 129,
    OP_SIZE: 130,
    // bit logic
    OP_INVERT: 131,
    OP_AND: 132,
    OP_OR: 133,
    OP_XOR: 134,
    OP_EQUAL: 135,
    OP_EQUALVERIFY: 136,
    OP_RESERVED1: 137,
    OP_RESERVED2: 138,
    // numeric
    OP_1ADD: 139,
    OP_1SUB: 140,
    OP_2MUL: 141,
    OP_2DIV: 142,
    OP_NEGATE: 143,
    OP_ABS: 144,
    OP_NOT: 145,
    OP_0NOTEQUAL: 146,
    OP_ADD: 147,
    OP_SUB: 148,
    OP_MUL: 149,
    OP_DIV: 150,
    OP_MOD: 151,
    OP_LSHIFT: 152,
    OP_RSHIFT: 153,
    OP_BOOLAND: 154,
    OP_BOOLOR: 155,
    OP_NUMEQUAL: 156,
    OP_NUMEQUALVERIFY: 157,
    OP_NUMNOTEQUAL: 158,
    OP_LESSTHAN: 159,
    OP_GREATERTHAN: 160,
    OP_LESSTHANOREQUAL: 161,
    OP_GREATERTHANOREQUAL: 162,
    OP_MIN: 163,
    OP_MAX: 164,
    OP_WITHIN: 165,
    // crypto
    OP_RIPEMD160: 166,
    OP_SHA1: 167,
    OP_SHA256: 168,
    OP_HASH160: 169,
    OP_HASH256: 170,
    OP_CODESEPARATOR: 171,
    OP_CHECKSIG: 172,
    OP_CHECKSIGVERIFY: 173,
    OP_CHECKMULTISIG: 174,
    OP_CHECKMULTISIGVERIFY: 175,
    OP_CHECKLOCKTIMEVERIFY: 177,
    OP_CHECKSEQUENCEVERIFY: 178,
    // expansion
    OP_NOP1: 176,
    OP_NOP2: 177,
    OP_NOP3: 178,
    OP_NOP4: 179,
    OP_NOP5: 180,
    OP_NOP6: 181,
    OP_NOP7: 182,
    OP_NOP8: 183,
    OP_NOP9: 184,
    OP_NOP10: 185,
    // template matching params
    OP_PUBKEYHASH: 253,
    OP_PUBKEY: 254,
    OP_INVALIDOPCODE: 255
};
$3f1a1a396beff35c$var$Opcode.reverseMap = [];
for(var $3f1a1a396beff35c$var$k in $3f1a1a396beff35c$var$Opcode.map)$3f1a1a396beff35c$var$Opcode.reverseMap[$3f1a1a396beff35c$var$Opcode.map[$3f1a1a396beff35c$var$k]] = $3f1a1a396beff35c$var$k;
// Easier access to opcodes
$iUxHD.extend($3f1a1a396beff35c$var$Opcode, $3f1a1a396beff35c$var$Opcode.map);
/**
 * @returns true if opcode is one of OP_0, OP_1, ..., OP_16
 */ $3f1a1a396beff35c$var$Opcode.isSmallIntOp = function(opcode) {
    if (opcode instanceof $3f1a1a396beff35c$var$Opcode) opcode = opcode.toNumber();
    return opcode === $3f1a1a396beff35c$var$Opcode.map.OP_0 || opcode >= $3f1a1a396beff35c$var$Opcode.map.OP_1 && opcode <= $3f1a1a396beff35c$var$Opcode.map.OP_16;
};
/**
 * Will return a string formatted for the console
 *
 * @returns {string} Script opcode
 */ $3f1a1a396beff35c$var$Opcode.prototype.inspect = function() {
    return "<Opcode: " + this.toString() + ", hex: " + this.toHex() + ", decimal: " + this.num + ">";
};
module.exports = $3f1a1a396beff35c$var$Opcode;

});

parcelRegister("hcB6V", function(module, exports) {
function $c860580f0eed5adb$var$decodeScriptChunks(script) {
    const chunks = [];
    let i = 0;
    let len = 0;
    while(i < script.length){
        const opcodenum = script[i];
        i += 1;
        if (opcodenum === 0) {
            len = opcodenum;
            chunks.push({
                opcodenum: opcodenum,
                len: len
            });
        } else if (opcodenum < 76) {
            len = opcodenum;
            chunks.push({
                opcodenum: opcodenum,
                buf: script.slice(i, i + opcodenum),
                len: len
            });
            i += opcodenum;
        } else if (opcodenum === 76) {
            len = script[i];
            i += 1;
            chunks.push({
                opcodenum: opcodenum,
                buf: script.slice(i, i + len),
                len: len
            });
            i += len;
        } else if (opcodenum === 77) {
            len = script[i] | script[i + 1] << 8;
            i += 2;
            chunks.push({
                opcodenum: opcodenum,
                buf: script.slice(i, i + len),
                len: len
            });
            i += len;
        } else if (opcodenum === 78) {
            len = script[i] + script[i + 1] * 0x0100 + script[i + 2] * 0x010000 + script[i + 3] * 0x01000000;
            i += 4;
            chunks.push({
                opcodenum: opcodenum,
                buf: script.slice(i, i + len),
                len: len
            });
            i += len;
        } else chunks.push({
            opcodenum: opcodenum
        });
    }
    // if (i !== script.length) throw new Error('bad script')
    return chunks;
}
module.exports = $c860580f0eed5adb$var$decodeScriptChunks;

});

parcelRegister("5kRlf", function(module, exports) {

var $gMcxC = parcelRequire("gMcxC");

var $5pTcb = parcelRequire("5pTcb");

var $fvPTe = parcelRequire("fvPTe");

var $iWn8t = parcelRequire("iWn8t");
function $3e28328e63d1f130$var$decodeASM(script) {
    const parts = script.split(" ");
    const writer = new $fvPTe();
    parts.forEach((part)=>{
        if (part in $5pTcb) writer.write([
            $5pTcb[part]
        ]);
        else if (part === "0") writer.write([
            $5pTcb.OP_0
        ]);
        else if (part === "-1") writer.write([
            $5pTcb.OP_1NEGATE
        ]);
        else {
            const buf = $gMcxC(part);
            $iWn8t(writer, buf);
        }
    });
    return writer.toBuffer();
}
module.exports = $3e28328e63d1f130$var$decodeASM;

});
parcelRegister("gMcxC", function(module, exports) {
/* global VARIANT */ 
var $iD62N = parcelRequire("iD62N");
// Prefer our implementation of decodeHex over Buffer when we don't know the VARIANT
// to avoid accidentally importing the Buffer shim in the browser.
function $c36adb718dea166c$var$decodeHex(hex) {
    if (typeof hex !== "string") throw new Error("not a string");
    if (hex.startsWith("0x")) hex = hex.slice(2);
    if (hex.length % 2 === 1) hex = "0" + hex;
    if (!$iD62N(hex)) throw new Error("invalid hex string in script");
    if (typeof VARIANT === "undefined" || VARIANT === "browser") {
        const length = hex.length / 2;
        const arr = new Uint8Array(length);
        const isNaN = (x)=>x !== x // eslint-disable-line no-self-compare
        ;
        for(let i = 0; i < length; ++i){
            const byte = parseInt(hex.substr(i * 2, 2), 16);
            if (isNaN(byte)) throw new Error("bad hex char");
            arr[i] = byte;
        }
        return arr;
    } else return Buffer.from(hex, "hex");
}
module.exports = $c36adb718dea166c$var$decodeHex;

});
parcelRegister("iD62N", function(module, exports) {
const $d9008ebb51d8bafc$var$HEX_REGEX = /^(?:[a-fA-F0-9][a-fA-F0-9])*$/;
function $d9008ebb51d8bafc$var$isHex(s) {
    return $d9008ebb51d8bafc$var$HEX_REGEX.test(s);
}
module.exports = $d9008ebb51d8bafc$var$isHex;

});


parcelRegister("iWn8t", function(module, exports) {
function $dc9f9706242b874f$var$writePushData(writer, buffer) {
    // It is possible to optimize buffers that only store numbers 1-16, or -1, by using the OP_N opcodes.
    // But we say "push data" is always stored using OP_0 or OP_PUSH(N) so that it's easy to identify and
    // extract, and also because there is some ambiguity around OP_0 if we don't do this.
    if (buffer.length === 0) writer.write([
        0
    ]);
    else if (buffer.length <= 75) {
        writer.write([
            buffer.length
        ]) // OP_PUSH(buffer.length)
        ;
        writer.write(buffer);
    } else if (buffer.length <= 0xFF) {
        writer.write([
            76,
            buffer.length
        ]) // OP_PUSHDATA1
        ;
        writer.write(buffer);
    } else if (buffer.length <= 0xFFFF) {
        writer.write([
            77,
            buffer.length % 256,
            buffer.length >> 8
        ]) // OP_PUSHDATA2
        ;
        writer.write(buffer);
    } else if (buffer.length <= 0xFFFFFFFF) {
        const prefix = new Uint8Array(5);
        prefix[0] = 78 // OP_PUSHDATA4
        ;
        let n = buffer.length;
        prefix[1] = n % 256;
        n = Math.floor(n / 256);
        prefix[2] = n % 256;
        n = Math.floor(n / 256);
        prefix[3] = n % 256;
        n = Math.floor(n / 256);
        prefix[4] = n;
        writer.write(prefix);
        writer.write(buffer);
    } else throw new Error("data too large");
    return writer;
}
module.exports = $dc9f9706242b874f$var$writePushData;

});


parcelRegister("eY7IQ", function(module, exports) {
/* global VARIANT */ let $ae5ca8c7fb2aa8c1$var$encodeHex = null;
// Prefer our implementation of encodeHex over Buffer when we don't know the VARIANT
// to avoid accidentally importing the Buffer shim in the browser.
if (typeof VARIANT === "undefined" || VARIANT === "browser") {
    // In the browser, a lookup table is fastest, and faster than the Buffer toString shim.
    const HEX = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "0a",
        "0b",
        "0c",
        "0d",
        "0e",
        "0f",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "1a",
        "1b",
        "1c",
        "1d",
        "1e",
        "1f",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "2a",
        "2b",
        "2c",
        "2d",
        "2e",
        "2f",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "3a",
        "3b",
        "3c",
        "3d",
        "3e",
        "3f",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "4a",
        "4b",
        "4c",
        "4d",
        "4e",
        "4f",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "5a",
        "5b",
        "5c",
        "5d",
        "5e",
        "5f",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "67",
        "68",
        "69",
        "6a",
        "6b",
        "6c",
        "6d",
        "6e",
        "6f",
        "70",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "78",
        "79",
        "7a",
        "7b",
        "7c",
        "7d",
        "7e",
        "7f",
        "80",
        "81",
        "82",
        "83",
        "84",
        "85",
        "86",
        "87",
        "88",
        "89",
        "8a",
        "8b",
        "8c",
        "8d",
        "8e",
        "8f",
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "9a",
        "9b",
        "9c",
        "9d",
        "9e",
        "9f",
        "a0",
        "a1",
        "a2",
        "a3",
        "a4",
        "a5",
        "a6",
        "a7",
        "a8",
        "a9",
        "aa",
        "ab",
        "ac",
        "ad",
        "ae",
        "af",
        "b0",
        "b1",
        "b2",
        "b3",
        "b4",
        "b5",
        "b6",
        "b7",
        "b8",
        "b9",
        "ba",
        "bb",
        "bc",
        "bd",
        "be",
        "bf",
        "c0",
        "c1",
        "c2",
        "c3",
        "c4",
        "c5",
        "c6",
        "c7",
        "c8",
        "c9",
        "ca",
        "cb",
        "cc",
        "cd",
        "ce",
        "cf",
        "d0",
        "d1",
        "d2",
        "d3",
        "d4",
        "d5",
        "d6",
        "d7",
        "d8",
        "d9",
        "da",
        "db",
        "dc",
        "dd",
        "de",
        "df",
        "e0",
        "e1",
        "e2",
        "e3",
        "e4",
        "e5",
        "e6",
        "e7",
        "e8",
        "e9",
        "ea",
        "eb",
        "ec",
        "ed",
        "ee",
        "ef",
        "f0",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "fa",
        "fb",
        "fc",
        "fd",
        "fe",
        "ff"
    ];
    $ae5ca8c7fb2aa8c1$var$encodeHex = function(buffer) {
        const len = buffer.length;
        const out = new Array(len);
        for(let i = 0; i < len; ++i)out[i] = HEX[buffer[i]];
        return out.join("");
    };
} else // Buffer toString('hex') in Node is faster than any JavaScript we could write
$ae5ca8c7fb2aa8c1$var$encodeHex = function(buffer) {
    return buffer instanceof Buffer ? buffer.toString("hex") : Buffer.from(buffer).toString("hex");
};
module.exports = $ae5ca8c7fb2aa8c1$var$encodeHex;

});


parcelRegister("9uoiU", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $jQNLW = parcelRequire("jQNLW");

var $5pTcb = parcelRequire("5pTcb");

var $lM2TS = parcelRequire("lM2TS");

var $aScoK = parcelRequire("aScoK");

var $km2cb = parcelRequire("km2cb");

var $hbQdz = parcelRequire("hbQdz");

var $2ijCr = parcelRequire("2ijCr");
/**
 * Bitcoin transactions contain scripts. Each input has a script called the
 * scriptSig, and each output has a script called the scriptPubkey. To validate
 * an input, the input's script is concatenated with the referenced output script,
 * and the result is executed. If at the end of execution the stack contains a
 * "true" value, then the transaction is valid.
 *
 * The primary way to use this class is via the verify function.
 * e.g., Interpreter().verify( ... );
 */ var $6e89c4ab0f303d12$var$Interpreter = function Interpreter(obj) {
    if (!(this instanceof Interpreter)) return new Interpreter(obj);
    if (obj) {
        this.initialize();
        this.set(obj);
    } else this.initialize();
};

/**
 * Verifies a Script by executing it and returns true if it is valid.
 * This function needs to be provided with the scriptSig and the scriptPubkey
 * separately.
 * @param {Script} scriptSig - the script's first part (corresponding to the tx input)
 * @param {Script} scriptPubkey - the script's last part (corresponding to the tx output)
 * @param {Transaction=} tx - the Transaction containing the scriptSig in one input (used
 *    to check signature validity for some opcodes like OP_CHECKSIG)
 * @param {number} nin - index of the transaction input containing the scriptSig verified.
 * @param {number} flags - evaluation flags. See Interpreter.SCRIPT_* constants
 * @param {number} satoshisBN - amount in satoshis of the input to be verified (when FORKID signhash is used)
 *
 * Translated from bitcoind's VerifyScript
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.verify = function(scriptSig, scriptPubkey, tx, nin, flags, satoshisBN, sighashScript) {
    var Transaction = (parcelRequire("67vNY"));
    if ($iUxHD.isUndefined(tx)) tx = new Transaction();
    if ($iUxHD.isUndefined(nin)) nin = 0;
    if ($iUxHD.isUndefined(flags)) flags = 0;
    // If FORKID is enabled, we also ensure strict encoding.
    if (flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID) {
        flags |= $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC;
        // If FORKID is enabled, we need the input amount.
        if (!satoshisBN) throw new Error("internal error - need satoshisBN to verify FORKID transactions");
    }
    this.set({
        script: scriptSig,
        tx: tx,
        nin: nin,
        flags: flags,
        satoshisBN: satoshisBN,
        sighashScript: sighashScript
    });
    var stackCopy;
    if ((flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_SIGPUSHONLY) !== 0 && !scriptSig.isPushOnly()) {
        this.errstr = "SCRIPT_ERR_SIG_PUSHONLY";
        return false;
    }
    // evaluate scriptSig
    if (!this.evaluate("scriptSig")) return false;
    if (flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_P2SH) stackCopy = this.stack.copy();
    var stack = this.stack;
    this.initialize();
    this.set({
        script: scriptPubkey,
        stack: stack,
        tx: tx,
        nin: nin,
        flags: flags,
        satoshisBN: satoshisBN,
        sighashScript: sighashScript
    });
    // evaluate scriptPubkey
    if (!this.evaluate("scriptPubkey")) return false;
    if (this.stack.length === 0) {
        this.errstr = "SCRIPT_ERR_EVAL_FALSE_NO_RESULT";
        return false;
    }
    var buf = this.stack.stacktop(-1);
    if (!$6e89c4ab0f303d12$var$Interpreter.castToBool(buf)) {
        this.errstr = "SCRIPT_ERR_EVAL_FALSE_IN_STACK";
        return false;
    }
    // Additional validation for spend-to-script-hash transactions:
    if (flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_P2SH && scriptPubkey.isScriptHashOut()) {
        // scriptSig must be literals-only or validation fails
        if (!scriptSig.isPushOnly()) {
            this.errstr = "SCRIPT_ERR_SIG_PUSHONLY";
            return false;
        }
        // stackCopy cannot be empty here, because if it was the
        // P2SH  HASH <> EQUAL  scriptPubKey would be evaluated with
        // an empty stack and the EvalScript above would return false.
        if (stackCopy.length === 0) throw new Error("internal error - stack copy empty");
        var redeemScriptSerialized = stackCopy.stacktop(-1);
        var redeemScript = $jQNLW.fromBuffer(redeemScriptSerialized);
        stackCopy.pop();
        this.initialize();
        this.set({
            script: redeemScript,
            stack: stackCopy,
            tx: tx,
            nin: nin,
            flags: flags,
            satoshisBN: satoshisBN
        });
        // evaluate redeemScript
        if (!this.evaluate()) return false;
        if (stackCopy.length === 0) {
            this.errstr = "SCRIPT_ERR_EVAL_FALSE_NO_P2SH_STACK";
            return false;
        }
        if (!$6e89c4ab0f303d12$var$Interpreter.castToBool(stackCopy.stacktop(-1))) {
            this.errstr = "SCRIPT_ERR_EVAL_FALSE_IN_P2SH_STACK";
            return false;
        }
    }
    // The CLEANSTACK check is only performed after potential P2SH evaluation,
    // as the non-P2SH evaluation of a P2SH script will obviously not result in
    // a clean stack (the P2SH inputs remain). The same holds for witness
    // evaluation.
    if ((flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CLEANSTACK) !== 0) // Disallow CLEANSTACK without P2SH, as otherwise a switch
    // CLEANSTACK->P2SH+CLEANSTACK would be possible, which is not a
    // softfork (and P2SH should be one).
    // if ((flags & Interpreter.SCRIPT_VERIFY_P2SH) === 0) {
    //   throw new Error('internal error - CLEANSTACK without P2SH')
    // }
    {
        if (this.stack.length !== 1) {
            this.errstr = "SCRIPT_ERR_CLEANSTACK";
            return false;
        }
    }
    return true;
};
module.exports = $6e89c4ab0f303d12$var$Interpreter;
$6e89c4ab0f303d12$var$Interpreter.prototype.initialize = function(obj) {
    this.stack = new $2ijCr([]);
    this.altstack = new $2ijCr([]);
    this.pc = 0;
    this.pbegincodehash = 0;
    this.nOpCount = 0;
    this.vfExec = [];
    this.errstr = "";
    this.flags = 0;
    // if OP_RETURN is found in executed branches after genesis is activated,
    // we still have to check if the rest of the script is valid
    this.nonTopLevelReturnAfterGenesis = false;
    this.returned = false;
};
$6e89c4ab0f303d12$var$Interpreter.prototype.set = function(obj) {
    this.script = obj.script || this.script;
    this.tx = obj.tx || this.tx;
    this.nin = typeof obj.nin !== "undefined" ? obj.nin : this.nin;
    this.satoshisBN = obj.satoshisBN || this.satoshisBN;
    this.stack = obj.stack || this.stack;
    this.altstack = obj.altstack || this.altstack;
    this.pc = typeof obj.pc !== "undefined" ? obj.pc : this.pc;
    this.pbegincodehash = typeof obj.pbegincodehash !== "undefined" ? obj.pbegincodehash : this.pbegincodehash;
    this.nOpCount = typeof obj.nOpCount !== "undefined" ? obj.nOpCount : this.nOpCount;
    this.vfExec = obj.vfExec || this.vfExec;
    this.errstr = obj.errstr || this.errstr;
    this.flags = typeof obj.flags !== "undefined" ? obj.flags : this.flags;
    this.sighashScript = obj.sighashScript || this.sighashScript;
};
$6e89c4ab0f303d12$var$Interpreter.prototype.subscript = function() {
    if (this.sighashScript) return this.sighashScript.clone();
    else // Subset of script starting at the most recent codeseparator
    // CScript scriptCode(pbegincodehash, pend);
    return $jQNLW.fromChunks(this.script.chunks.slice(this.pbegincodehash));
};
$6e89c4ab0f303d12$var$Interpreter.getTrue = ()=>Buffer.from([
        1
    ]);
$6e89c4ab0f303d12$var$Interpreter.getFalse = ()=>Buffer.from([]);
$6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_ELEMENT_SIZE = 520;
$6e89c4ab0f303d12$var$Interpreter.MAXIMUM_ELEMENT_SIZE = 4;
$6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD = 500000000;
$6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD_BN = new $lM2TS($6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD);
// flags taken from bitcoind
// bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NONE = 0;
// Evaluate P2SH subscripts (softfork safe, BIP16).
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_P2SH = 1;
// Passing a non-strict-DER signature or one with undefined hashtype to a checksig operation causes script failure.
// Passing a pubkey that is not (0x04 + 64 bytes) or (0x02 or 0x03 + 32 bytes) to checksig causes that pubkey to be
// skipped (not softfork safe: this flag can widen the validity of OP_CHECKSIG OP_NOT).
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC = 2;
// Passing a non-strict-DER signature to a checksig operation causes script failure (softfork safe, BIP62 rule 1)
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DERSIG = 4;
// Passing a non-strict-DER signature or one with S > order/2 to a checksig operation causes script failure
// (softfork safe, BIP62 rule 5).
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_LOW_S = 8;
// verify dummy stack item consumed by CHECKMULTISIG is of zero-length (softfork safe, BIP62 rule 7).
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLDUMMY = 16;
// Using a non-push operator in the scriptSig causes script failure (softfork safe, BIP62 rule 2).
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_SIGPUSHONLY = 32;
// Require minimal encodings for all push operations (OP_0... OP_16, OP_1NEGATE where possible, direct
// pushes up to 75 bytes, OP_PUSHDATA up to 255 bytes, OP_PUSHDATA2 for anything larger). Evaluating
// any other push causes the script to fail (BIP62 rule 3).
// In addition, whenever a stack element is interpreted as a number, it must be of minimal length (BIP62 rule 4).
// (softfork safe)
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_MINIMALDATA = 64;
// Discourage use of NOPs reserved for upgrades (NOP1-10)
//
// Provided so that nodes can avoid accepting or mining transactions
// containing executed NOP's whose meaning may change after a soft-fork,
// thus rendering the script invalid; with this flag set executing
// discouraged NOPs fails the script. This verification flag will never be
// a mandatory flag applied to scripts in a block. NOPs that are not
// executed, e.g.  within an unexecuted IF ENDIF block, are *not* rejected.
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 128;
// Require that only a single stack element remains after evaluation. This
// changes the success criterion from "At least one stack element must
// remain, and when interpreted as a boolean, it must be true" to "Exactly
// one stack element must remain, and when interpreted as a boolean, it must
// be true".
// (softfork safe, BIP62 rule 6)
// Note: CLEANSTACK should never be used without P2SH or WITNESS.
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CLEANSTACK = 256;
// CLTV See BIP65 for details.
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY = 512;
// support CHECKSEQUENCEVERIFY opcode
//
// See BIP112 for details
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY = 1024;
// Segwit script only: Require the argument of OP_IF/NOTIF to be exactly
// 0x01 or empty vector
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_MINIMALIF = 8192;
// Signature(s) must be empty vector if an CHECK(MULTI)SIG operation failed
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLFAIL = 16384;
// Public keys in scripts must be compressed
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_COMPRESSED_PUBKEYTYPE = 32768;
// Do we accept signature using SIGHASH_FORKID
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID = 65536;
// Do we accept activate replay protection using a different fork id.
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_REPLAY_PROTECTION = 131072;
// Enable new opcodes.
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES = 262144;
// Are the Magnetic upgrade opcodes enabled?
//
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES = 524288;
/* Below flags apply in the context of BIP 68 */ /**
 * If this flag set, CTxIn::nSequence is NOT interpreted as a relative
 * lock-time.
 */ $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_DISABLE_FLAG = -2147483648;
/**
 * If CTxIn::nSequence encodes a relative lock-time and this flag is set,
 * the relative lock-time has units of 512 seconds, otherwise it specifies
 * blocks with a granularity of 1.
 */ $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_TYPE_FLAG = 4194304;
/**
 * If CTxIn::nSequence encodes a relative lock-time, this mask is applied to
 * extract that lock-time from the sequence field.
 */ $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_MASK = 0x0000ffff;
$6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_SIZE = Number.MAX_SAFE_INTEGER;
$6e89c4ab0f303d12$var$Interpreter.MAX_OPCODE_COUNT = Number.MAX_SAFE_INTEGER;
$6e89c4ab0f303d12$var$Interpreter.DEFAULT_FLAGS = // Interp.SCRIPT_VERIFY_P2SH | Interp.SCRIPT_VERIFY_CLEANSTACK | // no longer applies now p2sh is deprecated: cleanstack only applies to p2sh
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES | // TODO: to be removed after upgrade to bsv 2.0
$6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_LOW_S | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLFAIL | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DERSIG | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_MINIMALDATA | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLDUMMY | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CLEANSTACK;
$6e89c4ab0f303d12$var$Interpreter.castToBool = function(buf) {
    for(var i = 0; i < buf.length; i++)if (buf[i] !== 0) {
        // can be negative zero
        if (i === buf.length - 1 && buf[i] === 0x80) return false;
        return true;
    }
    return false;
};
/**
 * Translated from bitcoind's CheckSignatureEncoding
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.checkSignatureEncoding = function(buf) {
    var sig;
    // Empty signature. Not strictly DER encoded, but allowed to provide a
    // compact way to provide an invalid signature for use with CHECK(MULTI)SIG
    if (buf.length === 0) return true;
    if ((this.flags & ($6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DERSIG | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_LOW_S | $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC)) !== 0 && !$km2cb.isTxDER(buf)) {
        this.errstr = "SCRIPT_ERR_SIG_DER_INVALID_FORMAT";
        return false;
    } else if ((this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_LOW_S) !== 0) {
        sig = $km2cb.fromTxFormat(buf);
        if (!sig.hasLowS()) {
            this.errstr = "SCRIPT_ERR_SIG_DER_HIGH_S";
            return false;
        }
    } else if ((this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0) {
        sig = $km2cb.fromTxFormat(buf);
        if (!sig.hasDefinedHashtype()) {
            this.errstr = "SCRIPT_ERR_SIG_HASHTYPE";
            return false;
        }
        if (!(this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID) && sig.nhashtype & $km2cb.SIGHASH_FORKID) {
            this.errstr = "SCRIPT_ERR_ILLEGAL_FORKID";
            return false;
        }
        if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID && !(sig.nhashtype & $km2cb.SIGHASH_FORKID)) {
            this.errstr = "SCRIPT_ERR_MUST_USE_FORKID";
            return false;
        }
    }
    return true;
};
/**
 * Translated from bitcoind's CheckPubKeyEncoding
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.checkPubkeyEncoding = function(buf) {
    if ((this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0 && !$hbQdz.isValid(buf)) {
        this.errstr = "SCRIPT_ERR_PUBKEYTYPE";
        return false;
    }
    return true;
};
/**
  *
  * Check the buffer is minimally encoded (see https://github.com/bitcoincashorg/spec/blob/master/may-2018-reenabled-opcodes.md#op_bin2num)
  *
  *
  */ $6e89c4ab0f303d12$var$Interpreter._isMinimallyEncoded = function(buf, nMaxNumSize) {
    nMaxNumSize = nMaxNumSize || $6e89c4ab0f303d12$var$Interpreter.MAXIMUM_ELEMENT_SIZE;
    if (buf.length > nMaxNumSize) return false;
    if (buf.length > 0) // Check that the number is encoded with the minimum possible number
    // of bytes.
    //
    // If the most-significant-byte - excluding the sign bit - is zero
    // then we're not minimal. Note how this test also rejects the
    // negative-zero encoding, 0x80.
    {
        if ((buf[buf.length - 1] & 0x7f) === 0) {
            // One exception: if there's more than one byte and the most
            // significant bit of the second-most-significant-byte is set it
            // would conflict with the sign bit. An example of this case is
            // +-255, which encode to 0xff00 and 0xff80 respectively.
            // (big-endian).
            if (buf.length <= 1 || (buf[buf.length - 2] & 0x80) === 0) return false;
        }
    }
    return true;
};
/**
  *
  * minimally encode the buffer content
  *
  * @param {number} nMaxNumSize (max allowed size)
  */ $6e89c4ab0f303d12$var$Interpreter._minimallyEncode = function(buf) {
    if (buf.length === 0) return buf;
    // If the last byte is not 0x00 or 0x80, we are minimally encoded.
    var last = buf[buf.length - 1];
    if (last & 0x7f) return buf;
    // If the script is one byte long, then we have a zero, which encodes as an
    // empty array.
    if (buf.length === 1) return Buffer.from("");
    // If the next byte has it sign bit set, then we are minimaly encoded.
    if (buf[buf.length - 2] & 0x80) return buf;
    // We are not minimally encoded, we need to figure out how much to trim.
    for(var i = buf.length - 1; i > 0; i--)// We found a non zero byte, time to encode.
    if (buf[i - 1] !== 0) {
        if (buf[i - 1] & 0x80) // We found a byte with it sign bit set so we need one more
        // byte.
        buf[i++] = last;
        else // the sign bit is clear, we can use it.
        buf[i - 1] |= last;
        return buf.slice(0, i);
    }
    // If we found the whole thing is zeros, then we have a zero.
    return Buffer.from("");
};
/**
 * Based on bitcoind's EvalScript function, with the inner loop moved to
 * Interpreter.prototype.step()
 * bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.evaluate = function(scriptType) {
    // TODO: script size should be configurable. no magic numbers
    if (this.script.toBuffer().length > $6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_SIZE) {
        this.errstr = "SCRIPT_ERR_SCRIPT_SIZE";
        return false;
    }
    try {
        while(!this.returned && this.pc < this.script.chunks.length){
            // fExec: if the opcode will be executed, i.e., not in a false branch
            let thisStep = {
                pc: this.pc,
                fExec: this.vfExec.indexOf(false) === -1,
                opcode: $5pTcb.fromNumber(this.script.chunks[this.pc].opcodenum)
            };
            var fSuccess = this.step(scriptType);
            this._callbackStep(thisStep);
            if (!fSuccess) return false;
        }
        // Size limits
        if (this.stack.length + this.altstack.length > 1000) {
            this.errstr = "SCRIPT_ERR_STACK_SIZE";
            return false;
        }
    } catch (e) {
        this.errstr = "SCRIPT_ERR_UNKNOWN_ERROR: " + e;
        return false;
    }
    if (this.vfExec.length > 0) {
        this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL";
        return false;
    }
    return true;
};
$6e89c4ab0f303d12$var$Interpreter.prototype._callbackStep = function(thisStep) {
    if (typeof this.stepListener === "function") try {
        this.stepListener(thisStep);
    } catch (err) {
        console.log(`Error in Step callback:${err}`);
    }
};
/**
 * call to update stackvar
 * @param {*} stack
 */ $6e89c4ab0f303d12$var$Interpreter.prototype._callbackStack = function(stack, pc, scriptType) {
    if (typeof this.stackListener === "function") try {
        this.stackListener(stack, pc, scriptType);
    } catch (err) {
        var chunk = this.script.chunks[pc];
        console.error(`Error: ${err} in _updateStack pc: ${pc}, opcode ${$5pTcb.fromNumber(chunk.opcodenum).toSafeString()}`);
    }
};
/**
 * Checks a locktime parameter with the transaction's locktime.
 * There are two times of nLockTime: lock-by-blockheight and lock-by-blocktime,
 * distinguished by whether nLockTime < LOCKTIME_THRESHOLD = 500000000
 *
 * See the corresponding code on bitcoin core:
 * https://github.com/bitcoin/bitcoin/blob/ffd75adce01a78b3461b3ff05bcc2b530a9ce994/src/script/interpreter.cpp#L1129
 *
 * @param {BN} nLockTime the locktime read from the script
 * @return {boolean} true if the transaction's locktime is less than or equal to
 *                   the transaction's locktime
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.checkLockTime = function(nLockTime) {
    // We want to compare apples to apples, so fail the script
    // unless the type of nLockTime being tested is the same as
    // the nLockTime in the transaction.
    if (!(this.tx.nLockTime < $6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD && nLockTime.lt($6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD_BN) || this.tx.nLockTime >= $6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD && nLockTime.gte($6e89c4ab0f303d12$var$Interpreter.LOCKTIME_THRESHOLD_BN))) return false;
    // Now that we know we're comparing apples-to-apples, the
    // comparison is a simple numeric one.
    if (nLockTime.gt(new $lM2TS(this.tx.nLockTime))) return false;
    // Finally the nLockTime feature can be disabled and thus
    // CHECKLOCKTIMEVERIFY bypassed if every txin has been
    // finalized by setting nSequence to maxint. The
    // transaction would be allowed into the blockchain, making
    // the opcode ineffective.
    //
    // Testing if this vin is not final is sufficient to
    // prevent this condition. Alternatively we could test all
    // inputs, but testing just this input minimizes the data
    // required to prove correct CHECKLOCKTIMEVERIFY execution.
    if (this.tx.inputs[this.nin].isFinal()) return false;
    return true;
};
/**
 * Checks a sequence parameter with the transaction's sequence.
 * @param {BN} nSequence the sequence read from the script
 * @return {boolean} true if the transaction's sequence is less than or equal to
 *                   the transaction's sequence
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.checkSequence = function(nSequence) {
    // Relative lock times are supported by comparing the passed in operand to
    // the sequence number of the input.
    var txToSequence = this.tx.inputs[this.nin].sequenceNumber;
    // Fail if the transaction's version number is not set high enough to
    // trigger BIP 68 rules.
    if (this.tx.version < 2) return false;
    // Sequence numbers with their most significant bit set are not consensus
    // constrained. Testing that the transaction's sequence number do not have
    // this bit set prevents using this property to get around a
    // CHECKSEQUENCEVERIFY check.
    if (txToSequence & $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_DISABLE_FLAG) return false;
    // Mask off any bits that do not have consensus-enforced meaning before
    // doing the integer comparisons
    var nLockTimeMask = $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_TYPE_FLAG | $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_MASK;
    var txToSequenceMasked = new $lM2TS(txToSequence & nLockTimeMask);
    var nSequenceMasked = nSequence.and(nLockTimeMask);
    // There are two kinds of nSequence: lock-by-blockheight and
    // lock-by-blocktime, distinguished by whether nSequenceMasked <
    // CTxIn::SEQUENCE_LOCKTIME_TYPE_FLAG.
    //
    // We want to compare apples to apples, so fail the script unless the type
    // of nSequenceMasked being tested is the same as the nSequenceMasked in the
    // transaction.
    var SEQUENCE_LOCKTIME_TYPE_FLAG_BN = new $lM2TS($6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_TYPE_FLAG);
    if (!(txToSequenceMasked.lt(SEQUENCE_LOCKTIME_TYPE_FLAG_BN) && nSequenceMasked.lt(SEQUENCE_LOCKTIME_TYPE_FLAG_BN) || txToSequenceMasked.gte(SEQUENCE_LOCKTIME_TYPE_FLAG_BN) && nSequenceMasked.gte(SEQUENCE_LOCKTIME_TYPE_FLAG_BN))) return false;
    // Now that we know we're comparing apples-to-apples, the comparison is a
    // simple numeric one.
    if (nSequenceMasked.gt(txToSequenceMasked)) return false;
    return true;
};
function $6e89c4ab0f303d12$var$padBufferToSize(buf, len) {
    let b = buf;
    while(b.length < len)b = Buffer.concat([
        Buffer.from([
            0x00
        ]),
        b
    ]);
    return b;
}
/**
 * Based on the inner loop of bitcoind's EvalScript function
 * bitcoind commit: b5d1b1092998bc95313856d535c632ea5a8f9104
 */ $6e89c4ab0f303d12$var$Interpreter.prototype.step = function(scriptType) {
    var self = this;
    function stacktop(i) {
        return self.stack.stacktop(i);
    }
    function vartop(i) {
        return self.stack.vartop(i);
    }
    function isOpcodeDisabled(opcode) {
        switch(opcode){
            case $5pTcb.OP_2MUL:
            case $5pTcb.OP_2DIV:
                // Disabled opcodes.
                return true;
            case $5pTcb.OP_INVERT:
            case $5pTcb.OP_MUL:
            case $5pTcb.OP_LSHIFT:
            case $5pTcb.OP_RSHIFT:
                // Opcodes that have been reenabled.
                if ((self.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES) === 0) return true;
                break;
            case $5pTcb.OP_DIV:
            case $5pTcb.OP_MOD:
            case $5pTcb.OP_SPLIT:
            case $5pTcb.OP_CAT:
            case $5pTcb.OP_AND:
            case $5pTcb.OP_OR:
            case $5pTcb.OP_XOR:
            case $5pTcb.OP_BIN2NUM:
            case $5pTcb.OP_NUM2BIN:
                // Opcodes that have been reenabled.
                if ((self.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES) === 0) return true;
                break;
            default:
                break;
        }
        return false;
    }
    var fRequireMinimal = (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_MINIMALDATA) !== 0;
    // bool fExec = !count(vfExec.begin(), vfExec.end(), false);
    var buf, buf1, buf2, spliced, n, x1, x2, bn, bn1, bn2, bufSig, bufPubkey, subscript;
    var sig, pubkey;
    var fValue, fSuccess;
    var var1, var2, var3;
    // Read instruction
    var chunk = this.script.chunks[this.pc];
    this.pc++;
    var opcodenum = chunk.opcodenum;
    if ($iUxHD.isUndefined(opcodenum)) {
        this.errstr = "SCRIPT_ERR_UNDEFINED_OPCODE";
        return false;
    }
    if (chunk.buf && chunk.buf.length > $6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_ELEMENT_SIZE) {
        this.errstr = "SCRIPT_ERR_PUSH_SIZE";
        return false;
    }
    // Do not execute instructions if Genesis OP_RETURN was found in executed branches.
    var fExec = this.vfExec.indexOf(false) === -1 && (!this.nonTopLevelReturnAfterGenesis || opcodenum === $5pTcb.OP_RETURN);
    // Note how Opcode.OP_RESERVED does not count towards the opcode limit.
    if (opcodenum > $5pTcb.OP_16 && ++this.nOpCount > $6e89c4ab0f303d12$var$Interpreter.MAX_OPCODE_COUNT) {
        this.errstr = "SCRIPT_ERR_OP_COUNT";
        return false;
    }
    if (isOpcodeDisabled(opcodenum)) {
        this.errstr = "SCRIPT_ERR_DISABLED_OPCODE";
        return false;
    }
    if (fExec && opcodenum >= 0 && opcodenum <= $5pTcb.OP_PUSHDATA4) {
        if (fRequireMinimal && !this.script.checkMinimalPush(this.pc - 1)) {
            this.errstr = "SCRIPT_ERR_MINIMALDATA";
            return false;
        }
        if (!chunk.buf) this.stack.push($6e89c4ab0f303d12$var$Interpreter.getFalse());
        else if (chunk.len !== chunk.buf.length) throw new Error(`Length of push value not equal to length of data (${chunk.len},${chunk.buf.length})`);
        else this.stack.push(chunk.buf);
    } else if (fExec || $5pTcb.OP_IF <= opcodenum && opcodenum <= $5pTcb.OP_ENDIF) switch(opcodenum){
        // Push value
        case $5pTcb.OP_1NEGATE:
        case $5pTcb.OP_1:
        case $5pTcb.OP_2:
        case $5pTcb.OP_3:
        case $5pTcb.OP_4:
        case $5pTcb.OP_5:
        case $5pTcb.OP_6:
        case $5pTcb.OP_7:
        case $5pTcb.OP_8:
        case $5pTcb.OP_9:
        case $5pTcb.OP_10:
        case $5pTcb.OP_11:
        case $5pTcb.OP_12:
        case $5pTcb.OP_13:
        case $5pTcb.OP_14:
        case $5pTcb.OP_15:
        case $5pTcb.OP_16:
            // ( -- value)
            // ScriptNum bn((int)opcode - (int)(Opcode.OP_1 - 1));
            n = opcodenum - ($5pTcb.OP_1 - 1);
            buf = new $lM2TS(n).toScriptNumBuffer();
            this.stack.push(buf);
            break;
        //
        // Control
        //
        case $5pTcb.OP_NOP:
            break;
        case $5pTcb.OP_NOP2:
        case $5pTcb.OP_CHECKLOCKTIMEVERIFY:
            if (!(this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY)) {
                // not enabled; treat as a NOP2
                if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
                    this.errstr = "SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS";
                    return false;
                }
                break;
            }
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            // Note that elsewhere numeric opcodes are limited to
            // operands in the range -2**31+1 to 2**31-1, however it is
            // legal for opcodes to produce results exceeding that
            // range. This limitation is implemented by CScriptNum's
            // default 4-byte limit.
            //
            // If we kept to that limit we'd have a year 2038 problem,
            // even though the nLockTime field in transactions
            // themselves is uint32 which only becomes meaningless
            // after the year 2106.
            //
            // Thus as a special case we tell CScriptNum to accept up
            // to 5-byte bignums, which are good until 2**39-1, well
            // beyond the 2**32-1 limit of the nLockTime field itself.
            var nLockTime = $lM2TS.fromScriptNumBuffer(this.stack.stacktop(-1), fRequireMinimal, 5);
            // In the rare event that the argument may be < 0 due to
            // some arithmetic being done first, you can always use
            // 0 MAX CHECKLOCKTIMEVERIFY.
            if (nLockTime.lt(new $lM2TS(0))) {
                this.errstr = "SCRIPT_ERR_NEGATIVE_LOCKTIME";
                return false;
            }
            // Actually compare the specified lock time with the transaction.
            if (!this.checkLockTime(nLockTime)) {
                this.errstr = "SCRIPT_ERR_UNSATISFIED_LOCKTIME";
                return false;
            }
            break;
        case $5pTcb.OP_NOP3:
        case $5pTcb.OP_CHECKSEQUENCEVERIFY:
            if (!(this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY)) {
                // not enabled; treat as a NOP3
                if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
                    this.errstr = "SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS";
                    return false;
                }
                break;
            }
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            // nSequence, like nLockTime, is a 32-bit unsigned
            // integer field. See the comment in CHECKLOCKTIMEVERIFY
            // regarding 5-byte numeric operands.
            var nSequence = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal, 5);
            // In the rare event that the argument may be < 0 due to
            // some arithmetic being done first, you can always use
            // 0 MAX CHECKSEQUENCEVERIFY.
            if (nSequence.lt(new $lM2TS(0))) {
                this.errstr = "SCRIPT_ERR_NEGATIVE_LOCKTIME";
                return false;
            }
            // To provide for future soft-fork extensibility, if the
            // operand has the disabled lock-time flag set,
            // CHECKSEQUENCEVERIFY behaves as a NOP.
            if ((nSequence & $6e89c4ab0f303d12$var$Interpreter.SEQUENCE_LOCKTIME_DISABLE_FLAG) !== 0) break;
            // Actually compare the specified lock time with the transaction.
            if (!this.checkSequence(nSequence)) {
                this.errstr = "SCRIPT_ERR_UNSATISFIED_LOCKTIME";
                return false;
            }
            break;
        case $5pTcb.OP_NOP1:
        case $5pTcb.OP_NOP4:
        case $5pTcb.OP_NOP5:
        case $5pTcb.OP_NOP6:
        case $5pTcb.OP_NOP7:
        case $5pTcb.OP_NOP8:
        case $5pTcb.OP_NOP9:
        case $5pTcb.OP_NOP10:
            if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
                this.errstr = "SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS";
                return false;
            }
            break;
        case $5pTcb.OP_IF:
        case $5pTcb.OP_NOTIF:
            // <expression> if [statements] [else [statements]] endif
            // bool fValue = false;
            fValue = false;
            if (fExec) {
                if (this.stack.length < 1) {
                    this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL";
                    return false;
                }
                buf = stacktop(-1);
                if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_MINIMALIF) {
                    if (buf.length > 1) {
                        this.errstr = "SCRIPT_ERR_MINIMALIF";
                        return false;
                    }
                    if (buf.length === 1 && buf[0] !== 1) {
                        this.errstr = "SCRIPT_ERR_MINIMALIF";
                        return false;
                    }
                }
                fValue = $6e89c4ab0f303d12$var$Interpreter.castToBool(buf);
                if (opcodenum === $5pTcb.OP_NOTIF) fValue = !fValue;
                this.stack.pop();
            }
            this.vfExec.push(fValue);
            break;
        case $5pTcb.OP_ELSE:
            if (this.vfExec.length === 0) {
                this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL";
                return false;
            }
            this.vfExec[this.vfExec.length - 1] = !this.vfExec[this.vfExec.length - 1];
            break;
        case $5pTcb.OP_ENDIF:
            if (this.vfExec.length === 0) {
                this.errstr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL";
                return false;
            }
            this.vfExec.pop();
            break;
        case $5pTcb.OP_VERIFY:
            // (true -- ) or
            // (false -- false) and return
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-1);
            fValue = $6e89c4ab0f303d12$var$Interpreter.castToBool(buf);
            if (fValue) this.stack.pop();
            else {
                this.errstr = "SCRIPT_ERR_VERIFY";
                return false;
            }
            break;
        case $5pTcb.OP_RETURN:
            if ((this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_P2SH) === 0) {
                if (this.vfExec.length === 0) {
                    // Terminate the execution as successful. The remaining of the script does not affect the validity (even in
                    // presence of unbalanced IFs, invalid opcodes etc)
                    this.returned = true;
                    return true;
                }
                // op_return encountered inside if statement after genesis --> check for invalid grammar
                this.nonTopLevelReturnAfterGenesis = true;
            } else return false;
            break;
        //
        // Stack ops
        //
        case $5pTcb.OP_TOALTSTACK:
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var1 = vartop(-1);
            this.altstack.push(this.stack.pop(), var1);
            break;
        case $5pTcb.OP_FROMALTSTACK:
            if (this.altstack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_ALTSTACK_OPERATION";
                return false;
            }
            const varAlt = this.altstack.vartop(-1);
            this.stack.push(this.altstack.pop(), varAlt);
            break;
        case $5pTcb.OP_2DROP:
            // (x1 x2 -- )
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            this.stack.pop();
            this.stack.pop();
            break;
        case $5pTcb.OP_2DUP:
            // (x1 x2 -- x1 x2 x1 x2)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            buf2 = stacktop(-1);
            var1 = vartop(-2);
            var2 = vartop(-1);
            this.stack.push(Buffer.from(buf1), `$${var1}`);
            this.stack.push(Buffer.from(buf2), `$${var2}`);
            break;
        case $5pTcb.OP_3DUP:
            // (x1 x2 x3 -- x1 x2 x3 x1 x2 x3)
            if (this.stack.length < 3) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-3);
            buf2 = stacktop(-2);
            var buf3 = stacktop(-1);
            var1 = vartop(-3);
            var2 = vartop(-2);
            var3 = vartop(-1);
            this.stack.push(Buffer.from(buf1), `$${var1}`);
            this.stack.push(Buffer.from(buf2), `$${var2}`);
            this.stack.push(Buffer.from(buf3), `$${var3}`);
            break;
        case $5pTcb.OP_2OVER:
            // (x1 x2 x3 x4 -- x1 x2 x3 x4 x1 x2)
            if (this.stack.length < 4) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-4);
            buf2 = stacktop(-3);
            var1 = vartop(-4);
            var2 = vartop(-3);
            this.stack.push(Buffer.from(buf1), `$${var1}`);
            this.stack.push(Buffer.from(buf2), `$${var2}`);
            break;
        case $5pTcb.OP_2ROT:
            // (x1 x2 x3 x4 x5 x6 -- x3 x4 x5 x6 x1 x2)
            if (this.stack.length < 6) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var1 = vartop(-6);
            var2 = vartop(-5);
            spliced = this.stack.splice(this.stack.length - 6, 2);
            this.stack.push(spliced[0], var1);
            this.stack.push(spliced[1], var2);
            break;
        case $5pTcb.OP_2SWAP:
            // (x1 x2 x3 x4 -- x3 x4 x1 x2)
            if (this.stack.length < 4) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var1 = vartop(-4);
            var2 = vartop(-3);
            spliced = this.stack.splice(this.stack.length - 4, 2);
            this.stack.push(spliced[0], var1);
            this.stack.push(spliced[1], var2);
            break;
        case $5pTcb.OP_IFDUP:
            // (x - 0 | x x)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-1);
            fValue = $6e89c4ab0f303d12$var$Interpreter.castToBool(buf);
            if (fValue) {
                var1 = vartop(-1);
                this.stack.push(Buffer.from(buf), `$${var1}`);
            }
            break;
        case $5pTcb.OP_DEPTH:
            // -- stacksize
            buf = new $lM2TS(this.stack.length).toScriptNumBuffer();
            this.stack.push(buf, "$depth");
            break;
        case $5pTcb.OP_DROP:
            // (x -- )
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            this.stack.pop();
            break;
        case $5pTcb.OP_DUP:
            // (x -- x x)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var1 = vartop(-1);
            this.stack.push(Buffer.from(stacktop(-1)), `$${var1}`);
            break;
        case $5pTcb.OP_NIP:
            // (x1 x2 -- x2)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            this.stack.splice(this.stack.length - 2, 1);
            break;
        case $5pTcb.OP_OVER:
            // (x1 x2 -- x1 x2 x1)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var2 = vartop(-2);
            this.stack.push(Buffer.from(stacktop(-2)), `$${var2}`);
            break;
        case $5pTcb.OP_PICK:
        case $5pTcb.OP_ROLL:
            // (xn ... x2 x1 x0 n - xn ... x2 x1 x0 xn)
            // (xn ... x2 x1 x0 n - ... x2 x1 x0 xn)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-1);
            bn = $lM2TS.fromScriptNumBuffer(buf, fRequireMinimal, 4);
            n = bn.toNumber();
            this.stack.pop();
            if (n < 0 || n >= this.stack.length) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-n - 1);
            var1 = vartop(-n - 1);
            if (opcodenum === $5pTcb.OP_ROLL) {
                this.stack.splice(this.stack.length - n - 1, 1);
                this.stack.push(Buffer.from(buf), var1);
            } else this.stack.push(Buffer.from(buf), `$${var1}`);
            break;
        case $5pTcb.OP_ROT:
            // (x1 x2 x3 -- x2 x3 x1)
            //  x2 x1 x3  after first swap
            //  x2 x3 x1  after second swap
            if (this.stack.length < 3) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            x1 = stacktop(-3);
            x2 = stacktop(-2);
            var x3 = stacktop(-1);
            var1 = vartop(-3);
            var2 = vartop(-2);
            var3 = vartop(-1);
            this.stack.write(-3, x2);
            this.stack.write(-2, x3);
            this.stack.write(-1, x1);
            this.stack.updateTopVars([
                var1,
                var3,
                var2
            ]);
            break;
        case $5pTcb.OP_SWAP:
            // (x1 x2 -- x2 x1)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            x1 = stacktop(-2);
            x2 = stacktop(-1);
            var1 = vartop(-2);
            var2 = vartop(-1);
            this.stack.write(-2, x2);
            this.stack.write(-1, x1);
            this.stack.updateTopVars([
                var1,
                var2
            ]);
            break;
        case $5pTcb.OP_TUCK:
            // (x1 x2 -- x2 x1 x2)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var1 = vartop(-2);
            var2 = vartop(-1);
            this.stack.splice(this.stack.length - 2, 0, Buffer.from(stacktop(-1)));
            this.stack.updateTopVars([
                var2,
                var1,
                `$${var2}`
            ]);
            break;
        case $5pTcb.OP_SIZE:
            // (in -- in size)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            bn = new $lM2TS(stacktop(-1).length);
            this.stack.push(bn.toScriptNumBuffer(), `$size`);
            break;
        //
        // Bitwise logic
        //
        case $5pTcb.OP_AND:
        case $5pTcb.OP_OR:
        case $5pTcb.OP_XOR:
            // (x1 x2 - out)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            buf2 = stacktop(-1);
            // Inputs must be the same size
            if (buf1.length !== buf2.length) {
                this.errstr = "SCRIPT_ERR_INVALID_OPERAND_SIZE";
                return false;
            }
            // To avoid allocating, we modify vch1 in place.
            switch(opcodenum){
                case $5pTcb.OP_AND:
                    for(let i = 0; i < buf1.length; i++)buf1[i] &= buf2[i];
                    break;
                case $5pTcb.OP_OR:
                    for(let i = 0; i < buf1.length; i++)buf1[i] |= buf2[i];
                    break;
                case $5pTcb.OP_XOR:
                    for(let i = 0; i < buf1.length; i++)buf1[i] ^= buf2[i];
                    break;
                default:
                    break;
            }
            // And pop vch2.
            this.stack.pop();
            break;
        case $5pTcb.OP_INVERT:
            // (x -- out)
            if (this.stack.length < 1) this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
            buf = stacktop(-1);
            for(let i = 0; i < buf.length; i++)buf[i] = ~buf[i];
            break;
        case $5pTcb.OP_LSHIFT:
        case $5pTcb.OP_RSHIFT:
            // (x n -- out)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            if (buf1.length === 0) this.stack.pop();
            else {
                bn1 = new $lM2TS(buf1);
                bn2 = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal, 4);
                n = bn2.toNumber();
                if (n < 0) {
                    this.errstr = "SCRIPT_ERR_INVALID_NUMBER_RANGE";
                    return false;
                }
                this.stack.pop();
                this.stack.pop();
                let shifted;
                if (opcodenum === $5pTcb.OP_LSHIFT) shifted = bn1.ushln(n);
                if (opcodenum === $5pTcb.OP_RSHIFT) shifted = bn1.ushrn(n);
                // bitcoin client implementation of l/rshift is unconventional, therefore this implementation is a bit unconventional
                // bn library has shift functions however it expands the carried bits into a new byte
                // in contrast to the bitcoin client implementation which drops off the carried bits
                // in other words, if operand was 1 byte then we put 1 byte back on the stack instead of expanding to more shifted bytes
                let bufShifted = $6e89c4ab0f303d12$var$padBufferToSize(Buffer.from(shifted.toArray().slice(buf1.length * -1)), buf1.length);
                this.stack.push(bufShifted);
            }
            break;
        case $5pTcb.OP_EQUAL:
        case $5pTcb.OP_EQUALVERIFY:
            // case Opcode.OP_NOTEQUAL: // use Opcode.OP_NUMNOTEQUAL
            // (x1 x2 - bool)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            buf2 = stacktop(-1);
            var fEqual = buf1.toString("hex") === buf2.toString("hex");
            this.stack.pop();
            this.stack.pop();
            this.stack.push(fEqual ? $6e89c4ab0f303d12$var$Interpreter.getTrue() : $6e89c4ab0f303d12$var$Interpreter.getFalse());
            if (opcodenum === $5pTcb.OP_EQUALVERIFY) {
                if (fEqual) this.stack.pop();
                else {
                    this.errstr = "SCRIPT_ERR_EQUALVERIFY";
                    return false;
                }
            }
            break;
        //
        // Numeric
        //
        case $5pTcb.OP_1ADD:
        case $5pTcb.OP_1SUB:
        case $5pTcb.OP_NEGATE:
        case $5pTcb.OP_ABS:
        case $5pTcb.OP_NOT:
        case $5pTcb.OP_0NOTEQUAL:
            // (in -- out)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-1);
            bn = $lM2TS.fromScriptNumBuffer(buf, fRequireMinimal);
            switch(opcodenum){
                case $5pTcb.OP_1ADD:
                    bn = bn.add($lM2TS.One);
                    break;
                case $5pTcb.OP_1SUB:
                    bn = bn.sub($lM2TS.One);
                    break;
                case $5pTcb.OP_NEGATE:
                    bn = bn.neg();
                    break;
                case $5pTcb.OP_ABS:
                    if (bn.cmp($lM2TS.Zero) < 0) bn = bn.neg();
                    break;
                case $5pTcb.OP_NOT:
                    bn = new $lM2TS((bn.cmp($lM2TS.Zero) === 0) + 0);
                    break;
                case $5pTcb.OP_0NOTEQUAL:
                    bn = new $lM2TS((bn.cmp($lM2TS.Zero) !== 0) + 0);
                    break;
            }
            this.stack.pop();
            this.stack.push(bn.toScriptNumBuffer());
            break;
        case $5pTcb.OP_ADD:
        case $5pTcb.OP_SUB:
        case $5pTcb.OP_MUL:
        case $5pTcb.OP_MOD:
        case $5pTcb.OP_DIV:
        case $5pTcb.OP_BOOLAND:
        case $5pTcb.OP_BOOLOR:
        case $5pTcb.OP_NUMEQUAL:
        case $5pTcb.OP_NUMEQUALVERIFY:
        case $5pTcb.OP_NUMNOTEQUAL:
        case $5pTcb.OP_LESSTHAN:
        case $5pTcb.OP_GREATERTHAN:
        case $5pTcb.OP_LESSTHANOREQUAL:
        case $5pTcb.OP_GREATERTHANOREQUAL:
        case $5pTcb.OP_MIN:
        case $5pTcb.OP_MAX:
            // (x1 x2 -- out)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            bn1 = $lM2TS.fromScriptNumBuffer(stacktop(-2), fRequireMinimal);
            bn2 = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal);
            bn = new $lM2TS(0);
            switch(opcodenum){
                case $5pTcb.OP_ADD:
                    bn = bn1.add(bn2);
                    break;
                case $5pTcb.OP_SUB:
                    bn = bn1.sub(bn2);
                    break;
                case $5pTcb.OP_MUL:
                    bn = bn1.mul(bn2);
                    break;
                case $5pTcb.OP_DIV:
                    // denominator must not be 0
                    if (bn2 === 0) {
                        this.errstr = "SCRIPT_ERR_DIV_BY_ZERO";
                        return false;
                    }
                    bn = bn1.div(bn2);
                    break;
                case $5pTcb.OP_MOD:
                    // divisor must not be 0
                    if (bn2 === 0) {
                        this.errstr = "SCRIPT_ERR_DIV_BY_ZERO";
                        return false;
                    }
                    bn = bn1.mod(bn2);
                    break;
                case $5pTcb.OP_BOOLAND:
                    bn = new $lM2TS((bn1.cmp($lM2TS.Zero) !== 0 && bn2.cmp($lM2TS.Zero) !== 0) + 0);
                    break;
                // case Opcode.OP_BOOLOR:        bn = (bn1 !== bnZero || bn2 !== bnZero); break;
                case $5pTcb.OP_BOOLOR:
                    bn = new $lM2TS((bn1.cmp($lM2TS.Zero) !== 0 || bn2.cmp($lM2TS.Zero) !== 0) + 0);
                    break;
                // case Opcode.OP_NUMEQUAL:      bn = (bn1 === bn2); break;
                case $5pTcb.OP_NUMEQUAL:
                    bn = new $lM2TS((bn1.cmp(bn2) === 0) + 0);
                    break;
                // case Opcode.OP_NUMEQUALVERIFY:    bn = (bn1 === bn2); break;
                case $5pTcb.OP_NUMEQUALVERIFY:
                    bn = new $lM2TS((bn1.cmp(bn2) === 0) + 0);
                    break;
                // case Opcode.OP_NUMNOTEQUAL:     bn = (bn1 !== bn2); break;
                case $5pTcb.OP_NUMNOTEQUAL:
                    bn = new $lM2TS((bn1.cmp(bn2) !== 0) + 0);
                    break;
                // case Opcode.OP_LESSTHAN:      bn = (bn1 < bn2); break;
                case $5pTcb.OP_LESSTHAN:
                    bn = new $lM2TS((bn1.cmp(bn2) < 0) + 0);
                    break;
                // case Opcode.OP_GREATERTHAN:     bn = (bn1 > bn2); break;
                case $5pTcb.OP_GREATERTHAN:
                    bn = new $lM2TS((bn1.cmp(bn2) > 0) + 0);
                    break;
                // case Opcode.OP_LESSTHANOREQUAL:   bn = (bn1 <= bn2); break;
                case $5pTcb.OP_LESSTHANOREQUAL:
                    bn = new $lM2TS((bn1.cmp(bn2) <= 0) + 0);
                    break;
                // case Opcode.OP_GREATERTHANOREQUAL:  bn = (bn1 >= bn2); break;
                case $5pTcb.OP_GREATERTHANOREQUAL:
                    bn = new $lM2TS((bn1.cmp(bn2) >= 0) + 0);
                    break;
                case $5pTcb.OP_MIN:
                    bn = bn1.cmp(bn2) < 0 ? bn1 : bn2;
                    break;
                case $5pTcb.OP_MAX:
                    bn = bn1.cmp(bn2) > 0 ? bn1 : bn2;
                    break;
            }
            this.stack.pop();
            this.stack.pop();
            this.stack.push(bn.toScriptNumBuffer());
            if (opcodenum === $5pTcb.OP_NUMEQUALVERIFY) {
                // if (CastToBool(stacktop(-1)))
                if ($6e89c4ab0f303d12$var$Interpreter.castToBool(stacktop(-1))) this.stack.pop();
                else {
                    this.errstr = "SCRIPT_ERR_NUMEQUALVERIFY";
                    return false;
                }
            }
            break;
        case $5pTcb.OP_WITHIN:
            // (x min max -- out)
            if (this.stack.length < 3) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            bn1 = $lM2TS.fromScriptNumBuffer(stacktop(-3), fRequireMinimal);
            bn2 = $lM2TS.fromScriptNumBuffer(stacktop(-2), fRequireMinimal);
            var bn3 = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal);
            // bool fValue = (bn2 <= bn1 && bn1 < bn3);
            fValue = bn2.cmp(bn1) <= 0 && bn1.cmp(bn3) < 0;
            this.stack.pop();
            this.stack.pop();
            this.stack.pop();
            this.stack.push(fValue ? $6e89c4ab0f303d12$var$Interpreter.getTrue() : $6e89c4ab0f303d12$var$Interpreter.getFalse());
            break;
        //
        // Crypto
        //
        case $5pTcb.OP_RIPEMD160:
        case $5pTcb.OP_SHA1:
        case $5pTcb.OP_SHA256:
        case $5pTcb.OP_HASH160:
        case $5pTcb.OP_HASH256:
            // (in -- hash)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf = stacktop(-1);
            // valtype vchHash((opcode === Opcode.OP_RIPEMD160 ||
            //                 opcode === Opcode.OP_SHA1 || opcode === Opcode.OP_HASH160) ? 20 : 32);
            var bufHash;
            if (opcodenum === $5pTcb.OP_RIPEMD160) bufHash = $aScoK.ripemd160(buf);
            else if (opcodenum === $5pTcb.OP_SHA1) bufHash = $aScoK.sha1(buf);
            else if (opcodenum === $5pTcb.OP_SHA256) bufHash = $aScoK.sha256(buf);
            else if (opcodenum === $5pTcb.OP_HASH160) bufHash = $aScoK.sha256ripemd160(buf);
            else if (opcodenum === $5pTcb.OP_HASH256) bufHash = $aScoK.sha256sha256(buf);
            this.stack.pop();
            this.stack.push(bufHash);
            break;
        case $5pTcb.OP_CODESEPARATOR:
            // Hash starts after the code separator
            this.pbegincodehash = this.pc;
            break;
        case $5pTcb.OP_CHECKSIG:
        case $5pTcb.OP_CHECKSIGVERIFY:
            // (sig pubkey -- bool)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            bufSig = stacktop(-2);
            bufPubkey = stacktop(-1);
            if (!this.checkSignatureEncoding(bufSig) || !this.checkPubkeyEncoding(bufPubkey)) return false;
            // Subset of script starting at the most recent codeseparator
            // CScript scriptCode(pbegincodehash, pend);
            subscript = this.subscript();
            // Drop the signature, since there's no way for a signature to sign itself
            var tmpScript = new $jQNLW().add(bufSig);
            subscript.findAndDelete(tmpScript);
            try {
                sig = $km2cb.fromTxFormat(bufSig);
                pubkey = $hbQdz.fromBuffer(bufPubkey, false);
                fSuccess = this.tx.verifySignature(sig, pubkey, this.nin, subscript, this.satoshisBN, this.flags);
            } catch (e) {
                // invalid sig or pubkey
                fSuccess = false;
            }
            if (!fSuccess && this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLFAIL && bufSig.length) {
                this.errstr = "SCRIPT_ERR_NULLFAIL";
                return false;
            }
            this.stack.pop();
            this.stack.pop();
            // stack.push_back(fSuccess ? vchTrue : vchFalse);
            this.stack.push(fSuccess ? $6e89c4ab0f303d12$var$Interpreter.getTrue() : $6e89c4ab0f303d12$var$Interpreter.getFalse());
            if (opcodenum === $5pTcb.OP_CHECKSIGVERIFY) {
                if (fSuccess) this.stack.pop();
                else {
                    this.errstr = "SCRIPT_ERR_CHECKSIGVERIFY";
                    return false;
                }
            }
            break;
        case $5pTcb.OP_CHECKMULTISIG:
        case $5pTcb.OP_CHECKMULTISIGVERIFY:
            // ([sig ...] num_of_signatures [pubkey ...] num_of_pubkeys -- bool)
            var i = 1;
            if (this.stack.length < i) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var nKeysCount = $lM2TS.fromScriptNumBuffer(stacktop(-i), fRequireMinimal).toNumber();
            // TODO: Keys and opcount are parameterized in client. No magic numbers!
            if (nKeysCount < 0 || nKeysCount > 20) {
                this.errstr = "SCRIPT_ERR_PUBKEY_COUNT";
                return false;
            }
            this.nOpCount += nKeysCount;
            if (this.nOpCount > $6e89c4ab0f303d12$var$Interpreter.MAX_OPCODE_COUNT) {
                this.errstr = "SCRIPT_ERR_OP_COUNT";
                return false;
            }
            // int ikey = ++i;
            var ikey = ++i;
            i += nKeysCount;
            // ikey2 is the position of last non-signature item in
            // the stack. Top stack item = 1. With
            // SCRIPT_VERIFY_NULLFAIL, this is used for cleanup if
            // operation fails.
            var ikey2 = nKeysCount + 2;
            if (this.stack.length < i) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var nSigsCount = $lM2TS.fromScriptNumBuffer(stacktop(-i), fRequireMinimal).toNumber();
            if (nSigsCount < 0 || nSigsCount > nKeysCount) {
                this.errstr = "SCRIPT_ERR_SIG_COUNT";
                return false;
            }
            // int isig = ++i;
            var isig = ++i;
            i += nSigsCount;
            if (this.stack.length < i) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            // Subset of script starting at the most recent codeseparator
            subscript = this.subscript();
            // Drop the signatures, since there's no way for a signature to sign itself
            for(var k = 0; k < nSigsCount; k++){
                bufSig = stacktop(-isig - k);
                subscript.findAndDelete(new $jQNLW().add(bufSig));
            }
            fSuccess = true;
            while(fSuccess && nSigsCount > 0){
                // valtype& vchSig  = stacktop(-isig);
                bufSig = stacktop(-isig);
                // valtype& vchPubKey = stacktop(-ikey);
                bufPubkey = stacktop(-ikey);
                if (!this.checkSignatureEncoding(bufSig) || !this.checkPubkeyEncoding(bufPubkey)) return false;
                var fOk;
                try {
                    sig = $km2cb.fromTxFormat(bufSig);
                    pubkey = $hbQdz.fromBuffer(bufPubkey, false);
                    fOk = this.tx.verifySignature(sig, pubkey, this.nin, subscript, this.satoshisBN, this.flags);
                } catch (e) {
                    // invalid sig or pubkey
                    fOk = false;
                }
                if (fOk) {
                    isig++;
                    nSigsCount--;
                }
                ikey++;
                nKeysCount--;
                // If there are more signatures left than keys left,
                // then too many signatures have failed
                if (nSigsCount > nKeysCount) fSuccess = false;
            }
            // Clean up stack of actual arguments
            while(i-- > 1){
                if (!fSuccess && this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLFAIL && !ikey2 && stacktop(-1).length) {
                    this.errstr = "SCRIPT_ERR_NULLFAIL";
                    return false;
                }
                if (ikey2 > 0) ikey2--;
                this.stack.pop();
            }
            // A bug causes CHECKMULTISIG to consume one extra argument
            // whose contents were not checked in any way.
            //
            // Unfortunately this is a potential source of mutability,
            // so optionally verify it is exactly equal to zero prior
            // to removing it from the stack.
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            if (this.flags & $6e89c4ab0f303d12$var$Interpreter.SCRIPT_VERIFY_NULLDUMMY && stacktop(-1).length) {
                this.errstr = "SCRIPT_ERR_SIG_NULLDUMMY";
                return false;
            }
            this.stack.pop();
            this.stack.push(fSuccess ? $6e89c4ab0f303d12$var$Interpreter.getTrue() : $6e89c4ab0f303d12$var$Interpreter.getFalse());
            if (opcodenum === $5pTcb.OP_CHECKMULTISIGVERIFY) {
                if (fSuccess) this.stack.pop();
                else {
                    this.errstr = "SCRIPT_ERR_CHECKMULTISIGVERIFY";
                    return false;
                }
            }
            break;
        //
        // Byte string operations
        //
        case $5pTcb.OP_CAT:
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            buf2 = stacktop(-1);
            if (buf1.length + buf2.length > $6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_ELEMENT_SIZE) {
                this.errstr = "SCRIPT_ERR_PUSH_SIZE";
                return false;
            }
            this.stack.write(-2, Buffer.concat([
                buf1,
                buf2
            ]));
            this.stack.pop();
            break;
        case $5pTcb.OP_SPLIT:
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-2);
            // Make sure the split point is apropriate.
            var position = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal).toNumber();
            if (position < 0 || position > buf1.length) {
                this.errstr = "SCRIPT_ERR_INVALID_SPLIT_RANGE";
                return false;
            }
            // Prepare the results in their own buffer as `data`
            // will be invalidated.
            // Copy buffer data, to slice it before
            var n1 = Buffer.from(buf1);
            // Replace existing stack values by the new values.
            this.stack.write(-2, n1.slice(0, position));
            this.stack.write(-1, n1.slice(position));
            break;
        //
        // Conversion operations
        //
        case $5pTcb.OP_NUM2BIN:
            // (in -- out)
            if (this.stack.length < 2) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            var size = $lM2TS.fromScriptNumBuffer(stacktop(-1), fRequireMinimal).toNumber();
            if (size > $6e89c4ab0f303d12$var$Interpreter.MAX_SCRIPT_ELEMENT_SIZE) {
                this.errstr = "SCRIPT_ERR_PUSH_SIZE";
                return false;
            }
            this.stack.pop();
            var rawnum = stacktop(-1);
            // Try to see if we can fit that number in the number of
            // byte requested.
            rawnum = $6e89c4ab0f303d12$var$Interpreter._minimallyEncode(rawnum);
            if (rawnum.length > size) {
                // We definitively cannot.
                this.errstr = "SCRIPT_ERR_IMPOSSIBLE_ENCODING";
                return false;
            }
            // We already have an element of the right size, we
            // don't need to do anything.
            if (rawnum.length === size) {
                this.stack.write(-1, rawnum);
                break;
            }
            var signbit = 0x00;
            if (rawnum.length > 0) {
                signbit = rawnum[rawnum.length - 1] & 0x80;
                rawnum[rawnum.length - 1] &= 0x7f;
            }
            var num = Buffer.alloc(size);
            rawnum.copy(num, 0);
            var l = rawnum.length - 1;
            while(l++ < size - 2)num[l] = 0x00;
            num[l] = signbit;
            this.stack.write(-1, num);
            break;
        case $5pTcb.OP_BIN2NUM:
            // (in -- out)
            if (this.stack.length < 1) {
                this.errstr = "SCRIPT_ERR_INVALID_STACK_OPERATION";
                return false;
            }
            buf1 = stacktop(-1);
            buf2 = $6e89c4ab0f303d12$var$Interpreter._minimallyEncode(buf1);
            this.stack.write(-1, buf2);
            // The resulting number must be a valid number.
            if (!$6e89c4ab0f303d12$var$Interpreter._isMinimallyEncoded(buf2)) {
                this.errstr = "SCRIPT_ERR_INVALID_NUMBER_RANGE";
                return false;
            }
            break;
        default:
            this.errstr = "SCRIPT_ERR_BAD_OPCODE";
            return false;
    }
    // only when next opcode is evaluate opcode, we update stack
    if (this.vfExec.indexOf(false) === -1) this._callbackStack(this.stack, this.pc, scriptType);
    return true;
};

});
parcelRegister("2ijCr", function(module, exports) {
"use strict";
var $1abc7b28c4be9132$var$Stack = function Stack(rawstack, varStack) {
    this.stack = rawstack;
    this.varStack = varStack || [];
};
module.exports = $1abc7b28c4be9132$var$Stack;
$1abc7b28c4be9132$var$Stack.prototype.pushVar = function(varName) {
    this.varStack.push(varName || "$tmp");
};
$1abc7b28c4be9132$var$Stack.prototype.popVar = function() {
    this.varStack.pop();
};
$1abc7b28c4be9132$var$Stack.prototype.push = function(n, varName) {
    this.pushVar(varName);
    this.stack.push(n);
    this.checkConsistency();
};
$1abc7b28c4be9132$var$Stack.prototype.pop = function() {
    this.popVar();
    let top = this.stack.pop();
    this.checkConsistency();
    return top;
};
$1abc7b28c4be9132$var$Stack.prototype.updateTopVars = function(vars) {
    if (vars.length > this.varStack.length) throw new Error(`updateTopVars fail, stack: ${this.stack.length},  varStack: ${this.varStack.length}, vars:${vars.length}`);
    vars = vars.reverse();
    this.varStack.splice(this.varStack.length - vars.length, vars.length, ...vars);
};
$1abc7b28c4be9132$var$Stack.prototype.stacktop = function(i) {
    return this.stack[this.stack.length + i];
};
$1abc7b28c4be9132$var$Stack.prototype.vartop = function(i) {
    return this.varStack[this.varStack.length + i];
};
$1abc7b28c4be9132$var$Stack.prototype.slice = function(start, end) {
    return this.stack.slice(start, end);
};
$1abc7b28c4be9132$var$Stack.prototype.splice = function(start, deleteCount, ...items) {
    this.varStack.splice(start, deleteCount, ...items);
    return this.stack.splice(start, deleteCount, ...items);
};
$1abc7b28c4be9132$var$Stack.prototype.write = function(i, value) {
    this.stack[this.stack.length + i] = value;
};
$1abc7b28c4be9132$var$Stack.prototype.copy = function() {
    return new $1abc7b28c4be9132$var$Stack(this.stack.slice() || [], this.varStack.slice() || []);
};
function $1abc7b28c4be9132$var$bytesToHexString(bytearray) {
    return bytearray.reduce(function(o, c) {
        o += ("0" + (c & 0xFF).toString(16)).slice(-2);
        return o;
    }, "");
}
$1abc7b28c4be9132$var$Stack.prototype.printVarStack = function() {
    let array = this.varStack.map((v, i)=>({
            name: v,
            value: $1abc7b28c4be9132$var$bytesToHexString(this.rawstack[i].data)
        }));
    console.log(JSON.stringify(array, null, 4));
};
$1abc7b28c4be9132$var$Stack.prototype.checkConsistency = function() {
    if (this.stack.length !== this.varStack.length) {
        this.printVarStack();
        throw new Error(`checkConsistency fail, stack: ${this.stack.length}, varStack:${this.varStack.length}`);
    }
};
$1abc7b28c4be9132$var$Stack.prototype.checkConsistencyWithVars = function(varStack) {
    if (this.stack.length < varStack.length) {
        this.printVarStack();
        throw new Error(`checkConsistencyWithVars fail, stack: ${this.stack.length}, varStack:${varStack.length}`);
    }
};
Object.defineProperty($1abc7b28c4be9132$var$Stack.prototype, "length", {
    get: function() {
        return this.stack.length;
    }
});
Object.defineProperty($1abc7b28c4be9132$var$Stack.prototype, "rawstack", {
    get: function() {
        return this.stack;
    }
});

});

parcelRegister("67vNY", function(module, exports) {

module.exports = (parcelRequire("lNMR4"));

module.exports.Input = (parcelRequire("3dEU6"));

module.exports.Output = (parcelRequire("6NOKO"));

module.exports.UnspentOutput = (parcelRequire("dm48c"));

module.exports.Signature = (parcelRequire("7fulv"));

module.exports.Sighash = (parcelRequire("aTWNt"));

});
parcelRegister("lNMR4", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lOQ1c = parcelRequire("lOQ1c");

var $bbk3w = parcelRequire("bbk3w");

var $eKoSX = parcelRequire("eKoSX");

var $fvPTe = parcelRequire("fvPTe");

var $kWg93 = parcelRequire("kWg93");

var $aScoK = parcelRequire("aScoK");

var $km2cb = parcelRequire("km2cb");

var $aTWNt = parcelRequire("aTWNt");

var $dOZs9 = parcelRequire("dOZs9");

var $dm48c = parcelRequire("dm48c");

var $3dEU6 = parcelRequire("3dEU6");
var $fdf41226c6c48850$var$PublicKeyHashInput = $3dEU6.PublicKeyHash;
var $fdf41226c6c48850$var$PublicKeyInput = $3dEU6.PublicKey;
var $fdf41226c6c48850$var$MultiSigScriptHashInput = $3dEU6.MultiSigScriptHash;
var $fdf41226c6c48850$var$MultiSigInput = $3dEU6.MultiSig;

var $6NOKO = parcelRequire("6NOKO");

var $3LdBG = parcelRequire("3LdBG");

var $eB3ON = parcelRequire("eB3ON");

var $lM2TS = parcelRequire("lM2TS");
/**
 * Represents a transaction, a set of inputs and outputs to change ownership of tokens
 *
 * @param {*} serialized
 * @constructor
 */ function $fdf41226c6c48850$var$Transaction(serialized) {
    if (!(this instanceof $fdf41226c6c48850$var$Transaction)) return new $fdf41226c6c48850$var$Transaction(serialized);
    this.inputs = [];
    this.outputs = [];
    this._inputAmount = undefined;
    this._outputAmount = undefined;
    this._inputsMap = new Map();
    this._outputsMap = new Map();
    this._privateKey = undefined;
    this._sigType = undefined;
    this.sealed = false;
    if (serialized) {
        if (serialized instanceof $fdf41226c6c48850$var$Transaction) return $fdf41226c6c48850$var$Transaction.shallowCopy(serialized);
        else if ($bbk3w.isHexa(serialized)) this.fromString(serialized);
        else if (Buffer.isBuffer(serialized)) this.fromBuffer(serialized);
        else if ($iUxHD.isObject(serialized)) this.fromObject(serialized);
        else throw new $lOQ1c.InvalidArgument("Must provide an object or string to deserialize a transaction");
    } else this._newTransaction();
}
var $fdf41226c6c48850$var$CURRENT_VERSION = 1;
var $fdf41226c6c48850$var$DEFAULT_NLOCKTIME = 0;
// Minimum amount for an output for it not to be considered a dust output
$fdf41226c6c48850$var$Transaction.DUST_AMOUNT = 1;
// Margin of error to allow fees in the vecinity of the expected value but doesn't allow a big difference
$fdf41226c6c48850$var$Transaction.FEE_SECURITY_MARGIN = 150;
// max amount of satoshis in circulation
$fdf41226c6c48850$var$Transaction.MAX_MONEY = 21000000 * 1e8;
// nlocktime limit to be considered block height rather than a timestamp
$fdf41226c6c48850$var$Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT = 5e8;
// Max value for an unsigned 32 bit value
$fdf41226c6c48850$var$Transaction.NLOCKTIME_MAX_VALUE = 4294967295;
// Value used for fee estimation (satoshis per kilobyte)
$fdf41226c6c48850$var$Transaction.FEE_PER_KB = 50;
// Safe upper bound for change address script size in bytes
$fdf41226c6c48850$var$Transaction.CHANGE_OUTPUT_MAX_SIZE = 62;
/**
 * a dummy privatekey
 */ $fdf41226c6c48850$var$Transaction.DUMMY_PRIVATEKEY = $eB3ON.fromWIF("cQ3nCBQB9RsFSyjNQM15NQLVpXXMtWh9PUyeFz5KxLJCHsuRH2Su");
/* Constructors and Serialization */ /**
 * Create a 'shallow' copy of the transaction, by serializing and deserializing
 * it dropping any additional information that inputs and outputs may have hold
 *
 * @param {Transaction} transaction
 * @return {Transaction}
 */ $fdf41226c6c48850$var$Transaction.shallowCopy = function(transaction) {
    var copy = new $fdf41226c6c48850$var$Transaction(transaction.toBuffer());
    return copy;
};
var $fdf41226c6c48850$var$hashProperty = {
    configurable: false,
    enumerable: true,
    get: function() {
        this._hash = new $eKoSX(this._getHash()).readReverse().toString("hex");
        return this._hash;
    }
};
Object.defineProperty($fdf41226c6c48850$var$Transaction.prototype, "hash", $fdf41226c6c48850$var$hashProperty);
Object.defineProperty($fdf41226c6c48850$var$Transaction.prototype, "id", $fdf41226c6c48850$var$hashProperty);
var $fdf41226c6c48850$var$ioProperty = {
    configurable: false,
    enumerable: true,
    get: function() {
        return this._getInputAmount();
    }
};
Object.defineProperty($fdf41226c6c48850$var$Transaction.prototype, "inputAmount", $fdf41226c6c48850$var$ioProperty);
$fdf41226c6c48850$var$ioProperty.get = function() {
    return this._getOutputAmount();
};
Object.defineProperty($fdf41226c6c48850$var$Transaction.prototype, "outputAmount", $fdf41226c6c48850$var$ioProperty);
/**
 * Retrieve the little endian hash of the transaction (used for serialization)
 * @return {Buffer}
 */ $fdf41226c6c48850$var$Transaction.prototype._getHash = function() {
    return $aScoK.sha256sha256(this.toBuffer());
};
/**
 * Retrieve a hexa string that can be used with bitcoind's CLI interface
 * (decoderawtransaction, sendrawtransaction)
 *
 * @param {Object|boolean=} unsafe if true, skip all tests. if it's an object,
 *   it's expected to contain a set of flags to skip certain tests:
 * * `disableAll`: disable all checks
 * * `disableLargeFees`: disable checking for fees that are too large
 * * `disableIsFullySigned`: disable checking if all inputs are fully signed
 * * `disableDustOutputs`: disable checking if there are no outputs that are dust amounts
 * * `disableMoreOutputThanInput`: disable checking if the transaction spends more bitcoins than the sum of the input amounts
 * @return {string}
 */ $fdf41226c6c48850$var$Transaction.prototype.serialize = function(unsafe) {
    if (unsafe === true || unsafe && unsafe.disableAll) return this.uncheckedSerialize();
    else return this.checkedSerialize(unsafe);
};
$fdf41226c6c48850$var$Transaction.prototype.uncheckedSerialize = $fdf41226c6c48850$var$Transaction.prototype.toString = function() {
    return this.toBuffer().toString("hex");
};
/**
 * Retrieve a hexa string that can be used with bitcoind's CLI interface
 * (decoderawtransaction, sendrawtransaction)
 *
 * @param {Object} opts allows to skip certain tests. {@see Transaction#serialize}
 * @return {string}
 */ $fdf41226c6c48850$var$Transaction.prototype.checkedSerialize = function(opts) {
    var serializationError = this.getSerializationError(opts);
    if (serializationError) {
        serializationError.message += " - For more information please see: https://bsv.io/api/lib/transaction#serialization-checks";
        throw serializationError;
    }
    return this.uncheckedSerialize();
};
$fdf41226c6c48850$var$Transaction.prototype.invalidSatoshis = function() {
    var invalid = false;
    for(var i = 0; i < this.outputs.length; i++)if (this.outputs[i].invalidSatoshis()) invalid = true;
    return invalid;
};
/**
 * Retrieve a possible error that could appear when trying to serialize and
 * broadcast this transaction.
 *
 * @param {Object} opts allows to skip certain tests. {@see Transaction#serialize}
 * @return {bsv.Error}
 */ $fdf41226c6c48850$var$Transaction.prototype.getSerializationError = function(opts) {
    opts = opts || {};
    if (this.invalidSatoshis()) return new $lOQ1c.Transaction.InvalidSatoshis();
    var unspent = this.getUnspentValue();
    var unspentError;
    if (unspent < 0) {
        if (!opts.disableMoreOutputThanInput) unspentError = new $lOQ1c.Transaction.InvalidOutputAmountSum();
    } else unspentError = this._hasFeeError(opts, unspent);
    return unspentError || this._hasDustOutputs(opts) || this._isMissingSignatures(opts);
};
$fdf41226c6c48850$var$Transaction.prototype._hasFeeError = function(opts, unspent) {
    if (!$iUxHD.isUndefined(this._fee) && this._fee !== unspent) return new $lOQ1c.Transaction.FeeError.Different("Unspent value is " + unspent + " but specified fee is " + this._fee);
    if (!opts.disableLargeFees) {
        var maximumFee = Math.floor($fdf41226c6c48850$var$Transaction.FEE_SECURITY_MARGIN * this._estimateFee());
        if (unspent > maximumFee) {
            if (this._missingChange()) return new $lOQ1c.Transaction.ChangeAddressMissing("Fee is too large and no change address was provided");
            return new $lOQ1c.Transaction.FeeError.TooLarge("expected less than " + maximumFee + " but got " + unspent);
        }
    }
};
$fdf41226c6c48850$var$Transaction.prototype._missingChange = function() {
    return !this._changeScript;
};
$fdf41226c6c48850$var$Transaction.prototype._hasDustOutputs = function(opts) {
    if (opts.disableDustOutputs) return;
    var index, output;
    for(index in this.outputs){
        output = this.outputs[index];
        if (output.satoshis < $fdf41226c6c48850$var$Transaction.DUST_AMOUNT && !output.script.isDataOut() && !output.script.isSafeDataOut()) return new $lOQ1c.Transaction.DustOutputs();
    }
};
$fdf41226c6c48850$var$Transaction.prototype._isMissingSignatures = function(opts) {
    if (opts.disableIsFullySigned) return;
    if (!this.isFullySigned()) return new $lOQ1c.Transaction.MissingSignatures();
};
$fdf41226c6c48850$var$Transaction.prototype.inspect = function() {
    return "<Transaction: " + this.uncheckedSerialize() + ">";
};
$fdf41226c6c48850$var$Transaction.prototype.toBuffer = function() {
    var writer = new $fvPTe();
    return this.toBufferWriter(writer).toBuffer();
};
$fdf41226c6c48850$var$Transaction.prototype.toBufferWriter = function(writer) {
    writer.writeUInt32LE(this.version);
    writer.writeVarintNum(this.inputs.length);
    $iUxHD.each(this.inputs, function(input) {
        input.toBufferWriter(writer);
    });
    writer.writeVarintNum(this.outputs.length);
    $iUxHD.each(this.outputs, function(output) {
        output.toBufferWriter(writer);
    });
    writer.writeUInt32LE(this.nLockTime);
    return writer;
};
$fdf41226c6c48850$var$Transaction.prototype.fromBuffer = function(buffer) {
    var reader = new $eKoSX(buffer);
    return this.fromBufferReader(reader);
};
$fdf41226c6c48850$var$Transaction.prototype.fromBufferReader = function(reader) {
    $e34gf.checkArgument(!reader.finished(), "No transaction data received");
    var i, sizeTxIns, sizeTxOuts;
    this.version = reader.readInt32LE();
    sizeTxIns = reader.readVarintNum();
    for(i = 0; i < sizeTxIns; i++){
        var input = $3dEU6.fromBufferReader(reader);
        this.inputs.push(input);
    }
    sizeTxOuts = reader.readVarintNum();
    for(i = 0; i < sizeTxOuts; i++)this.outputs.push($6NOKO.fromBufferReader(reader));
    this.nLockTime = reader.readUInt32LE();
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.toObject = $fdf41226c6c48850$var$Transaction.prototype.toJSON = function toObject() {
    var inputs = [];
    this.inputs.forEach(function(input) {
        inputs.push(input.toObject());
    });
    var outputs = [];
    this.outputs.forEach(function(output) {
        outputs.push(output.toObject());
    });
    var obj = {
        hash: this.hash,
        version: this.version,
        inputs: inputs,
        outputs: outputs,
        nLockTime: this.nLockTime
    };
    if (this._changeScript) obj.changeScript = this._changeScript.toString();
    if (this._changeScript) obj.changeAddress = this._changeAddress.toString();
    if (!$iUxHD.isUndefined(this._changeIndex)) obj.changeIndex = this._changeIndex;
    if (!$iUxHD.isUndefined(this._fee)) obj.fee = this._fee;
    return obj;
};
$fdf41226c6c48850$var$Transaction.prototype.fromObject = function fromObject(arg) {
    $e34gf.checkArgument($iUxHD.isObject(arg) || arg instanceof $fdf41226c6c48850$var$Transaction);
    var self = this;
    var transaction;
    if (arg instanceof $fdf41226c6c48850$var$Transaction) transaction = transaction.toObject();
    else transaction = arg;
    $iUxHD.each(transaction.inputs, function(input) {
        if (!input.output || !input.output.script) {
            self.uncheckedAddInput(new $3dEU6(input));
            return;
        }
        var script = new $3LdBG(input.output.script);
        var txin;
        if (script.isPublicKeyHashOut()) txin = new $3dEU6.PublicKeyHash(input);
        else if (script.isScriptHashOut() && input.publicKeys && input.threshold) txin = new $3dEU6.MultiSigScriptHash(input, input.publicKeys, input.threshold, input.signatures);
        else if (script.isPublicKeyOut()) txin = new $3dEU6.PublicKey(input);
        else throw new $lOQ1c.Transaction.Input.UnsupportedScript(input.output.script);
        self.addInput(txin);
    });
    $iUxHD.each(transaction.outputs, function(output) {
        self.addOutput(new $6NOKO(output));
    });
    if (transaction.changeIndex) this._changeIndex = transaction.changeIndex;
    if (transaction.changeScript) this._changeScript = new $3LdBG(transaction.changeScript);
    if (transaction.changeAddress) this._changeAddress = $dOZs9.fromString(transaction.changeAddress);
    if (transaction.fee) this._fee = transaction.fee;
    this.nLockTime = transaction.nLockTime;
    this.version = transaction.version;
    this._checkConsistency(arg);
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype._checkConsistency = function(arg) {
    if (!$iUxHD.isUndefined(this._changeIndex)) {
        $e34gf.checkState(this._changeScript, "Change script is expected.");
        $e34gf.checkState(this._changeAddress, "Change address is expected.");
        $e34gf.checkState(this.outputs[this._changeIndex], "Change index points to undefined output.");
        $e34gf.checkState(this.outputs[this._changeIndex].script.toString() === this._changeScript.toString(), "Change output has an unexpected script.");
    }
    if (arg && arg.hash) $e34gf.checkState(arg.hash === this.hash, "Hash in object does not match transaction hash.");
};
/**
 * Sets nLockTime so that transaction is not valid until the desired date(a
 * timestamp in seconds since UNIX epoch is also accepted)
 *
 * @param {Date | Number} time
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.lockUntilDate = function(time) {
    $e34gf.checkArgument(time);
    if ($iUxHD.isNumber(time) && time < $fdf41226c6c48850$var$Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) throw new $lOQ1c.Transaction.LockTimeTooEarly();
    if ($iUxHD.isDate(time)) time = time.getTime() / 1000;
    for(var i = 0; i < this.inputs.length; i++)if (this.inputs[i].sequenceNumber === $3dEU6.DEFAULT_SEQNUMBER) this.inputs[i].sequenceNumber = $3dEU6.DEFAULT_LOCKTIME_SEQNUMBER;
    this.nLockTime = time;
    return this;
};
/**
 * Sets nLockTime so that transaction is not valid until the desired block
 * height.
 *
 * @param {Number} height
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.lockUntilBlockHeight = function(height) {
    $e34gf.checkArgument($iUxHD.isNumber(height));
    if (height >= $fdf41226c6c48850$var$Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) throw new $lOQ1c.Transaction.BlockHeightTooHigh();
    if (height < 0) throw new $lOQ1c.Transaction.NLockTimeOutOfRange();
    for(var i = 0; i < this.inputs.length; i++)if (this.inputs[i].sequenceNumber === $3dEU6.DEFAULT_SEQNUMBER) this.inputs[i].sequenceNumber = $3dEU6.DEFAULT_LOCKTIME_SEQNUMBER;
    this.nLockTime = height;
    return this;
};
/**
 *  Returns a semantic version of the transaction's nLockTime.
 *  @return {Number|Date}
 *  If nLockTime is 0, it returns null,
 *  if it is < 500000000, it returns a block height (number)
 *  else it returns a Date object.
 */ $fdf41226c6c48850$var$Transaction.prototype.getLockTime = function() {
    if (!this.nLockTime) return null;
    if (this.nLockTime < $fdf41226c6c48850$var$Transaction.NLOCKTIME_BLOCKHEIGHT_LIMIT) return this.nLockTime;
    return new Date(1000 * this.nLockTime);
};
$fdf41226c6c48850$var$Transaction.prototype.fromString = function(string) {
    this.fromBuffer(Buffer.from(string, "hex"));
};
$fdf41226c6c48850$var$Transaction.prototype._newTransaction = function() {
    this.version = $fdf41226c6c48850$var$CURRENT_VERSION;
    this.nLockTime = $fdf41226c6c48850$var$DEFAULT_NLOCKTIME;
};
/* Transaction creation interface */ /**
 * @typedef {Object} Transaction~fromObject
 * @property {string} prevTxId
 * @property {number} outputIndex
 * @property {(Buffer|string|Script)} script
 * @property {number} satoshis
 */ /**
 * Add an input to this transaction. This is a high level interface
 * to add an input, for more control, use @{link Transaction#addInput}.
 *
 * Can receive, as output information, the output of bitcoind's `listunspent` command,
 * and a slightly fancier format recognized by bsv:
 *
 * ```
 * {
 *  address: 'mszYqVnqKoQx4jcTdJXxwKAissE3Jbrrc1',
 *  txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
 *  outputIndex: 0,
 *  script: Script.empty(),
 *  satoshis: 1020000
 * }
 * ```
 * Where `address` can be either a string or a bsv Address object. The
 * same is true for `script`, which can be a string or a bsv Script.
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @example
 * ```javascript
 * var transaction = new Transaction();
 *
 * // From a pay to public key hash output from bitcoind's listunspent
 * transaction.from({'txid': '0000...', vout: 0, amount: 0.1, scriptPubKey: 'OP_DUP ...'});
 *
 * // From a pay to public key hash output
 * transaction.from({'txId': '0000...', outputIndex: 0, satoshis: 1000, script: 'OP_DUP ...'});
 *
 * // From a multisig P2SH output
 * transaction.from({'txId': '0000...', inputIndex: 0, satoshis: 1000, script: '... OP_HASH'},
 *                  ['03000...', '02000...'], 2);
 * ```
 *
 * @param {(Array.<Transaction~fromObject>|Transaction~fromObject)} utxo
 * @param {Array=} pubkeys
 * @param {number=} threshold
 */ $fdf41226c6c48850$var$Transaction.prototype.from = function(utxo, pubkeys, threshold) {
    if ($iUxHD.isArray(utxo)) {
        var self = this;
        $iUxHD.each(utxo, function(utxo) {
            self.from(utxo, pubkeys, threshold);
        });
        return this;
    }
    var exists = $iUxHD.some(this.inputs, function(input) {
        // TODO: Maybe prevTxId should be a string? Or defined as read only property?
        return input.prevTxId.toString("hex") === utxo.txId && input.outputIndex === utxo.outputIndex;
    });
    if (exists) return this;
    if (pubkeys && threshold) this._fromMultisigUtxo(utxo, pubkeys, threshold);
    else this._fromNonP2SH(utxo);
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype._fromNonP2SH = function(utxo) {
    var Clazz;
    utxo = new $dm48c(utxo);
    if (utxo.script.isPublicKeyHashOut()) Clazz = $fdf41226c6c48850$var$PublicKeyHashInput;
    else if (utxo.script.isPublicKeyOut()) Clazz = $fdf41226c6c48850$var$PublicKeyInput;
    else Clazz = $3dEU6;
    this.addInput(new Clazz({
        output: new $6NOKO({
            script: utxo.script,
            satoshis: utxo.satoshis
        }),
        prevTxId: utxo.txId,
        outputIndex: utxo.outputIndex,
        script: $3LdBG.empty()
    }));
};
$fdf41226c6c48850$var$Transaction.prototype._fromMultisigUtxo = function(utxo, pubkeys, threshold) {
    $e34gf.checkArgument(threshold <= pubkeys.length, "Number of required signatures must be greater than the number of public keys");
    var Clazz;
    utxo = new $dm48c(utxo);
    if (utxo.script.isMultisigOut()) Clazz = $fdf41226c6c48850$var$MultiSigInput;
    else if (utxo.script.isScriptHashOut()) Clazz = $fdf41226c6c48850$var$MultiSigScriptHashInput;
    else throw new Error("@TODO");
    this.addInput(new Clazz({
        output: new $6NOKO({
            script: utxo.script,
            satoshis: utxo.satoshis
        }),
        prevTxId: utxo.txId,
        outputIndex: utxo.outputIndex,
        script: $3LdBG.empty()
    }, pubkeys, threshold));
};
/**
 * Add an input to this transaction. The input must be an instance of the `Input` class.
 * It should have information about the Output that it's spending, but if it's not already
 * set, two additional parameters, `outputScript` and `satoshis` can be provided.
 *
 * @param {Input} input
 * @param {String|Script} outputScript
 * @param {number} satoshis
 * @return Transaction this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.addInput = function(input, outputScript, satoshis) {
    $e34gf.checkArgumentType(input, $3dEU6, "input");
    if (!input.output && ($iUxHD.isUndefined(outputScript) || $iUxHD.isUndefined(satoshis))) throw new $lOQ1c.Transaction.NeedMoreInfo("Need information about the UTXO script and satoshis");
    if (!input.output && outputScript && !$iUxHD.isUndefined(satoshis)) {
        outputScript = outputScript instanceof $3LdBG ? outputScript : new $3LdBG(outputScript);
        $e34gf.checkArgumentType(satoshis, "number", "satoshis");
        input.output = new $6NOKO({
            script: outputScript,
            satoshis: satoshis
        });
    }
    return this.uncheckedAddInput(input);
};
/**
 * Add an input to this transaction, without checking that the input has information about
 * the output that it's spending.
 *
 * @param {Input} input
 * @return Transaction this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.uncheckedAddInput = function(input) {
    $e34gf.checkArgumentType(input, $3dEU6, "input");
    this.inputs.push(input);
    this._inputAmount = undefined;
    this._updateChangeOutput();
    return this;
};
/**
 * Returns true if the transaction has enough info on all inputs to be correctly validated
 *
 * @return {boolean}
 */ $fdf41226c6c48850$var$Transaction.prototype.hasAllUtxoInfo = function() {
    return $iUxHD.every(this.inputs.map(function(input) {
        return !!input.output;
    }));
};
/**
 * Manually set the fee for this transaction. Beware that this resets all the signatures
 * for inputs (in further versions, SIGHASH_SINGLE or SIGHASH_NONE signatures will not
 * be reset).
 *
 * @param {number} amount satoshis to be sent
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.fee = function(amount) {
    $e34gf.checkArgument($iUxHD.isNumber(amount), "amount must be a number");
    this._fee = amount;
    this._updateChangeOutput();
    return this;
};
/**
 * Manually set the fee per KB for this transaction. Beware that this resets all the signatures
 * for inputs (in further versions, SIGHASH_SINGLE or SIGHASH_NONE signatures will not
 * be reset).
 *
 * @param {number} amount satoshis per KB to be sent
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.feePerKb = function(amount) {
    $e34gf.checkArgument($iUxHD.isNumber(amount), "amount must be a number");
    this._feePerKb = amount;
    this._updateChangeOutput();
    return this;
};
/* Output management */ /**
 * Set the change address for this transaction
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @param {Address} address An address for change to be sent to.
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.change = function(address) {
    $e34gf.checkArgument(address, "address is required");
    this._changeScript = $3LdBG.fromAddress(address);
    this._changeAddress = $dOZs9(address);
    this._updateChangeOutput();
    return this;
};
/**
 * @return {Output} change output, if it exists
 */ $fdf41226c6c48850$var$Transaction.prototype.getChangeOutput = function() {
    if (!$iUxHD.isUndefined(this._changeIndex)) return this.outputs[this._changeIndex];
    return null;
};
/**
 * @return {Address | null} change address, if it exists
 */ $fdf41226c6c48850$var$Transaction.prototype.getChangeAddress = function() {
    return this._changeAddress ? this._changeAddress : null;
};
/**
 * @typedef {Object} Transaction~toObject
 * @property {(string|Address)} address
 * @property {number} satoshis
 */ /**
 * Add an output to the transaction.
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @param {(string|Address|Array.<Transaction~toObject>)} address
 * @param {number} amount in satoshis
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.to = function(address, amount) {
    if ($iUxHD.isArray(address)) {
        var self = this;
        $iUxHD.each(address, function(to) {
            self.to(to.address, to.satoshis);
        });
        return this;
    }
    $e34gf.checkArgument($bbk3w.isNaturalNumber(amount), "Amount is expected to be a positive integer");
    this.addOutput(new $6NOKO({
        script: $3LdBG(new $dOZs9(address)),
        satoshis: amount
    }));
    return this;
};
/**
 * Add an OP_RETURN output to the transaction.
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @param {Buffer|string} value the data to be stored in the OP_RETURN output.
 *    In case of a string, the UTF-8 representation will be stored
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.addData = function(value) {
    this.addOutput(new $6NOKO({
        script: $3LdBG.buildDataOut(value),
        satoshis: 0
    }));
    return this;
};
/**
 * Add an OP_FALSE | OP_RETURN output to the transaction.
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @param {Buffer|string} value the data to be stored in the OP_RETURN output.
 *    In case of a string, the UTF-8 representation will be stored
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.addSafeData = function(value) {
    this.addOutput(new $6NOKO({
        script: $3LdBG.buildSafeDataOut(value),
        satoshis: 0
    }));
    return this;
};
/**
 * Add an output to the transaction.
 *
 * @param {Output} output the output to add.
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.addOutput = function(output) {
    $e34gf.checkArgumentType(output, $6NOKO, "output");
    this._addOutput(output);
    this._updateChangeOutput();
    return this;
};
/**
 * Remove all outputs from the transaction.
 *
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.clearOutputs = function() {
    this.outputs = [];
    this._clearSignatures();
    this._outputAmount = undefined;
    this._changeIndex = undefined;
    this._updateChangeOutput();
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype._addOutput = function(output) {
    this.outputs.push(output);
    this._outputAmount = undefined;
};
/**
 * Calculates or gets the total output amount in satoshis
 *
 * @return {Number} the transaction total output amount
 */ $fdf41226c6c48850$var$Transaction.prototype._getOutputAmount = function() {
    if ($iUxHD.isUndefined(this._outputAmount)) {
        var self = this;
        this._outputAmount = 0;
        $iUxHD.each(this.outputs, function(output) {
            self._outputAmount += output.satoshis;
        });
    }
    return this._outputAmount;
};
/**
 * Calculates or gets the total input amount in satoshis
 *
 * @return {Number} the transaction total input amount
 */ $fdf41226c6c48850$var$Transaction.prototype._getInputAmount = function() {
    if ($iUxHD.isUndefined(this._inputAmount)) {
        var self = this;
        this._inputAmount = 0;
        $iUxHD.each(this.inputs, function(input) {
            if ($iUxHD.isUndefined(input.output)) throw new $lOQ1c.Transaction.Input.MissingPreviousOutput();
            self._inputAmount += input.output.satoshis;
        });
    }
    return this._inputAmount;
};
$fdf41226c6c48850$var$Transaction.prototype._updateChangeOutput = function() {
    if (this.sealed) throw new $lOQ1c.Transaction.TransactionAlreadySealed();
    if (!this._changeScript) return;
    if (!$iUxHD.isUndefined(this._changeIndex)) this._removeOutput(this._changeIndex);
    this._changeIndex = this.outputs.length;
    this._addOutput(new $6NOKO({
        script: this._changeScript,
        satoshis: 0
    }));
    var available = this.getUnspentValue();
    var fee = this.getFee();
    var changeAmount = available - fee;
    this._removeOutput(this._changeIndex);
    this._changeIndex = undefined;
    if (changeAmount >= $fdf41226c6c48850$var$Transaction.DUST_AMOUNT) {
        this._changeIndex = this.outputs.length;
        this._addOutput(new $6NOKO({
            script: this._changeScript,
            satoshis: changeAmount
        }));
    }
    this._clearSignatures();
};
/**
 * Calculates the fee of the transaction.
 *
 * If there's a fixed fee set, return that.
 *
 * If there is no change output set, the fee is the
 * total value of the outputs minus inputs. Note that
 * a serialized transaction only specifies the value
 * of its outputs. (The value of inputs are recorded
 * in the previous transaction outputs being spent.)
 * This method therefore raises a "MissingPreviousOutput"
 * error when called on a serialized transaction.
 *
 * If there's no fee set and no change address,
 * estimate the fee based on size.
 *
 * @return {Number} fee of this transaction in satoshis
 */ $fdf41226c6c48850$var$Transaction.prototype.getFee = function() {
    if (this.isCoinbase()) return 0;
    if (!$iUxHD.isUndefined(this._fee)) return this._fee;
    // if no change output is set, fees should equal all the unspent amount
    if (!this._changeScript) return this.getUnspentValue();
    return this._estimateFee();
};
/**
 * Estimates fee from serialized transaction size in bytes.
 */ $fdf41226c6c48850$var$Transaction.prototype._estimateFee = function() {
    var estimatedSize = this._estimateSize();
    return Math.ceil(estimatedSize / 1000 * (this._feePerKb || $fdf41226c6c48850$var$Transaction.FEE_PER_KB));
};
$fdf41226c6c48850$var$Transaction.prototype.getUnspentValue = function() {
    return this._getInputAmount() - this._getOutputAmount();
};
$fdf41226c6c48850$var$Transaction.prototype._clearSignatures = function() {
    $iUxHD.each(this.inputs, function(input) {
        input.clearSignatures();
    });
};
// 4    version
// ???  num inputs (VARINT)
// --- input list ---
//
// ???  num outputs (VARINT)
// --- output list ---
//      8       value
//      ???     script size (VARINT)
//      ???     script
//
// 4    locktime
$fdf41226c6c48850$var$Transaction.prototype.getEstimateSize = function() {
    return this._estimateSize();
};
$fdf41226c6c48850$var$Transaction.prototype._estimateSize = function() {
    var result = 8 // size of version + size of locktime
    ;
    result += $kWg93(this.inputs.length).toBuffer().length;
    result += $kWg93(this.outputs.length).toBuffer().length;
    $iUxHD.each(this.inputs, function(input) {
        result += input._estimateSize();
    });
    $iUxHD.each(this.outputs, function(output) {
        result += output.getSize();
    });
    return result;
};
$fdf41226c6c48850$var$Transaction.prototype._removeOutput = function(index) {
    var output = this.outputs[index];
    this.outputs = $iUxHD.without(this.outputs, output);
    this._outputAmount = undefined;
};
$fdf41226c6c48850$var$Transaction.prototype.removeOutput = function(index) {
    this._removeOutput(index);
    this._updateChangeOutput();
};
/**
 * Sort a transaction's inputs and outputs according to BIP69
 *
 * @see {https://github.com/bitcoin/bips/blob/master/bip-0069.mediawiki}
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.sort = function() {
    this.sortInputs(function(inputs) {
        var copy = Array.prototype.concat.apply([], inputs);
        copy.sort(function(first, second) {
            return first.prevTxId.compare(second.prevTxId) || first.outputIndex - second.outputIndex;
        });
        return copy;
    });
    this.sortOutputs(function(outputs) {
        var copy = Array.prototype.concat.apply([], outputs);
        copy.sort(function(first, second) {
            return first.satoshis - second.satoshis || first.script.toBuffer().compare(second.script.toBuffer());
        });
        return copy;
    });
    return this;
};
/**
 * Randomize this transaction's outputs ordering. The shuffling algorithm is a
 * version of the Fisher-Yates shuffle.
 *
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.shuffleOutputs = function() {
    return this.sortOutputs($iUxHD.shuffle);
};
/**
 * Sort this transaction's outputs, according to a given sorting function that
 * takes an array as argument and returns a new array, with the same elements
 * but with a different order. The argument function MUST NOT modify the order
 * of the original array
 *
 * @param {Function} sortingFunction
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.sortOutputs = function(sortingFunction) {
    var outs = sortingFunction(this.outputs);
    return this._newOutputOrder(outs);
};
/**
 * Sort this transaction's inputs, according to a given sorting function that
 * takes an array as argument and returns a new array, with the same elements
 * but with a different order.
 *
 * @param {Function} sortingFunction
 * @return {Transaction} this
 */ $fdf41226c6c48850$var$Transaction.prototype.sortInputs = function(sortingFunction) {
    this.inputs = sortingFunction(this.inputs);
    this._clearSignatures();
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype._newOutputOrder = function(newOutputs) {
    var isInvalidSorting = this.outputs.length !== newOutputs.length || $iUxHD.difference(this.outputs, newOutputs).length !== 0;
    if (isInvalidSorting) throw new $lOQ1c.Transaction.InvalidSorting();
    if (!$iUxHD.isUndefined(this._changeIndex)) {
        var changeOutput = this.outputs[this._changeIndex];
        this._changeIndex = newOutputs.indexOf(changeOutput);
    }
    this.outputs = newOutputs;
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.removeInput = function(txId, outputIndex) {
    var index;
    if (!outputIndex && $iUxHD.isNumber(txId)) index = txId;
    else index = $iUxHD.findIndex(this.inputs, function(input) {
        return input.prevTxId.toString("hex") === txId && input.outputIndex === outputIndex;
    });
    if (index < 0 || index >= this.inputs.length) throw new $lOQ1c.Transaction.InvalidIndex(index, this.inputs.length);
    var input = this.inputs[index];
    this.inputs = $iUxHD.without(this.inputs, input);
    this._inputAmount = undefined;
    this._updateChangeOutput();
};
/* Signature handling */ /**
 * Sign the transaction using one or more private keys.
 *
 * It tries to sign each input, verifying that the signature will be valid
 * (matches a public key).
 *
 * @param {Array|String|PrivateKey} privateKey
 * @param {number} sigtype
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.sign = function(privateKey, sigtype) {
    $e34gf.checkState(this.hasAllUtxoInfo(), "Not all utxo information is available to sign the transaction.");
    var self = this;
    if ($iUxHD.isArray(privateKey)) {
        $iUxHD.each(privateKey, function(privateKey) {
            self.sign(privateKey, sigtype);
        });
        return this;
    }
    $iUxHD.each(this.getSignatures(privateKey, sigtype), function(signature) {
        self.applySignature(signature);
    });
    this._privateKey = privateKey;
    this._sigType = sigtype;
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.getSignatures = function(privKey, sigtype) {
    privKey = new $eB3ON(privKey);
    // By default, signs using ALL|FORKID
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    var transaction = this;
    var results = [];
    var hashData = $aScoK.sha256ripemd160(privKey.publicKey.toBuffer());
    $iUxHD.each(this.inputs, function forEachInput(input, index) {
        $iUxHD.each(input.getSignatures(transaction, privKey, index, sigtype, hashData), function(signature) {
            results.push(signature);
        });
    });
    return results;
};
/**
 * Add a signature to the transaction
 *
 * @param {Object} signature
 * @param {number} signature.inputIndex
 * @param {number} signature.sigtype
 * @param {PublicKey} signature.publicKey
 * @param {Signature} signature.signature
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.applySignature = function(signature) {
    this.inputs[signature.inputIndex].addSignature(this, signature);
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.isFullySigned = function() {
    $iUxHD.each(this.inputs, function(input) {
        if (input.isFullySigned === $3dEU6.prototype.isFullySigned) throw new $lOQ1c.Transaction.UnableToVerifySignature("Unrecognized script kind, or not enough information to execute script.This usually happens when creating a transaction from a serialized transaction");
    });
    return $iUxHD.every($iUxHD.map(this.inputs, function(input) {
        return input.isFullySigned();
    }));
};
$fdf41226c6c48850$var$Transaction.prototype.isValidSignature = function(signature) {
    var self = this;
    if (this.inputs[signature.inputIndex].isValidSignature === $3dEU6.prototype.isValidSignature) throw new $lOQ1c.Transaction.UnableToVerifySignature("Unrecognized script kind, or not enough information to execute script.This usually happens when creating a transaction from a serialized transaction");
    return this.inputs[signature.inputIndex].isValidSignature(self, signature);
};
/**
 * @returns {bool} whether the signature is valid for this transaction input
 */ $fdf41226c6c48850$var$Transaction.prototype.verifySignature = function(sig, pubkey, nin, subscript, satoshisBN, flags) {
    return $aTWNt.verify(this, sig, pubkey, nin, subscript, satoshisBN, flags);
};
/**
 * Check that a transaction passes basic sanity tests. If not, return a string
 * describing the error. This function contains the same logic as
 * CheckTransaction in bitcoin core.
 */ $fdf41226c6c48850$var$Transaction.prototype.verify = function(notVerifyInput) {
    // Basic checks that don't depend on any context
    if (this.inputs.length === 0) return "transaction txins empty";
    if (this.outputs.length === 0) return "transaction txouts empty";
    // Check for negative or overflow output values
    var valueoutbn = new $lM2TS(0);
    for(var i = 0; i < this.outputs.length; i++){
        var txout = this.outputs[i];
        if (txout.invalidSatoshis()) return "transaction txout " + i + " satoshis is invalid";
        if (txout._satoshisBN.gt(new $lM2TS($fdf41226c6c48850$var$Transaction.MAX_MONEY, 10))) return "transaction txout " + i + " greater than MAX_MONEY";
        valueoutbn = valueoutbn.add(txout._satoshisBN);
        if (valueoutbn.gt(new $lM2TS($fdf41226c6c48850$var$Transaction.MAX_MONEY))) return "transaction txout " + i + " total output greater than MAX_MONEY";
    }
    // Check for duplicate inputs
    var txinmap = {};
    for(i = 0; i < this.inputs.length; i++){
        var txin = this.inputs[i];
        var inputid = txin.prevTxId + ":" + txin.outputIndex;
        if (!$iUxHD.isUndefined(txinmap[inputid])) return "transaction input " + i + " duplicate input";
        txinmap[inputid] = true;
    }
    var isCoinbase = this.isCoinbase();
    if (isCoinbase) {
        var buf = this.inputs[0]._scriptBuffer;
        if (buf.length < 2 || buf.length > 100) return "coinbase transaction script size invalid";
    } else for(i = 0; i < this.inputs.length; i++){
        if (this.inputs[i].isNull()) return "transaction input " + i + " has null input";
        if (!notVerifyInput) {
            var res = this.inputs[i].verify(this, i);
            if (!res.success) return "transaction input " + i + " VerifyError: " + res.error;
        }
    }
    return true;
};
/**
 * Analogous to bitcoind's IsCoinBase function in transaction.h
 */ $fdf41226c6c48850$var$Transaction.prototype.isCoinbase = function() {
    return this.inputs.length === 1 && this.inputs[0].isNull();
};
/**
 *
 * @param {number | object} inputIndex or option
 * @param {Script|(tx, output) => Script} unlockScriptOrCallback  unlockScript or a callback returns unlockScript
 * @returns unlockScript of the special input
 */ $fdf41226c6c48850$var$Transaction.prototype.setInputScript = function(options, unlockScriptOrCallback) {
    var inputIndex = 0;
    var privateKey;
    var sigtype;
    var isLowS = false;
    if (typeof options === "number") {
        inputIndex = options;
        sigtype = $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    } else {
        inputIndex = options.inputIndex || 0;
        privateKey = options.privateKey;
        sigtype = options.sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
        isLowS = options.isLowS || false;
    }
    if (unlockScriptOrCallback instanceof Function) {
        var outputInPrevTx = this.inputs[inputIndex].output;
        this._inputsMap.set(inputIndex, {
            sigtype: sigtype,
            privateKey: privateKey,
            isLowS: isLowS,
            callback: unlockScriptOrCallback
        });
        var unlockScript = unlockScriptOrCallback(this, outputInPrevTx);
        this.inputs[inputIndex].setScript(unlockScript);
    } else this.inputs[inputIndex].setScript(unlockScriptOrCallback);
    return this;
};
/**
 *
 * @param {number | object} inputIndex or option
 * @param {(tx, output) => Promise<Script>} unlockScriptOrCallback  a callback returns a unlocking script
 * @returns A promise which resolves to unlockScript of the special input
 */ $fdf41226c6c48850$var$Transaction.prototype.setInputScriptAsync = async function(options, unlockScriptOrCallback) {
    var inputIndex = 0;
    var sigtype;
    var isLowS = false;
    if (typeof options === "number") {
        inputIndex = options;
        sigtype = $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    } else {
        inputIndex = options.inputIndex || 0;
        sigtype = options.sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
        isLowS = options.isLowS || false;
    }
    if (unlockScriptOrCallback instanceof Function) {
        var outputInPrevTx = this.inputs[inputIndex].output;
        this._inputsMap.set(inputIndex, {
            sigtype: sigtype,
            isLowS: isLowS,
            callback: unlockScriptOrCallback
        });
        var unlockScript = await unlockScriptOrCallback(this, outputInPrevTx);
        this.inputs[inputIndex].setScript(unlockScript);
    } else throw new $lOQ1c.InvalidArgument("Must provide a callback returns a unlocking script");
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.setInputSequence = function(inputIndex, sequence) {
    this.inputs[inputIndex].sequenceNumber = sequence;
    return this;
};
/**
 *
 * @param {number} outputIndex
 * @param {Output|(tx) => Output} outputOrcb  output or a callback returns output
 * @returns output
 */ $fdf41226c6c48850$var$Transaction.prototype.setOutput = function(outputIndex, outputOrcb) {
    if (outputOrcb instanceof Function) {
        this._outputsMap.set(outputIndex, outputOrcb);
        this.outputs[outputIndex] = outputOrcb(this);
    } else this.outputs[outputIndex] = outputOrcb;
    this._updateChangeOutput();
    return this;
};
/**
 * Seal a transaction. After the transaction is sealed, except for the unlock script entered,
 * other attributes of the transaction cannot be modified
 */ $fdf41226c6c48850$var$Transaction.prototype.seal = function() {
    var self = this;
    this._outputsMap.forEach(function(callback, key) {
        self.outputs[key] = callback(self);
    });
    this._updateChangeOutput();
    this._inputsMap.forEach(function(options, key) {
        var outputInPrevTx = self.inputs[key].output;
        var unlockScript = options.callback(self, outputInPrevTx);
        self.inputs[key].setScript(unlockScript);
    });
    if (this._privateKey) this.sign(this._privateKey, this._sigType);
    this.sealed = true;
    return this;
};
/**
 * Seal a transaction asynchronously. After the transaction is sealed, except for the unlock script entered,
 * other attributes of the transaction cannot be modified
 */ $fdf41226c6c48850$var$Transaction.prototype.sealAsync = async function() {
    var self = this;
    this._outputsMap.forEach(function(callback, key) {
        self.outputs[key] = callback(self);
    });
    this._updateChangeOutput();
    var promises = [];
    this._inputsMap.forEach(function(options, key) {
        var outputInPrevTx = self.inputs[key].output;
        promises.push(Promise.resolve(options.callback(self, outputInPrevTx)).then((unlockScript)=>{
            return {
                key: key,
                unlockScript: unlockScript
            };
        }));
    });
    await Promise.all(promises).then((items)=>{
        items.forEach(({ key: key, unlockScript: unlockScript })=>{
            self.inputs[key].setScript(unlockScript);
        });
    });
    if (this._privateKey) this.sign(this._privateKey, this._sigType);
    this.sealed = true;
    return this;
};
$fdf41226c6c48850$var$Transaction.prototype.setLockTime = function(nLockTime) {
    this.nLockTime = nLockTime;
    return this;
};
/**
 *
 * @returns satoshis of change output
 */ $fdf41226c6c48850$var$Transaction.prototype.getChangeAmount = function() {
    if ($iUxHD.isUndefined(this._changeIndex)) return 0;
    return this.outputs[this._changeIndex].satoshis;
};
/**
 *
 * @returns estimate fee by transaction size
 */ $fdf41226c6c48850$var$Transaction.prototype.getEstimateFee = function() {
    return this._estimateFee();
};
/**
 *
 * @param {number} feePerKb the fee per KB for this transaction
 * @returns true or false
 */ $fdf41226c6c48850$var$Transaction.prototype.checkFeeRate = function(feePerKb) {
    var fee = this.getUnspentValue();
    var estimatedSize = this._estimateSize();
    var expectedRate = (feePerKb || this._feePerKb || $fdf41226c6c48850$var$Transaction.FEE_PER_KB) / 1000;
    var realFeeRate = fee / estimatedSize;
    return realFeeRate >= expectedRate;
};
/**
 *
 * @returns the serialization of all input outpoints
 */ $fdf41226c6c48850$var$Transaction.prototype.prevouts = function() {
    var writer = new $fvPTe();
    $iUxHD.each(this.inputs, function(input) {
        writer.writeReverse(input.prevTxId);
        writer.writeUInt32LE(input.outputIndex);
    });
    var buf = writer.toBuffer();
    return buf.toString("hex");
};
/**
 *
 * @returns if the transaction is sealed
 */ $fdf41226c6c48850$var$Transaction.prototype.isSealed = function() {
    return this.sealed;
};
$fdf41226c6c48850$var$Transaction.prototype.getPreimage = function(inputIndex, sigtype, isLowS, csIdx) {
    $e34gf.checkArgumentType(inputIndex, "number", "inputIndex");
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    isLowS = isLowS || false;
    inputIndex = inputIndex || 0;
    var preimage = this.inputs[inputIndex].getPreimage(this, inputIndex, sigtype, isLowS, csIdx);
    return preimage.toString("hex");
};
$fdf41226c6c48850$var$Transaction.prototype.getSignature = function(inputIndex, privateKeys, sigtypes) {
    $e34gf.checkArgumentType(inputIndex, "number", "inputIndex");
    var results = [];
    var inputOpt = (this._inputsMap || new Map()).get(inputIndex);
    privateKeys = privateKeys || (inputOpt ? inputOpt.privateKey : this._privateKey);
    if (privateKeys) {
        sigtypes = sigtypes || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
        var sigs = this.inputs[inputIndex].getSignatures(this, privateKeys, inputIndex, sigtypes);
        $iUxHD.each(sigs, function(sig) {
            results.push(sig.signature.toTxFormat().toString("hex"));
        });
        if (results.length === 1) return results[0];
        return results;
    }
    return [];
};
$fdf41226c6c48850$var$Transaction.prototype.addInputFromPrevTx = function(prevTx, outputIndex) {
    $e34gf.checkArgumentType(prevTx, $fdf41226c6c48850$var$Transaction, "prevTx");
    var outputIdx = outputIndex || 0;
    const output = prevTx.outputs[outputIdx];
    if (output.script.isPublicKeyHashOut()) return this.addInput(new $fdf41226c6c48850$var$PublicKeyHashInput({
        prevTxId: prevTx.id,
        outputIndex: outputIdx,
        script: new $3LdBG(""),
        output: output
    }));
    else return this.addInput(new $3dEU6({
        prevTxId: prevTx.id,
        outputIndex: outputIdx,
        script: new $3LdBG(""),
        output: output
    }));
};
$fdf41226c6c48850$var$Transaction.prototype.addDummyInput = function(script, satoshis) {
    $e34gf.checkArgumentType(script, $3LdBG, "script");
    $e34gf.checkArgumentType(satoshis, "number", "satoshis");
    return this.addInput(new $3dEU6({
        prevTxId: "a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458",
        outputIndex: 0,
        script: new $3LdBG(""),
        output: new $6NOKO({
            script: script,
            satoshis: satoshis
        })
    }));
};
/**
 * Same as change(addresss), but using the address of Transaction.DUMMY_PRIVATEKEY as default change address
 *
 * Beware that this resets all the signatures for inputs (in further versions,
 * SIGHASH_SINGLE or SIGHASH_NONE signatures will not be reset).
 *
 * @return {Transaction} this, for chaining
 */ $fdf41226c6c48850$var$Transaction.prototype.dummyChange = function() {
    return this.change($fdf41226c6c48850$var$Transaction.DUMMY_PRIVATEKEY.toAddress());
};
$fdf41226c6c48850$var$Transaction.prototype.verifyScript = function(inputIndex) {
    $e34gf.checkArgumentType(inputIndex, "number", "inputIndex");
    if (!this.inputs[inputIndex]) throw new $lOQ1c.Transaction.Input.MissingInput();
    return this.inputs[inputIndex].verify(this, inputIndex);
};
/**
 * @deprecated, please use `verifyScript` instead
 */ $fdf41226c6c48850$var$Transaction.prototype.verifyInputScript = function(inputIndex) {
    return this.verifyScript(inputIndex);
};
$fdf41226c6c48850$var$Transaction.prototype.getInputAmount = function(inputIndex) {
    $e34gf.checkArgumentType(inputIndex, "number", "inputIndex");
    if (!this.inputs[inputIndex]) throw new $lOQ1c.Transaction.Input.MissingInput();
    return this.inputs[inputIndex].output.satoshis;
};
$fdf41226c6c48850$var$Transaction.prototype.getOutputAmount = function(outputIndex) {
    $e34gf.checkArgumentType(outputIndex, "number", "outputIndex");
    if (!this.outputs[outputIndex]) throw new $lOQ1c.Transaction.MissingOutput();
    return this.outputs[outputIndex].satoshis;
};
module.exports = $fdf41226c6c48850$var$Transaction;

});
parcelRegister("eKoSX", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lM2TS = parcelRequire("lM2TS");
var $abc8aa4b71d809cc$var$BufferReader = function BufferReader(buf) {
    if (!(this instanceof BufferReader)) return new BufferReader(buf);
    if ($iUxHD.isUndefined(buf)) return;
    if (Buffer.isBuffer(buf)) this.set({
        buf: buf
    });
    else if ($iUxHD.isString(buf)) {
        var b = Buffer.from(buf, "hex");
        if (b.length * 2 !== buf.length) throw new TypeError("Invalid hex string");
        this.set({
            buf: b
        });
    } else if ($iUxHD.isObject(buf)) {
        var obj = buf;
        this.set(obj);
    } else throw new TypeError("Unrecognized argument for BufferReader");
};
$abc8aa4b71d809cc$var$BufferReader.prototype.set = function(obj) {
    this.buf = obj.buf || this.buf || undefined;
    this.pos = obj.pos || this.pos || 0;
    return this;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.eof = function() {
    return this.pos >= this.buf.length;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.finished = $abc8aa4b71d809cc$var$BufferReader.prototype.eof;
$abc8aa4b71d809cc$var$BufferReader.prototype.read = function(len) {
    $e34gf.checkArgument(!$iUxHD.isUndefined(len), "Must specify a length");
    var buf = this.buf.slice(this.pos, this.pos + len);
    this.pos = this.pos + len;
    return buf;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readAll = function() {
    var buf = this.buf.slice(this.pos, this.buf.length);
    this.pos = this.buf.length;
    return buf;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt8 = function() {
    var val = this.buf.readUInt8(this.pos);
    this.pos = this.pos + 1;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt16BE = function() {
    var val = this.buf.readUInt16BE(this.pos);
    this.pos = this.pos + 2;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt16LE = function() {
    var val = this.buf.readUInt16LE(this.pos);
    this.pos = this.pos + 2;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt32BE = function() {
    var val = this.buf.readUInt32BE(this.pos);
    this.pos = this.pos + 4;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt32LE = function() {
    var val = this.buf.readUInt32LE(this.pos);
    this.pos = this.pos + 4;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readInt32LE = function() {
    var val = this.buf.readInt32LE(this.pos);
    this.pos = this.pos + 4;
    return val;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt64BEBN = function() {
    var buf = this.buf.slice(this.pos, this.pos + 8);
    var bn = $lM2TS.fromBuffer(buf);
    this.pos = this.pos + 8;
    return bn;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readUInt64LEBN = function() {
    var second = this.buf.readUInt32LE(this.pos);
    var first = this.buf.readUInt32LE(this.pos + 4);
    var combined = first * 0x100000000 + second;
    // Instantiating an instance of BN with a number is faster than with an
    // array or string. However, the maximum safe number for a double precision
    // floating point is 2 ^ 52 - 1 (0x1fffffffffffff), thus we can safely use
    // non-floating point numbers less than this amount (52 bits). And in the case
    // that the number is larger, we can instatiate an instance of BN by passing
    // an array from the buffer (slower) and specifying the endianness.
    var bn;
    if (combined <= 0x1fffffffffffff) bn = new $lM2TS(combined);
    else {
        var data = Array.prototype.slice.call(this.buf, this.pos, this.pos + 8);
        bn = new $lM2TS(data, 10, "le");
    }
    this.pos = this.pos + 8;
    return bn;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readVarintNum = function() {
    var first = this.readUInt8();
    switch(first){
        case 0xFD:
            return this.readUInt16LE();
        case 0xFE:
            return this.readUInt32LE();
        case 0xFF:
            var bn = this.readUInt64LEBN();
            var n = bn.toNumber();
            if (n <= Math.pow(2, 53)) return n;
            else throw new Error("number too large to retain precision - use readVarintBN");
        // break // unreachable
        default:
            return first;
    }
};
/**
 * reads a length prepended buffer
 */ $abc8aa4b71d809cc$var$BufferReader.prototype.readVarLengthBuffer = function() {
    var len = this.readVarintNum();
    var buf = this.read(len);
    $e34gf.checkState(buf.length === len, "Invalid length while reading varlength buffer. Expected to read: " + len + " and read " + buf.length);
    return buf;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readVarintBuf = function() {
    var first = this.buf.readUInt8(this.pos);
    switch(first){
        case 0xFD:
            return this.read(3);
        case 0xFE:
            return this.read(5);
        case 0xFF:
            return this.read(9);
        default:
            return this.read(1);
    }
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readVarintBN = function() {
    var first = this.readUInt8();
    switch(first){
        case 0xFD:
            return new $lM2TS(this.readUInt16LE());
        case 0xFE:
            return new $lM2TS(this.readUInt32LE());
        case 0xFF:
            return this.readUInt64LEBN();
        default:
            return new $lM2TS(first);
    }
};
$abc8aa4b71d809cc$var$BufferReader.prototype.reverse = function() {
    var buf = Buffer.alloc(this.buf.length);
    for(var i = 0; i < buf.length; i++)buf[i] = this.buf[this.buf.length - 1 - i];
    this.buf = buf;
    return this;
};
$abc8aa4b71d809cc$var$BufferReader.prototype.readReverse = function(len) {
    if ($iUxHD.isUndefined(len)) len = this.buf.length;
    var buf = this.buf.slice(this.pos, this.pos + len);
    this.pos = this.pos + len;
    return Buffer.from(buf).reverse();
};
$abc8aa4b71d809cc$var$BufferReader.prototype.remaining = function() {
    return this.buf.length - this.pos;
};
module.exports = $abc8aa4b71d809cc$var$BufferReader;

});

parcelRegister("kWg93", function(module, exports) {
"use strict";

var $fvPTe = parcelRequire("fvPTe");

var $eKoSX = parcelRequire("eKoSX");

var $lM2TS = parcelRequire("lM2TS");
var $f3e5bf7c88fa4d07$var$Varint = function Varint(buf) {
    if (!(this instanceof Varint)) return new Varint(buf);
    if (Buffer.isBuffer(buf)) this.buf = buf;
    else if (typeof buf === "number") {
        var num = buf;
        this.fromNumber(num);
    } else if (buf instanceof $lM2TS) {
        var bn = buf;
        this.fromBN(bn);
    } else if (buf) {
        var obj = buf;
        this.set(obj);
    }
};
$f3e5bf7c88fa4d07$var$Varint.prototype.set = function(obj) {
    this.buf = obj.buf || this.buf;
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.fromString = function(str) {
    this.set({
        buf: Buffer.from(str, "hex")
    });
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.toString = function() {
    return this.buf.toString("hex");
};
$f3e5bf7c88fa4d07$var$Varint.prototype.fromBuffer = function(buf) {
    this.buf = buf;
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.fromBufferReader = function(br) {
    this.buf = br.readVarintBuf();
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.fromBN = function(bn) {
    var bw = new $fvPTe();
    this.buf = bw.writeVarintBN(bn).toBuffer();
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.fromNumber = function(num) {
    var bw = new $fvPTe();
    this.buf = bw.writeVarintNum(num).toBuffer();
    return this;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.toBuffer = function() {
    return this.buf;
};
$f3e5bf7c88fa4d07$var$Varint.prototype.toBN = function() {
    return $eKoSX(this.buf).readVarintBN();
};
$f3e5bf7c88fa4d07$var$Varint.prototype.toNumber = function() {
    return $eKoSX(this.buf).readVarintNum();
};
module.exports = $f3e5bf7c88fa4d07$var$Varint;

});

parcelRegister("aTWNt", function(module, exports) {
"use strict";

var $km2cb = parcelRequire("km2cb");

var $3LdBG = parcelRequire("3LdBG");

var $6NOKO = parcelRequire("6NOKO");

var $eKoSX = parcelRequire("eKoSX");

var $fvPTe = parcelRequire("fvPTe");

var $lM2TS = parcelRequire("lM2TS");

var $aScoK = parcelRequire("aScoK");

var $2p5rz = parcelRequire("2p5rz");

var $e34gf = parcelRequire("e34gf");

var $9uoiU = parcelRequire("9uoiU");

var $iUxHD = parcelRequire("iUxHD");

var $318hy = parcelRequire("318hy");
var $7efca64b016e45dc$var$SIGHASH_SINGLE_BUG = Buffer.from("0000000000000000000000000000000000000000000000000000000000000001", "hex");
var $7efca64b016e45dc$var$BITS_64_ON = "ffffffffffffffff";
// By default, we sign with sighash_forkid
var $7efca64b016e45dc$var$DEFAULT_SIGN_FLAGS = $9uoiU.SCRIPT_ENABLE_SIGHASH_FORKID;
var $7efca64b016e45dc$var$sighashPreimageForForkId = function(transaction, sighashType, inputNumber, subscript, satoshisBN, hashCache = new $318hy()) {
    var input = transaction.inputs[inputNumber];
    $e34gf.checkArgument(satoshisBN instanceof $lM2TS, "For ForkId=0 signatures, satoshis or complete input must be provided");
    function GetPrevoutHash(tx) {
        var writer = new $fvPTe();
        $iUxHD.each(tx.inputs, function(input) {
            writer.writeReverse(input.prevTxId);
            writer.writeUInt32LE(input.outputIndex);
        });
        var buf = writer.toBuffer();
        var ret = $aScoK.sha256sha256(buf);
        return ret;
    }
    function GetSequenceHash(tx) {
        var writer = new $fvPTe();
        $iUxHD.each(tx.inputs, function(input) {
            writer.writeUInt32LE(input.sequenceNumber);
        });
        var buf = writer.toBuffer();
        var ret = $aScoK.sha256sha256(buf);
        return ret;
    }
    function GetOutputsHash(tx, n) {
        var writer = new $fvPTe();
        if ($iUxHD.isUndefined(n)) $iUxHD.each(tx.outputs, function(output) {
            output.toBufferWriter(writer);
        });
        else tx.outputs[n].toBufferWriter(writer);
        var buf = writer.toBuffer();
        var ret = $aScoK.sha256sha256(buf);
        return ret;
    }
    var hashPrevouts = Buffer.alloc(32);
    var hashSequence = Buffer.alloc(32);
    var hashOutputs = Buffer.alloc(32);
    if (!(sighashType & $km2cb.SIGHASH_ANYONECANPAY)) hashPrevouts = hashCache.prevoutsHashBuf ? hashCache.prevoutsHashBuf : hashCache.prevoutsHashBuf = GetPrevoutHash(transaction);
    if (!(sighashType & $km2cb.SIGHASH_ANYONECANPAY) && (sighashType & 31) !== $km2cb.SIGHASH_SINGLE && (sighashType & 31) !== $km2cb.SIGHASH_NONE) hashSequence = hashCache.sequenceHashBuf ? hashCache.sequenceHashBuf : hashCache.sequenceHashBuf = GetSequenceHash(transaction);
    if ((sighashType & 31) !== $km2cb.SIGHASH_SINGLE && (sighashType & 31) !== $km2cb.SIGHASH_NONE) hashOutputs = hashCache.outputsHashBuf ? hashCache.outputsHashBuf : hashCache.outputsHashBuf = GetOutputsHash(transaction);
    else if ((sighashType & 31) === $km2cb.SIGHASH_SINGLE && inputNumber < transaction.outputs.length) hashOutputs = GetOutputsHash(transaction, inputNumber);
    var writer = new $fvPTe();
    // Version
    writer.writeUInt32LE(transaction.version);
    // Input prevouts/nSequence (none/all, depending on flags)
    writer.write(hashPrevouts);
    writer.write(hashSequence);
    //  outpoint (32-byte hash + 4-byte little endian)
    writer.writeReverse(input.prevTxId);
    writer.writeUInt32LE(input.outputIndex);
    // scriptCode of the input (serialized as scripts inside CTxOuts)
    var subscriptBuffer = subscript.toBuffer();
    writer.writeVarintNum(subscriptBuffer.length);
    writer.write(subscriptBuffer);
    // value of the output spent by this input (8-byte little endian)
    writer.writeUInt64LEBN(satoshisBN);
    // nSequence of the input (4-byte little endian)
    var sequenceNumber = input.sequenceNumber;
    writer.writeUInt32LE(sequenceNumber);
    // Outputs (none/one/all, depending on flags)
    writer.write(hashOutputs);
    // Locktime
    writer.writeUInt32LE(transaction.nLockTime);
    // sighashType
    writer.writeUInt32LE(sighashType >>> 0);
    var buf = writer.toBuffer();
    return buf;
};


/**
 * Returns a buffer with the which is hashed with sighash that needs to be signed
 * for OP_CHECKSIG.
 *
 * @name Signing.sighash
 * @param {Transaction} transaction the transaction to sign
 * @param {number} sighashType the type of the hash
 * @param {number} inputNumber the input index for the signature
 * @param {Script} subscript the script that will be signed
 * @param {satoshisBN} input's amount (for  ForkId signatures)
 *
 */ var $7efca64b016e45dc$var$sighashPreimage = function sighashPreimage(transaction, sighashType, inputNumber, subscript, satoshisBN, flags, hashCache = new $318hy()) {
    var Transaction = (parcelRequire("lNMR4"));
    var Input = (parcelRequire("3dEU6"));
    if ($iUxHD.isUndefined(flags)) flags = $7efca64b016e45dc$var$DEFAULT_SIGN_FLAGS;
    if (flags & $9uoiU.SCRIPT_ENABLE_REPLAY_PROTECTION) {
        // Legacy chain's value for fork id must be of the form 0xffxxxx.
        // By xoring with 0xdead, we ensure that the value will be different
        // from the original one, even if it already starts with 0xff.
        var forkValue = sighashType >> 8;
        var newForkValue = 0xff0000 | forkValue ^ 0xdead;
        sighashType = newForkValue << 8 | sighashType & 0xff;
    }
    if (sighashType & $km2cb.SIGHASH_FORKID && flags & $9uoiU.SCRIPT_ENABLE_SIGHASH_FORKID) return $7efca64b016e45dc$var$sighashPreimageForForkId(transaction, sighashType, inputNumber, subscript, satoshisBN);
    // Copy transaction
    var txcopy = Transaction.shallowCopy(transaction);
    // Copy script
    subscript = new $3LdBG(subscript);
    // For no ForkId sighash, separators need to be removed.
    subscript.removeCodeseparators();
    var i;
    for(i = 0; i < txcopy.inputs.length; i++)// Blank signatures for other inputs
    txcopy.inputs[i] = new Input(txcopy.inputs[i]).setScript($3LdBG.empty());
    txcopy.inputs[inputNumber] = new Input(txcopy.inputs[inputNumber]).setScript(subscript);
    if ((sighashType & 31) === $km2cb.SIGHASH_NONE || (sighashType & 31) === $km2cb.SIGHASH_SINGLE) {
        // clear all sequenceNumbers
        for(i = 0; i < txcopy.inputs.length; i++)if (i !== inputNumber) txcopy.inputs[i].sequenceNumber = 0;
    }
    if ((sighashType & 31) === $km2cb.SIGHASH_NONE) txcopy.outputs = [];
    else if ((sighashType & 31) === $km2cb.SIGHASH_SINGLE) {
        // The SIGHASH_SINGLE bug.
        // https://bitcointalk.org/index.php?topic=260595.0
        if (inputNumber >= txcopy.outputs.length) return $7efca64b016e45dc$var$SIGHASH_SINGLE_BUG;
        txcopy.outputs.length = inputNumber + 1;
        for(i = 0; i < inputNumber; i++)txcopy.outputs[i] = new $6NOKO({
            satoshis: $lM2TS.fromBuffer(Buffer.from($7efca64b016e45dc$var$BITS_64_ON, "hex")),
            script: $3LdBG.empty()
        });
    }
    if (sighashType & $km2cb.SIGHASH_ANYONECANPAY) txcopy.inputs = [
        txcopy.inputs[inputNumber]
    ];
    var buf = new $fvPTe().write(txcopy.toBuffer()).writeInt32LE(sighashType).toBuffer();
    return buf;
};
/**
 * Returns a buffer of length 32 bytes with the hash that needs to be signed
 * for OP_CHECKSIG.
 *
 * @name Signing.sighash
 * @param {Transaction} transaction the transaction to sign
 * @param {number} sighashType the type of the hash
 * @param {number} inputNumber the input index for the signature
 * @param {Script} subscript the script that will be signed
 * @param {satoshisBN} input's amount (for  ForkId signatures)
 *
 */ var $7efca64b016e45dc$var$sighash = function sighash(transaction, sighashType, inputNumber, subscript, satoshisBN, flags, hashCache = new $318hy()) {
    var preimage = $7efca64b016e45dc$var$sighashPreimage(transaction, sighashType, inputNumber, subscript, satoshisBN, flags, hashCache);
    if (preimage.compare($7efca64b016e45dc$var$SIGHASH_SINGLE_BUG) === 0) return preimage;
    var ret = $aScoK.sha256sha256(preimage);
    ret = new $eKoSX(ret).readReverse();
    return ret;
};
/**
 * Create a signature
 *
 * @name Signing.sign
 * @param {Transaction} transaction
 * @param {PrivateKey} privateKey
 * @param {number} sighash
 * @param {number} inputIndex
 * @param {Script} subscript
 * @param {satoshisBN} input's amount
 * @return {Signature}
 */ function $7efca64b016e45dc$var$sign(transaction, privateKey, sighashType, inputIndex, subscript, satoshisBN, flags, hashCache = new $318hy()) {
    var hashbuf = $7efca64b016e45dc$var$sighash(transaction, sighashType, inputIndex, subscript, satoshisBN, flags, hashCache);
    var sig = $2p5rz.sign(hashbuf, privateKey, "little").set({
        nhashtype: sighashType
    });
    return sig;
}
/**
 * Verify a signature
 *
 * @name Signing.verify
 * @param {Transaction} transaction
 * @param {Signature} signature
 * @param {PublicKey} publicKey
 * @param {number} inputIndex
 * @param {Script} subscript
 * @param {satoshisBN} input's amount
 * @param {flags} verification flags
 * @return {boolean}
 */ function $7efca64b016e45dc$var$verify(transaction, signature, publicKey, inputIndex, subscript, satoshisBN, flags, hashCache = new $318hy()) {
    $e34gf.checkArgument(!$iUxHD.isUndefined(transaction));
    $e34gf.checkArgument(!$iUxHD.isUndefined(signature) && !$iUxHD.isUndefined(signature.nhashtype));
    var hashbuf = $7efca64b016e45dc$var$sighash(transaction, signature.nhashtype, inputIndex, subscript, satoshisBN, flags, hashCache);
    return $2p5rz.verify(hashbuf, signature, publicKey, "little");
}
/**
 * @namespace Signing
 */ module.exports = {
    sighashPreimage: $7efca64b016e45dc$var$sighashPreimage,
    sighash: $7efca64b016e45dc$var$sighash,
    sign: $7efca64b016e45dc$var$sign,
    verify: $7efca64b016e45dc$var$verify
};

});
parcelRegister("6NOKO", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $lM2TS = parcelRequire("lM2TS");

var $bbk3w = parcelRequire("bbk3w");

var $fvPTe = parcelRequire("fvPTe");

var $kWg93 = parcelRequire("kWg93");

var $3LdBG = parcelRequire("3LdBG");

var $e34gf = parcelRequire("e34gf");

var $lOQ1c = parcelRequire("lOQ1c");
var $4f3eb05e7ad3d480$var$MAX_SAFE_INTEGER = 0x1fffffffffffff;
function $4f3eb05e7ad3d480$var$Output(args) {
    if (!(this instanceof $4f3eb05e7ad3d480$var$Output)) return new $4f3eb05e7ad3d480$var$Output(args);
    if ($iUxHD.isObject(args)) {
        this.satoshis = args.satoshis;
        if (Buffer.isBuffer(args.script)) this.setScriptFromBuffer(args.script);
        else {
            var script;
            if ($iUxHD.isString(args.script) && $bbk3w.isHexa(args.script)) script = Buffer.from(args.script, "hex");
            else script = args.script;
            this.setScript(script);
        }
    } else throw new TypeError("Unrecognized argument for Output");
}
Object.defineProperty($4f3eb05e7ad3d480$var$Output.prototype, "script", {
    configurable: false,
    enumerable: true,
    get: function() {
        return this._script;
    }
});
Object.defineProperty($4f3eb05e7ad3d480$var$Output.prototype, "satoshis", {
    configurable: false,
    enumerable: true,
    get: function() {
        return this._satoshis;
    },
    set: function(num) {
        if (num instanceof $lM2TS) {
            this._satoshisBN = num;
            this._satoshis = num.toNumber();
        } else if ($iUxHD.isString(num)) {
            this._satoshis = parseInt(num);
            this._satoshisBN = $lM2TS.fromNumber(this._satoshis);
        } else {
            $e34gf.checkArgument($bbk3w.isNaturalNumber(num), "Output satoshis is not a natural number");
            this._satoshisBN = $lM2TS.fromNumber(num);
            this._satoshis = num;
        }
        $e34gf.checkState($bbk3w.isNaturalNumber(this._satoshis), "Output satoshis is not a natural number");
    }
});
$4f3eb05e7ad3d480$var$Output.prototype.invalidSatoshis = function() {
    if (this._satoshis > $4f3eb05e7ad3d480$var$MAX_SAFE_INTEGER) return "transaction txout satoshis greater than max safe integer";
    if (this._satoshis !== this._satoshisBN.toNumber()) return "transaction txout satoshis has corrupted value";
    if (this._satoshis < 0) return "transaction txout negative";
    return false;
};
Object.defineProperty($4f3eb05e7ad3d480$var$Output.prototype, "satoshisBN", {
    configurable: false,
    enumerable: true,
    get: function() {
        return this._satoshisBN;
    },
    set: function(num) {
        this._satoshisBN = num;
        this._satoshis = num.toNumber();
        $e34gf.checkState($bbk3w.isNaturalNumber(this._satoshis), "Output satoshis is not a natural number");
    }
});
$4f3eb05e7ad3d480$var$Output.prototype.toObject = $4f3eb05e7ad3d480$var$Output.prototype.toJSON = function toObject() {
    var obj = {
        satoshis: this.satoshis
    };
    obj.script = this._script.toBuffer().toString("hex");
    return obj;
};
$4f3eb05e7ad3d480$var$Output.fromObject = function(data) {
    return new $4f3eb05e7ad3d480$var$Output(data);
};
$4f3eb05e7ad3d480$var$Output.prototype.setScriptFromBuffer = function(buffer) {
    try {
        this._script = $3LdBG.fromBuffer(buffer);
        this._script._isOutput = true;
    } catch (e) {
        if (e instanceof $lOQ1c.Script.InvalidBuffer) this._script = null;
        else throw e;
    }
};
$4f3eb05e7ad3d480$var$Output.prototype.setScript = function(script) {
    if (script instanceof $3LdBG) {
        this._script = script;
        this._script._isOutput = true;
    } else if ($iUxHD.isString(script)) {
        this._script = $3LdBG.fromString(script);
        this._script._isOutput = true;
    } else if (Buffer.isBuffer(script)) this.setScriptFromBuffer(script);
    else throw new TypeError("Invalid argument type: script");
    return this;
};
$4f3eb05e7ad3d480$var$Output.prototype.inspect = function() {
    var scriptStr;
    if (this.script) scriptStr = this.script.inspect();
    return "<Output (" + this.satoshis + " sats) " + scriptStr + ">";
};
$4f3eb05e7ad3d480$var$Output.fromBufferReader = function(br) {
    var obj = {};
    obj.satoshis = br.readUInt64LEBN();
    var size = br.readVarintNum();
    if (size !== 0) {
        if (br.remaining() < size) throw new TypeError("Unrecognized Output");
        obj.script = br.read(size);
    } else obj.script = Buffer.from([]);
    return new $4f3eb05e7ad3d480$var$Output(obj);
};
$4f3eb05e7ad3d480$var$Output.prototype.toBufferWriter = function(writer) {
    if (!writer) writer = new $fvPTe();
    writer.writeUInt64LEBN(this._satoshisBN);
    var script = this._script.toBuffer();
    writer.writeVarintNum(script.length);
    writer.write(script);
    return writer;
};
// 8    value
// ???  script size (VARINT)
// ???  script
$4f3eb05e7ad3d480$var$Output.prototype.getSize = function() {
    var scriptSize = this.script.toBuffer().length;
    var varintSize = $kWg93(scriptSize).toBuffer().length;
    return 8 + varintSize + scriptSize;
};
module.exports = $4f3eb05e7ad3d480$var$Output;

});

parcelRegister("318hy", function(module, exports) {
/**
 * Hash Cache
 * ==========
 *
 * For use in sighash.
 */ "use strict";
class $2327e3be7623ccb7$var$HashCache {
    constructor(prevoutsHashBuf, sequenceHashBuf, outputsHashBuf){
        this.prevoutsHashBuf = prevoutsHashBuf;
        this.sequenceHashBuf = sequenceHashBuf;
        this.outputsHashBuf = outputsHashBuf;
    }
    static fromBuffer(buf) {
        return $2327e3be7623ccb7$var$HashCache.fromJSON(JSON.parse(buf.toString()));
    }
    toBuffer() {
        return Buffer.from(JSON.stringify(this.toJSON()));
    }
    static fromJSON(json) {
        return new $2327e3be7623ccb7$var$HashCache(json.prevoutsHashBuf ? Buffer.from(json.prevoutsHashBuf, "hex") : undefined, json.sequenceHashBuf ? Buffer.from(json.sequenceHashBuf, "hex") : undefined, json.outputsHashBuf ? Buffer.from(json.outputsHashBuf, "hex") : undefined);
    }
    toJSON() {
        return {
            prevoutsHashBuf: this.prevoutsHashBuf ? this.prevoutsHashBuf.toString("hex") : undefined,
            sequenceHashBuf: this.sequenceHashBuf ? this.sequenceHashBuf.toString("hex") : undefined,
            outputsHashBuf: this.outputsHashBuf ? this.outputsHashBuf.toString("hex") : undefined
        };
    }
    toHex() {
        return this.toBuffer().toString("hex");
    }
    static fromHex(hex) {
        const buf = Buffer.from(hex, "hex");
        return $2327e3be7623ccb7$var$HashCache.fromBuffer(buf);
    }
}
module.exports = $2327e3be7623ccb7$var$HashCache;

});

parcelRegister("3dEU6", function(module, exports) {

module.exports = (parcelRequire("iIaR3"));

module.exports.PublicKey = (parcelRequire("6yekk"));

module.exports.PublicKeyHash = (parcelRequire("5c5uT"));

module.exports.MultiSig = (parcelRequire("jHcAk"));

module.exports.MultiSigScriptHash = (parcelRequire("beuE8"));

});
parcelRegister("iIaR3", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lOQ1c = parcelRequire("lOQ1c");

var $fvPTe = parcelRequire("fvPTe");

var $bbk3w = parcelRequire("bbk3w");

var $3LdBG = parcelRequire("3LdBG");

var $aTWNt = parcelRequire("aTWNt");

var $6NOKO = parcelRequire("6NOKO");

var $km2cb = parcelRequire("km2cb");

var $7fulv = parcelRequire("7fulv");

var $aScoK = parcelRequire("aScoK");

var $9uoiU = parcelRequire("9uoiU");

var $5pTcb = parcelRequire("5pTcb");

var $eB3ON = parcelRequire("eB3ON");
var $d9f4c19047ac3993$var$MAXINT = 0xffffffff // Math.pow(2, 32) - 1;
;
var $d9f4c19047ac3993$var$DEFAULT_RBF_SEQNUMBER = $d9f4c19047ac3993$var$MAXINT - 2;
var $d9f4c19047ac3993$var$DEFAULT_SEQNUMBER = $d9f4c19047ac3993$var$MAXINT;
var $d9f4c19047ac3993$var$DEFAULT_LOCKTIME_SEQNUMBER = $d9f4c19047ac3993$var$MAXINT - 1;
function $d9f4c19047ac3993$var$getLowSPreimage(tx, sigtype, inputIndex, subscript, inputAmount) {
    var i = 0;
    do {
        var preimage = $aTWNt.sighashPreimage(tx, sigtype, inputIndex, subscript, inputAmount);
        var sighash = $aScoK.sha256sha256(preimage);
        if ($iUxHD.isPositiveNumber(sighash.readUInt8()) && $iUxHD.isPositiveNumber(sighash.readUInt8(31))) return preimage;
        tx.nLockTime++;
    }while (i < Number.MAX_SAFE_INTEGER);
}
function $d9f4c19047ac3993$var$Input(params) {
    if (!(this instanceof $d9f4c19047ac3993$var$Input)) return new $d9f4c19047ac3993$var$Input(params);
    if (params) return this._fromObject(params);
}
$d9f4c19047ac3993$var$Input.MAXINT = $d9f4c19047ac3993$var$MAXINT;
$d9f4c19047ac3993$var$Input.DEFAULT_SEQNUMBER = $d9f4c19047ac3993$var$DEFAULT_SEQNUMBER;
$d9f4c19047ac3993$var$Input.DEFAULT_LOCKTIME_SEQNUMBER = $d9f4c19047ac3993$var$DEFAULT_LOCKTIME_SEQNUMBER;
$d9f4c19047ac3993$var$Input.DEFAULT_RBF_SEQNUMBER = $d9f4c19047ac3993$var$DEFAULT_RBF_SEQNUMBER;
// txid + output index + sequence number
$d9f4c19047ac3993$var$Input.BASE_SIZE = 40;
Object.defineProperty($d9f4c19047ac3993$var$Input.prototype, "script", {
    configurable: false,
    enumerable: true,
    get: function() {
        if (this.isNull()) return null;
        if (!this._script) {
            this._script = new $3LdBG(this._scriptBuffer);
            this._script._isInput = true;
        }
        return this._script;
    }
});
$d9f4c19047ac3993$var$Input.fromObject = function(obj) {
    $e34gf.checkArgument($iUxHD.isObject(obj));
    var input = new $d9f4c19047ac3993$var$Input();
    return input._fromObject(obj);
};
$d9f4c19047ac3993$var$Input.prototype._fromObject = function(params) {
    var prevTxId;
    if ($iUxHD.isString(params.prevTxId) && $bbk3w.isHexa(params.prevTxId)) prevTxId = Buffer.from(params.prevTxId, "hex");
    else prevTxId = params.prevTxId;
    this.output = params.output ? params.output instanceof $6NOKO ? params.output : new $6NOKO(params.output) : undefined;
    this.prevTxId = prevTxId || params.txidbuf;
    this.outputIndex = $iUxHD.isUndefined(params.outputIndex) ? params.txoutnum : params.outputIndex;
    this.sequenceNumber = $iUxHD.isUndefined(params.sequenceNumber) ? $iUxHD.isUndefined(params.seqnum) ? $d9f4c19047ac3993$var$DEFAULT_SEQNUMBER : params.seqnum : params.sequenceNumber;
    if ($iUxHD.isUndefined(params.script) && $iUxHD.isUndefined(params.scriptBuffer)) throw new $lOQ1c.Transaction.Input.MissingScript();
    this.setScript(params.scriptBuffer || params.script);
    return this;
};
$d9f4c19047ac3993$var$Input.prototype.toObject = $d9f4c19047ac3993$var$Input.prototype.toJSON = function toObject() {
    var obj = {
        prevTxId: this.prevTxId.toString("hex"),
        outputIndex: this.outputIndex,
        sequenceNumber: this.sequenceNumber,
        script: this._scriptBuffer.toString("hex")
    };
    // add human readable form if input contains valid script
    if (this.script) obj.scriptString = this.script.toString();
    if (this.output) obj.output = this.output.toObject();
    return obj;
};
$d9f4c19047ac3993$var$Input.fromBufferReader = function(br) {
    var input = new $d9f4c19047ac3993$var$Input();
    input.prevTxId = br.readReverse(32);
    input.outputIndex = br.readUInt32LE();
    input._scriptBuffer = br.readVarLengthBuffer();
    input.sequenceNumber = br.readUInt32LE();
    // TODO: return different classes according to which input it is
    // e.g: CoinbaseInput, PublicKeyHashInput, MultiSigScriptHashInput, etc.
    return input;
};
$d9f4c19047ac3993$var$Input.prototype.toBufferWriter = function(writer) {
    if (!writer) writer = new $fvPTe();
    writer.writeReverse(this.prevTxId);
    writer.writeUInt32LE(this.outputIndex);
    var script = this._scriptBuffer;
    writer.writeVarintNum(script.length);
    writer.write(script);
    writer.writeUInt32LE(this.sequenceNumber);
    return writer;
};
$d9f4c19047ac3993$var$Input.prototype.setScript = function(script) {
    this._script = null;
    if (script instanceof $3LdBG) {
        this._script = script;
        this._script._isInput = true;
        this._scriptBuffer = script.toBuffer();
    } else if (script === null) {
        this._script = $3LdBG.empty();
        this._script._isInput = true;
        this._scriptBuffer = this._script.toBuffer();
    } else if ($bbk3w.isHexa(script)) // hex string script
    this._scriptBuffer = Buffer.from(script, "hex");
    else if ($iUxHD.isString(script)) {
        // human readable string script
        this._script = new $3LdBG(script);
        this._script._isInput = true;
        this._scriptBuffer = this._script.toBuffer();
    } else if (Buffer.isBuffer(script)) // buffer script
    this._scriptBuffer = Buffer.from(script);
    else throw new TypeError("Invalid argument type: script");
    return this;
};
/**
 * Retrieve signatures for the provided PrivateKey.
 *
 * @param {Transaction} transaction - the transaction to be signed
 * @param {PrivateKey | Array} privateKeys - the private key to use when signing
 * @param {number} inputIndex - the index of this input in the provided transaction
 * @param {number} sigType - defaults to Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID
 * @abstract
 */ $d9f4c19047ac3993$var$Input.prototype.getSignatures = function(transaction, privateKeys, inputIndex, sigtype) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    var results = [];
    if (privateKeys instanceof $eB3ON) results.push(new $7fulv({
        publicKey: privateKeys.publicKey,
        prevTxId: this.prevTxId,
        outputIndex: this.outputIndex,
        inputIndex: inputIndex,
        signature: $aTWNt.sign(transaction, privateKeys, sigtype, inputIndex, this.output.script, this.output.satoshisBN),
        sigtype: sigtype
    }));
    else if ($iUxHD.isArray(privateKeys)) {
        var self = this;
        $iUxHD.each(privateKeys, function(privateKey, index) {
            var sigtype_ = sigtype;
            if ($iUxHD.isArray(sigtype)) sigtype_ = sigtype[index] || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
            results.push(new $7fulv({
                publicKey: privateKey.publicKey,
                prevTxId: self.prevTxId,
                outputIndex: self.outputIndex,
                inputIndex: inputIndex,
                signature: $aTWNt.sign(transaction, privateKey, sigtype_, inputIndex, self.output.script, self.output.satoshisBN),
                sigtype: sigtype_
            }));
        });
    }
    return results;
};
/**
 * Retrieve preimage for the Input.
 *
 * @param {Transaction} transaction - the transaction to be signed
 * @param {number} inputIndex - the index of this input in the provided transaction
 * @param {number} sigType - defaults to Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID
 * @param {boolean} isLowS - true if the sig hash is safe for low s.
 * @param {number} csIdx - the index of OP_CODESEPARATOR
 * @abstract
 */ $d9f4c19047ac3993$var$Input.prototype.getPreimage = function(transaction, inputIndex, sigtype, isLowS, csIdx) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    isLowS = isLowS || false;
    var subscript = typeof csIdx === "number" ? this.output.script.subScript(csIdx) : this.output.script;
    return isLowS ? $d9f4c19047ac3993$var$getLowSPreimage(transaction, sigtype, inputIndex, subscript, this.output.satoshisBN) : $aTWNt.sighashPreimage(transaction, sigtype, inputIndex, subscript, this.output.satoshisBN);
};
$d9f4c19047ac3993$var$Input.prototype.isFullySigned = function() {
    throw new $lOQ1c.AbstractMethodInvoked("Input#isFullySigned");
};
$d9f4c19047ac3993$var$Input.prototype.isFinal = function() {
    return this.sequenceNumber === $d9f4c19047ac3993$var$Input.MAXINT;
};
$d9f4c19047ac3993$var$Input.prototype.addSignature = function() {
// throw new errors.AbstractMethodInvoked('Input#addSignature')
};
$d9f4c19047ac3993$var$Input.prototype.clearSignatures = function() {
// throw new errors.AbstractMethodInvoked('Input#clearSignatures')
};
$d9f4c19047ac3993$var$Input.prototype.isValidSignature = function(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return $aTWNt.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.output.script, this.output.satoshisBN);
};
/**
 * @returns true if this is a coinbase input (represents no input)
 */ $d9f4c19047ac3993$var$Input.prototype.isNull = function() {
    return this.prevTxId.toString("hex") === "0000000000000000000000000000000000000000000000000000000000000000" && this.outputIndex === 0xffffffff;
};
$d9f4c19047ac3993$var$Input.prototype._estimateSize = function() {
    return this.toBufferWriter().toBuffer().length;
};
$d9f4c19047ac3993$var$Input.prototype.verify = function(transaction, inputIndex) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    $e34gf.checkState(this.script instanceof $3LdBG);
    $e34gf.checkState(this.output.script instanceof $3LdBG);
    var us = this.script;
    var ls = this.output.script;
    var inputSatoshis = this.output.satoshisBN;
    $9uoiU.MAX_SCRIPT_ELEMENT_SIZE = Number.MAX_SAFE_INTEGER;
    $9uoiU.MAXIMUM_ELEMENT_SIZE = Number.MAX_SAFE_INTEGER;
    const bsi = new $9uoiU();
    let failedAt = {};
    bsi.stepListener = function(step) {
        if (step.fExec || $5pTcb.OP_IF <= step.opcode.toNumber() && step.opcode.toNumber() <= $5pTcb.OP_ENDIF) {
            if ($5pTcb.OP_IF <= step.opcode.toNumber() && step.opcode.toNumber() <= $5pTcb.OP_ENDIF || step.opcode.toNumber() === $5pTcb.OP_RETURN) failedAt.opcode = step.opcode;
            else failedAt = step;
        }
    };
    var success = bsi.verify(us, ls, transaction, inputIndex, $9uoiU.DEFAULT_FLAGS, inputSatoshis);
    if (failedAt.opcode) failedAt.opcode = failedAt.opcode.toNumber();
    return {
        success: success,
        error: bsi.errstr,
        failedAt: success ? {} : failedAt
    };
};
module.exports = $d9f4c19047ac3993$var$Input;

});
parcelRegister("7fulv", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");


var $bbk3w = parcelRequire("bbk3w");

var $hbQdz = parcelRequire("hbQdz");

var $lOQ1c = parcelRequire("lOQ1c");

var $km2cb = parcelRequire("km2cb");
/**
 * @desc
 * Wrapper around Signature with fields related to signing a transaction specifically
 *
 * @param {Object|string|TransactionSignature} arg
 * @constructor
 */ function $5471792b7d3964a3$var$TransactionSignature(arg) {
    if (!(this instanceof $5471792b7d3964a3$var$TransactionSignature)) return new $5471792b7d3964a3$var$TransactionSignature(arg);
    if (arg instanceof $5471792b7d3964a3$var$TransactionSignature) return arg;
    if ($iUxHD.isObject(arg)) return this._fromObject(arg);
    throw new $lOQ1c.InvalidArgument("TransactionSignatures must be instantiated from an object");
}
$fxX3C$inherits($5471792b7d3964a3$var$TransactionSignature, $km2cb);
$5471792b7d3964a3$var$TransactionSignature.prototype._fromObject = function(arg) {
    this._checkObjectArgs(arg);
    this.publicKey = new $hbQdz(arg.publicKey);
    this.prevTxId = Buffer.isBuffer(arg.prevTxId) ? arg.prevTxId : Buffer.from(arg.prevTxId, "hex");
    this.outputIndex = arg.outputIndex;
    this.inputIndex = arg.inputIndex;
    this.signature = arg.signature instanceof $km2cb ? arg.signature : Buffer.isBuffer(arg.signature) ? $km2cb.fromBuffer(arg.signature) : $km2cb.fromString(arg.signature);
    this.sigtype = arg.sigtype;
    return this;
};
$5471792b7d3964a3$var$TransactionSignature.prototype._checkObjectArgs = function(arg) {
    $e34gf.checkArgument($hbQdz(arg.publicKey), "publicKey");
    $e34gf.checkArgument(!$iUxHD.isUndefined(arg.inputIndex), "inputIndex");
    $e34gf.checkArgument(!$iUxHD.isUndefined(arg.outputIndex), "outputIndex");
    $e34gf.checkState($iUxHD.isNumber(arg.inputIndex), "inputIndex must be a number");
    $e34gf.checkState($iUxHD.isNumber(arg.outputIndex), "outputIndex must be a number");
    $e34gf.checkArgument(arg.signature, "signature");
    $e34gf.checkArgument(arg.prevTxId, "prevTxId");
    $e34gf.checkState(arg.signature instanceof $km2cb || Buffer.isBuffer(arg.signature) || $bbk3w.isHexa(arg.signature), "signature must be a buffer or hexa value");
    $e34gf.checkState(Buffer.isBuffer(arg.prevTxId) || $bbk3w.isHexa(arg.prevTxId), "prevTxId must be a buffer or hexa value");
    $e34gf.checkArgument(arg.sigtype, "sigtype");
    $e34gf.checkState($iUxHD.isNumber(arg.sigtype), "sigtype must be a number");
};
/**
 * Serializes a transaction to a plain JS object
 * @return {Object}
 */ $5471792b7d3964a3$var$TransactionSignature.prototype.toObject = $5471792b7d3964a3$var$TransactionSignature.prototype.toJSON = function toObject() {
    return {
        publicKey: this.publicKey.toString(),
        prevTxId: this.prevTxId.toString("hex"),
        outputIndex: this.outputIndex,
        inputIndex: this.inputIndex,
        signature: this.signature.toString(),
        sigtype: this.sigtype
    };
};
/**
 * Builds a TransactionSignature from an object
 * @param {Object} object
 * @return {TransactionSignature}
 */ $5471792b7d3964a3$var$TransactionSignature.fromObject = function(object) {
    $e34gf.checkArgument(object);
    return new $5471792b7d3964a3$var$TransactionSignature(object);
};
module.exports = $5471792b7d3964a3$var$TransactionSignature;

});


parcelRegister("6yekk", function(module, exports) {
"use strict";


var $e34gf = parcelRequire("e34gf");

var $iIaR3 = parcelRequire("iIaR3");

var $6NOKO = parcelRequire("6NOKO");

var $aTWNt = parcelRequire("aTWNt");

var $3LdBG = parcelRequire("3LdBG");

var $km2cb = parcelRequire("km2cb");

var $7fulv = parcelRequire("7fulv");
/**
 * Represents a special kind of input of PayToPublicKey kind.
 * @constructor
 */ function $4c51080f80d3a232$var$PublicKeyInput() {
    $iIaR3.apply(this, arguments);
}
$fxX3C$inherits($4c51080f80d3a232$var$PublicKeyInput, $iIaR3);
/**
 * @param {Transaction} transaction - the transaction to be signed
 * @param {PrivateKey} privateKey - the private key with which to sign the transaction
 * @param {number} index - the index of the input in the transaction input vector
 * @param {number=} sigtype - the type of signature, defaults to Signature.SIGHASH_ALL
 * @return {Array} of objects that can be
 */ $4c51080f80d3a232$var$PublicKeyInput.prototype.getSignatures = function(transaction, privateKey, index, sigtype) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    var publicKey = privateKey.toPublicKey();
    if (publicKey.toString() === this.output.script.getPublicKey().toString("hex")) return [
        new $7fulv({
            publicKey: publicKey,
            prevTxId: this.prevTxId,
            outputIndex: this.outputIndex,
            inputIndex: index,
            signature: $aTWNt.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
            sigtype: sigtype
        })
    ];
    return [];
};
/**
 * Add the provided signature
 *
 * @param {Object} signature
 * @param {PublicKey} signature.publicKey
 * @param {Signature} signature.signature
 * @param {number=} signature.sigtype
 * @return {PublicKeyInput} this, for chaining
 */ $4c51080f80d3a232$var$PublicKeyInput.prototype.addSignature = function(transaction, signature) {
    $e34gf.checkState(this.isValidSignature(transaction, signature), "Signature is invalid");
    this.setScript($3LdBG.buildPublicKeyIn(signature.signature.toDER(), signature.sigtype));
    return this;
};
/**
 * Clear the input's signature
 * @return {PublicKeyHashInput} this, for chaining
 */ $4c51080f80d3a232$var$PublicKeyInput.prototype.clearSignatures = function() {
    this.setScript($3LdBG.empty());
    return this;
};
/**
 * Query whether the input is signed
 * @return {boolean}
 */ $4c51080f80d3a232$var$PublicKeyInput.prototype.isFullySigned = function() {
    return this.script.isPublicKeyIn();
};
// 32   txid
// 4    output index
// ---
// 1    script size (VARINT)
// 1    signature size (OP_PUSHDATA)
// <=72 signature (DER + SIGHASH type)
// ---
// 4    sequence number
$4c51080f80d3a232$var$PublicKeyInput.SCRIPT_MAX_SIZE = 74;
$4c51080f80d3a232$var$PublicKeyInput.prototype._estimateSize = function() {
    return $iIaR3.BASE_SIZE + $4c51080f80d3a232$var$PublicKeyInput.SCRIPT_MAX_SIZE;
};
module.exports = $4c51080f80d3a232$var$PublicKeyInput;

});

parcelRegister("5c5uT", function(module, exports) {
"use strict";


var $e34gf = parcelRequire("e34gf");

var $aScoK = parcelRequire("aScoK");

var $iIaR3 = parcelRequire("iIaR3");

var $6NOKO = parcelRequire("6NOKO");

var $aTWNt = parcelRequire("aTWNt");

var $3LdBG = parcelRequire("3LdBG");

var $km2cb = parcelRequire("km2cb");

var $7fulv = parcelRequire("7fulv");
/**
 * Represents a special kind of input of PayToPublicKeyHash kind.
 * @constructor
 */ function $3c8256628dd9f099$var$PublicKeyHashInput() {
    $iIaR3.apply(this, arguments);
}
$fxX3C$inherits($3c8256628dd9f099$var$PublicKeyHashInput, $iIaR3);
/**
 * @param {Transaction} transaction - the transaction to be signed
 * @param {PrivateKey} privateKey - the private key with which to sign the transaction
 * @param {number} index - the index of the input in the transaction input vector
 * @param {number=} sigtype - the type of signature, defaults to Signature.SIGHASH_ALL
 * @param {Buffer=} hashData - the precalculated hash of the public key associated with the privateKey provided
 * @return {Array} of objects that can be
 */ $3c8256628dd9f099$var$PublicKeyHashInput.prototype.getSignatures = function(transaction, privateKey, index, sigtype, hashData) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    hashData = hashData || $aScoK.sha256ripemd160(privateKey.publicKey.toBuffer());
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    if (hashData.equals(this.output.script.getPublicKeyHash())) return [
        new $7fulv({
            publicKey: privateKey.publicKey,
            prevTxId: this.prevTxId,
            outputIndex: this.outputIndex,
            inputIndex: index,
            signature: $aTWNt.sign(transaction, privateKey, sigtype, index, this.output.script, this.output.satoshisBN),
            sigtype: sigtype
        })
    ];
    return [];
};
/**
 * Add the provided signature
 *
 * @param {Object} signature
 * @param {PublicKey} signature.publicKey
 * @param {Signature} signature.signature
 * @param {number=} signature.sigtype
 * @return {PublicKeyHashInput} this, for chaining
 */ $3c8256628dd9f099$var$PublicKeyHashInput.prototype.addSignature = function(transaction, signature) {
    $e34gf.checkState(this.isValidSignature(transaction, signature), "Signature is invalid");
    this.setScript($3LdBG.buildPublicKeyHashIn(signature.publicKey, signature.signature.toDER(), signature.sigtype));
    return this;
};
/**
 * Clear the input's signature
 * @return {PublicKeyHashInput} this, for chaining
 */ $3c8256628dd9f099$var$PublicKeyHashInput.prototype.clearSignatures = function() {
    this.setScript($3LdBG.empty());
    return this;
};
/**
 * Query whether the input is signed
 * @return {boolean}
 */ $3c8256628dd9f099$var$PublicKeyHashInput.prototype.isFullySigned = function() {
    return this.script.isPublicKeyHashIn();
};
// 32   txid
// 4    output index
// --- script ---
// 1    script size (VARINT)
// 1    signature size (OP_PUSHDATA)
// <=72 signature (DER + SIGHASH type)
// 1    public key size (OP_PUSHDATA)
// 65   uncompressed public key
//
// 4    sequence number
$3c8256628dd9f099$var$PublicKeyHashInput.SCRIPT_MAX_SIZE = 140;
$3c8256628dd9f099$var$PublicKeyHashInput.prototype._estimateSize = function() {
    return $iIaR3.BASE_SIZE + $3c8256628dd9f099$var$PublicKeyHashInput.SCRIPT_MAX_SIZE;
};
module.exports = $3c8256628dd9f099$var$PublicKeyHashInput;

});

parcelRegister("jHcAk", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");


var $iIaR3 = parcelRequire("iIaR3");

var $6NOKO = parcelRequire("6NOKO");

var $e34gf = parcelRequire("e34gf");

var $3LdBG = parcelRequire("3LdBG");

var $km2cb = parcelRequire("km2cb");

var $aTWNt = parcelRequire("aTWNt");

var $7fulv = parcelRequire("7fulv");

var $hbQdz = parcelRequire("hbQdz");

var $kWg93 = parcelRequire("kWg93");
/**
 * @constructor
 */ function $e56bcb96b19d3007$var$MultiSigInput(input, pubkeys, threshold, signatures) {
    $iIaR3.apply(this, arguments);
    var self = this;
    pubkeys = pubkeys || input.publicKeys;
    threshold = threshold || input.threshold;
    signatures = signatures || input.signatures;
    this.publicKeys = pubkeys.map((k)=>k.toString("hex")).sort().map((k)=>new $hbQdz(k));
    $e34gf.checkState($3LdBG.buildMultisigOut(this.publicKeys, threshold).equals(this.output.script), "Provided public keys don't match to the provided output script");
    this.publicKeyIndex = {};
    $iUxHD.each(this.publicKeys, function(publicKey, index) {
        self.publicKeyIndex[publicKey.toString()] = index;
    });
    this.threshold = threshold;
    // Empty array of signatures
    this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(this.publicKeys.length);
}
$fxX3C$inherits($e56bcb96b19d3007$var$MultiSigInput, $iIaR3);
$e56bcb96b19d3007$var$MultiSigInput.prototype.toObject = function() {
    var obj = $iIaR3.prototype.toObject.apply(this, arguments);
    obj.threshold = this.threshold;
    obj.publicKeys = $iUxHD.map(this.publicKeys, function(publicKey) {
        return publicKey.toString();
    });
    obj.signatures = this._serializeSignatures();
    return obj;
};
$e56bcb96b19d3007$var$MultiSigInput.prototype._deserializeSignatures = function(signatures) {
    return $iUxHD.map(signatures, function(signature) {
        if (!signature) return undefined;
        return new $7fulv(signature);
    });
};
$e56bcb96b19d3007$var$MultiSigInput.prototype._serializeSignatures = function() {
    return $iUxHD.map(this.signatures, function(signature) {
        if (!signature) return undefined;
        return signature.toObject();
    });
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.getSignatures = function(transaction, privateKey, index, sigtype) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    var self = this;
    var results = [];
    $iUxHD.each(this.publicKeys, function(publicKey) {
        if (publicKey.toString() === privateKey.publicKey.toString()) results.push(new $7fulv({
            publicKey: privateKey.publicKey,
            prevTxId: self.prevTxId,
            outputIndex: self.outputIndex,
            inputIndex: index,
            signature: $aTWNt.sign(transaction, privateKey, sigtype, index, self.output.script, self.output.satoshisBN),
            sigtype: sigtype
        }));
    });
    return results;
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.addSignature = function(transaction, signature) {
    $e34gf.checkState(!this.isFullySigned(), "All needed signatures have already been added");
    $e34gf.checkArgument(!$iUxHD.isUndefined(this.publicKeyIndex[signature.publicKey.toString()]), "Signature has no matching public key");
    $e34gf.checkState(this.isValidSignature(transaction, signature));
    this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;
    this._updateScript();
    return this;
};
$e56bcb96b19d3007$var$MultiSigInput.prototype._updateScript = function() {
    this.setScript($3LdBG.buildMultisigIn(this.publicKeys, this.threshold, this._createSignatures()));
    return this;
};
$e56bcb96b19d3007$var$MultiSigInput.prototype._createSignatures = function() {
    return $iUxHD.map($iUxHD.filter(this.signatures, function(signature) {
        return !$iUxHD.isUndefined(signature);
    }), function(signature) {
        return Buffer.concat([
            signature.signature.toDER(),
            Buffer.from([
                signature.sigtype & 0xff
            ])
        ]);
    });
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.clearSignatures = function() {
    this.signatures = new Array(this.publicKeys.length);
    this._updateScript();
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.isFullySigned = function() {
    return this.countSignatures() === this.threshold;
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.countMissingSignatures = function() {
    return this.threshold - this.countSignatures();
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.countSignatures = function() {
    return $iUxHD.reduce(this.signatures, function(sum, signature) {
        return sum + !!signature;
    }, 0);
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.publicKeysWithoutSignature = function() {
    var self = this;
    return $iUxHD.filter(this.publicKeys, function(publicKey) {
        return !self.signatures[self.publicKeyIndex[publicKey.toString()]];
    });
};
$e56bcb96b19d3007$var$MultiSigInput.prototype.isValidSignature = function(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return $aTWNt.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.output.script, this.output.satoshisBN);
};
/**
 *
 * @param {Buffer[]} signatures
 * @param {PublicKey[]} publicKeys
 * @param {Transaction} transaction
 * @param {Integer} inputIndex
 * @param {Input} input
 * @returns {TransactionSignature[]}
 */ $e56bcb96b19d3007$var$MultiSigInput.normalizeSignatures = function(transaction, input, inputIndex, signatures, publicKeys) {
    return publicKeys.map(function(pubKey) {
        var signatureMatch = null;
        signatures = signatures.filter(function(signatureBuffer) {
            if (signatureMatch) return true;
            var signature = new $7fulv({
                signature: $km2cb.fromTxFormat(signatureBuffer),
                publicKey: pubKey,
                prevTxId: input.prevTxId,
                outputIndex: input.outputIndex,
                inputIndex: inputIndex,
                sigtype: $km2cb.SIGHASH_ALL
            });
            signature.signature.nhashtype = signature.sigtype;
            var isMatch = $aTWNt.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, input.output.script);
            if (isMatch) {
                signatureMatch = signature;
                return false;
            }
            return true;
        });
        return signatureMatch || null;
    });
};
// 32   txid
// 4    output index
// --- script ---
// ??? script size (VARINT)
// 1    OP_0
// --- signature list ---
//      1       signature size (OP_PUSHDATA)
//      <=72    signature (DER + SIGHASH type)
//
// 4    sequence number
$e56bcb96b19d3007$var$MultiSigInput.SIGNATURE_SIZE = 73;
$e56bcb96b19d3007$var$MultiSigInput.prototype._estimateSize = function() {
    var scriptSize = 1 + this.threshold * $e56bcb96b19d3007$var$MultiSigInput.SIGNATURE_SIZE;
    return $iIaR3.BASE_SIZE + $kWg93(scriptSize).toBuffer().length + scriptSize;
};
module.exports = $e56bcb96b19d3007$var$MultiSigInput;

});

parcelRegister("beuE8", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");


var $iIaR3 = parcelRequire("iIaR3");

var $6NOKO = parcelRequire("6NOKO");

var $e34gf = parcelRequire("e34gf");

var $3LdBG = parcelRequire("3LdBG");

var $km2cb = parcelRequire("km2cb");

var $aTWNt = parcelRequire("aTWNt");

var $7fulv = parcelRequire("7fulv");

var $hbQdz = parcelRequire("hbQdz");

var $kWg93 = parcelRequire("kWg93");
/**
 * @constructor
 */ function $82d8c637726faba1$var$MultiSigScriptHashInput(input, pubkeys, threshold, signatures) {
    $iIaR3.apply(this, arguments);
    var self = this;
    pubkeys = pubkeys || input.publicKeys;
    threshold = threshold || input.threshold;
    signatures = signatures || input.signatures;
    this.publicKeys = pubkeys.map((k)=>k.toString("hex")).sort().map((k)=>new $hbQdz(k));
    this.redeemScript = $3LdBG.buildMultisigOut(this.publicKeys, threshold);
    $e34gf.checkState($3LdBG.buildScriptHashOut(this.redeemScript).equals(this.output.script), "Provided public keys don't hash to the provided output");
    this.publicKeyIndex = {};
    $iUxHD.each(this.publicKeys, function(publicKey, index) {
        self.publicKeyIndex[publicKey.toString()] = index;
    });
    this.threshold = threshold;
    // Empty array of signatures
    this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(this.publicKeys.length);
}
$fxX3C$inherits($82d8c637726faba1$var$MultiSigScriptHashInput, $iIaR3);
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.toObject = function() {
    var obj = $iIaR3.prototype.toObject.apply(this, arguments);
    obj.threshold = this.threshold;
    obj.publicKeys = $iUxHD.map(this.publicKeys, function(publicKey) {
        return publicKey.toString();
    });
    obj.signatures = this._serializeSignatures();
    return obj;
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype._deserializeSignatures = function(signatures) {
    return $iUxHD.map(signatures, function(signature) {
        if (!signature) return undefined;
        return new $7fulv(signature);
    });
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype._serializeSignatures = function() {
    return $iUxHD.map(this.signatures, function(signature) {
        if (!signature) return undefined;
        return signature.toObject();
    });
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.getSignatures = function(transaction, privateKey, index, sigtype) {
    $e34gf.checkState(this.output instanceof $6NOKO);
    sigtype = sigtype || $km2cb.SIGHASH_ALL | $km2cb.SIGHASH_FORKID;
    var self = this;
    var results = [];
    $iUxHD.each(this.publicKeys, function(publicKey) {
        if (publicKey.toString() === privateKey.publicKey.toString()) results.push(new $7fulv({
            publicKey: privateKey.publicKey,
            prevTxId: self.prevTxId,
            outputIndex: self.outputIndex,
            inputIndex: index,
            signature: $aTWNt.sign(transaction, privateKey, sigtype, index, self.redeemScript, self.output.satoshisBN),
            sigtype: sigtype
        }));
    });
    return results;
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.addSignature = function(transaction, signature) {
    $e34gf.checkState(!this.isFullySigned(), "All needed signatures have already been added");
    $e34gf.checkArgument(!$iUxHD.isUndefined(this.publicKeyIndex[signature.publicKey.toString()]), "Signature has no matching public key");
    $e34gf.checkState(this.isValidSignature(transaction, signature));
    this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;
    this._updateScript();
    return this;
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype._updateScript = function() {
    this.setScript($3LdBG.buildP2SHMultisigIn(this.publicKeys, this.threshold, this._createSignatures(), {
        cachedMultisig: this.redeemScript
    }));
    return this;
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype._createSignatures = function() {
    return $iUxHD.map($iUxHD.filter(this.signatures, function(signature) {
        return !$iUxHD.isUndefined(signature);
    }), function(signature) {
        return Buffer.concat([
            signature.signature.toDER(),
            Buffer.from([
                signature.sigtype & 0xff
            ])
        ]);
    });
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.clearSignatures = function() {
    this.signatures = new Array(this.publicKeys.length);
    this._updateScript();
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.isFullySigned = function() {
    return this.countSignatures() === this.threshold;
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.countMissingSignatures = function() {
    return this.threshold - this.countSignatures();
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.countSignatures = function() {
    return $iUxHD.reduce(this.signatures, function(sum, signature) {
        return sum + !!signature;
    }, 0);
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.publicKeysWithoutSignature = function() {
    var self = this;
    return $iUxHD.filter(this.publicKeys, function(publicKey) {
        return !self.signatures[self.publicKeyIndex[publicKey.toString()]];
    });
};
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype.isValidSignature = function(transaction, signature) {
    // FIXME: Refactor signature so this is not necessary
    signature.signature.nhashtype = signature.sigtype;
    return $aTWNt.verify(transaction, signature.signature, signature.publicKey, signature.inputIndex, this.redeemScript, this.output.satoshisBN);
};
// 32   txid
// 4    output index
// --- script ---
// ???  script size (VARINT)
// 1    OP_0
// --- signature list ---
//      1       signature size (OP_PUSHDATA)
//      <=72    signature (DER + SIGHASH type)
//
// ???  redeem script size (OP_PUSHDATA)
// --- redeem script ---
//      1       OP_2
//      --- public key list ---
//      1       public key size (OP_PUSHDATA)
//      33      compressed public key
//
//      1       OP_3
//      1       OP_CHECKMULTISIG
//
// 4    sequence number
$82d8c637726faba1$var$MultiSigScriptHashInput.SIGNATURE_SIZE = 73;
$82d8c637726faba1$var$MultiSigScriptHashInput.PUBKEY_SIZE = 34;
$82d8c637726faba1$var$MultiSigScriptHashInput.prototype._estimateSize = function() {
    var pubKeysSize = this.publicKeys.length * $82d8c637726faba1$var$MultiSigScriptHashInput.PUBKEY_SIZE;
    var sigsSize = this.threshold * $82d8c637726faba1$var$MultiSigScriptHashInput.SIGNATURE_SIZE;
    var redeemScriptSize = 3 + pubKeysSize;
    var redeemScriptPushdataSize = redeemScriptSize <= 75 ? 1 : redeemScriptSize <= 255 ? 2 : 3;
    var scriptLength = sigsSize + 1 + redeemScriptPushdataSize + redeemScriptSize;
    return $iIaR3.BASE_SIZE + $kWg93(scriptLength).toBuffer().length + scriptLength;
};
module.exports = $82d8c637726faba1$var$MultiSigScriptHashInput;

});



parcelRegister("dm48c", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $bbk3w = parcelRequire("bbk3w");

var $3LdBG = parcelRequire("3LdBG");

var $dOZs9 = parcelRequire("dOZs9");
/**
 * Represents an unspent output information: its script, associated amount and address,
 * transaction id and output index.
 *
 * @constructor
 * @param {object} data
 * @param {string} data.txid the previous transaction id
 * @param {string=} data.txId alias for `txid`
 * @param {number} data.vout the index in the transaction
 * @param {number=} data.outputIndex alias for `vout`
 * @param {string|Script} data.scriptPubKey the script that must be resolved to release the funds
 * @param {string|Script=} data.script alias for `scriptPubKey`
 * @param {number} data.amount amount of bitcoins associated
 * @param {number=} data.satoshis alias for `amount`, but expressed in satoshis (1 BSV = 1e8 satoshis)
 * @param {string|Address=} data.address the associated address to the script, if provided
 */ function $9b9088ce0249a4b5$var$UnspentOutput(data) {
    if (!(this instanceof $9b9088ce0249a4b5$var$UnspentOutput)) return new $9b9088ce0249a4b5$var$UnspentOutput(data);
    $e34gf.checkArgument($iUxHD.isObject(data), "Must provide an object from where to extract data");
    var address = data.address ? new $dOZs9(data.address) : undefined;
    var txId = data.txid ? data.txid : data.txId;
    if (!txId || !$bbk3w.isHexaString(txId) || txId.length > 64) // TODO: Use the errors library
    throw new Error("Invalid TXID in object", data);
    var outputIndex = $iUxHD.isUndefined(data.vout) ? data.outputIndex : data.vout;
    if (!$iUxHD.isNumber(outputIndex)) throw new Error("Invalid outputIndex, received " + outputIndex);
    $e34gf.checkArgument(!$iUxHD.isUndefined(data.scriptPubKey) || !$iUxHD.isUndefined(data.script), "Must provide the scriptPubKey for that output!");
    var script = new $3LdBG(data.scriptPubKey || data.script);
    $e34gf.checkArgument(!$iUxHD.isUndefined(data.amount) || !$iUxHD.isUndefined(data.satoshis), "Must provide an amount for the output");
    var amount = !$iUxHD.isUndefined(data.amount) ? Math.round(data.amount * 1e8) : data.satoshis;
    $e34gf.checkArgument($iUxHD.isNumber(amount), "Amount must be a number");
    $bbk3w.defineImmutable(this, {
        address: address,
        txId: txId,
        outputIndex: outputIndex,
        script: script,
        satoshis: amount
    });
}
/**
 * Provide an informative output when displaying this object in the console
 * @returns string
 */ $9b9088ce0249a4b5$var$UnspentOutput.prototype.inspect = function() {
    return "<UnspentOutput: " + this.txId + ":" + this.outputIndex + ", satoshis: " + this.satoshis + ", address: " + this.address + ">";
};
/**
 * String representation: just "txid:index"
 * @returns string
 */ $9b9088ce0249a4b5$var$UnspentOutput.prototype.toString = function() {
    return this.txId + ":" + this.outputIndex;
};
/**
 * Deserialize an UnspentOutput from an object
 * @param {object|string} data
 * @return UnspentOutput
 */ $9b9088ce0249a4b5$var$UnspentOutput.fromObject = function(data) {
    return new $9b9088ce0249a4b5$var$UnspentOutput(data);
};
/**
 * Returns a plain object (no prototype or methods) with the associated info for this output
 * @return {object}
 */ $9b9088ce0249a4b5$var$UnspentOutput.prototype.toObject = $9b9088ce0249a4b5$var$UnspentOutput.prototype.toJSON = function toObject() {
    return {
        address: this.address ? this.address.toString() : undefined,
        txid: this.txId,
        vout: this.outputIndex,
        scriptPubKey: this.script.toBuffer().toString("hex"),
        amount: Number.parseFloat((this.satoshis / 1e8).toFixed(8))
    };
};
module.exports = $9b9088ce0249a4b5$var$UnspentOutput;

});






parcelRegister("b3rcQ", function(module, exports) {


if (process.browser) module.exports = (parcelRequire("fUHBt"));
else module.exports = (parcelRequire("epwAn"));

});
parcelRegister("fUHBt", function(module, exports) {
"use strict";
function $b95de8b95b860fed$var$Random() {}
/* secure random bytes that sometimes throws an error due to lack of entropy */ $b95de8b95b860fed$var$Random.getRandomBuffer = function(size) {
    if (!window.crypto && !window.msCrypto) throw new Error("window.crypto not available");
    var crypto;
    if (window.crypto && window.crypto.getRandomValues) crypto = window.crypto;
    else if (window.msCrypto && window.msCrypto.getRandomValues) crypto = window.msCrypto;
    else throw new Error("window.crypto.getRandomValues not available");
    var bbuf = new Uint8Array(size);
    crypto.getRandomValues(bbuf);
    var buf = Buffer.from(bbuf);
    return buf;
};
module.exports = $b95de8b95b860fed$var$Random;

});

parcelRegister("epwAn", function(module, exports) {
"use strict";
function $a7dcad529fba6c7d$var$Random() {}

/* secure random bytes that sometimes throws an error due to lack of entropy */ $a7dcad529fba6c7d$var$Random.getRandomBuffer = function(size) {
    var crypto = $fxX3C$crypto;
    return crypto.randomBytes(size);
};
module.exports = $a7dcad529fba6c7d$var$Random;

});





parcelRegister("clspB", function(module, exports) {

module.exports = (parcelRequire("8rE8W"));

module.exports.BlockHeader = (parcelRequire("lrDO8"));

module.exports.MerkleBlock = (parcelRequire("goS54"));

});
parcelRegister("8rE8W", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $lrDO8 = parcelRequire("lrDO8");

var $lM2TS = parcelRequire("lM2TS");

var $eKoSX = parcelRequire("eKoSX");

var $fvPTe = parcelRequire("fvPTe");

var $aScoK = parcelRequire("aScoK");

var $67vNY = parcelRequire("67vNY");

var $e34gf = parcelRequire("e34gf");
/**
 * Instantiate a Block from a Buffer, JSON object, or Object with
 * the properties of the Block
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {Block}
 * @constructor
 */ function $625ffbefe2416ef1$var$Block(arg) {
    if (!(this instanceof $625ffbefe2416ef1$var$Block)) return new $625ffbefe2416ef1$var$Block(arg);
    $iUxHD.extend(this, $625ffbefe2416ef1$var$Block._from(arg));
    return this;
}
$625ffbefe2416ef1$var$Block.MAX_BLOCK_SIZE = 128000000;
/**
 * @param {*} - A Buffer, JSON string or Object
 * @returns {Object} - An object representing block data
 * @throws {TypeError} - If the argument was not recognized
 * @private
 */ $625ffbefe2416ef1$var$Block._from = function _from(arg) {
    var info = {};
    if (Buffer.isBuffer(arg)) info = $625ffbefe2416ef1$var$Block._fromBufferReader($eKoSX(arg));
    else if ($iUxHD.isObject(arg)) info = $625ffbefe2416ef1$var$Block._fromObject(arg);
    else throw new TypeError("Unrecognized argument for Block");
    return info;
};
/**
 * @param {Object} - A plain JavaScript object
 * @returns {Object} - An object representing block data
 * @private
 */ $625ffbefe2416ef1$var$Block._fromObject = function _fromObject(data) {
    var transactions = [];
    data.transactions.forEach(function(tx) {
        if (tx instanceof $67vNY) transactions.push(tx);
        else transactions.push($67vNY().fromObject(tx));
    });
    var info = {
        header: $lrDO8.fromObject(data.header),
        transactions: transactions
    };
    return info;
};
/**
 * @param {Object} - A plain JavaScript object
 * @returns {Block} - An instance of block
 */ $625ffbefe2416ef1$var$Block.fromObject = function fromObject(obj) {
    var info = $625ffbefe2416ef1$var$Block._fromObject(obj);
    return new $625ffbefe2416ef1$var$Block(info);
};
/**
 * @param {BufferReader} - Block data
 * @returns {Object} - An object representing the block data
 * @private
 */ $625ffbefe2416ef1$var$Block._fromBufferReader = function _fromBufferReader(br) {
    var info = {};
    $e34gf.checkState(!br.finished(), "No block data received");
    info.header = $lrDO8.fromBufferReader(br);
    var transactions = br.readVarintNum();
    info.transactions = [];
    for(var i = 0; i < transactions; i++)info.transactions.push($67vNY().fromBufferReader(br));
    return info;
};
/**
 * @param {BufferReader} - A buffer reader of the block
 * @returns {Block} - An instance of block
 */ $625ffbefe2416ef1$var$Block.fromBufferReader = function fromBufferReader(br) {
    $e34gf.checkArgument(br, "br is required");
    var info = $625ffbefe2416ef1$var$Block._fromBufferReader(br);
    return new $625ffbefe2416ef1$var$Block(info);
};
/**
 * @param {Buffer} - A buffer of the block
 * @returns {Block} - An instance of block
 */ $625ffbefe2416ef1$var$Block.fromBuffer = function fromBuffer(buf) {
    return $625ffbefe2416ef1$var$Block.fromBufferReader(new $eKoSX(buf));
};
/**
 * @param {string} - str - A hex encoded string of the block
 * @returns {Block} - A hex encoded string of the block
 */ $625ffbefe2416ef1$var$Block.fromString = function fromString(str) {
    var buf = Buffer.from(str, "hex");
    return $625ffbefe2416ef1$var$Block.fromBuffer(buf);
};
/**
 * @param {Binary} - Raw block binary data or buffer
 * @returns {Block} - An instance of block
 */ $625ffbefe2416ef1$var$Block.fromRawBlock = function fromRawBlock(data) {
    if (!Buffer.isBuffer(data)) data = Buffer.from(data, "binary");
    var br = $eKoSX(data);
    br.pos = $625ffbefe2416ef1$var$Block.Values.START_OF_BLOCK;
    var info = $625ffbefe2416ef1$var$Block._fromBufferReader(br);
    return new $625ffbefe2416ef1$var$Block(info);
};
/**
 * @returns {Object} - A plain object with the block properties
 */ $625ffbefe2416ef1$var$Block.prototype.toObject = $625ffbefe2416ef1$var$Block.prototype.toJSON = function toObject() {
    var transactions = [];
    this.transactions.forEach(function(tx) {
        transactions.push(tx.toObject());
    });
    return {
        header: this.header.toObject(),
        transactions: transactions
    };
};
/**
 * @returns {Buffer} - A buffer of the block
 */ $625ffbefe2416ef1$var$Block.prototype.toBuffer = function toBuffer() {
    return this.toBufferWriter().concat();
};
/**
 * @returns {string} - A hex encoded string of the block
 */ $625ffbefe2416ef1$var$Block.prototype.toString = function toString() {
    return this.toBuffer().toString("hex");
};
/**
 * @param {BufferWriter} - An existing instance of BufferWriter
 * @returns {BufferWriter} - An instance of BufferWriter representation of the Block
 */ $625ffbefe2416ef1$var$Block.prototype.toBufferWriter = function toBufferWriter(bw) {
    if (!bw) bw = new $fvPTe();
    bw.write(this.header.toBuffer());
    bw.writeVarintNum(this.transactions.length);
    for(var i = 0; i < this.transactions.length; i++)this.transactions[i].toBufferWriter(bw);
    return bw;
};
/**
 * Will iterate through each transaction and return an array of hashes
 * @returns {Array} - An array with transaction hashes
 */ $625ffbefe2416ef1$var$Block.prototype.getTransactionHashes = function getTransactionHashes() {
    var hashes = [];
    if (this.transactions.length === 0) return [
        $625ffbefe2416ef1$var$Block.Values.NULL_HASH
    ];
    for(var t = 0; t < this.transactions.length; t++)hashes.push(this.transactions[t]._getHash());
    return hashes;
};
/**
 * Will build a merkle tree of all the transactions, ultimately arriving at
 * a single point, the merkle root.
 * @link https://en.bitcoin.it/wiki/Protocol_specification#Merkle_Trees
 * @returns {Array} - An array with each level of the tree after the other.
 */ $625ffbefe2416ef1$var$Block.prototype.getMerkleTree = function getMerkleTree() {
    var tree = this.getTransactionHashes();
    var j = 0;
    for(var size = this.transactions.length; size > 1; size = Math.floor((size + 1) / 2)){
        for(var i = 0; i < size; i += 2){
            var i2 = Math.min(i + 1, size - 1);
            var buf = Buffer.concat([
                tree[j + i],
                tree[j + i2]
            ]);
            tree.push($aScoK.sha256sha256(buf));
        }
        j += size;
    }
    return tree;
};
/**
 * Calculates the merkleRoot from the transactions.
 * @returns {Buffer} - A buffer of the merkle root hash
 */ $625ffbefe2416ef1$var$Block.prototype.getMerkleRoot = function getMerkleRoot() {
    var tree = this.getMerkleTree();
    return tree[tree.length - 1];
};
/**
 * Verifies that the transactions in the block match the header merkle root
 * @returns {Boolean} - If the merkle roots match
 */ $625ffbefe2416ef1$var$Block.prototype.validMerkleRoot = function validMerkleRoot() {
    var h = new $lM2TS(this.header.merkleRoot.toString("hex"), "hex");
    var c = new $lM2TS(this.getMerkleRoot().toString("hex"), "hex");
    if (h.cmp(c) !== 0) return false;
    return true;
};
/**
 * @returns {Buffer} - The little endian hash buffer of the header
 */ $625ffbefe2416ef1$var$Block.prototype._getHash = function() {
    return this.header._getHash();
};
var $625ffbefe2416ef1$var$idProperty = {
    configurable: false,
    enumerable: true,
    /**
   * @returns {string} - The big endian hash buffer of the header
   */ get: function() {
        if (!this._id) this._id = this.header.id;
        return this._id;
    },
    set: $iUxHD.noop
};
Object.defineProperty($625ffbefe2416ef1$var$Block.prototype, "id", $625ffbefe2416ef1$var$idProperty);
Object.defineProperty($625ffbefe2416ef1$var$Block.prototype, "hash", $625ffbefe2416ef1$var$idProperty);
/**
 * @returns {string} - A string formatted for the console
 */ $625ffbefe2416ef1$var$Block.prototype.inspect = function inspect() {
    return "<Block " + this.id + ">";
};
$625ffbefe2416ef1$var$Block.Values = {
    START_OF_BLOCK: 8,
    NULL_HASH: Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex")
};
module.exports = $625ffbefe2416ef1$var$Block;

});
parcelRegister("lrDO8", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $lM2TS = parcelRequire("lM2TS");

var $eKoSX = parcelRequire("eKoSX");

var $fvPTe = parcelRequire("fvPTe");

var $aScoK = parcelRequire("aScoK");

var $e34gf = parcelRequire("e34gf");
var $f9caff8dd596c7bc$var$GENESIS_BITS = 0x1d00ffff;
/**
 * Instantiate a BlockHeader from a Buffer, JSON object, or Object with
 * the properties of the BlockHeader
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {BlockHeader} - An instance of block header
 * @constructor
 */ var $f9caff8dd596c7bc$var$BlockHeader = function BlockHeader(arg) {
    if (!(this instanceof BlockHeader)) return new BlockHeader(arg);
    var info = BlockHeader._from(arg);
    this.version = info.version;
    this.prevHash = info.prevHash;
    this.merkleRoot = info.merkleRoot;
    this.time = info.time;
    this.timestamp = info.time;
    this.bits = info.bits;
    this.nonce = info.nonce;
    if (info.hash) $e34gf.checkState(this.hash === info.hash, "Argument object hash property does not match block hash.");
    return this;
};
/**
 * @param {*} - A Buffer, JSON string or Object
 * @returns {Object} - An object representing block header data
 * @throws {TypeError} - If the argument was not recognized
 * @private
 */ $f9caff8dd596c7bc$var$BlockHeader._from = function _from(arg) {
    var info = {};
    if (Buffer.isBuffer(arg)) info = $f9caff8dd596c7bc$var$BlockHeader._fromBufferReader($eKoSX(arg));
    else if ($iUxHD.isObject(arg)) info = $f9caff8dd596c7bc$var$BlockHeader._fromObject(arg);
    else throw new TypeError("Unrecognized argument for BlockHeader");
    return info;
};
/**
 * @param {Object} - A JSON string
 * @returns {Object} - An object representing block header data
 * @private
 */ $f9caff8dd596c7bc$var$BlockHeader._fromObject = function _fromObject(data) {
    $e34gf.checkArgument(data, "data is required");
    var prevHash = data.prevHash;
    var merkleRoot = data.merkleRoot;
    if ($iUxHD.isString(data.prevHash)) prevHash = Buffer.from(data.prevHash, "hex").reverse();
    if ($iUxHD.isString(data.merkleRoot)) merkleRoot = Buffer.from(data.merkleRoot, "hex").reverse();
    var info = {
        hash: data.hash,
        version: data.version,
        prevHash: prevHash,
        merkleRoot: merkleRoot,
        time: data.time,
        timestamp: data.time,
        bits: data.bits,
        nonce: data.nonce
    };
    return info;
};
/**
 * @param {Object} - A plain JavaScript object
 * @returns {BlockHeader} - An instance of block header
 */ $f9caff8dd596c7bc$var$BlockHeader.fromObject = function fromObject(obj) {
    var info = $f9caff8dd596c7bc$var$BlockHeader._fromObject(obj);
    return new $f9caff8dd596c7bc$var$BlockHeader(info);
};
/**
 * @param {Binary} - Raw block binary data or buffer
 * @returns {BlockHeader} - An instance of block header
 */ $f9caff8dd596c7bc$var$BlockHeader.fromRawBlock = function fromRawBlock(data) {
    if (!Buffer.isBuffer(data)) data = Buffer.from(data, "binary");
    var br = $eKoSX(data);
    br.pos = $f9caff8dd596c7bc$var$BlockHeader.Constants.START_OF_HEADER;
    var info = $f9caff8dd596c7bc$var$BlockHeader._fromBufferReader(br);
    return new $f9caff8dd596c7bc$var$BlockHeader(info);
};
/**
 * @param {Buffer} - A buffer of the block header
 * @returns {BlockHeader} - An instance of block header
 */ $f9caff8dd596c7bc$var$BlockHeader.fromBuffer = function fromBuffer(buf) {
    var info = $f9caff8dd596c7bc$var$BlockHeader._fromBufferReader($eKoSX(buf));
    return new $f9caff8dd596c7bc$var$BlockHeader(info);
};
/**
 * @param {string} - A hex encoded buffer of the block header
 * @returns {BlockHeader} - An instance of block header
 */ $f9caff8dd596c7bc$var$BlockHeader.fromString = function fromString(str) {
    var buf = Buffer.from(str, "hex");
    return $f9caff8dd596c7bc$var$BlockHeader.fromBuffer(buf);
};
/**
 * @param {BufferReader} - A BufferReader of the block header
 * @returns {Object} - An object representing block header data
 * @private
 */ $f9caff8dd596c7bc$var$BlockHeader._fromBufferReader = function _fromBufferReader(br) {
    var info = {};
    info.version = br.readInt32LE();
    info.prevHash = br.read(32);
    info.merkleRoot = br.read(32);
    info.time = br.readUInt32LE();
    info.bits = br.readUInt32LE();
    info.nonce = br.readUInt32LE();
    return info;
};
/**
 * @param {BufferReader} - A BufferReader of the block header
 * @returns {BlockHeader} - An instance of block header
 */ $f9caff8dd596c7bc$var$BlockHeader.fromBufferReader = function fromBufferReader(br) {
    var info = $f9caff8dd596c7bc$var$BlockHeader._fromBufferReader(br);
    return new $f9caff8dd596c7bc$var$BlockHeader(info);
};
/**
 * @returns {Object} - A plain object of the BlockHeader
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.toObject = $f9caff8dd596c7bc$var$BlockHeader.prototype.toJSON = function toObject() {
    return {
        hash: this.hash,
        version: this.version,
        prevHash: Buffer.from(this.prevHash).reverse().toString("hex"),
        merkleRoot: Buffer.from(this.merkleRoot).reverse().toString("hex"),
        time: this.time,
        bits: this.bits,
        nonce: this.nonce
    };
};
/**
 * @returns {Buffer} - A Buffer of the BlockHeader
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.toBuffer = function toBuffer() {
    return this.toBufferWriter().concat();
};
/**
 * @returns {string} - A hex encoded string of the BlockHeader
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.toString = function toString() {
    return this.toBuffer().toString("hex");
};
/**
 * @param {BufferWriter} - An existing instance BufferWriter
 * @returns {BufferWriter} - An instance of BufferWriter representation of the BlockHeader
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.toBufferWriter = function toBufferWriter(bw) {
    if (!bw) bw = new $fvPTe();
    bw.writeInt32LE(this.version);
    bw.write(this.prevHash);
    bw.write(this.merkleRoot);
    bw.writeUInt32LE(this.time);
    bw.writeUInt32LE(this.bits);
    bw.writeUInt32LE(this.nonce);
    return bw;
};
/**
 * Returns the target difficulty for this block
 * @param {Number} bits
 * @returns {BN} An instance of BN with the decoded difficulty bits
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.getTargetDifficulty = function getTargetDifficulty(bits) {
    bits = bits || this.bits;
    var target = new $lM2TS(bits & 0xffffff);
    var mov = 8 * ((bits >>> 24) - 3);
    while(mov-- > 0)target = target.mul(new $lM2TS(2));
    return target;
};
/**
 * @link https://en.bitcoin.it/wiki/Difficulty
 * @return {Number}
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.getDifficulty = function getDifficulty() {
    var difficulty1TargetBN = this.getTargetDifficulty($f9caff8dd596c7bc$var$GENESIS_BITS).mul(new $lM2TS(Math.pow(10, 8)));
    var currentTargetBN = this.getTargetDifficulty();
    var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
    var decimalPos = difficultyString.length - 8;
    difficultyString = difficultyString.slice(0, decimalPos) + "." + difficultyString.slice(decimalPos);
    return parseFloat(difficultyString);
};
/**
 * @returns {Buffer} - The little endian hash buffer of the header
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype._getHash = function hash() {
    var buf = this.toBuffer();
    return $aScoK.sha256sha256(buf);
};
var $f9caff8dd596c7bc$var$idProperty = {
    configurable: false,
    enumerable: true,
    /**
   * @returns {string} - The big endian hash buffer of the header
   */ get: function() {
        if (!this._id) this._id = $eKoSX(this._getHash()).readReverse().toString("hex");
        return this._id;
    },
    set: $iUxHD.noop
};
Object.defineProperty($f9caff8dd596c7bc$var$BlockHeader.prototype, "id", $f9caff8dd596c7bc$var$idProperty);
Object.defineProperty($f9caff8dd596c7bc$var$BlockHeader.prototype, "hash", $f9caff8dd596c7bc$var$idProperty);
/**
 * @returns {Boolean} - If timestamp is not too far in the future
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.validTimestamp = function validTimestamp() {
    var currentTime = Math.round(new Date().getTime() / 1000);
    if (this.time > currentTime + $f9caff8dd596c7bc$var$BlockHeader.Constants.MAX_TIME_OFFSET) return false;
    return true;
};
/**
 * @returns {Boolean} - If the proof-of-work hash satisfies the target difficulty
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.validProofOfWork = function validProofOfWork() {
    var pow = new $lM2TS(this.id, "hex");
    var target = this.getTargetDifficulty();
    if (pow.cmp(target) > 0) return false;
    return true;
};
/**
 * @returns {string} - A string formatted for the console
 */ $f9caff8dd596c7bc$var$BlockHeader.prototype.inspect = function inspect() {
    return "<BlockHeader " + this.id + ">";
};
$f9caff8dd596c7bc$var$BlockHeader.Constants = {
    START_OF_HEADER: 8,
    MAX_TIME_OFFSET: 7200,
    LARGEST_HASH: new $lM2TS("10000000000000000000000000000000000000000000000000000000000000000", "hex")
};
module.exports = $f9caff8dd596c7bc$var$BlockHeader;

});


parcelRegister("goS54", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $lrDO8 = parcelRequire("lrDO8");

var $eKoSX = parcelRequire("eKoSX");

var $fvPTe = parcelRequire("fvPTe");

var $aScoK = parcelRequire("aScoK");

var $67vNY = parcelRequire("67vNY");

var $lOQ1c = parcelRequire("lOQ1c");

var $e34gf = parcelRequire("e34gf");
/**
 * Instantiate a MerkleBlock from a Buffer, JSON object, or Object with
 * the properties of the Block
 *
 * @param {*} - A Buffer, JSON string, or Object representing a MerkleBlock
 * @returns {MerkleBlock}
 * @constructor
 */ function $bf08d6920ce608d9$var$MerkleBlock(arg) {
    if (!(this instanceof $bf08d6920ce608d9$var$MerkleBlock)) return new $bf08d6920ce608d9$var$MerkleBlock(arg);
    var info = {};
    if (Buffer.isBuffer(arg)) info = $bf08d6920ce608d9$var$MerkleBlock._fromBufferReader($eKoSX(arg));
    else if ($iUxHD.isObject(arg)) {
        var header;
        if (arg.header instanceof $lrDO8) header = arg.header;
        else header = $lrDO8.fromObject(arg.header);
        info = {
            /**
       * @name MerkleBlock#header
       * @type {BlockHeader}
       */ header: header,
            /**
       * @name MerkleBlock#numTransactions
       * @type {Number}
       */ numTransactions: arg.numTransactions,
            /**
       * @name MerkleBlock#hashes
       * @type {String[]}
       */ hashes: arg.hashes,
            /**
       * @name MerkleBlock#flags
       * @type {Number[]}
       */ flags: arg.flags
        };
    } else throw new TypeError("Unrecognized argument for MerkleBlock");
    $iUxHD.extend(this, info);
    this._flagBitsUsed = 0;
    this._hashesUsed = 0;
    return this;
}
/**
 * @param {Buffer} - MerkleBlock data in a Buffer object
 * @returns {MerkleBlock} - A MerkleBlock object
 */ $bf08d6920ce608d9$var$MerkleBlock.fromBuffer = function fromBuffer(buf) {
    return $bf08d6920ce608d9$var$MerkleBlock.fromBufferReader($eKoSX(buf));
};
/**
 * @param {BufferReader} - MerkleBlock data in a BufferReader object
 * @returns {MerkleBlock} - A MerkleBlock object
 */ $bf08d6920ce608d9$var$MerkleBlock.fromBufferReader = function fromBufferReader(br) {
    return new $bf08d6920ce608d9$var$MerkleBlock($bf08d6920ce608d9$var$MerkleBlock._fromBufferReader(br));
};
/**
 * @returns {Buffer} - A buffer of the block
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.toBuffer = function toBuffer() {
    return this.toBufferWriter().concat();
};
/**
 * @param {BufferWriter} - An existing instance of BufferWriter
 * @returns {BufferWriter} - An instance of BufferWriter representation of the MerkleBlock
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.toBufferWriter = function toBufferWriter(bw) {
    if (!bw) bw = new $fvPTe();
    bw.write(this.header.toBuffer());
    bw.writeUInt32LE(this.numTransactions);
    bw.writeVarintNum(this.hashes.length);
    for(var i = 0; i < this.hashes.length; i++)bw.write(Buffer.from(this.hashes[i], "hex"));
    bw.writeVarintNum(this.flags.length);
    for(i = 0; i < this.flags.length; i++)bw.writeUInt8(this.flags[i]);
    return bw;
};
/**
 * @returns {Object} - A plain object with the MerkleBlock properties
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.toObject = $bf08d6920ce608d9$var$MerkleBlock.prototype.toJSON = function toObject() {
    return {
        header: this.header.toObject(),
        numTransactions: this.numTransactions,
        hashes: this.hashes,
        flags: this.flags
    };
};
/**
 * Verify that the MerkleBlock is valid
 * @returns {Boolean} - True/False whether this MerkleBlock is Valid
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.validMerkleTree = function validMerkleTree() {
    $e34gf.checkState($iUxHD.isArray(this.flags), "MerkleBlock flags is not an array");
    $e34gf.checkState($iUxHD.isArray(this.hashes), "MerkleBlock hashes is not an array");
    // Can't have more hashes than numTransactions
    if (this.hashes.length > this.numTransactions) return false;
    // Can't have more flag bits than num hashes
    if (this.flags.length * 8 < this.hashes.length) return false;
    var height = this._calcTreeHeight();
    var opts = {
        hashesUsed: 0,
        flagBitsUsed: 0
    };
    var root = this._traverseMerkleTree(height, 0, opts);
    if (opts.hashesUsed !== this.hashes.length) return false;
    return root.equals(this.header.merkleRoot);
};
/**
 * WARNING: This method is deprecated. Use filteredTxsHash instead.
 *
 * Return a list of all the txs hash that match the filter
 * @returns {Array} - txs hash that match the filter
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.filterdTxsHash = function filterdTxsHash() {
    throw new Error("filterdTxsHash has been deprecated. use filteredTxsHash.");
};
/**
 * Return a list of all the txs hash that match the filter
 * @returns {Array} - txs hash that match the filter
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.filteredTxsHash = function filteredTxsHash() {
    $e34gf.checkState($iUxHD.isArray(this.flags), "MerkleBlock flags is not an array");
    $e34gf.checkState($iUxHD.isArray(this.hashes), "MerkleBlock hashes is not an array");
    // Can't have more hashes than numTransactions
    if (this.hashes.length > this.numTransactions) throw new $lOQ1c.MerkleBlock.InvalidMerkleTree();
    // Can't have more flag bits than num hashes
    if (this.flags.length * 8 < this.hashes.length) throw new $lOQ1c.MerkleBlock.InvalidMerkleTree();
    // If there is only one hash the filter do not match any txs in the block
    if (this.hashes.length === 1) return [];
    var height = this._calcTreeHeight();
    var opts = {
        hashesUsed: 0,
        flagBitsUsed: 0
    };
    var txs = this._traverseMerkleTree(height, 0, opts, true);
    if (opts.hashesUsed !== this.hashes.length) throw new $lOQ1c.MerkleBlock.InvalidMerkleTree();
    return txs;
};
/**
 * Traverse a the tree in this MerkleBlock, validating it along the way
 * Modeled after Bitcoin Core merkleblock.cpp TraverseAndExtract()
 * @param {Number} - depth - Current height
 * @param {Number} - pos - Current position in the tree
 * @param {Object} - opts - Object with values that need to be mutated throughout the traversal
 * @param {Boolean} - checkForTxs - if true return opts.txs else return the Merkle Hash
 * @param {Number} - opts.flagBitsUsed - Number of flag bits used, should start at 0
 * @param {Number} - opts.hashesUsed - Number of hashes used, should start at 0
 * @param {Array} - opts.txs - Will finish populated by transactions found during traversal that match the filter
 * @returns {Buffer|null} - Buffer containing the Merkle Hash for that height
 * @returns {Array} - transactions found during traversal that match the filter
 * @private
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype._traverseMerkleTree = function traverseMerkleTree(depth, pos, opts, checkForTxs) {
    opts = opts || {};
    opts.txs = opts.txs || [];
    opts.flagBitsUsed = opts.flagBitsUsed || 0;
    opts.hashesUsed = opts.hashesUsed || 0;
    checkForTxs = checkForTxs || false;
    if (opts.flagBitsUsed > this.flags.length * 8) return null;
    var isParentOfMatch = this.flags[opts.flagBitsUsed >> 3] >>> (opts.flagBitsUsed++ & 7) & 1;
    if (depth === 0 || !isParentOfMatch) {
        if (opts.hashesUsed >= this.hashes.length) return null;
        var hash = this.hashes[opts.hashesUsed++];
        if (depth === 0 && isParentOfMatch) opts.txs.push(hash);
        return Buffer.from(hash, "hex");
    } else {
        var left = this._traverseMerkleTree(depth - 1, pos * 2, opts);
        var right = left;
        if (pos * 2 + 1 < this._calcTreeWidth(depth - 1)) right = this._traverseMerkleTree(depth - 1, pos * 2 + 1, opts);
        if (checkForTxs) return opts.txs;
        else return $aScoK.sha256sha256(Buffer.concat([
            left,
            right
        ]));
    }
};
/** Calculates the width of a merkle tree at a given height.
 *  Modeled after Bitcoin Core merkleblock.h CalcTreeWidth()
 * @param {Number} - Height at which we want the tree width
 * @returns {Number} - Width of the tree at a given height
 * @private
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype._calcTreeWidth = function calcTreeWidth(height) {
    return this.numTransactions + (1 << height) - 1 >> height;
};
/** Calculates the height of the merkle tree in this MerkleBlock
 * @param {Number} - Height at which we want the tree width
 * @returns {Number} - Height of the merkle tree in this MerkleBlock
 * @private
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype._calcTreeHeight = function calcTreeHeight() {
    var height = 0;
    while(this._calcTreeWidth(height) > 1)height++;
    return height;
};
/**
 * @param {Transaction|String} - Transaction or Transaction ID Hash
 * @returns {Boolean} - return true/false if this MerkleBlock has the TX or not
 * @private
 */ $bf08d6920ce608d9$var$MerkleBlock.prototype.hasTransaction = function hasTransaction(tx) {
    $e34gf.checkArgument(!$iUxHD.isUndefined(tx), "tx cannot be undefined");
    $e34gf.checkArgument(tx instanceof $67vNY || typeof tx === "string", 'Invalid tx given, tx must be a "string" or "Transaction"');
    var hash = tx;
    if (tx instanceof $67vNY) // We need to reverse the id hash for the lookup
    hash = Buffer.from(tx.id, "hex").reverse().toString("hex");
    var txs = [];
    var height = this._calcTreeHeight();
    this._traverseMerkleTree(height, 0, {
        txs: txs
    });
    return txs.indexOf(hash) !== -1;
};
/**
 * @param {Buffer} - MerkleBlock data
 * @returns {Object} - An Object representing merkleblock data
 * @private
 */ $bf08d6920ce608d9$var$MerkleBlock._fromBufferReader = function _fromBufferReader(br) {
    $e34gf.checkState(!br.finished(), "No merkleblock data received");
    var info = {};
    info.header = $lrDO8.fromBufferReader(br);
    info.numTransactions = br.readUInt32LE();
    var numHashes = br.readVarintNum();
    info.hashes = [];
    for(var i = 0; i < numHashes; i++)info.hashes.push(br.read(32).toString("hex"));
    var numFlags = br.readVarintNum();
    info.flags = [];
    for(i = 0; i < numFlags; i++)info.flags.push(br.readUInt8());
    return info;
};
/**
 * @param {Object} - A plain JavaScript object
 * @returns {Block} - An instance of block
 */ $bf08d6920ce608d9$var$MerkleBlock.fromObject = function fromObject(obj) {
    return new $bf08d6920ce608d9$var$MerkleBlock(obj);
};
module.exports = $bf08d6920ce608d9$var$MerkleBlock;

});


parcelRegister("Nv8ZS", function(module, exports) {
"use strict";


var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lM2TS = parcelRequire("lM2TS");

var $6BAsE = parcelRequire("6BAsE");

var $9AjNa = parcelRequire("9AjNa");

var $aScoK = parcelRequire("aScoK");

var $92x2d = parcelRequire("92x2d");

var $japbZ = parcelRequire("japbZ");

var $eB3ON = parcelRequire("eB3ON");

var $b3rcQ = parcelRequire("b3rcQ");

var $lOQ1c = parcelRequire("lOQ1c");
var $094cbc4a51127ca7$var$hdErrors = $lOQ1c.HDPrivateKey;

var $bbk3w = parcelRequire("bbk3w");
var $094cbc4a51127ca7$var$MINIMUM_ENTROPY_BITS = 128;
var $094cbc4a51127ca7$var$BITS_TO_BYTES = 1 / 8;
var $094cbc4a51127ca7$var$MAXIMUM_ENTROPY_BITS = 512;
/**
 * Represents an instance of an hierarchically derived private key.
 *
 * More info on https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 *
 * @constructor
 * @param {string|Buffer|Object} arg
 */ function $094cbc4a51127ca7$var$HDPrivateKey(arg) {
    if (arg instanceof $094cbc4a51127ca7$var$HDPrivateKey) return arg;
    if (!(this instanceof $094cbc4a51127ca7$var$HDPrivateKey)) return new $094cbc4a51127ca7$var$HDPrivateKey(arg);
    if (!arg) return this._generateRandomly();
    if ($92x2d.get(arg)) return this._generateRandomly(arg);
    else if ($iUxHD.isString(arg) || Buffer.isBuffer(arg)) {
        if ($094cbc4a51127ca7$var$HDPrivateKey.isValidSerialized(arg)) this._buildFromSerialized(arg);
        else if ($bbk3w.isValidJSON(arg)) this._buildFromJSON(arg);
        else if (Buffer.isBuffer(arg) && $094cbc4a51127ca7$var$HDPrivateKey.isValidSerialized(arg.toString())) this._buildFromSerialized(arg.toString());
        else throw $094cbc4a51127ca7$var$HDPrivateKey.getSerializedError(arg);
    } else if ($iUxHD.isObject(arg)) this._buildFromObject(arg);
    else throw new $094cbc4a51127ca7$var$hdErrors.UnrecognizedArgument(arg);
}
$094cbc4a51127ca7$var$HDPrivateKey.fromRandom = function() {
    return new $094cbc4a51127ca7$var$HDPrivateKey();
};
/**
 * Verifies that a given path is valid.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 * @return {boolean}
 */ $094cbc4a51127ca7$var$HDPrivateKey.isValidPath = function(arg, hardened) {
    if ($iUxHD.isString(arg)) {
        var indexes = $094cbc4a51127ca7$var$HDPrivateKey._getDerivationIndexes(arg);
        return indexes !== null && $iUxHD.every(indexes, $094cbc4a51127ca7$var$HDPrivateKey.isValidPath);
    }
    if ($iUxHD.isNumber(arg)) {
        if (arg < $094cbc4a51127ca7$var$HDPrivateKey.Hardened && hardened === true) arg += $094cbc4a51127ca7$var$HDPrivateKey.Hardened;
        return arg >= 0 && arg < $094cbc4a51127ca7$var$HDPrivateKey.MaxIndex;
    }
    return false;
};
/**
 * Internal function that splits a string path into a derivation index array.
 * It will return null if the string path is malformed.
 * It does not validate if indexes are in bounds.
 *
 * @param {string} path
 * @return {Array}
 */ $094cbc4a51127ca7$var$HDPrivateKey._getDerivationIndexes = function(path) {
    var steps = path.split("/");
    // Special cases:
    if ($iUxHD.includes($094cbc4a51127ca7$var$HDPrivateKey.RootElementAlias, path)) return [];
    if (!$iUxHD.includes($094cbc4a51127ca7$var$HDPrivateKey.RootElementAlias, steps[0])) return null;
    var indexes = steps.slice(1).map(function(step) {
        var isHardened = step.slice(-1) === "'";
        if (isHardened) step = step.slice(0, -1);
        if (!step || step[0] === "-") return NaN;
        var index = +step // cast to number
        ;
        if (isHardened) index += $094cbc4a51127ca7$var$HDPrivateKey.Hardened;
        return index;
    });
    return $iUxHD.some(indexes, isNaN) ? null : indexes;
};
/**
 * WARNING: This method is deprecated. Use deriveChild or deriveNonCompliantChild instead. This is not BIP32 compliant
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.derive(0).derive(1).derive(2, true);
 * var copy_of_child_0_1_2h = parent.derive("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.derive = function() {
    throw new Error("derive has been deprecated. use deriveChild or, for the old way, deriveNonCompliantChild.");
};
/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Get a derived child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same private key), "m/0/1/40/2'/1000", where the ' quote means a hardened
 * derivation.
 *
 * If the first argument is a number, the child with that index will be
 * derived. If the second argument is truthy, the hardened version will be
 * derived. See the example usage for clarification.
 *
 * WARNING: The `nonCompliant` option should NOT be used, except for older implementation
 * that used a derivation strategy that used a non-zero padded private key.
 *
 * @example
 * ```javascript
 * var parent = new HDPrivateKey('xprv...');
 * var child_0_1_2h = parent.deriveChild(0).deriveChild(1).deriveChild(2, true);
 * var copy_of_child_0_1_2h = parent.deriveChild("m/0/1/2'");
 * assert(child_0_1_2h.xprivkey === copy_of_child_0_1_2h);
 * ```
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.deriveChild = function(arg, hardened) {
    if ($iUxHD.isNumber(arg)) return this._deriveWithNumber(arg, hardened);
    else if ($iUxHD.isString(arg)) return this._deriveFromString(arg);
    else throw new $094cbc4a51127ca7$var$hdErrors.InvalidDerivationArgument(arg);
};
/**
 * WARNING: This method will not be officially supported until v1.0.0
 *
 *
 * WARNING: If this is a new implementation you should NOT use this method, you should be using
 * `derive` instead.
 *
 * This method is explicitly for use and compatibility with an implementation that
 * was not compliant with BIP32 regarding the derivation algorithm. The private key
 * must be 32 bytes hashing, and this implementation will use the non-zero padded
 * serialization of a private key, such that it's still possible to derive the privateKey
 * to recover those funds.
 *
 * @param {string|number} arg
 * @param {boolean?} hardened
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.deriveNonCompliantChild = function(arg, hardened) {
    if ($iUxHD.isNumber(arg)) return this._deriveWithNumber(arg, hardened, true);
    else if ($iUxHD.isString(arg)) return this._deriveFromString(arg, true);
    else throw new $094cbc4a51127ca7$var$hdErrors.InvalidDerivationArgument(arg);
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._deriveWithNumber = function(index, hardened, nonCompliant) {
    if (!$094cbc4a51127ca7$var$HDPrivateKey.isValidPath(index, hardened)) throw new $094cbc4a51127ca7$var$hdErrors.InvalidPath(index);
    hardened = index >= $094cbc4a51127ca7$var$HDPrivateKey.Hardened ? true : hardened;
    if (index < $094cbc4a51127ca7$var$HDPrivateKey.Hardened && hardened === true) index += $094cbc4a51127ca7$var$HDPrivateKey.Hardened;
    var indexBuffer = $bbk3w.integerAsBuffer(index);
    var data;
    if (hardened && nonCompliant) {
        // The private key serialization in this case will not be exactly 32 bytes and can be
        // any value less, and the value is not zero-padded.
        var nonZeroPadded = this.privateKey.bn.toBuffer();
        data = Buffer.concat([
            Buffer.from([
                0
            ]),
            nonZeroPadded,
            indexBuffer
        ]);
    } else if (hardened) {
        // This will use a 32 byte zero padded serialization of the private key
        var privateKeyBuffer = this.privateKey.bn.toBuffer({
            size: 32
        });
        $fxX3C$assert(privateKeyBuffer.length === 32, "length of private key buffer is expected to be 32 bytes");
        data = Buffer.concat([
            Buffer.from([
                0
            ]),
            privateKeyBuffer,
            indexBuffer
        ]);
    } else data = Buffer.concat([
        this.publicKey.toBuffer(),
        indexBuffer
    ]);
    var hash = $aScoK.sha512hmac(data, this._buffers.chainCode);
    var leftPart = $lM2TS.fromBuffer(hash.slice(0, 32), {
        size: 32
    });
    var chainCode = hash.slice(32, 64);
    var privateKey = leftPart.add(this.privateKey.toBigNumber()).umod($japbZ.getN()).toBuffer({
        size: 32
    });
    if (!$eB3ON.isValid(privateKey)) // Index at this point is already hardened, we can pass null as the hardened arg
    return this._deriveWithNumber(index + 1, null, nonCompliant);
    var derived = new $094cbc4a51127ca7$var$HDPrivateKey({
        network: this.network,
        depth: this.depth + 1,
        parentFingerPrint: this.fingerPrint,
        childIndex: index,
        chainCode: chainCode,
        privateKey: privateKey
    });
    return derived;
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._deriveFromString = function(path, nonCompliant) {
    if (!$094cbc4a51127ca7$var$HDPrivateKey.isValidPath(path)) throw new $094cbc4a51127ca7$var$hdErrors.InvalidPath(path);
    var indexes = $094cbc4a51127ca7$var$HDPrivateKey._getDerivationIndexes(path);
    var derived = indexes.reduce(function(prev, index) {
        return prev._deriveWithNumber(index, null, nonCompliant);
    }, this);
    return derived;
};
/**
 * Verifies that a given serialized private key in base58 with checksum format
 * is valid.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {boolean}
 */ $094cbc4a51127ca7$var$HDPrivateKey.isValidSerialized = function(data, network) {
    return !$094cbc4a51127ca7$var$HDPrivateKey.getSerializedError(data, network);
};
/**
 * Checks what's the error that causes the validation of a serialized private key
 * in base58 with checksum to fail.
 *
 * @param {string|Buffer} data - the serialized private key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {errors.InvalidArgument|null}
 */ $094cbc4a51127ca7$var$HDPrivateKey.getSerializedError = function(data, network) {
    if (!($iUxHD.isString(data) || Buffer.isBuffer(data))) return new $094cbc4a51127ca7$var$hdErrors.UnrecognizedArgument("Expected string or buffer");
    if (!$6BAsE.validCharacters(data)) return new $lOQ1c.InvalidB58Char("(unknown)", data);
    try {
        data = $9AjNa.decode(data);
    } catch (e) {
        return new $lOQ1c.InvalidB58Checksum(data);
    }
    if (data.length !== $094cbc4a51127ca7$var$HDPrivateKey.DataLength) return new $094cbc4a51127ca7$var$hdErrors.InvalidLength(data);
    if (!$iUxHD.isUndefined(network)) {
        var error = $094cbc4a51127ca7$var$HDPrivateKey._validateNetwork(data, network);
        if (error) return error;
    }
    return null;
};
$094cbc4a51127ca7$var$HDPrivateKey._validateNetwork = function(data, networkArg) {
    var network = $92x2d.get(networkArg);
    if (!network) return new $lOQ1c.InvalidNetworkArgument(networkArg);
    var version = data.slice(0, 4);
    if (version.readUInt32BE(0) !== network.xprivkey) return new $lOQ1c.InvalidNetwork(version);
    return null;
};
$094cbc4a51127ca7$var$HDPrivateKey.fromString = function(arg) {
    $e34gf.checkArgument($iUxHD.isString(arg), "No valid string was provided");
    return new $094cbc4a51127ca7$var$HDPrivateKey(arg);
};
$094cbc4a51127ca7$var$HDPrivateKey.fromObject = function(arg) {
    $e34gf.checkArgument($iUxHD.isObject(arg), "No valid argument was provided");
    return new $094cbc4a51127ca7$var$HDPrivateKey(arg);
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._buildFromJSON = function(arg) {
    return this._buildFromObject(JSON.parse(arg));
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._buildFromObject = function(arg) {
    // TODO: Type validation
    var buffers = {
        version: arg.network ? $bbk3w.integerAsBuffer($92x2d.get(arg.network).xprivkey) : arg.version,
        depth: $iUxHD.isNumber(arg.depth) ? Buffer.from([
            arg.depth & 0xff
        ]) : arg.depth,
        parentFingerPrint: $iUxHD.isNumber(arg.parentFingerPrint) ? $bbk3w.integerAsBuffer(arg.parentFingerPrint) : arg.parentFingerPrint,
        childIndex: $iUxHD.isNumber(arg.childIndex) ? $bbk3w.integerAsBuffer(arg.childIndex) : arg.childIndex,
        chainCode: $iUxHD.isString(arg.chainCode) ? Buffer.from(arg.chainCode, "hex") : arg.chainCode,
        privateKey: $iUxHD.isString(arg.privateKey) && $bbk3w.isHexa(arg.privateKey) ? Buffer.from(arg.privateKey, "hex") : arg.privateKey,
        checksum: arg.checksum ? arg.checksum.length ? arg.checksum : $bbk3w.integerAsBuffer(arg.checksum) : undefined
    };
    return this._buildFromBuffers(buffers);
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._buildFromSerialized = function(arg) {
    var decoded = $9AjNa.decode(arg);
    var buffers = {
        version: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.VersionStart, $094cbc4a51127ca7$var$HDPrivateKey.VersionEnd),
        depth: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.DepthStart, $094cbc4a51127ca7$var$HDPrivateKey.DepthEnd),
        parentFingerPrint: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintStart, $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintEnd),
        childIndex: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.ChildIndexStart, $094cbc4a51127ca7$var$HDPrivateKey.ChildIndexEnd),
        chainCode: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.ChainCodeStart, $094cbc4a51127ca7$var$HDPrivateKey.ChainCodeEnd),
        privateKey: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyStart, $094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyEnd),
        checksum: decoded.slice($094cbc4a51127ca7$var$HDPrivateKey.ChecksumStart, $094cbc4a51127ca7$var$HDPrivateKey.ChecksumEnd),
        xprivkey: arg
    };
    return this._buildFromBuffers(buffers);
};
$094cbc4a51127ca7$var$HDPrivateKey.prototype._generateRandomly = function(network) {
    return $094cbc4a51127ca7$var$HDPrivateKey.fromSeed($b3rcQ.getRandomBuffer(64), network);
};
/**
 * Generate a private key from a seed, as described in BIP32
 *
 * @param {string|Buffer} hexa
 * @param {*} network
 * @return HDPrivateKey
 */ $094cbc4a51127ca7$var$HDPrivateKey.fromSeed = function(hexa, network) {
    if ($bbk3w.isHexaString(hexa)) hexa = Buffer.from(hexa, "hex");
    if (!Buffer.isBuffer(hexa)) throw new $094cbc4a51127ca7$var$hdErrors.InvalidEntropyArgument(hexa);
    if (hexa.length < $094cbc4a51127ca7$var$MINIMUM_ENTROPY_BITS * $094cbc4a51127ca7$var$BITS_TO_BYTES) throw new $094cbc4a51127ca7$var$hdErrors.InvalidEntropyArgument.NotEnoughEntropy(hexa);
    if (hexa.length > $094cbc4a51127ca7$var$MAXIMUM_ENTROPY_BITS * $094cbc4a51127ca7$var$BITS_TO_BYTES) throw new $094cbc4a51127ca7$var$hdErrors.InvalidEntropyArgument.TooMuchEntropy(hexa);
    var hash = $aScoK.sha512hmac(hexa, Buffer.from("Bitcoin seed"));
    return new $094cbc4a51127ca7$var$HDPrivateKey({
        network: $92x2d.get(network) || $92x2d.defaultNetwork,
        depth: 0,
        parentFingerPrint: 0,
        childIndex: 0,
        privateKey: hash.slice(0, 32),
        chainCode: hash.slice(32, 64)
    });
};

$094cbc4a51127ca7$var$HDPrivateKey.prototype._calcHDPublicKey = function() {
    if (!this._hdPublicKey) {
        var HDPublicKey = (parcelRequire("iFSyP"));
        this._hdPublicKey = new HDPublicKey(this);
    }
};
/**
 * Receives a object with buffers in all the properties and populates the
 * internal structure
 *
 * @param {Object} arg
 * @param {buffer.Buffer} arg.version
 * @param {buffer.Buffer} arg.depth
 * @param {buffer.Buffer} arg.parentFingerPrint
 * @param {buffer.Buffer} arg.childIndex
 * @param {buffer.Buffer} arg.chainCode
 * @param {buffer.Buffer} arg.privateKey
 * @param {buffer.Buffer} arg.checksum
 * @param {string=} arg.xprivkey - if set, don't recalculate the base58
 *      representation
 * @return {HDPrivateKey} this
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype._buildFromBuffers = function(arg) {
    $094cbc4a51127ca7$var$HDPrivateKey._validateBufferArguments(arg);
    $bbk3w.defineImmutable(this, {
        _buffers: arg
    });
    var sequence = [
        arg.version,
        arg.depth,
        arg.parentFingerPrint,
        arg.childIndex,
        arg.chainCode,
        Buffer.alloc(1),
        arg.privateKey
    ];
    var concat = Buffer.concat(sequence);
    if (!arg.checksum || !arg.checksum.length) arg.checksum = $9AjNa.checksum(concat);
    else {
        if (arg.checksum.toString() !== $9AjNa.checksum(concat).toString()) throw new $lOQ1c.InvalidB58Checksum(concat);
    }
    var network = $92x2d.get(arg.version.readUInt32BE(0));
    var xprivkey;
    xprivkey = $9AjNa.encode(Buffer.concat(sequence));
    arg.xprivkey = Buffer.from(xprivkey);
    var privateKey = new $eB3ON($lM2TS.fromBuffer(arg.privateKey), network);
    var publicKey = privateKey.toPublicKey();
    var size = $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintSize;
    var fingerPrint = $aScoK.sha256ripemd160(publicKey.toBuffer()).slice(0, size);
    $bbk3w.defineImmutable(this, {
        xprivkey: xprivkey,
        network: network,
        depth: arg.depth[0],
        privateKey: privateKey,
        publicKey: publicKey,
        fingerPrint: fingerPrint
    });
    this._hdPublicKey = null;
    Object.defineProperty(this, "hdPublicKey", {
        configurable: false,
        enumerable: true,
        get: function() {
            this._calcHDPublicKey();
            return this._hdPublicKey;
        }
    });
    Object.defineProperty(this, "xpubkey", {
        configurable: false,
        enumerable: true,
        get: function() {
            this._calcHDPublicKey();
            return this._hdPublicKey.xpubkey;
        }
    });
    return this;
};
$094cbc4a51127ca7$var$HDPrivateKey._validateBufferArguments = function(arg) {
    var checkBuffer = function(name, size) {
        var buff = arg[name];
        $fxX3C$assert(Buffer.isBuffer(buff), name + " argument is not a buffer");
        $fxX3C$assert(buff.length === size, name + " has not the expected size: found " + buff.length + ", expected " + size);
    };
    checkBuffer("version", $094cbc4a51127ca7$var$HDPrivateKey.VersionSize);
    checkBuffer("depth", $094cbc4a51127ca7$var$HDPrivateKey.DepthSize);
    checkBuffer("parentFingerPrint", $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintSize);
    checkBuffer("childIndex", $094cbc4a51127ca7$var$HDPrivateKey.ChildIndexSize);
    checkBuffer("chainCode", $094cbc4a51127ca7$var$HDPrivateKey.ChainCodeSize);
    checkBuffer("privateKey", $094cbc4a51127ca7$var$HDPrivateKey.PrivateKeySize);
    if (arg.checksum && arg.checksum.length) checkBuffer("checksum", $094cbc4a51127ca7$var$HDPrivateKey.CheckSumSize);
};
/**
 * Returns the string representation of this private key (a string starting
 * with "xprv..."
 *
 * @return string
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.toString = function() {
    return this.xprivkey;
};
/**
 * Returns the console representation of this extended private key.
 * @return string
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.inspect = function() {
    return "<HDPrivateKey: " + this.xprivkey + ">";
};
/**
 * Returns a plain object with a representation of this private key.
 *
 * Fields include:<ul>
 * <li> network: either 'livenet' or 'testnet'
 * <li> depth: a number ranging from 0 to 255
 * <li> fingerPrint: a number ranging from 0 to 2^32-1, taken from the hash of the
 * <li>     associated public key
 * <li> parentFingerPrint: a number ranging from 0 to 2^32-1, taken from the hash
 * <li>     of this parent's associated public key or zero.
 * <li> childIndex: the index from which this child was derived (or zero)
 * <li> chainCode: an hexa string representing a number used in the derivation
 * <li> privateKey: the private key associated, in hexa representation
 * <li> xprivkey: the representation of this extended private key in checksum
 * <li>     base58 format
 * <li> checksum: the base58 checksum of xprivkey
 * </ul>
 *  @return {Object}
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.toObject = $094cbc4a51127ca7$var$HDPrivateKey.prototype.toJSON = function toObject() {
    return {
        network: $92x2d.get(this._buffers.version.readUInt32BE(0), "xprivkey").name,
        depth: this._buffers.depth[0],
        fingerPrint: this.fingerPrint.readUInt32BE(0),
        parentFingerPrint: this._buffers.parentFingerPrint.readUInt32BE(0),
        childIndex: this._buffers.childIndex.readUInt32BE(0),
        chainCode: this._buffers.chainCode.toString("hex"),
        privateKey: this.privateKey.toBuffer().toString("hex"),
        checksum: this._buffers.checksum.readUInt32BE(0),
        xprivkey: this.xprivkey
    };
};
/**
 * Build a HDPrivateKey from a buffer
 *
 * @param {Buffer} arg
 * @return {HDPrivateKey}
 */ $094cbc4a51127ca7$var$HDPrivateKey.fromBuffer = function(buf) {
    return new $094cbc4a51127ca7$var$HDPrivateKey(buf.toString());
};
/**
 * Build a HDPrivateKey from a hex string
 *
 * @param {string} hex
 * @return {HDPrivateKey}
 */ $094cbc4a51127ca7$var$HDPrivateKey.fromHex = function(hex) {
    return $094cbc4a51127ca7$var$HDPrivateKey.fromBuffer(Buffer.from(hex, "hex"));
};
/**
 * Returns a buffer representation of the HDPrivateKey
 *
 * @return {string}
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.toBuffer = function() {
    return Buffer.from(this.toString());
};
/**
 * Returns a hex string representation of the HDPrivateKey
 *
 * @return {string}
 */ $094cbc4a51127ca7$var$HDPrivateKey.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
$094cbc4a51127ca7$var$HDPrivateKey.DefaultDepth = 0;
$094cbc4a51127ca7$var$HDPrivateKey.DefaultFingerprint = 0;
$094cbc4a51127ca7$var$HDPrivateKey.DefaultChildIndex = 0;
$094cbc4a51127ca7$var$HDPrivateKey.Hardened = 0x80000000;
$094cbc4a51127ca7$var$HDPrivateKey.MaxIndex = 2 * $094cbc4a51127ca7$var$HDPrivateKey.Hardened;
$094cbc4a51127ca7$var$HDPrivateKey.RootElementAlias = [
    "m",
    "M",
    "m'",
    "M'"
];
$094cbc4a51127ca7$var$HDPrivateKey.VersionSize = 4;
$094cbc4a51127ca7$var$HDPrivateKey.DepthSize = 1;
$094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintSize = 4;
$094cbc4a51127ca7$var$HDPrivateKey.ChildIndexSize = 4;
$094cbc4a51127ca7$var$HDPrivateKey.ChainCodeSize = 32;
$094cbc4a51127ca7$var$HDPrivateKey.PrivateKeySize = 32;
$094cbc4a51127ca7$var$HDPrivateKey.CheckSumSize = 4;
$094cbc4a51127ca7$var$HDPrivateKey.DataLength = 78;
$094cbc4a51127ca7$var$HDPrivateKey.SerializedByteSize = 82;
$094cbc4a51127ca7$var$HDPrivateKey.VersionStart = 0;
$094cbc4a51127ca7$var$HDPrivateKey.VersionEnd = $094cbc4a51127ca7$var$HDPrivateKey.VersionStart + $094cbc4a51127ca7$var$HDPrivateKey.VersionSize;
$094cbc4a51127ca7$var$HDPrivateKey.DepthStart = $094cbc4a51127ca7$var$HDPrivateKey.VersionEnd;
$094cbc4a51127ca7$var$HDPrivateKey.DepthEnd = $094cbc4a51127ca7$var$HDPrivateKey.DepthStart + $094cbc4a51127ca7$var$HDPrivateKey.DepthSize;
$094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintStart = $094cbc4a51127ca7$var$HDPrivateKey.DepthEnd;
$094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintEnd = $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintStart + $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintSize;
$094cbc4a51127ca7$var$HDPrivateKey.ChildIndexStart = $094cbc4a51127ca7$var$HDPrivateKey.ParentFingerPrintEnd;
$094cbc4a51127ca7$var$HDPrivateKey.ChildIndexEnd = $094cbc4a51127ca7$var$HDPrivateKey.ChildIndexStart + $094cbc4a51127ca7$var$HDPrivateKey.ChildIndexSize;
$094cbc4a51127ca7$var$HDPrivateKey.ChainCodeStart = $094cbc4a51127ca7$var$HDPrivateKey.ChildIndexEnd;
$094cbc4a51127ca7$var$HDPrivateKey.ChainCodeEnd = $094cbc4a51127ca7$var$HDPrivateKey.ChainCodeStart + $094cbc4a51127ca7$var$HDPrivateKey.ChainCodeSize;
$094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyStart = $094cbc4a51127ca7$var$HDPrivateKey.ChainCodeEnd + 1;
$094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyEnd = $094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyStart + $094cbc4a51127ca7$var$HDPrivateKey.PrivateKeySize;
$094cbc4a51127ca7$var$HDPrivateKey.ChecksumStart = $094cbc4a51127ca7$var$HDPrivateKey.PrivateKeyEnd;
$094cbc4a51127ca7$var$HDPrivateKey.ChecksumEnd = $094cbc4a51127ca7$var$HDPrivateKey.ChecksumStart + $094cbc4a51127ca7$var$HDPrivateKey.CheckSumSize;
$fxX3C$assert($094cbc4a51127ca7$var$HDPrivateKey.ChecksumEnd === $094cbc4a51127ca7$var$HDPrivateKey.SerializedByteSize);
module.exports = $094cbc4a51127ca7$var$HDPrivateKey;

});
parcelRegister("iFSyP", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $e34gf = parcelRequire("e34gf");

var $lM2TS = parcelRequire("lM2TS");

var $6BAsE = parcelRequire("6BAsE");

var $9AjNa = parcelRequire("9AjNa");

var $aScoK = parcelRequire("aScoK");

var $Nv8ZS = parcelRequire("Nv8ZS");

var $92x2d = parcelRequire("92x2d");

var $japbZ = parcelRequire("japbZ");

var $hbQdz = parcelRequire("hbQdz");

var $lOQ1c = parcelRequire("lOQ1c");
var $d98660fbcc06a655$var$errors = $lOQ1c;
var $d98660fbcc06a655$var$hdErrors = $lOQ1c.HDPublicKey;


var $bbk3w = parcelRequire("bbk3w");
/**
 * The representation of an hierarchically derived public key.
 *
 * See https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 *
 * @constructor
 * @param {Object|string|Buffer} arg
 */ function $d98660fbcc06a655$var$HDPublicKey(arg) {
    if (arg instanceof $d98660fbcc06a655$var$HDPublicKey) return arg;
    if (!(this instanceof $d98660fbcc06a655$var$HDPublicKey)) return new $d98660fbcc06a655$var$HDPublicKey(arg);
    if (arg) {
        if ($iUxHD.isString(arg) || Buffer.isBuffer(arg)) {
            var error = $d98660fbcc06a655$var$HDPublicKey.getSerializedError(arg);
            if (!error) return this._buildFromSerialized(arg);
            else if (Buffer.isBuffer(arg) && !$d98660fbcc06a655$var$HDPublicKey.getSerializedError(arg.toString())) return this._buildFromSerialized(arg.toString());
            else {
                if (error instanceof $d98660fbcc06a655$var$hdErrors.ArgumentIsPrivateExtended) return new $Nv8ZS(arg).hdPublicKey;
                throw error;
            }
        } else {
            if ($iUxHD.isObject(arg)) {
                if (arg instanceof $Nv8ZS) return this._buildFromPrivate(arg);
                else return this._buildFromObject(arg);
            } else throw new $d98660fbcc06a655$var$hdErrors.UnrecognizedArgument(arg);
        }
    } else throw new $d98660fbcc06a655$var$hdErrors.MustSupplyArgument();
}
$d98660fbcc06a655$var$HDPublicKey.fromHDPrivateKey = function(hdPrivateKey) {
    return new $d98660fbcc06a655$var$HDPublicKey(hdPrivateKey);
};
/**
 * Verifies that a given path is valid.
 *
 * @param {string|number} arg
 * @return {boolean}
 */ $d98660fbcc06a655$var$HDPublicKey.isValidPath = function(arg) {
    if ($iUxHD.isString(arg)) {
        var indexes = $Nv8ZS._getDerivationIndexes(arg);
        return indexes !== null && $iUxHD.every(indexes, $d98660fbcc06a655$var$HDPublicKey.isValidPath);
    }
    if ($iUxHD.isNumber(arg)) return arg >= 0 && arg < $d98660fbcc06a655$var$HDPublicKey.Hardened;
    return false;
};
/**
 * WARNING: This method is deprecated. Use deriveChild instead.
 *
 *
 * Get a derivated child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same public key), "m/0/1/40/2/1000".
 *
 * Note that hardened keys can't be derived from a public extended key.
 *
 * If the first argument is a number, the child with that index will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPublicKey('xpub...');
 * var child_0_1_2 = parent.derive(0).derive(1).derive(2);
 * var copy_of_child_0_1_2 = parent.derive("m/0/1/2");
 * assert(child_0_1_2.xprivkey === copy_of_child_0_1_2);
 * ```
 *
 * @param {string|number} arg
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.derive = function() {
    throw new Error("derive has been deprecated. use deriveChild or, for the old way, deriveNonCompliantChild.");
};
/**
 * WARNING: This method will not be officially supported until v1.0.0.
 *
 *
 * Get a derivated child based on a string or number.
 *
 * If the first argument is a string, it's parsed as the full path of
 * derivation. Valid values for this argument include "m" (which returns the
 * same public key), "m/0/1/40/2/1000".
 *
 * Note that hardened keys can't be derived from a public extended key.
 *
 * If the first argument is a number, the child with that index will be
 * derived. See the example usage for clarification.
 *
 * @example
 * ```javascript
 * var parent = new HDPublicKey('xpub...');
 * var child_0_1_2 = parent.deriveChild(0).deriveChild(1).deriveChild(2);
 * var copy_of_child_0_1_2 = parent.deriveChild("m/0/1/2");
 * assert(child_0_1_2.xprivkey === copy_of_child_0_1_2);
 * ```
 *
 * @param {string|number} arg
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.deriveChild = function(arg, hardened) {
    if ($iUxHD.isNumber(arg)) return this._deriveWithNumber(arg, hardened);
    else if ($iUxHD.isString(arg)) return this._deriveFromString(arg);
    else throw new $d98660fbcc06a655$var$hdErrors.InvalidDerivationArgument(arg);
};
$d98660fbcc06a655$var$HDPublicKey.prototype._deriveWithNumber = function(index, hardened) {
    if (index >= $d98660fbcc06a655$var$HDPublicKey.Hardened || hardened) throw new $d98660fbcc06a655$var$hdErrors.InvalidIndexCantDeriveHardened();
    if (index < 0) throw new $d98660fbcc06a655$var$hdErrors.InvalidPath(index);
    var indexBuffer = $bbk3w.integerAsBuffer(index);
    var data = Buffer.concat([
        this.publicKey.toBuffer(),
        indexBuffer
    ]);
    var hash = $aScoK.sha512hmac(data, this._buffers.chainCode);
    var leftPart = $lM2TS.fromBuffer(hash.slice(0, 32), {
        size: 32
    });
    var chainCode = hash.slice(32, 64);
    var publicKey;
    try {
        publicKey = $hbQdz.fromPoint($japbZ.getG().mul(leftPart).add(this.publicKey.point));
    } catch (e) {
        return this._deriveWithNumber(index + 1);
    }
    var derived = new $d98660fbcc06a655$var$HDPublicKey({
        network: this.network,
        depth: this.depth + 1,
        parentFingerPrint: this.fingerPrint,
        childIndex: index,
        chainCode: chainCode,
        publicKey: publicKey
    });
    return derived;
};
$d98660fbcc06a655$var$HDPublicKey.prototype._deriveFromString = function(path) {
    if ($iUxHD.includes(path, "'")) throw new $d98660fbcc06a655$var$hdErrors.InvalidIndexCantDeriveHardened();
    else if (!$d98660fbcc06a655$var$HDPublicKey.isValidPath(path)) throw new $d98660fbcc06a655$var$hdErrors.InvalidPath(path);
    var indexes = $Nv8ZS._getDerivationIndexes(path);
    var derived = indexes.reduce(function(prev, index) {
        return prev._deriveWithNumber(index);
    }, this);
    return derived;
};
/**
 * Verifies that a given serialized public key in base58 with checksum format
 * is valid.
 *
 * @param {string|Buffer} data - the serialized public key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {boolean}
 */ $d98660fbcc06a655$var$HDPublicKey.isValidSerialized = function(data, network) {
    return $iUxHD.isNull($d98660fbcc06a655$var$HDPublicKey.getSerializedError(data, network));
};
/**
 * Checks what's the error that causes the validation of a serialized public key
 * in base58 with checksum to fail.
 *
 * @param {string|Buffer} data - the serialized public key
 * @param {string|Network=} network - optional, if present, checks that the
 *     network provided matches the network serialized.
 * @return {errors|null}
 */ $d98660fbcc06a655$var$HDPublicKey.getSerializedError = function(data, network) {
    if (!($iUxHD.isString(data) || Buffer.isBuffer(data))) return new $d98660fbcc06a655$var$hdErrors.UnrecognizedArgument("expected buffer or string");
    if (!$6BAsE.validCharacters(data)) return new $d98660fbcc06a655$var$errors.InvalidB58Char("(unknown)", data);
    try {
        data = $9AjNa.decode(data);
    } catch (e) {
        return new $d98660fbcc06a655$var$errors.InvalidB58Checksum(data);
    }
    if (data.length !== $d98660fbcc06a655$var$HDPublicKey.DataSize) return new $d98660fbcc06a655$var$hdErrors.InvalidLength(data);
    if (!$iUxHD.isUndefined(network)) {
        var error = $d98660fbcc06a655$var$HDPublicKey._validateNetwork(data, network);
        if (error) return error;
    }
    var version = data.readUInt32BE(0);
    if (version === $92x2d.livenet.xprivkey || version === $92x2d.testnet.xprivkey) return new $d98660fbcc06a655$var$hdErrors.ArgumentIsPrivateExtended();
    return null;
};
$d98660fbcc06a655$var$HDPublicKey._validateNetwork = function(data, networkArg) {
    var network = $92x2d.get(networkArg);
    if (!network) return new $d98660fbcc06a655$var$errors.InvalidNetworkArgument(networkArg);
    var version = data.slice($d98660fbcc06a655$var$HDPublicKey.VersionStart, $d98660fbcc06a655$var$HDPublicKey.VersionEnd);
    if (version.readUInt32BE(0) !== network.xpubkey) return new $d98660fbcc06a655$var$errors.InvalidNetwork(version);
    return null;
};
$d98660fbcc06a655$var$HDPublicKey.prototype._buildFromPrivate = function(arg) {
    var args = $iUxHD.clone(arg._buffers);
    var point = $japbZ.getG().mul($lM2TS.fromBuffer(args.privateKey));
    args.publicKey = $japbZ.pointToCompressed(point);
    args.version = $bbk3w.integerAsBuffer($92x2d.get(args.version.readUInt32BE(0)).xpubkey);
    args.privateKey = undefined;
    args.checksum = undefined;
    args.xprivkey = undefined;
    return this._buildFromBuffers(args);
};
$d98660fbcc06a655$var$HDPublicKey.prototype._buildFromObject = function(arg) {
    // TODO: Type validation
    var buffers = {
        version: arg.network ? $bbk3w.integerAsBuffer($92x2d.get(arg.network).xpubkey) : arg.version,
        depth: $iUxHD.isNumber(arg.depth) ? Buffer.from([
            arg.depth & 0xff
        ]) : arg.depth,
        parentFingerPrint: $iUxHD.isNumber(arg.parentFingerPrint) ? $bbk3w.integerAsBuffer(arg.parentFingerPrint) : arg.parentFingerPrint,
        childIndex: $iUxHD.isNumber(arg.childIndex) ? $bbk3w.integerAsBuffer(arg.childIndex) : arg.childIndex,
        chainCode: $iUxHD.isString(arg.chainCode) ? Buffer.from(arg.chainCode, "hex") : arg.chainCode,
        publicKey: $iUxHD.isString(arg.publicKey) ? Buffer.from(arg.publicKey, "hex") : Buffer.isBuffer(arg.publicKey) ? arg.publicKey : arg.publicKey.toBuffer(),
        checksum: $iUxHD.isNumber(arg.checksum) ? $bbk3w.integerAsBuffer(arg.checksum) : arg.checksum
    };
    return this._buildFromBuffers(buffers);
};
$d98660fbcc06a655$var$HDPublicKey.prototype._buildFromSerialized = function(arg) {
    var decoded = $9AjNa.decode(arg);
    var buffers = {
        version: decoded.slice($d98660fbcc06a655$var$HDPublicKey.VersionStart, $d98660fbcc06a655$var$HDPublicKey.VersionEnd),
        depth: decoded.slice($d98660fbcc06a655$var$HDPublicKey.DepthStart, $d98660fbcc06a655$var$HDPublicKey.DepthEnd),
        parentFingerPrint: decoded.slice($d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintStart, $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintEnd),
        childIndex: decoded.slice($d98660fbcc06a655$var$HDPublicKey.ChildIndexStart, $d98660fbcc06a655$var$HDPublicKey.ChildIndexEnd),
        chainCode: decoded.slice($d98660fbcc06a655$var$HDPublicKey.ChainCodeStart, $d98660fbcc06a655$var$HDPublicKey.ChainCodeEnd),
        publicKey: decoded.slice($d98660fbcc06a655$var$HDPublicKey.PublicKeyStart, $d98660fbcc06a655$var$HDPublicKey.PublicKeyEnd),
        checksum: decoded.slice($d98660fbcc06a655$var$HDPublicKey.ChecksumStart, $d98660fbcc06a655$var$HDPublicKey.ChecksumEnd),
        xpubkey: arg
    };
    return this._buildFromBuffers(buffers);
};
/**
 * Receives a object with buffers in all the properties and populates the
 * internal structure
 *
 * @param {Object} arg
 * @param {buffer.Buffer} arg.version
 * @param {buffer.Buffer} arg.depth
 * @param {buffer.Buffer} arg.parentFingerPrint
 * @param {buffer.Buffer} arg.childIndex
 * @param {buffer.Buffer} arg.chainCode
 * @param {buffer.Buffer} arg.publicKey
 * @param {buffer.Buffer} arg.checksum
 * @param {string=} arg.xpubkey - if set, don't recalculate the base58
 *      representation
 * @return {HDPublicKey} this
 */ $d98660fbcc06a655$var$HDPublicKey.prototype._buildFromBuffers = function(arg) {
    $d98660fbcc06a655$var$HDPublicKey._validateBufferArguments(arg);
    $bbk3w.defineImmutable(this, {
        _buffers: arg
    });
    var sequence = [
        arg.version,
        arg.depth,
        arg.parentFingerPrint,
        arg.childIndex,
        arg.chainCode,
        arg.publicKey
    ];
    var concat = Buffer.concat(sequence);
    var checksum = $9AjNa.checksum(concat);
    if (!arg.checksum || !arg.checksum.length) arg.checksum = checksum;
    else {
        if (arg.checksum.toString("hex") !== checksum.toString("hex")) throw new $d98660fbcc06a655$var$errors.InvalidB58Checksum(concat, checksum);
    }
    var network = $92x2d.get(arg.version.readUInt32BE(0));
    var xpubkey;
    xpubkey = $9AjNa.encode(Buffer.concat(sequence));
    arg.xpubkey = Buffer.from(xpubkey);
    var publicKey = new $hbQdz(arg.publicKey, {
        network: network
    });
    var size = $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintSize;
    var fingerPrint = $aScoK.sha256ripemd160(publicKey.toBuffer()).slice(0, size);
    $bbk3w.defineImmutable(this, {
        xpubkey: xpubkey,
        network: network,
        depth: arg.depth[0],
        publicKey: publicKey,
        fingerPrint: fingerPrint
    });
    return this;
};
$d98660fbcc06a655$var$HDPublicKey._validateBufferArguments = function(arg) {
    var checkBuffer = function(name, size) {
        var buff = arg[name];
        $fxX3C$assert(Buffer.isBuffer(buff), name + " argument is not a buffer, it's " + typeof buff);
        $fxX3C$assert(buff.length === size, name + " has not the expected size: found " + buff.length + ", expected " + size);
    };
    checkBuffer("version", $d98660fbcc06a655$var$HDPublicKey.VersionSize);
    checkBuffer("depth", $d98660fbcc06a655$var$HDPublicKey.DepthSize);
    checkBuffer("parentFingerPrint", $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintSize);
    checkBuffer("childIndex", $d98660fbcc06a655$var$HDPublicKey.ChildIndexSize);
    checkBuffer("chainCode", $d98660fbcc06a655$var$HDPublicKey.ChainCodeSize);
    checkBuffer("publicKey", $d98660fbcc06a655$var$HDPublicKey.PublicKeySize);
    if (arg.checksum && arg.checksum.length) checkBuffer("checksum", $d98660fbcc06a655$var$HDPublicKey.CheckSumSize);
};
$d98660fbcc06a655$var$HDPublicKey.fromString = function(arg) {
    $e34gf.checkArgument($iUxHD.isString(arg), "No valid string was provided");
    return new $d98660fbcc06a655$var$HDPublicKey(arg);
};
$d98660fbcc06a655$var$HDPublicKey.fromObject = function(arg) {
    $e34gf.checkArgument($iUxHD.isObject(arg), "No valid argument was provided");
    return new $d98660fbcc06a655$var$HDPublicKey(arg);
};
/**
 * Returns the base58 checked representation of the public key
 * @return {string} a string starting with "xpub..." in livenet
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.toString = function() {
    return this.xpubkey;
};
/**
 * Returns the console representation of this extended public key.
 * @return string
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.inspect = function() {
    return "<HDPublicKey: " + this.xpubkey + ">";
};
/**
 * Returns a plain JavaScript object with information to reconstruct a key.
 *
 * Fields are: <ul>
 *  <li> network: 'livenet' or 'testnet'
 *  <li> depth: a number from 0 to 255, the depth to the master extended key
 *  <li> fingerPrint: a number of 32 bits taken from the hash of the public key
 *  <li> fingerPrint: a number of 32 bits taken from the hash of this key's
 *  <li>     parent's public key
 *  <li> childIndex: index with which this key was derived
 *  <li> chainCode: string in hexa encoding used for derivation
 *  <li> publicKey: string, hexa encoded, in compressed key format
 *  <li> checksum: this._buffers.checksum.readUInt32BE(0),
 *  <li> xpubkey: the string with the base58 representation of this extended key
 *  <li> checksum: the base58 checksum of xpubkey
 * </ul>
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.toObject = $d98660fbcc06a655$var$HDPublicKey.prototype.toJSON = function toObject() {
    return {
        network: $92x2d.get(this._buffers.version.readUInt32BE(0)).name,
        depth: this._buffers.depth[0],
        fingerPrint: this.fingerPrint.readUInt32BE(0),
        parentFingerPrint: this._buffers.parentFingerPrint.readUInt32BE(0),
        childIndex: this._buffers.childIndex.readUInt32BE(0),
        chainCode: this._buffers.chainCode.toString("hex"),
        publicKey: this.publicKey.toString(),
        checksum: this._buffers.checksum.readUInt32BE(0),
        xpubkey: this.xpubkey
    };
};
/**
 * Create a HDPublicKey from a buffer argument
 *
 * @param {Buffer} arg
 * @return {HDPublicKey}
 */ $d98660fbcc06a655$var$HDPublicKey.fromBuffer = function(arg) {
    return new $d98660fbcc06a655$var$HDPublicKey(arg);
};
/**
 * Create a HDPublicKey from a hex string argument
 *
 * @param {Buffer} arg
 * @return {HDPublicKey}
 */ $d98660fbcc06a655$var$HDPublicKey.fromHex = function(hex) {
    return $d98660fbcc06a655$var$HDPublicKey.fromBuffer(Buffer.from(hex, "hex"));
};
/**
 * Return a buffer representation of the xpubkey
 *
 * @return {Buffer}
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.toBuffer = function() {
    return Buffer.from(this._buffers.xpubkey);
};
/**
 * Return a hex string representation of the xpubkey
 *
 * @return {Buffer}
 */ $d98660fbcc06a655$var$HDPublicKey.prototype.toHex = function() {
    return this.toBuffer().toString("hex");
};
$d98660fbcc06a655$var$HDPublicKey.Hardened = 0x80000000;
$d98660fbcc06a655$var$HDPublicKey.RootElementAlias = [
    "m",
    "M"
];
$d98660fbcc06a655$var$HDPublicKey.VersionSize = 4;
$d98660fbcc06a655$var$HDPublicKey.DepthSize = 1;
$d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintSize = 4;
$d98660fbcc06a655$var$HDPublicKey.ChildIndexSize = 4;
$d98660fbcc06a655$var$HDPublicKey.ChainCodeSize = 32;
$d98660fbcc06a655$var$HDPublicKey.PublicKeySize = 33;
$d98660fbcc06a655$var$HDPublicKey.CheckSumSize = 4;
$d98660fbcc06a655$var$HDPublicKey.DataSize = 78;
$d98660fbcc06a655$var$HDPublicKey.SerializedByteSize = 82;
$d98660fbcc06a655$var$HDPublicKey.VersionStart = 0;
$d98660fbcc06a655$var$HDPublicKey.VersionEnd = $d98660fbcc06a655$var$HDPublicKey.VersionStart + $d98660fbcc06a655$var$HDPublicKey.VersionSize;
$d98660fbcc06a655$var$HDPublicKey.DepthStart = $d98660fbcc06a655$var$HDPublicKey.VersionEnd;
$d98660fbcc06a655$var$HDPublicKey.DepthEnd = $d98660fbcc06a655$var$HDPublicKey.DepthStart + $d98660fbcc06a655$var$HDPublicKey.DepthSize;
$d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintStart = $d98660fbcc06a655$var$HDPublicKey.DepthEnd;
$d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintEnd = $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintStart + $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintSize;
$d98660fbcc06a655$var$HDPublicKey.ChildIndexStart = $d98660fbcc06a655$var$HDPublicKey.ParentFingerPrintEnd;
$d98660fbcc06a655$var$HDPublicKey.ChildIndexEnd = $d98660fbcc06a655$var$HDPublicKey.ChildIndexStart + $d98660fbcc06a655$var$HDPublicKey.ChildIndexSize;
$d98660fbcc06a655$var$HDPublicKey.ChainCodeStart = $d98660fbcc06a655$var$HDPublicKey.ChildIndexEnd;
$d98660fbcc06a655$var$HDPublicKey.ChainCodeEnd = $d98660fbcc06a655$var$HDPublicKey.ChainCodeStart + $d98660fbcc06a655$var$HDPublicKey.ChainCodeSize;
$d98660fbcc06a655$var$HDPublicKey.PublicKeyStart = $d98660fbcc06a655$var$HDPublicKey.ChainCodeEnd;
$d98660fbcc06a655$var$HDPublicKey.PublicKeyEnd = $d98660fbcc06a655$var$HDPublicKey.PublicKeyStart + $d98660fbcc06a655$var$HDPublicKey.PublicKeySize;
$d98660fbcc06a655$var$HDPublicKey.ChecksumStart = $d98660fbcc06a655$var$HDPublicKey.PublicKeyEnd;
$d98660fbcc06a655$var$HDPublicKey.ChecksumEnd = $d98660fbcc06a655$var$HDPublicKey.ChecksumStart + $d98660fbcc06a655$var$HDPublicKey.CheckSumSize;
$fxX3C$assert($d98660fbcc06a655$var$HDPublicKey.PublicKeyEnd === $d98660fbcc06a655$var$HDPublicKey.DataSize);
$fxX3C$assert($d98660fbcc06a655$var$HDPublicKey.ChecksumEnd === $d98660fbcc06a655$var$HDPublicKey.SerializedByteSize);
module.exports = $d98660fbcc06a655$var$HDPublicKey;

});


parcelRegister("891M9", function(module, exports) {

module.exports = (parcelRequire("g8Ob1"));

});
parcelRegister("g8Ob1", function(module, exports) {
"use strict";

var $hbQdz = parcelRequire("hbQdz");

var $eB3ON = parcelRequire("eB3ON");

var $aScoK = parcelRequire("aScoK");

var $e34gf = parcelRequire("e34gf");

var $9T8Cc = parcelRequire("9T8Cc");

var $lOQ1c = parcelRequire("lOQ1c");

var $bc0450c7dce6ddbc$var$CBC = $fxX3C$aesjs.ModeOfOperation.cbc;
var $bc0450c7dce6ddbc$var$AESCBC = function AESCBC() {};
$bc0450c7dce6ddbc$var$AESCBC.encrypt = function(messagebuf, keybuf, ivbuf) {
    $e34gf.checkArgument(messagebuf);
    $e34gf.checkArgument(keybuf);
    $e34gf.checkArgument(ivbuf);
    $e34gf.checkArgument(keybuf.length === 16, "keybuf length must be 16");
    $e34gf.checkArgument(ivbuf.length === 16, "ivbuf length must be 16");
    messagebuf = $fxX3C$aesjs.padding.pkcs7.pad(messagebuf);
    var aesCbc = new $bc0450c7dce6ddbc$var$CBC(keybuf, ivbuf);
    var encryptedBytes = aesCbc.encrypt(messagebuf);
    return Buffer.from(encryptedBytes);
};
$bc0450c7dce6ddbc$var$AESCBC.decrypt = function(encbuf, keybuf, ivbuf) {
    $e34gf.checkArgument(encbuf);
    $e34gf.checkArgument(keybuf);
    $e34gf.checkArgument(ivbuf);
    $e34gf.checkArgument(keybuf.length === 16, "keybuf length must be 16");
    $e34gf.checkArgument(ivbuf.length === 16, "ivbuf length must be 16");
    var aesCbc = new $bc0450c7dce6ddbc$var$CBC(keybuf, ivbuf);
    var decryptedBytes = aesCbc.decrypt(encbuf);
    return Buffer.from($fxX3C$aesjs.padding.pkcs7.strip(decryptedBytes));
};
// Electrum BIE1 ECIES
// Difference from Original Bitcore ECIES:
//  BIE1:
//      1.Secret S is compressed P(33 bytes), while Bitcore's Secret is Px(32 bytes). See ivkEkM.
//      2.use AES-128-CBC instead of AES-256-CBC.
//      3.IV is retrived from first 16 bytes of Hashed Secret Buffer. See iv
//      4.key Encryption(kE) is retrived from 17-32 bytes of Hashed Secret Buffer, instead of 1-32 bytes. See kE
//      5.a magic word 'BIE1' is used to identify message type.
//      6.ephemeral key is introduced, so you can encrypt messages only with public key.
//      7.HMAC is whole message.
//  Notice:
//      Electrum does not support shortTag nor noKey
//      Do NOT use those 2 options if you are to send a message to Electrum
//      Encrypted message is NOT recoverable if you use ephemeral key
//  Security:
//
// Default algorithm is set to BIE1, however original Bitcore ECIES is still preserved.
var $bc0450c7dce6ddbc$var$ECIES = function ECIES(opts, algorithm = "BIE1") {
    if (algorithm !== "BIE1") throw new $lOQ1c.ECIES.UnsupportAlgorithm(algorithm);
    if (!(this instanceof ECIES)) return new ECIES(opts, algorithm);
    // use ephemeral key if privateKey is not set.
    this._privateKey = new $eB3ON();
    this.opts = opts || {};
    this.opts.ephemeralKey = true;
};
$bc0450c7dce6ddbc$var$ECIES.prototype.privateKey = function(privateKey) {
    $e34gf.checkArgument($eB3ON.isValid(privateKey), "no private key provided");
    this._privateKey = $eB3ON(privateKey.toHex()) || null;
    this.opts.ephemeralKey = false;
    return this;
};
$bc0450c7dce6ddbc$var$ECIES.prototype.publicKey = function(publicKey) {
    $e34gf.checkArgument($hbQdz.isValid(publicKey), "no public key provided");
    this._publicKey = $hbQdz(publicKey.toString()) || null;
    if (this._publicKey != null) this.opts.fixedPublicKey = true;
    return this;
};
var $bc0450c7dce6ddbc$var$defineProperty = function(name, getter) {
    var cachedName = "_" + name;
    Object.defineProperty($bc0450c7dce6ddbc$var$ECIES.prototype, name, {
        configurable: false,
        enumerable: true,
        get: function() {
            var value = this[cachedName];
            value = this[cachedName] = getter.apply(this);
            return value;
        }
    });
};
$bc0450c7dce6ddbc$var$defineProperty("Rbuf", function() {
    return this._privateKey.publicKey.toDER(true);
});
$bc0450c7dce6ddbc$var$defineProperty("ivkEkM", function() {
    var r = this._privateKey.bn;
    var KB = this._publicKey.point;
    var P = KB.mul(r);
    var S = $hbQdz(P);
    var Sbuf = S.toBuffer();
    return $aScoK.sha512(Sbuf);
});
$bc0450c7dce6ddbc$var$defineProperty("iv", function() {
    return this.ivkEkM.slice(0, 16);
});
$bc0450c7dce6ddbc$var$defineProperty("kE", function() {
    return this.ivkEkM.slice(16, 32);
});
$bc0450c7dce6ddbc$var$defineProperty("kM", function() {
    return this.ivkEkM.slice(32, 64);
});
// Encrypts the message (String or Buffer).
$bc0450c7dce6ddbc$var$ECIES.prototype.encrypt = function(message) {
    if (!Buffer.isBuffer(message)) message = Buffer.from(message);
    var ciphertext = $bc0450c7dce6ddbc$var$AESCBC.encrypt(message, this.kE, this.iv);
    var encbuf;
    var BIE1 = Buffer.from("BIE1");
    if (this.opts.noKey && !this.opts.ephemeralKey) encbuf = Buffer.concat([
        BIE1,
        ciphertext
    ]);
    else encbuf = Buffer.concat([
        BIE1,
        this.Rbuf,
        ciphertext
    ]);
    var hmac = $aScoK.sha256hmac(encbuf, this.kM);
    if (this.opts.shortTag) hmac = hmac.slice(0, 4);
    return Buffer.concat([
        encbuf,
        hmac
    ]);
};
$bc0450c7dce6ddbc$var$ECIES.prototype.decrypt = function(encbuf) {
    $e34gf.checkArgument(Buffer.isBuffer(encbuf), "ciphetext must be a buffer");
    var tagLength = 32;
    var offset = 4;
    if (this.opts.shortTag) tagLength = 4;
    var magic = encbuf.slice(0, 4);
    if (!magic.equals(Buffer.from("BIE1"))) throw new $lOQ1c.DecryptionError("Invalid Magic");
    if (!this.opts.noKey) {
        var pub;
        // BIE1 use compressed public key, length is always 33.
        pub = encbuf.slice(4, 37);
        if (this.opts.fixedPublicKey) console.log('Notice: Overriding PublicKey in message. Consider use "noKey" option if you are not sending message to electrum and do not want to use ephemeral key');
        else this._publicKey = $hbQdz.fromDER(pub);
        offset = 37;
    }
    var ciphertext = encbuf.slice(offset, encbuf.length - tagLength);
    var hmac = encbuf.slice(encbuf.length - tagLength, encbuf.length);
    var hmac2 = $aScoK.sha256hmac(encbuf.slice(0, encbuf.length - tagLength), this.kM);
    if (this.opts.shortTag) hmac2 = hmac2.slice(0, 4);
    if (!hmac.equals(hmac2)) throw new $lOQ1c.ECIES.DecryptionError("Invalid checksum");
    return $bc0450c7dce6ddbc$var$AESCBC.decrypt(ciphertext, this.kE, this.iv);
};
$bc0450c7dce6ddbc$var$ECIES.bitcoreECIES = $9T8Cc;
module.exports = $bc0450c7dce6ddbc$var$ECIES;

});
parcelRegister("9T8Cc", function(module, exports) {
"use strict";

var $hbQdz = parcelRequire("hbQdz");

var $aScoK = parcelRequire("aScoK");

var $e34gf = parcelRequire("e34gf");

var $732feee610bfae31$var$CBC = $fxX3C$aesjs.ModeOfOperation.cbc;

var $b3rcQ = parcelRequire("b3rcQ");
var $732feee610bfae31$var$AESCBC = function AESCBC() {};
$732feee610bfae31$var$AESCBC.encrypt = function(messagebuf, cipherkeybuf, ivbuf) {
    $e34gf.checkArgument(messagebuf);
    $e34gf.checkArgument(cipherkeybuf);
    $e34gf.checkArgument(ivbuf);
    ivbuf = ivbuf || $b3rcQ.getRandomBuffer(16);
    messagebuf = $fxX3C$aesjs.padding.pkcs7.pad(messagebuf);
    var aesCbc = new $732feee610bfae31$var$CBC(cipherkeybuf, ivbuf);
    var ctbuf = aesCbc.encrypt(messagebuf);
    var encbuf = Buffer.concat([
        ivbuf,
        ctbuf
    ]);
    return encbuf;
};
$732feee610bfae31$var$AESCBC.decrypt = function(encbuf, cipherkeybuf) {
    $e34gf.checkArgument(encbuf);
    $e34gf.checkArgument(cipherkeybuf);
    var ivbuf = encbuf.slice(0, 16);
    var ctbuf = encbuf.slice(16);
    var aesCbc = new $732feee610bfae31$var$CBC(cipherkeybuf, ivbuf);
    var messagebuf = aesCbc.decrypt(ctbuf);
    messagebuf = $fxX3C$aesjs.padding.pkcs7.strip(messagebuf);
    return Buffer.from(messagebuf);
};
// http://en.wikipedia.org/wiki/Integrated_Encryption_Scheme
var $732feee610bfae31$var$ECIES = function ECIES(opts) {
    if (!(this instanceof ECIES)) return new ECIES();
    this.opts = opts || {};
};
$732feee610bfae31$var$ECIES.prototype.privateKey = function(privateKey) {
    $e34gf.checkArgument(privateKey, "no private key provided");
    this._privateKey = privateKey || null;
    return this;
};
$732feee610bfae31$var$ECIES.prototype.publicKey = function(publicKey) {
    $e34gf.checkArgument(publicKey, "no public key provided");
    this._publicKey = publicKey || null;
    return this;
};
var $732feee610bfae31$var$cachedProperty = function(name, getter) {
    var cachedName = "_" + name;
    Object.defineProperty($732feee610bfae31$var$ECIES.prototype, name, {
        configurable: false,
        enumerable: true,
        get: function() {
            var value = this[cachedName];
            if (!value) value = this[cachedName] = getter.apply(this);
            return value;
        }
    });
};
$732feee610bfae31$var$cachedProperty("Rbuf", function() {
    return this._privateKey.publicKey.toDER(true);
});
$732feee610bfae31$var$cachedProperty("kEkM", function() {
    var r = this._privateKey.bn;
    var KB = this._publicKey.point;
    var P = KB.mul(r);
    var S = P.getX();
    var Sbuf = S.toBuffer({
        size: 32
    });
    return $aScoK.sha512(Sbuf);
});
$732feee610bfae31$var$cachedProperty("kE", function() {
    return this.kEkM.slice(0, 32);
});
$732feee610bfae31$var$cachedProperty("kM", function() {
    return this.kEkM.slice(32, 64);
});
// Encrypts the message (String or Buffer).
// Optional `ivbuf` contains 16-byte Buffer to be used in AES-CBC.
// By default, `ivbuf` is computed deterministically from message and private key using HMAC-SHA256.
// Deterministic IV enables end-to-end test vectors for alternative implementations.
// Note that identical messages have identical ciphertexts. If your protocol does not include some
// kind of a sequence identifier inside the message *and* it is important to not allow attacker to learn
// that message is repeated, then you should use custom IV.
// For random IV, pass `Random.getRandomBuffer(16)` for the second argument.
$732feee610bfae31$var$ECIES.prototype.encrypt = function(message, ivbuf) {
    if (!Buffer.isBuffer(message)) message = Buffer.from(message);
    if (ivbuf === undefined) ivbuf = $aScoK.sha256hmac(message, this._privateKey.toBuffer()).slice(0, 16);
    var c = $732feee610bfae31$var$AESCBC.encrypt(message, this.kE, ivbuf);
    var d = $aScoK.sha256hmac(c, this.kM);
    if (this.opts.shortTag) d = d.slice(0, 4);
    var encbuf;
    if (this.opts.noKey) encbuf = Buffer.concat([
        c,
        d
    ]);
    else encbuf = Buffer.concat([
        this.Rbuf,
        c,
        d
    ]);
    return encbuf;
};
$732feee610bfae31$var$ECIES.prototype.decrypt = function(encbuf) {
    $e34gf.checkArgument(encbuf);
    var offset = 0;
    var tagLength = 32;
    if (this.opts.shortTag) tagLength = 4;
    if (!this.opts.noKey) {
        var pub;
        switch(encbuf[0]){
            case 4:
                pub = encbuf.slice(0, 65);
                break;
            case 3:
            case 2:
                pub = encbuf.slice(0, 33);
                break;
            default:
                throw new Error("Invalid type: " + encbuf[0]);
        }
        this._publicKey = $hbQdz.fromDER(pub);
        offset += pub.length;
    }
    var c = encbuf.slice(offset, encbuf.length - tagLength);
    var d = encbuf.slice(encbuf.length - tagLength, encbuf.length);
    var d2 = $aScoK.sha256hmac(c, this.kM);
    if (this.opts.shortTag) d2 = d2.slice(0, 4);
    var equal = true;
    for(var i = 0; i < d.length; i++)equal &= d[i] === d2[i];
    if (!equal) throw new Error("Invalid checksum");
    return $732feee610bfae31$var$AESCBC.decrypt(c, this.kE);
};
module.exports = $732feee610bfae31$var$ECIES;

});



parcelRegister("hVM3U", function(module, exports) {
"use strict";

var $iUxHD = parcelRequire("iUxHD");

var $eB3ON = parcelRequire("eB3ON");

var $hbQdz = parcelRequire("hbQdz");

var $dOZs9 = parcelRequire("dOZs9");

var $fvPTe = parcelRequire("fvPTe");

var $2p5rz = parcelRequire("2p5rz");

var $km2cb = parcelRequire("km2cb");

var $aScoK = parcelRequire("aScoK");
var $d0dd0aa41b8e67cd$require$sha256sha256 = $aScoK.sha256sha256;

var $bbk3w = parcelRequire("bbk3w");

var $e34gf = parcelRequire("e34gf");
/**
 * constructs a new message to sign and verify.
 *
 * @param {String} message
 * @returns {Message}
 */ var $d0dd0aa41b8e67cd$var$Message = function Message(message) {
    if (!(this instanceof Message)) return new Message(message);
    $e34gf.checkArgument($iUxHD.isString(message) || Buffer.isBuffer(message), "First argument should be a string or Buffer");
    if ($iUxHD.isString(message)) this.messageBuffer = Buffer.from(message);
    if (Buffer.isBuffer(message)) this.messageBuffer = message;
    return this;
};
$d0dd0aa41b8e67cd$var$Message.sign = function(message, privateKey) {
    return new $d0dd0aa41b8e67cd$var$Message(message).sign(privateKey);
};
$d0dd0aa41b8e67cd$var$Message.verify = function(message, address, signature) {
    return new $d0dd0aa41b8e67cd$var$Message(message).verify(address, signature);
};
$d0dd0aa41b8e67cd$var$Message.MAGIC_BYTES = Buffer.from("Bitcoin Signed Message:\n");
$d0dd0aa41b8e67cd$var$Message.prototype.magicHash = function magicHash() {
    var prefix1 = $fvPTe.varintBufNum($d0dd0aa41b8e67cd$var$Message.MAGIC_BYTES.length);
    var prefix2 = $fvPTe.varintBufNum(this.messageBuffer.length);
    var buf = Buffer.concat([
        prefix1,
        $d0dd0aa41b8e67cd$var$Message.MAGIC_BYTES,
        prefix2,
        this.messageBuffer
    ]);
    var hash = $d0dd0aa41b8e67cd$require$sha256sha256(buf);
    return hash;
};
$d0dd0aa41b8e67cd$var$Message.prototype._sign = function _sign(privateKey) {
    $e34gf.checkArgument(privateKey instanceof $eB3ON, "First argument should be an instance of PrivateKey");
    var hash = this.magicHash();
    return $2p5rz.signWithCalcI(hash, privateKey);
};
/**
 * Will sign a message with a given bitcoin private key.
 *
 * @param {PrivateKey} privateKey - An instance of PrivateKey
 * @returns {String} A base64 encoded compact signature
 */ $d0dd0aa41b8e67cd$var$Message.prototype.sign = function sign(privateKey) {
    var signature = this._sign(privateKey);
    return signature.toCompact().toString("base64");
};
$d0dd0aa41b8e67cd$var$Message.prototype._verify = function _verify(publicKey, signature) {
    $e34gf.checkArgument(publicKey instanceof $hbQdz, "First argument should be an instance of PublicKey");
    $e34gf.checkArgument(signature instanceof $km2cb, "Second argument should be an instance of Signature");
    var hash = this.magicHash();
    var verified = $2p5rz.verify(hash, signature, publicKey);
    if (!verified) this.error = "The signature was invalid";
    return verified;
};
/**
 * Will return a boolean of the signature is valid for a given bitcoin address.
 * If it isn't the specific reason is accessible via the "error" member.
 *
 * @param {Address|String} bitcoinAddress - A bitcoin address
 * @param {String} signatureString - A base64 encoded compact signature
 * @returns {Boolean}
 */ $d0dd0aa41b8e67cd$var$Message.prototype.verify = function verify(bitcoinAddress, signatureString) {
    $e34gf.checkArgument(bitcoinAddress);
    $e34gf.checkArgument(signatureString && $iUxHD.isString(signatureString));
    if ($iUxHD.isString(bitcoinAddress)) bitcoinAddress = $dOZs9.fromString(bitcoinAddress);
    var signature = $km2cb.fromCompact(Buffer.from(signatureString, "base64"));
    // recover the public key
    var ecdsa = new $2p5rz();
    ecdsa.hashbuf = this.magicHash();
    ecdsa.sig = signature;
    var publicKey = ecdsa.toPublicKey();
    var signatureAddress = $dOZs9.fromPublicKey(publicKey, bitcoinAddress.network);
    // check that the recovered address and specified address match
    if (bitcoinAddress.toString() !== signatureAddress.toString()) {
        this.error = "The signature did not match the message digest";
        return false;
    }
    return this._verify(publicKey, signature);
};
/**
 * Instantiate a message from a message string
 *
 * @param {String} str - A string of the message
 * @returns {Message} A new instance of a Message
 */ $d0dd0aa41b8e67cd$var$Message.fromString = function(str) {
    return new $d0dd0aa41b8e67cd$var$Message(str);
};
/**
 * Instantiate a message from JSON
 *
 * @param {String} json - An JSON string or Object with keys: message
 * @returns {Message} A new instance of a Message
 */ $d0dd0aa41b8e67cd$var$Message.fromJSON = function fromJSON(json) {
    if ($bbk3w.isValidJSON(json)) json = JSON.parse(json);
    return $d0dd0aa41b8e67cd$var$Message.fromObject(json);
};
/**
 * @returns {Object} A plain object with the message information
 */ $d0dd0aa41b8e67cd$var$Message.prototype.toObject = function toObject() {
    return {
        messageHex: this.messageBuffer.toString("hex")
    };
};
$d0dd0aa41b8e67cd$var$Message.fromObject = function(obj) {
    let messageBuffer = Buffer.from(obj.messageHex, "hex");
    return new $d0dd0aa41b8e67cd$var$Message(messageBuffer);
};
/**
 * @returns {String} A JSON representation of the message information
 */ $d0dd0aa41b8e67cd$var$Message.prototype.toJSON = function toJSON() {
    return JSON.stringify(this.toObject());
};
/**
 * Will return a the string representation of the message
 *
 * @returns {String} Message
 */ $d0dd0aa41b8e67cd$var$Message.prototype.toString = function() {
    return this.messageBuffer.toString();
};
/**
 * Will return a string formatted for the console
 *
 * @returns {String} Message
 */ $d0dd0aa41b8e67cd$var$Message.prototype.inspect = function() {
    return "<Message: " + this.toString() + ">";
};
module.exports = $d0dd0aa41b8e67cd$var$Message;

});

parcelRegister("8a4Lk", function(module, exports) {
"use strict";

var $lM2TS = parcelRequire("lM2TS");

var $aScoK = parcelRequire("aScoK");

var $b3rcQ = parcelRequire("b3rcQ");


var $iUxHD = parcelRequire("iUxHD");

var $17pwQ = parcelRequire("17pwQ");

var $lOQ1c = parcelRequire("lOQ1c");

var $e34gf = parcelRequire("e34gf");

var $Nv8ZS = parcelRequire("Nv8ZS");
/**
 * This is an immutable class that represents a BIP39 Mnemonic code.
 * See BIP39 specification for more info: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * A Mnemonic code is a a group of easy to remember words used for the generation
 * of deterministic wallets. A Mnemonic can be used to generate a seed using
 * an optional passphrase, for later generate a HDPrivateKey.
 *
 * @example
 * // generate a random mnemonic
 * var mnemonic = new Mnemonic();
 * var phrase = mnemonic.phrase;
 *
 * // use a different language
 * var mnemonic = new Mnemonic(Mnemonic.Words.SPANISH);
 * var xprivkey = mnemonic.toHDPrivateKey();
 *
 * @param {*=} data - a seed, phrase, or entropy to initialize (can be skipped)
 * @param {Array=} wordlist - the wordlist to generate mnemonics from
 * @returns {Mnemonic} A new instance of Mnemonic
 * @constructor
 */ var $5f12f39b430c5084$var$Mnemonic = function(data, wordlist) {
    if (!(this instanceof $5f12f39b430c5084$var$Mnemonic)) return new $5f12f39b430c5084$var$Mnemonic(data, wordlist);
    if ($iUxHD.isArray(data)) {
        wordlist = data;
        data = null;
    }
    // handle data overloading
    var ent, phrase, seed;
    if (Buffer.isBuffer(data)) seed = data;
    else if ($iUxHD.isString(data)) phrase = $fxX3C$unorm.nfkd(data);
    else if ($iUxHD.isNumber(data)) ent = data;
    else if (data) throw new $lOQ1c.InvalidArgument("data", "Must be a Buffer, a string or an integer");
    ent = ent || 128;
    // check and detect wordlist
    wordlist = wordlist || $5f12f39b430c5084$var$Mnemonic._getDictionary(phrase);
    if (phrase && !wordlist) throw new $lOQ1c.Mnemonic.UnknownWordlist(phrase);
    wordlist = wordlist || $5f12f39b430c5084$var$Mnemonic.Words.ENGLISH;
    if (seed) phrase = $5f12f39b430c5084$var$Mnemonic._entropy2mnemonic(seed, wordlist);
    // validate phrase and ent
    if (phrase && !$5f12f39b430c5084$var$Mnemonic.isValid(phrase, wordlist)) throw new $lOQ1c.Mnemonic.InvalidMnemonic(phrase);
    if (ent % 32 !== 0 || ent < 128) throw new $lOQ1c.InvalidArgument("ENT", "Values must be ENT > 128 and ENT % 32 == 0");
    phrase = phrase || $5f12f39b430c5084$var$Mnemonic._mnemonic(ent, wordlist);
    Object.defineProperty(this, "wordlist", {
        configurable: false,
        value: wordlist
    });
    Object.defineProperty(this, "phrase", {
        configurable: false,
        value: phrase
    });
};
$5f12f39b430c5084$var$Mnemonic.fromRandom = function(wordlist = $5f12f39b430c5084$var$Mnemonic.Words.ENGLISH) {
    return new $5f12f39b430c5084$var$Mnemonic(wordlist);
};
$5f12f39b430c5084$var$Mnemonic.fromString = function(mnemonic, wordlist = $5f12f39b430c5084$var$Mnemonic.Words.ENGLISH) {
    return new $5f12f39b430c5084$var$Mnemonic(mnemonic, wordlist);
};

$5f12f39b430c5084$var$Mnemonic.Words = (parcelRequire("6LlJH"));
/**
 * Will return a boolean if the mnemonic is valid
 *
 * @example
 *
 * var valid = Mnemonic.isValid('lab rescue lunch elbow recall phrase perfect donkey biology guess moment husband');
 * // true
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} [wordlist] - The wordlist used
 * @returns {boolean}
 */ $5f12f39b430c5084$var$Mnemonic.isValid = function(mnemonic, wordlist) {
    mnemonic = $fxX3C$unorm.nfkd(mnemonic);
    wordlist = wordlist || $5f12f39b430c5084$var$Mnemonic._getDictionary(mnemonic);
    if (!wordlist) return false;
    var words = mnemonic.split(" ");
    var bin = "";
    for(var i = 0; i < words.length; i++){
        var ind = wordlist.indexOf(words[i]);
        if (ind < 0) return false;
        bin = bin + ("00000000000" + ind.toString(2)).slice(-11);
    }
    var cs = bin.length / 33;
    var hashBits = bin.slice(-cs);
    var nonhashBits = bin.slice(0, bin.length - cs);
    var buf = Buffer.alloc(nonhashBits.length / 8);
    for(i = 0; i < nonhashBits.length / 8; i++)buf.writeUInt8(parseInt(bin.slice(i * 8, (i + 1) * 8), 2), i);
    var expectedHashBits = $5f12f39b430c5084$var$Mnemonic._entropyChecksum(buf);
    return expectedHashBits === hashBits;
};
/**
 * Internal function to check if a mnemonic belongs to a wordlist.
 *
 * @param {String} mnemonic - The mnemonic string
 * @param {String} wordlist - The wordlist
 * @returns {boolean}
 */ $5f12f39b430c5084$var$Mnemonic._belongsToWordlist = function(mnemonic, wordlist) {
    var words = $fxX3C$unorm.nfkd(mnemonic).split(" ");
    for(var i = 0; i < words.length; i++){
        var ind = wordlist.indexOf(words[i]);
        if (ind < 0) return false;
    }
    return true;
};
/**
 * Internal function to detect the wordlist used to generate the mnemonic.
 *
 * @param {String} mnemonic - The mnemonic string
 * @returns {Array} the wordlist or null
 */ $5f12f39b430c5084$var$Mnemonic._getDictionary = function(mnemonic) {
    if (!mnemonic) return null;
    var dicts = Object.keys($5f12f39b430c5084$var$Mnemonic.Words);
    for(var i = 0; i < dicts.length; i++){
        var key = dicts[i];
        if ($5f12f39b430c5084$var$Mnemonic._belongsToWordlist(mnemonic, $5f12f39b430c5084$var$Mnemonic.Words[key])) return $5f12f39b430c5084$var$Mnemonic.Words[key];
    }
    return null;
};
/**
 * Will generate a seed based on the mnemonic and optional passphrase. Note that
 * this seed is absolutely NOT the seed that is output by .toSeed(). These are
 * two different seeds. The seed you want to put in here, if any, is just some
 * random byte string. Normally you should rely on the .fromRandom() method.
 *
 * @param {String} [passphrase]
 * @returns {Buffer}
 */ $5f12f39b430c5084$var$Mnemonic.prototype.toSeed = function(passphrase) {
    passphrase = passphrase || "";
    return $17pwQ($fxX3C$unorm.nfkd(this.phrase), $fxX3C$unorm.nfkd("mnemonic" + passphrase), 2048, 64);
};
/**
 * Will generate a Mnemonic object based on a seed.
 *
 * @param {Buffer} [seed]
 * @param {string} [wordlist]
 * @returns {Mnemonic}
 */ $5f12f39b430c5084$var$Mnemonic.fromSeed = function(seed, wordlist) {
    $e34gf.checkArgument(Buffer.isBuffer(seed), "seed must be a Buffer.");
    $e34gf.checkArgument($iUxHD.isArray(wordlist) || $iUxHD.isString(wordlist), "wordlist must be a string or an array.");
    return new $5f12f39b430c5084$var$Mnemonic(seed, wordlist);
};
/**
 *
 * Generates a HD Private Key from a Mnemonic.
 * Optionally receive a passphrase and bitcoin network.
 *
 * @param {String=} [passphrase]
 * @param {Network|String|number=} [network] - The network: 'livenet' or 'testnet'
 * @returns {HDPrivateKey}
 */ $5f12f39b430c5084$var$Mnemonic.prototype.toHDPrivateKey = function(passphrase, network) {
    var seed = this.toSeed(passphrase);
    return $Nv8ZS.fromSeed(seed, network);
};
/**
 * Will return a the string representation of the mnemonic
 *
 * @returns {String} Mnemonic
 */ $5f12f39b430c5084$var$Mnemonic.prototype.toString = function() {
    return this.phrase;
};
/**
 * Will return a string formatted for the console
 *
 * @returns {String} Mnemonic
 */ $5f12f39b430c5084$var$Mnemonic.prototype.inspect = function() {
    return "<Mnemonic: " + this.toString() + " >";
};
/**
 * Internal function to generate a random mnemonic
 *
 * @param {Number} ENT - Entropy size, defaults to 128
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */ $5f12f39b430c5084$var$Mnemonic._mnemonic = function(ENT, wordlist) {
    var buf = $b3rcQ.getRandomBuffer(ENT / 8);
    return $5f12f39b430c5084$var$Mnemonic._entropy2mnemonic(buf, wordlist);
};
/**
 * Internal function to generate mnemonic based on entropy
 *
 * @param {Number} entropy - Entropy buffer
 * @param {Array} wordlist - Array of words to generate the mnemonic
 * @returns {String} Mnemonic string
 */ $5f12f39b430c5084$var$Mnemonic._entropy2mnemonic = function(entropy, wordlist) {
    var bin = "";
    for(var i = 0; i < entropy.length; i++)bin = bin + ("00000000" + entropy[i].toString(2)).slice(-8);
    bin = bin + $5f12f39b430c5084$var$Mnemonic._entropyChecksum(entropy);
    if (bin.length % 11 !== 0) throw new $lOQ1c.InvalidEntropy(bin);
    var mnemonic = [];
    for(i = 0; i < bin.length / 11; i++){
        var wi = parseInt(bin.slice(i * 11, (i + 1) * 11), 2);
        mnemonic.push(wordlist[wi]);
    }
    var ret;
    if (wordlist === $5f12f39b430c5084$var$Mnemonic.Words.JAPANESE) ret = mnemonic.join("\u3000");
    else ret = mnemonic.join(" ");
    return ret;
};
/**
 * Internal function to create checksum of entropy
 *
 * @param entropy
 * @returns {string} Checksum of entropy length / 32
 * @private
 */ $5f12f39b430c5084$var$Mnemonic._entropyChecksum = function(entropy) {
    var hash = $aScoK.sha256(entropy);
    var bits = entropy.length * 8;
    var cs = bits / 32;
    var hashbits = new $lM2TS(hash.toString("hex"), 16).toString(2);
    // zero pad the hash bits
    while(hashbits.length % 256 !== 0)hashbits = "0" + hashbits;
    var checksum = hashbits.slice(0, cs);
    return checksum;
};
module.exports = $5f12f39b430c5084$var$Mnemonic;

});
parcelRegister("17pwQ", function(module, exports) {


if (process.browser) module.exports = (parcelRequire("epcUs"));
else module.exports = (parcelRequire("8vLCX"));

});
parcelRegister("epcUs", function(module, exports) {
"use strict";

/**
 * PDKBF2
 * Credit to: https://github.com/stayradiated/pbkdf2-sha512
 * Copyright (c) 2014, JP Richardson Copyright (c) 2010-2011 Intalio Pte, All Rights Reserved
 */ function $a7cd6a1799466bc7$var$pbkdf2(key, salt, iterations, dkLen) {
    var hLen = 64 // SHA512 Mac length
    ;
    if (dkLen > (Math.pow(2, 32) - 1) * hLen) throw Error("Requested key length too long");
    if (typeof key !== "string" && !Buffer.isBuffer(key)) throw new TypeError("key must a string or Buffer");
    if (typeof salt !== "string" && !Buffer.isBuffer(salt)) throw new TypeError("salt must a string or Buffer");
    if (typeof key === "string") key = Buffer.from(key);
    if (typeof salt === "string") salt = Buffer.from(salt);
    var DK = Buffer.alloc(dkLen);
    var U = Buffer.alloc(hLen);
    var T = Buffer.alloc(hLen);
    var block1 = Buffer.alloc(salt.length + 4);
    var l = Math.ceil(dkLen / hLen);
    var r = dkLen - (l - 1) * hLen;
    salt.copy(block1, 0, 0, salt.length);
    for(var i = 1; i <= l; i++){
        block1[salt.length + 0] = i >> 24 & 0xff;
        block1[salt.length + 1] = i >> 16 & 0xff;
        block1[salt.length + 2] = i >> 8 & 0xff;
        block1[salt.length + 3] = i >> 0 & 0xff;
        U = $fxX3C$hashjs.hmac($fxX3C$hashjs.sha512, key).update(block1).digest();
        U.copy(T, 0, 0, hLen);
        for(var j = 1; j < iterations; j++){
            U = $fxX3C$hashjs.hmac($fxX3C$hashjs.sha512, key).update(U).digest();
            for(var k = 0; k < hLen; k++)T[k] ^= U[k];
        }
        var destPos = (i - 1) * hLen;
        var len = i === l ? r : hLen;
        T.copy(DK, destPos, 0, len);
    }
    return DK;
}
module.exports = $a7cd6a1799466bc7$var$pbkdf2;

});

parcelRegister("8vLCX", function(module, exports) {
"use strict";

/**
 * PDKBF2
 * Credit to: https://github.com/stayradiated/pbkdf2-sha512
 * Copyright (c) 2014, JP Richardson Copyright (c) 2010-2011 Intalio Pte, All Rights Reserved
 */ function $632629c62c2f80c4$var$pbkdf2(key, salt, iterations, dkLen) {
    var hLen = 64 // SHA512 Mac length
    ;
    if (dkLen > (Math.pow(2, 32) - 1) * hLen) throw Error("Requested key length too long");
    if (typeof key !== "string" && !Buffer.isBuffer(key)) throw new TypeError("key must a string or Buffer");
    if (typeof salt !== "string" && !Buffer.isBuffer(salt)) throw new TypeError("salt must a string or Buffer");
    if (typeof key === "string") key = Buffer.from(key);
    if (typeof salt === "string") salt = Buffer.from(salt);
    var DK = Buffer.alloc(dkLen);
    var U = Buffer.alloc(hLen);
    var T = Buffer.alloc(hLen);
    var block1 = Buffer.alloc(salt.length + 4);
    var l = Math.ceil(dkLen / hLen);
    var r = dkLen - (l - 1) * hLen;
    salt.copy(block1, 0, 0, salt.length);
    for(var i = 1; i <= l; i++){
        block1[salt.length + 0] = i >> 24 & 0xff;
        block1[salt.length + 1] = i >> 16 & 0xff;
        block1[salt.length + 2] = i >> 8 & 0xff;
        block1[salt.length + 3] = i >> 0 & 0xff;
        U = $fxX3C$crypto.createHmac("sha512", key).update(block1).digest();
        U.copy(T, 0, 0, hLen);
        for(var j = 1; j < iterations; j++){
            U = $fxX3C$crypto.createHmac("sha512", key).update(U).digest();
            for(var k = 0; k < hLen; k++)T[k] ^= U[k];
        }
        var destPos = (i - 1) * hLen;
        var len = i === l ? r : hLen;
        T.copy(DK, destPos, 0, len);
    }
    return DK;
}
module.exports = $632629c62c2f80c4$var$pbkdf2;

});


parcelRegister("6LlJH", function(module, exports) {






module.exports = {
    "CHINESE": (parcelRequire("5Syfg")),
    "ENGLISH": (parcelRequire("l029f")),
    "FRENCH": (parcelRequire("gLqNu")),
    "ITALIAN": (parcelRequire("2OnXB")),
    "JAPANESE": (parcelRequire("ivIla")),
    "SPANISH": (parcelRequire("fRsoT"))
};

});
parcelRegister("5Syfg", function(module, exports) {
"use strict";
var $447c8f4d39a5fa15$var$chinese = [
    "\u7684",
    "\u4E00",
    "\u662F",
    "\u5728",
    "\u4E0D",
    "\u4E86",
    "\u6709",
    "\u548C",
    "\u4EBA",
    "\u8FD9",
    "\u4E2D",
    "\u5927",
    "\u4E3A",
    "\u4E0A",
    "\u4E2A",
    "\u56FD",
    "\u6211",
    "\u4EE5",
    "\u8981",
    "\u4ED6",
    "\u65F6",
    "\u6765",
    "\u7528",
    "\u4EEC",
    "\u751F",
    "\u5230",
    "\u4F5C",
    "\u5730",
    "\u4E8E",
    "\u51FA",
    "\u5C31",
    "\u5206",
    "\u5BF9",
    "\u6210",
    "\u4F1A",
    "\u53EF",
    "\u4E3B",
    "\u53D1",
    "\u5E74",
    "\u52A8",
    "\u540C",
    "\u5DE5",
    "\u4E5F",
    "\u80FD",
    "\u4E0B",
    "\u8FC7",
    "\u5B50",
    "\u8BF4",
    "\u4EA7",
    "\u79CD",
    "\u9762",
    "\u800C",
    "\u65B9",
    "\u540E",
    "\u591A",
    "\u5B9A",
    "\u884C",
    "\u5B66",
    "\u6CD5",
    "\u6240",
    "\u6C11",
    "\u5F97",
    "\u7ECF",
    "\u5341",
    "\u4E09",
    "\u4E4B",
    "\u8FDB",
    "\u7740",
    "\u7B49",
    "\u90E8",
    "\u5EA6",
    "\u5BB6",
    "\u7535",
    "\u529B",
    "\u91CC",
    "\u5982",
    "\u6C34",
    "\u5316",
    "\u9AD8",
    "\u81EA",
    "\u4E8C",
    "\u7406",
    "\u8D77",
    "\u5C0F",
    "\u7269",
    "\u73B0",
    "\u5B9E",
    "\u52A0",
    "\u91CF",
    "\u90FD",
    "\u4E24",
    "\u4F53",
    "\u5236",
    "\u673A",
    "\u5F53",
    "\u4F7F",
    "\u70B9",
    "\u4ECE",
    "\u4E1A",
    "\u672C",
    "\u53BB",
    "\u628A",
    "\u6027",
    "\u597D",
    "\u5E94",
    "\u5F00",
    "\u5B83",
    "\u5408",
    "\u8FD8",
    "\u56E0",
    "\u7531",
    "\u5176",
    "\u4E9B",
    "\u7136",
    "\u524D",
    "\u5916",
    "\u5929",
    "\u653F",
    "\u56DB",
    "\u65E5",
    "\u90A3",
    "\u793E",
    "\u4E49",
    "\u4E8B",
    "\u5E73",
    "\u5F62",
    "\u76F8",
    "\u5168",
    "\u8868",
    "\u95F4",
    "\u6837",
    "\u4E0E",
    "\u5173",
    "\u5404",
    "\u91CD",
    "\u65B0",
    "\u7EBF",
    "\u5185",
    "\u6570",
    "\u6B63",
    "\u5FC3",
    "\u53CD",
    "\u4F60",
    "\u660E",
    "\u770B",
    "\u539F",
    "\u53C8",
    "\u4E48",
    "\u5229",
    "\u6BD4",
    "\u6216",
    "\u4F46",
    "\u8D28",
    "\u6C14",
    "\u7B2C",
    "\u5411",
    "\u9053",
    "\u547D",
    "\u6B64",
    "\u53D8",
    "\u6761",
    "\u53EA",
    "\u6CA1",
    "\u7ED3",
    "\u89E3",
    "\u95EE",
    "\u610F",
    "\u5EFA",
    "\u6708",
    "\u516C",
    "\u65E0",
    "\u7CFB",
    "\u519B",
    "\u5F88",
    "\u60C5",
    "\u8005",
    "\u6700",
    "\u7ACB",
    "\u4EE3",
    "\u60F3",
    "\u5DF2",
    "\u901A",
    "\u5E76",
    "\u63D0",
    "\u76F4",
    "\u9898",
    "\u515A",
    "\u7A0B",
    "\u5C55",
    "\u4E94",
    "\u679C",
    "\u6599",
    "\u8C61",
    "\u5458",
    "\u9769",
    "\u4F4D",
    "\u5165",
    "\u5E38",
    "\u6587",
    "\u603B",
    "\u6B21",
    "\u54C1",
    "\u5F0F",
    "\u6D3B",
    "\u8BBE",
    "\u53CA",
    "\u7BA1",
    "\u7279",
    "\u4EF6",
    "\u957F",
    "\u6C42",
    "\u8001",
    "\u5934",
    "\u57FA",
    "\u8D44",
    "\u8FB9",
    "\u6D41",
    "\u8DEF",
    "\u7EA7",
    "\u5C11",
    "\u56FE",
    "\u5C71",
    "\u7EDF",
    "\u63A5",
    "\u77E5",
    "\u8F83",
    "\u5C06",
    "\u7EC4",
    "\u89C1",
    "\u8BA1",
    "\u522B",
    "\u5979",
    "\u624B",
    "\u89D2",
    "\u671F",
    "\u6839",
    "\u8BBA",
    "\u8FD0",
    "\u519C",
    "\u6307",
    "\u51E0",
    "\u4E5D",
    "\u533A",
    "\u5F3A",
    "\u653E",
    "\u51B3",
    "\u897F",
    "\u88AB",
    "\u5E72",
    "\u505A",
    "\u5FC5",
    "\u6218",
    "\u5148",
    "\u56DE",
    "\u5219",
    "\u4EFB",
    "\u53D6",
    "\u636E",
    "\u5904",
    "\u961F",
    "\u5357",
    "\u7ED9",
    "\u8272",
    "\u5149",
    "\u95E8",
    "\u5373",
    "\u4FDD",
    "\u6CBB",
    "\u5317",
    "\u9020",
    "\u767E",
    "\u89C4",
    "\u70ED",
    "\u9886",
    "\u4E03",
    "\u6D77",
    "\u53E3",
    "\u4E1C",
    "\u5BFC",
    "\u5668",
    "\u538B",
    "\u5FD7",
    "\u4E16",
    "\u91D1",
    "\u589E",
    "\u4E89",
    "\u6D4E",
    "\u9636",
    "\u6CB9",
    "\u601D",
    "\u672F",
    "\u6781",
    "\u4EA4",
    "\u53D7",
    "\u8054",
    "\u4EC0",
    "\u8BA4",
    "\u516D",
    "\u5171",
    "\u6743",
    "\u6536",
    "\u8BC1",
    "\u6539",
    "\u6E05",
    "\u7F8E",
    "\u518D",
    "\u91C7",
    "\u8F6C",
    "\u66F4",
    "\u5355",
    "\u98CE",
    "\u5207",
    "\u6253",
    "\u767D",
    "\u6559",
    "\u901F",
    "\u82B1",
    "\u5E26",
    "\u5B89",
    "\u573A",
    "\u8EAB",
    "\u8F66",
    "\u4F8B",
    "\u771F",
    "\u52A1",
    "\u5177",
    "\u4E07",
    "\u6BCF",
    "\u76EE",
    "\u81F3",
    "\u8FBE",
    "\u8D70",
    "\u79EF",
    "\u793A",
    "\u8BAE",
    "\u58F0",
    "\u62A5",
    "\u6597",
    "\u5B8C",
    "\u7C7B",
    "\u516B",
    "\u79BB",
    "\u534E",
    "\u540D",
    "\u786E",
    "\u624D",
    "\u79D1",
    "\u5F20",
    "\u4FE1",
    "\u9A6C",
    "\u8282",
    "\u8BDD",
    "\u7C73",
    "\u6574",
    "\u7A7A",
    "\u5143",
    "\u51B5",
    "\u4ECA",
    "\u96C6",
    "\u6E29",
    "\u4F20",
    "\u571F",
    "\u8BB8",
    "\u6B65",
    "\u7FA4",
    "\u5E7F",
    "\u77F3",
    "\u8BB0",
    "\u9700",
    "\u6BB5",
    "\u7814",
    "\u754C",
    "\u62C9",
    "\u6797",
    "\u5F8B",
    "\u53EB",
    "\u4E14",
    "\u7A76",
    "\u89C2",
    "\u8D8A",
    "\u7EC7",
    "\u88C5",
    "\u5F71",
    "\u7B97",
    "\u4F4E",
    "\u6301",
    "\u97F3",
    "\u4F17",
    "\u4E66",
    "\u5E03",
    "\u590D",
    "\u5BB9",
    "\u513F",
    "\u987B",
    "\u9645",
    "\u5546",
    "\u975E",
    "\u9A8C",
    "\u8FDE",
    "\u65AD",
    "\u6DF1",
    "\u96BE",
    "\u8FD1",
    "\u77FF",
    "\u5343",
    "\u5468",
    "\u59D4",
    "\u7D20",
    "\u6280",
    "\u5907",
    "\u534A",
    "\u529E",
    "\u9752",
    "\u7701",
    "\u5217",
    "\u4E60",
    "\u54CD",
    "\u7EA6",
    "\u652F",
    "\u822C",
    "\u53F2",
    "\u611F",
    "\u52B3",
    "\u4FBF",
    "\u56E2",
    "\u5F80",
    "\u9178",
    "\u5386",
    "\u5E02",
    "\u514B",
    "\u4F55",
    "\u9664",
    "\u6D88",
    "\u6784",
    "\u5E9C",
    "\u79F0",
    "\u592A",
    "\u51C6",
    "\u7CBE",
    "\u503C",
    "\u53F7",
    "\u7387",
    "\u65CF",
    "\u7EF4",
    "\u5212",
    "\u9009",
    "\u6807",
    "\u5199",
    "\u5B58",
    "\u5019",
    "\u6BDB",
    "\u4EB2",
    "\u5FEB",
    "\u6548",
    "\u65AF",
    "\u9662",
    "\u67E5",
    "\u6C5F",
    "\u578B",
    "\u773C",
    "\u738B",
    "\u6309",
    "\u683C",
    "\u517B",
    "\u6613",
    "\u7F6E",
    "\u6D3E",
    "\u5C42",
    "\u7247",
    "\u59CB",
    "\u5374",
    "\u4E13",
    "\u72B6",
    "\u80B2",
    "\u5382",
    "\u4EAC",
    "\u8BC6",
    "\u9002",
    "\u5C5E",
    "\u5706",
    "\u5305",
    "\u706B",
    "\u4F4F",
    "\u8C03",
    "\u6EE1",
    "\u53BF",
    "\u5C40",
    "\u7167",
    "\u53C2",
    "\u7EA2",
    "\u7EC6",
    "\u5F15",
    "\u542C",
    "\u8BE5",
    "\u94C1",
    "\u4EF7",
    "\u4E25",
    "\u9996",
    "\u5E95",
    "\u6DB2",
    "\u5B98",
    "\u5FB7",
    "\u968F",
    "\u75C5",
    "\u82CF",
    "\u5931",
    "\u5C14",
    "\u6B7B",
    "\u8BB2",
    "\u914D",
    "\u5973",
    "\u9EC4",
    "\u63A8",
    "\u663E",
    "\u8C08",
    "\u7F6A",
    "\u795E",
    "\u827A",
    "\u5462",
    "\u5E2D",
    "\u542B",
    "\u4F01",
    "\u671B",
    "\u5BC6",
    "\u6279",
    "\u8425",
    "\u9879",
    "\u9632",
    "\u4E3E",
    "\u7403",
    "\u82F1",
    "\u6C27",
    "\u52BF",
    "\u544A",
    "\u674E",
    "\u53F0",
    "\u843D",
    "\u6728",
    "\u5E2E",
    "\u8F6E",
    "\u7834",
    "\u4E9A",
    "\u5E08",
    "\u56F4",
    "\u6CE8",
    "\u8FDC",
    "\u5B57",
    "\u6750",
    "\u6392",
    "\u4F9B",
    "\u6CB3",
    "\u6001",
    "\u5C01",
    "\u53E6",
    "\u65BD",
    "\u51CF",
    "\u6811",
    "\u6EB6",
    "\u600E",
    "\u6B62",
    "\u6848",
    "\u8A00",
    "\u58EB",
    "\u5747",
    "\u6B66",
    "\u56FA",
    "\u53F6",
    "\u9C7C",
    "\u6CE2",
    "\u89C6",
    "\u4EC5",
    "\u8D39",
    "\u7D27",
    "\u7231",
    "\u5DE6",
    "\u7AE0",
    "\u65E9",
    "\u671D",
    "\u5BB3",
    "\u7EED",
    "\u8F7B",
    "\u670D",
    "\u8BD5",
    "\u98DF",
    "\u5145",
    "\u5175",
    "\u6E90",
    "\u5224",
    "\u62A4",
    "\u53F8",
    "\u8DB3",
    "\u67D0",
    "\u7EC3",
    "\u5DEE",
    "\u81F4",
    "\u677F",
    "\u7530",
    "\u964D",
    "\u9ED1",
    "\u72AF",
    "\u8D1F",
    "\u51FB",
    "\u8303",
    "\u7EE7",
    "\u5174",
    "\u4F3C",
    "\u4F59",
    "\u575A",
    "\u66F2",
    "\u8F93",
    "\u4FEE",
    "\u6545",
    "\u57CE",
    "\u592B",
    "\u591F",
    "\u9001",
    "\u7B14",
    "\u8239",
    "\u5360",
    "\u53F3",
    "\u8D22",
    "\u5403",
    "\u5BCC",
    "\u6625",
    "\u804C",
    "\u89C9",
    "\u6C49",
    "\u753B",
    "\u529F",
    "\u5DF4",
    "\u8DDF",
    "\u867D",
    "\u6742",
    "\u98DE",
    "\u68C0",
    "\u5438",
    "\u52A9",
    "\u5347",
    "\u9633",
    "\u4E92",
    "\u521D",
    "\u521B",
    "\u6297",
    "\u8003",
    "\u6295",
    "\u574F",
    "\u7B56",
    "\u53E4",
    "\u5F84",
    "\u6362",
    "\u672A",
    "\u8DD1",
    "\u7559",
    "\u94A2",
    "\u66FE",
    "\u7AEF",
    "\u8D23",
    "\u7AD9",
    "\u7B80",
    "\u8FF0",
    "\u94B1",
    "\u526F",
    "\u5C3D",
    "\u5E1D",
    "\u5C04",
    "\u8349",
    "\u51B2",
    "\u627F",
    "\u72EC",
    "\u4EE4",
    "\u9650",
    "\u963F",
    "\u5BA3",
    "\u73AF",
    "\u53CC",
    "\u8BF7",
    "\u8D85",
    "\u5FAE",
    "\u8BA9",
    "\u63A7",
    "\u5DDE",
    "\u826F",
    "\u8F74",
    "\u627E",
    "\u5426",
    "\u7EAA",
    "\u76CA",
    "\u4F9D",
    "\u4F18",
    "\u9876",
    "\u7840",
    "\u8F7D",
    "\u5012",
    "\u623F",
    "\u7A81",
    "\u5750",
    "\u7C89",
    "\u654C",
    "\u7565",
    "\u5BA2",
    "\u8881",
    "\u51B7",
    "\u80DC",
    "\u7EDD",
    "\u6790",
    "\u5757",
    "\u5242",
    "\u6D4B",
    "\u4E1D",
    "\u534F",
    "\u8BC9",
    "\u5FF5",
    "\u9648",
    "\u4ECD",
    "\u7F57",
    "\u76D0",
    "\u53CB",
    "\u6D0B",
    "\u9519",
    "\u82E6",
    "\u591C",
    "\u5211",
    "\u79FB",
    "\u9891",
    "\u9010",
    "\u9760",
    "\u6DF7",
    "\u6BCD",
    "\u77ED",
    "\u76AE",
    "\u7EC8",
    "\u805A",
    "\u6C7D",
    "\u6751",
    "\u4E91",
    "\u54EA",
    "\u65E2",
    "\u8DDD",
    "\u536B",
    "\u505C",
    "\u70C8",
    "\u592E",
    "\u5BDF",
    "\u70E7",
    "\u8FC5",
    "\u5883",
    "\u82E5",
    "\u5370",
    "\u6D32",
    "\u523B",
    "\u62EC",
    "\u6FC0",
    "\u5B54",
    "\u641E",
    "\u751A",
    "\u5BA4",
    "\u5F85",
    "\u6838",
    "\u6821",
    "\u6563",
    "\u4FB5",
    "\u5427",
    "\u7532",
    "\u6E38",
    "\u4E45",
    "\u83DC",
    "\u5473",
    "\u65E7",
    "\u6A21",
    "\u6E56",
    "\u8D27",
    "\u635F",
    "\u9884",
    "\u963B",
    "\u6BEB",
    "\u666E",
    "\u7A33",
    "\u4E59",
    "\u5988",
    "\u690D",
    "\u606F",
    "\u6269",
    "\u94F6",
    "\u8BED",
    "\u6325",
    "\u9152",
    "\u5B88",
    "\u62FF",
    "\u5E8F",
    "\u7EB8",
    "\u533B",
    "\u7F3A",
    "\u96E8",
    "\u5417",
    "\u9488",
    "\u5218",
    "\u554A",
    "\u6025",
    "\u5531",
    "\u8BEF",
    "\u8BAD",
    "\u613F",
    "\u5BA1",
    "\u9644",
    "\u83B7",
    "\u8336",
    "\u9C9C",
    "\u7CAE",
    "\u65A4",
    "\u5B69",
    "\u8131",
    "\u786B",
    "\u80A5",
    "\u5584",
    "\u9F99",
    "\u6F14",
    "\u7236",
    "\u6E10",
    "\u8840",
    "\u6B22",
    "\u68B0",
    "\u638C",
    "\u6B4C",
    "\u6C99",
    "\u521A",
    "\u653B",
    "\u8C13",
    "\u76FE",
    "\u8BA8",
    "\u665A",
    "\u7C92",
    "\u4E71",
    "\u71C3",
    "\u77DB",
    "\u4E4E",
    "\u6740",
    "\u836F",
    "\u5B81",
    "\u9C81",
    "\u8D35",
    "\u949F",
    "\u7164",
    "\u8BFB",
    "\u73ED",
    "\u4F2F",
    "\u9999",
    "\u4ECB",
    "\u8FEB",
    "\u53E5",
    "\u4E30",
    "\u57F9",
    "\u63E1",
    "\u5170",
    "\u62C5",
    "\u5F26",
    "\u86CB",
    "\u6C89",
    "\u5047",
    "\u7A7F",
    "\u6267",
    "\u7B54",
    "\u4E50",
    "\u8C01",
    "\u987A",
    "\u70DF",
    "\u7F29",
    "\u5F81",
    "\u8138",
    "\u559C",
    "\u677E",
    "\u811A",
    "\u56F0",
    "\u5F02",
    "\u514D",
    "\u80CC",
    "\u661F",
    "\u798F",
    "\u4E70",
    "\u67D3",
    "\u4E95",
    "\u6982",
    "\u6162",
    "\u6015",
    "\u78C1",
    "\u500D",
    "\u7956",
    "\u7687",
    "\u4FC3",
    "\u9759",
    "\u8865",
    "\u8BC4",
    "\u7FFB",
    "\u8089",
    "\u8DF5",
    "\u5C3C",
    "\u8863",
    "\u5BBD",
    "\u626C",
    "\u68C9",
    "\u5E0C",
    "\u4F24",
    "\u64CD",
    "\u5782",
    "\u79CB",
    "\u5B9C",
    "\u6C22",
    "\u5957",
    "\u7763",
    "\u632F",
    "\u67B6",
    "\u4EAE",
    "\u672B",
    "\u5BAA",
    "\u5E86",
    "\u7F16",
    "\u725B",
    "\u89E6",
    "\u6620",
    "\u96F7",
    "\u9500",
    "\u8BD7",
    "\u5EA7",
    "\u5C45",
    "\u6293",
    "\u88C2",
    "\u80DE",
    "\u547C",
    "\u5A18",
    "\u666F",
    "\u5A01",
    "\u7EFF",
    "\u6676",
    "\u539A",
    "\u76DF",
    "\u8861",
    "\u9E21",
    "\u5B59",
    "\u5EF6",
    "\u5371",
    "\u80F6",
    "\u5C4B",
    "\u4E61",
    "\u4E34",
    "\u9646",
    "\u987E",
    "\u6389",
    "\u5440",
    "\u706F",
    "\u5C81",
    "\u63AA",
    "\u675F",
    "\u8010",
    "\u5267",
    "\u7389",
    "\u8D75",
    "\u8DF3",
    "\u54E5",
    "\u5B63",
    "\u8BFE",
    "\u51EF",
    "\u80E1",
    "\u989D",
    "\u6B3E",
    "\u7ECD",
    "\u5377",
    "\u9F50",
    "\u4F1F",
    "\u84B8",
    "\u6B96",
    "\u6C38",
    "\u5B97",
    "\u82D7",
    "\u5DDD",
    "\u7089",
    "\u5CA9",
    "\u5F31",
    "\u96F6",
    "\u6768",
    "\u594F",
    "\u6CBF",
    "\u9732",
    "\u6746",
    "\u63A2",
    "\u6ED1",
    "\u9547",
    "\u996D",
    "\u6D53",
    "\u822A",
    "\u6000",
    "\u8D76",
    "\u5E93",
    "\u593A",
    "\u4F0A",
    "\u7075",
    "\u7A0E",
    "\u9014",
    "\u706D",
    "\u8D5B",
    "\u5F52",
    "\u53EC",
    "\u9F13",
    "\u64AD",
    "\u76D8",
    "\u88C1",
    "\u9669",
    "\u5EB7",
    "\u552F",
    "\u5F55",
    "\u83CC",
    "\u7EAF",
    "\u501F",
    "\u7CD6",
    "\u76D6",
    "\u6A2A",
    "\u7B26",
    "\u79C1",
    "\u52AA",
    "\u5802",
    "\u57DF",
    "\u67AA",
    "\u6DA6",
    "\u5E45",
    "\u54C8",
    "\u7ADF",
    "\u719F",
    "\u866B",
    "\u6CFD",
    "\u8111",
    "\u58E4",
    "\u78B3",
    "\u6B27",
    "\u904D",
    "\u4FA7",
    "\u5BE8",
    "\u6562",
    "\u5F7B",
    "\u8651",
    "\u659C",
    "\u8584",
    "\u5EAD",
    "\u7EB3",
    "\u5F39",
    "\u9972",
    "\u4F38",
    "\u6298",
    "\u9EA6",
    "\u6E7F",
    "\u6697",
    "\u8377",
    "\u74E6",
    "\u585E",
    "\u5E8A",
    "\u7B51",
    "\u6076",
    "\u6237",
    "\u8BBF",
    "\u5854",
    "\u5947",
    "\u900F",
    "\u6881",
    "\u5200",
    "\u65CB",
    "\u8FF9",
    "\u5361",
    "\u6C2F",
    "\u9047",
    "\u4EFD",
    "\u6BD2",
    "\u6CE5",
    "\u9000",
    "\u6D17",
    "\u6446",
    "\u7070",
    "\u5F69",
    "\u5356",
    "\u8017",
    "\u590F",
    "\u62E9",
    "\u5FD9",
    "\u94DC",
    "\u732E",
    "\u786C",
    "\u4E88",
    "\u7E41",
    "\u5708",
    "\u96EA",
    "\u51FD",
    "\u4EA6",
    "\u62BD",
    "\u7BC7",
    "\u9635",
    "\u9634",
    "\u4E01",
    "\u5C3A",
    "\u8FFD",
    "\u5806",
    "\u96C4",
    "\u8FCE",
    "\u6CDB",
    "\u7238",
    "\u697C",
    "\u907F",
    "\u8C0B",
    "\u5428",
    "\u91CE",
    "\u732A",
    "\u65D7",
    "\u7D2F",
    "\u504F",
    "\u5178",
    "\u9986",
    "\u7D22",
    "\u79E6",
    "\u8102",
    "\u6F6E",
    "\u7237",
    "\u8C46",
    "\u5FFD",
    "\u6258",
    "\u60CA",
    "\u5851",
    "\u9057",
    "\u6108",
    "\u6731",
    "\u66FF",
    "\u7EA4",
    "\u7C97",
    "\u503E",
    "\u5C1A",
    "\u75DB",
    "\u695A",
    "\u8C22",
    "\u594B",
    "\u8D2D",
    "\u78E8",
    "\u541B",
    "\u6C60",
    "\u65C1",
    "\u788E",
    "\u9AA8",
    "\u76D1",
    "\u6355",
    "\u5F1F",
    "\u66B4",
    "\u5272",
    "\u8D2F",
    "\u6B8A",
    "\u91CA",
    "\u8BCD",
    "\u4EA1",
    "\u58C1",
    "\u987F",
    "\u5B9D",
    "\u5348",
    "\u5C18",
    "\u95FB",
    "\u63ED",
    "\u70AE",
    "\u6B8B",
    "\u51AC",
    "\u6865",
    "\u5987",
    "\u8B66",
    "\u7EFC",
    "\u62DB",
    "\u5434",
    "\u4ED8",
    "\u6D6E",
    "\u906D",
    "\u5F90",
    "\u60A8",
    "\u6447",
    "\u8C37",
    "\u8D5E",
    "\u7BB1",
    "\u9694",
    "\u8BA2",
    "\u7537",
    "\u5439",
    "\u56ED",
    "\u7EB7",
    "\u5510",
    "\u8D25",
    "\u5B8B",
    "\u73BB",
    "\u5DE8",
    "\u8015",
    "\u5766",
    "\u8363",
    "\u95ED",
    "\u6E7E",
    "\u952E",
    "\u51E1",
    "\u9A7B",
    "\u9505",
    "\u6551",
    "\u6069",
    "\u5265",
    "\u51DD",
    "\u78B1",
    "\u9F7F",
    "\u622A",
    "\u70BC",
    "\u9EBB",
    "\u7EBA",
    "\u7981",
    "\u5E9F",
    "\u76DB",
    "\u7248",
    "\u7F13",
    "\u51C0",
    "\u775B",
    "\u660C",
    "\u5A5A",
    "\u6D89",
    "\u7B52",
    "\u5634",
    "\u63D2",
    "\u5CB8",
    "\u6717",
    "\u5E84",
    "\u8857",
    "\u85CF",
    "\u59D1",
    "\u8D38",
    "\u8150",
    "\u5974",
    "\u5566",
    "\u60EF",
    "\u4E58",
    "\u4F19",
    "\u6062",
    "\u5300",
    "\u7EB1",
    "\u624E",
    "\u8FA9",
    "\u8033",
    "\u5F6A",
    "\u81E3",
    "\u4EBF",
    "\u7483",
    "\u62B5",
    "\u8109",
    "\u79C0",
    "\u8428",
    "\u4FC4",
    "\u7F51",
    "\u821E",
    "\u5E97",
    "\u55B7",
    "\u7EB5",
    "\u5BF8",
    "\u6C57",
    "\u6302",
    "\u6D2A",
    "\u8D3A",
    "\u95EA",
    "\u67EC",
    "\u7206",
    "\u70EF",
    "\u6D25",
    "\u7A3B",
    "\u5899",
    "\u8F6F",
    "\u52C7",
    "\u50CF",
    "\u6EDA",
    "\u5398",
    "\u8499",
    "\u82B3",
    "\u80AF",
    "\u5761",
    "\u67F1",
    "\u8361",
    "\u817F",
    "\u4EEA",
    "\u65C5",
    "\u5C3E",
    "\u8F67",
    "\u51B0",
    "\u8D21",
    "\u767B",
    "\u9ECE",
    "\u524A",
    "\u94BB",
    "\u52D2",
    "\u9003",
    "\u969C",
    "\u6C28",
    "\u90ED",
    "\u5CF0",
    "\u5E01",
    "\u6E2F",
    "\u4F0F",
    "\u8F68",
    "\u4EA9",
    "\u6BD5",
    "\u64E6",
    "\u83AB",
    "\u523A",
    "\u6D6A",
    "\u79D8",
    "\u63F4",
    "\u682A",
    "\u5065",
    "\u552E",
    "\u80A1",
    "\u5C9B",
    "\u7518",
    "\u6CE1",
    "\u7761",
    "\u7AE5",
    "\u94F8",
    "\u6C64",
    "\u9600",
    "\u4F11",
    "\u6C47",
    "\u820D",
    "\u7267",
    "\u7ED5",
    "\u70B8",
    "\u54F2",
    "\u78F7",
    "\u7EE9",
    "\u670B",
    "\u6DE1",
    "\u5C16",
    "\u542F",
    "\u9677",
    "\u67F4",
    "\u5448",
    "\u5F92",
    "\u989C",
    "\u6CEA",
    "\u7A0D",
    "\u5FD8",
    "\u6CF5",
    "\u84DD",
    "\u62D6",
    "\u6D1E",
    "\u6388",
    "\u955C",
    "\u8F9B",
    "\u58EE",
    "\u950B",
    "\u8D2B",
    "\u865A",
    "\u5F2F",
    "\u6469",
    "\u6CF0",
    "\u5E7C",
    "\u5EF7",
    "\u5C0A",
    "\u7A97",
    "\u7EB2",
    "\u5F04",
    "\u96B6",
    "\u7591",
    "\u6C0F",
    "\u5BAB",
    "\u59D0",
    "\u9707",
    "\u745E",
    "\u602A",
    "\u5C24",
    "\u7434",
    "\u5FAA",
    "\u63CF",
    "\u819C",
    "\u8FDD",
    "\u5939",
    "\u8170",
    "\u7F18",
    "\u73E0",
    "\u7A77",
    "\u68EE",
    "\u679D",
    "\u7AF9",
    "\u6C9F",
    "\u50AC",
    "\u7EF3",
    "\u5FC6",
    "\u90A6",
    "\u5269",
    "\u5E78",
    "\u6D46",
    "\u680F",
    "\u62E5",
    "\u7259",
    "\u8D2E",
    "\u793C",
    "\u6EE4",
    "\u94A0",
    "\u7EB9",
    "\u7F62",
    "\u62CD",
    "\u54B1",
    "\u558A",
    "\u8896",
    "\u57C3",
    "\u52E4",
    "\u7F5A",
    "\u7126",
    "\u6F5C",
    "\u4F0D",
    "\u58A8",
    "\u6B32",
    "\u7F1D",
    "\u59D3",
    "\u520A",
    "\u9971",
    "\u4EFF",
    "\u5956",
    "\u94DD",
    "\u9B3C",
    "\u4E3D",
    "\u8DE8",
    "\u9ED8",
    "\u6316",
    "\u94FE",
    "\u626B",
    "\u559D",
    "\u888B",
    "\u70AD",
    "\u6C61",
    "\u5E55",
    "\u8BF8",
    "\u5F27",
    "\u52B1",
    "\u6885",
    "\u5976",
    "\u6D01",
    "\u707E",
    "\u821F",
    "\u9274",
    "\u82EF",
    "\u8BBC",
    "\u62B1",
    "\u6BC1",
    "\u61C2",
    "\u5BD2",
    "\u667A",
    "\u57D4",
    "\u5BC4",
    "\u5C4A",
    "\u8DC3",
    "\u6E21",
    "\u6311",
    "\u4E39",
    "\u8270",
    "\u8D1D",
    "\u78B0",
    "\u62D4",
    "\u7239",
    "\u6234",
    "\u7801",
    "\u68A6",
    "\u82BD",
    "\u7194",
    "\u8D64",
    "\u6E14",
    "\u54ED",
    "\u656C",
    "\u9897",
    "\u5954",
    "\u94C5",
    "\u4EF2",
    "\u864E",
    "\u7A00",
    "\u59B9",
    "\u4E4F",
    "\u73CD",
    "\u7533",
    "\u684C",
    "\u9075",
    "\u5141",
    "\u9686",
    "\u87BA",
    "\u4ED3",
    "\u9B4F",
    "\u9510",
    "\u6653",
    "\u6C2E",
    "\u517C",
    "\u9690",
    "\u788D",
    "\u8D6B",
    "\u62E8",
    "\u5FE0",
    "\u8083",
    "\u7F38",
    "\u7275",
    "\u62A2",
    "\u535A",
    "\u5DE7",
    "\u58F3",
    "\u5144",
    "\u675C",
    "\u8BAF",
    "\u8BDA",
    "\u78A7",
    "\u7965",
    "\u67EF",
    "\u9875",
    "\u5DE1",
    "\u77E9",
    "\u60B2",
    "\u704C",
    "\u9F84",
    "\u4F26",
    "\u7968",
    "\u5BFB",
    "\u6842",
    "\u94FA",
    "\u5723",
    "\u6050",
    "\u6070",
    "\u90D1",
    "\u8DA3",
    "\u62AC",
    "\u8352",
    "\u817E",
    "\u8D34",
    "\u67D4",
    "\u6EF4",
    "\u731B",
    "\u9614",
    "\u8F86",
    "\u59BB",
    "\u586B",
    "\u64A4",
    "\u50A8",
    "\u7B7E",
    "\u95F9",
    "\u6270",
    "\u7D2B",
    "\u7802",
    "\u9012",
    "\u620F",
    "\u540A",
    "\u9676",
    "\u4F10",
    "\u5582",
    "\u7597",
    "\u74F6",
    "\u5A46",
    "\u629A",
    "\u81C2",
    "\u6478",
    "\u5FCD",
    "\u867E",
    "\u8721",
    "\u90BB",
    "\u80F8",
    "\u5DE9",
    "\u6324",
    "\u5076",
    "\u5F03",
    "\u69FD",
    "\u52B2",
    "\u4E73",
    "\u9093",
    "\u5409",
    "\u4EC1",
    "\u70C2",
    "\u7816",
    "\u79DF",
    "\u4E4C",
    "\u8230",
    "\u4F34",
    "\u74DC",
    "\u6D45",
    "\u4E19",
    "\u6682",
    "\u71E5",
    "\u6A61",
    "\u67F3",
    "\u8FF7",
    "\u6696",
    "\u724C",
    "\u79E7",
    "\u80C6",
    "\u8BE6",
    "\u7C27",
    "\u8E0F",
    "\u74F7",
    "\u8C31",
    "\u5446",
    "\u5BBE",
    "\u7CCA",
    "\u6D1B",
    "\u8F89",
    "\u6124",
    "\u7ADE",
    "\u9699",
    "\u6012",
    "\u7C98",
    "\u4E43",
    "\u7EEA",
    "\u80A9",
    "\u7C4D",
    "\u654F",
    "\u6D82",
    "\u7199",
    "\u7686",
    "\u4FA6",
    "\u60AC",
    "\u6398",
    "\u4EAB",
    "\u7EA0",
    "\u9192",
    "\u72C2",
    "\u9501",
    "\u6DC0",
    "\u6068",
    "\u7272",
    "\u9738",
    "\u722C",
    "\u8D4F",
    "\u9006",
    "\u73A9",
    "\u9675",
    "\u795D",
    "\u79D2",
    "\u6D59",
    "\u8C8C",
    "\u5F79",
    "\u5F7C",
    "\u6089",
    "\u9E2D",
    "\u8D8B",
    "\u51E4",
    "\u6668",
    "\u755C",
    "\u8F88",
    "\u79E9",
    "\u5375",
    "\u7F72",
    "\u68AF",
    "\u708E",
    "\u6EE9",
    "\u68CB",
    "\u9A71",
    "\u7B5B",
    "\u5CE1",
    "\u5192",
    "\u5565",
    "\u5BFF",
    "\u8BD1",
    "\u6D78",
    "\u6CC9",
    "\u5E3D",
    "\u8FDF",
    "\u7845",
    "\u7586",
    "\u8D37",
    "\u6F0F",
    "\u7A3F",
    "\u51A0",
    "\u5AE9",
    "\u80C1",
    "\u82AF",
    "\u7262",
    "\u53DB",
    "\u8680",
    "\u5965",
    "\u9E23",
    "\u5CAD",
    "\u7F8A",
    "\u51ED",
    "\u4E32",
    "\u5858",
    "\u7ED8",
    "\u9175",
    "\u878D",
    "\u76C6",
    "\u9521",
    "\u5E99",
    "\u7B79",
    "\u51BB",
    "\u8F85",
    "\u6444",
    "\u88AD",
    "\u7B4B",
    "\u62D2",
    "\u50DA",
    "\u65F1",
    "\u94BE",
    "\u9E1F",
    "\u6F06",
    "\u6C88",
    "\u7709",
    "\u758F",
    "\u6DFB",
    "\u68D2",
    "\u7A57",
    "\u785D",
    "\u97E9",
    "\u903C",
    "\u626D",
    "\u4FA8",
    "\u51C9",
    "\u633A",
    "\u7897",
    "\u683D",
    "\u7092",
    "\u676F",
    "\u60A3",
    "\u998F",
    "\u529D",
    "\u8C6A",
    "\u8FBD",
    "\u52C3",
    "\u9E3F",
    "\u65E6",
    "\u540F",
    "\u62DC",
    "\u72D7",
    "\u57CB",
    "\u8F8A",
    "\u63A9",
    "\u996E",
    "\u642C",
    "\u9A82",
    "\u8F9E",
    "\u52FE",
    "\u6263",
    "\u4F30",
    "\u848B",
    "\u7ED2",
    "\u96FE",
    "\u4E08",
    "\u6735",
    "\u59C6",
    "\u62DF",
    "\u5B87",
    "\u8F91",
    "\u9655",
    "\u96D5",
    "\u507F",
    "\u84C4",
    "\u5D07",
    "\u526A",
    "\u5021",
    "\u5385",
    "\u54AC",
    "\u9A76",
    "\u85AF",
    "\u5237",
    "\u65A5",
    "\u756A",
    "\u8D4B",
    "\u5949",
    "\u4F5B",
    "\u6D47",
    "\u6F2B",
    "\u66FC",
    "\u6247",
    "\u9499",
    "\u6843",
    "\u6276",
    "\u4ED4",
    "\u8FD4",
    "\u4FD7",
    "\u4E8F",
    "\u8154",
    "\u978B",
    "\u68F1",
    "\u8986",
    "\u6846",
    "\u6084",
    "\u53D4",
    "\u649E",
    "\u9A97",
    "\u52D8",
    "\u65FA",
    "\u6CB8",
    "\u5B64",
    "\u5410",
    "\u5B5F",
    "\u6E20",
    "\u5C48",
    "\u75BE",
    "\u5999",
    "\u60DC",
    "\u4EF0",
    "\u72E0",
    "\u80C0",
    "\u8C10",
    "\u629B",
    "\u9709",
    "\u6851",
    "\u5C97",
    "\u561B",
    "\u8870",
    "\u76D7",
    "\u6E17",
    "\u810F",
    "\u8D56",
    "\u6D8C",
    "\u751C",
    "\u66F9",
    "\u9605",
    "\u808C",
    "\u54E9",
    "\u5389",
    "\u70C3",
    "\u7EAC",
    "\u6BC5",
    "\u6628",
    "\u4F2A",
    "\u75C7",
    "\u716E",
    "\u53F9",
    "\u9489",
    "\u642D",
    "\u830E",
    "\u7B3C",
    "\u9177",
    "\u5077",
    "\u5F13",
    "\u9525",
    "\u6052",
    "\u6770",
    "\u5751",
    "\u9F3B",
    "\u7FFC",
    "\u7EB6",
    "\u53D9",
    "\u72F1",
    "\u902E",
    "\u7F50",
    "\u7EDC",
    "\u68DA",
    "\u6291",
    "\u81A8",
    "\u852C",
    "\u5BFA",
    "\u9AA4",
    "\u7A46",
    "\u51B6",
    "\u67AF",
    "\u518C",
    "\u5C38",
    "\u51F8",
    "\u7EC5",
    "\u576F",
    "\u727A",
    "\u7130",
    "\u8F70",
    "\u6B23",
    "\u664B",
    "\u7626",
    "\u5FA1",
    "\u952D",
    "\u9526",
    "\u4E27",
    "\u65EC",
    "\u953B",
    "\u5784",
    "\u641C",
    "\u6251",
    "\u9080",
    "\u4EAD",
    "\u916F",
    "\u8FC8",
    "\u8212",
    "\u8106",
    "\u9176",
    "\u95F2",
    "\u5FE7",
    "\u915A",
    "\u987D",
    "\u7FBD",
    "\u6DA8",
    "\u5378",
    "\u4ED7",
    "\u966A",
    "\u8F9F",
    "\u60E9",
    "\u676D",
    "\u59DA",
    "\u809A",
    "\u6349",
    "\u98D8",
    "\u6F02",
    "\u6606",
    "\u6B3A",
    "\u543E",
    "\u90CE",
    "\u70F7",
    "\u6C41",
    "\u5475",
    "\u9970",
    "\u8427",
    "\u96C5",
    "\u90AE",
    "\u8FC1",
    "\u71D5",
    "\u6492",
    "\u59FB",
    "\u8D74",
    "\u5BB4",
    "\u70E6",
    "\u503A",
    "\u5E10",
    "\u6591",
    "\u94C3",
    "\u65E8",
    "\u9187",
    "\u8463",
    "\u997C",
    "\u96CF",
    "\u59FF",
    "\u62CC",
    "\u5085",
    "\u8179",
    "\u59A5",
    "\u63C9",
    "\u8D24",
    "\u62C6",
    "\u6B6A",
    "\u8461",
    "\u80FA",
    "\u4E22",
    "\u6D69",
    "\u5FBD",
    "\u6602",
    "\u57AB",
    "\u6321",
    "\u89C8",
    "\u8D2A",
    "\u6170",
    "\u7F34",
    "\u6C6A",
    "\u614C",
    "\u51AF",
    "\u8BFA",
    "\u59DC",
    "\u8C0A",
    "\u51F6",
    "\u52A3",
    "\u8BEC",
    "\u8000",
    "\u660F",
    "\u8EBA",
    "\u76C8",
    "\u9A91",
    "\u4E54",
    "\u6EAA",
    "\u4E1B",
    "\u5362",
    "\u62B9",
    "\u95F7",
    "\u54A8",
    "\u522E",
    "\u9A7E",
    "\u7F06",
    "\u609F",
    "\u6458",
    "\u94D2",
    "\u63B7",
    "\u9887",
    "\u5E7B",
    "\u67C4",
    "\u60E0",
    "\u60E8",
    "\u4F73",
    "\u4EC7",
    "\u814A",
    "\u7A9D",
    "\u6DA4",
    "\u5251",
    "\u77A7",
    "\u5821",
    "\u6CFC",
    "\u8471",
    "\u7F69",
    "\u970D",
    "\u635E",
    "\u80CE",
    "\u82CD",
    "\u6EE8",
    "\u4FE9",
    "\u6345",
    "\u6E58",
    "\u780D",
    "\u971E",
    "\u90B5",
    "\u8404",
    "\u75AF",
    "\u6DEE",
    "\u9042",
    "\u718A",
    "\u7CAA",
    "\u70D8",
    "\u5BBF",
    "\u6863",
    "\u6208",
    "\u9A73",
    "\u5AC2",
    "\u88D5",
    "\u5F99",
    "\u7BAD",
    "\u6350",
    "\u80A0",
    "\u6491",
    "\u6652",
    "\u8FA8",
    "\u6BBF",
    "\u83B2",
    "\u644A",
    "\u6405",
    "\u9171",
    "\u5C4F",
    "\u75AB",
    "\u54C0",
    "\u8521",
    "\u5835",
    "\u6CAB",
    "\u76B1",
    "\u7545",
    "\u53E0",
    "\u9601",
    "\u83B1",
    "\u6572",
    "\u8F96",
    "\u94A9",
    "\u75D5",
    "\u575D",
    "\u5DF7",
    "\u997F",
    "\u7978",
    "\u4E18",
    "\u7384",
    "\u6E9C",
    "\u66F0",
    "\u903B",
    "\u5F6D",
    "\u5C1D",
    "\u537F",
    "\u59A8",
    "\u8247",
    "\u541E",
    "\u97E6",
    "\u6028",
    "\u77EE",
    "\u6B47"
];
module.exports = $447c8f4d39a5fa15$var$chinese;

});

parcelRegister("l029f", function(module, exports) {
"use strict";
var $f49b43a161e3aae6$var$english = [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
    "account",
    "accuse",
    "achieve",
    "acid",
    "acoustic",
    "acquire",
    "across",
    "act",
    "action",
    "actor",
    "actress",
    "actual",
    "adapt",
    "add",
    "addict",
    "address",
    "adjust",
    "admit",
    "adult",
    "advance",
    "advice",
    "aerobic",
    "affair",
    "afford",
    "afraid",
    "again",
    "age",
    "agent",
    "agree",
    "ahead",
    "aim",
    "air",
    "airport",
    "aisle",
    "alarm",
    "album",
    "alcohol",
    "alert",
    "alien",
    "all",
    "alley",
    "allow",
    "almost",
    "alone",
    "alpha",
    "already",
    "also",
    "alter",
    "always",
    "amateur",
    "amazing",
    "among",
    "amount",
    "amused",
    "analyst",
    "anchor",
    "ancient",
    "anger",
    "angle",
    "angry",
    "animal",
    "ankle",
    "announce",
    "annual",
    "another",
    "answer",
    "antenna",
    "antique",
    "anxiety",
    "any",
    "apart",
    "apology",
    "appear",
    "apple",
    "approve",
    "april",
    "arch",
    "arctic",
    "area",
    "arena",
    "argue",
    "arm",
    "armed",
    "armor",
    "army",
    "around",
    "arrange",
    "arrest",
    "arrive",
    "arrow",
    "art",
    "artefact",
    "artist",
    "artwork",
    "ask",
    "aspect",
    "assault",
    "asset",
    "assist",
    "assume",
    "asthma",
    "athlete",
    "atom",
    "attack",
    "attend",
    "attitude",
    "attract",
    "auction",
    "audit",
    "august",
    "aunt",
    "author",
    "auto",
    "autumn",
    "average",
    "avocado",
    "avoid",
    "awake",
    "aware",
    "away",
    "awesome",
    "awful",
    "awkward",
    "axis",
    "baby",
    "bachelor",
    "bacon",
    "badge",
    "bag",
    "balance",
    "balcony",
    "ball",
    "bamboo",
    "banana",
    "banner",
    "bar",
    "barely",
    "bargain",
    "barrel",
    "base",
    "basic",
    "basket",
    "battle",
    "beach",
    "bean",
    "beauty",
    "because",
    "become",
    "beef",
    "before",
    "begin",
    "behave",
    "behind",
    "believe",
    "below",
    "belt",
    "bench",
    "benefit",
    "best",
    "betray",
    "better",
    "between",
    "beyond",
    "bicycle",
    "bid",
    "bike",
    "bind",
    "biology",
    "bird",
    "birth",
    "bitter",
    "black",
    "blade",
    "blame",
    "blanket",
    "blast",
    "bleak",
    "bless",
    "blind",
    "blood",
    "blossom",
    "blouse",
    "blue",
    "blur",
    "blush",
    "board",
    "boat",
    "body",
    "boil",
    "bomb",
    "bone",
    "bonus",
    "book",
    "boost",
    "border",
    "boring",
    "borrow",
    "boss",
    "bottom",
    "bounce",
    "box",
    "boy",
    "bracket",
    "brain",
    "brand",
    "brass",
    "brave",
    "bread",
    "breeze",
    "brick",
    "bridge",
    "brief",
    "bright",
    "bring",
    "brisk",
    "broccoli",
    "broken",
    "bronze",
    "broom",
    "brother",
    "brown",
    "brush",
    "bubble",
    "buddy",
    "budget",
    "buffalo",
    "build",
    "bulb",
    "bulk",
    "bullet",
    "bundle",
    "bunker",
    "burden",
    "burger",
    "burst",
    "bus",
    "business",
    "busy",
    "butter",
    "buyer",
    "buzz",
    "cabbage",
    "cabin",
    "cable",
    "cactus",
    "cage",
    "cake",
    "call",
    "calm",
    "camera",
    "camp",
    "can",
    "canal",
    "cancel",
    "candy",
    "cannon",
    "canoe",
    "canvas",
    "canyon",
    "capable",
    "capital",
    "captain",
    "car",
    "carbon",
    "card",
    "cargo",
    "carpet",
    "carry",
    "cart",
    "case",
    "cash",
    "casino",
    "castle",
    "casual",
    "cat",
    "catalog",
    "catch",
    "category",
    "cattle",
    "caught",
    "cause",
    "caution",
    "cave",
    "ceiling",
    "celery",
    "cement",
    "census",
    "century",
    "cereal",
    "certain",
    "chair",
    "chalk",
    "champion",
    "change",
    "chaos",
    "chapter",
    "charge",
    "chase",
    "chat",
    "cheap",
    "check",
    "cheese",
    "chef",
    "cherry",
    "chest",
    "chicken",
    "chief",
    "child",
    "chimney",
    "choice",
    "choose",
    "chronic",
    "chuckle",
    "chunk",
    "churn",
    "cigar",
    "cinnamon",
    "circle",
    "citizen",
    "city",
    "civil",
    "claim",
    "clap",
    "clarify",
    "claw",
    "clay",
    "clean",
    "clerk",
    "clever",
    "click",
    "client",
    "cliff",
    "climb",
    "clinic",
    "clip",
    "clock",
    "clog",
    "close",
    "cloth",
    "cloud",
    "clown",
    "club",
    "clump",
    "cluster",
    "clutch",
    "coach",
    "coast",
    "coconut",
    "code",
    "coffee",
    "coil",
    "coin",
    "collect",
    "color",
    "column",
    "combine",
    "come",
    "comfort",
    "comic",
    "common",
    "company",
    "concert",
    "conduct",
    "confirm",
    "congress",
    "connect",
    "consider",
    "control",
    "convince",
    "cook",
    "cool",
    "copper",
    "copy",
    "coral",
    "core",
    "corn",
    "correct",
    "cost",
    "cotton",
    "couch",
    "country",
    "couple",
    "course",
    "cousin",
    "cover",
    "coyote",
    "crack",
    "cradle",
    "craft",
    "cram",
    "crane",
    "crash",
    "crater",
    "crawl",
    "crazy",
    "cream",
    "credit",
    "creek",
    "crew",
    "cricket",
    "crime",
    "crisp",
    "critic",
    "crop",
    "cross",
    "crouch",
    "crowd",
    "crucial",
    "cruel",
    "cruise",
    "crumble",
    "crunch",
    "crush",
    "cry",
    "crystal",
    "cube",
    "culture",
    "cup",
    "cupboard",
    "curious",
    "current",
    "curtain",
    "curve",
    "cushion",
    "custom",
    "cute",
    "cycle",
    "dad",
    "damage",
    "damp",
    "dance",
    "danger",
    "daring",
    "dash",
    "daughter",
    "dawn",
    "day",
    "deal",
    "debate",
    "debris",
    "decade",
    "december",
    "decide",
    "decline",
    "decorate",
    "decrease",
    "deer",
    "defense",
    "define",
    "defy",
    "degree",
    "delay",
    "deliver",
    "demand",
    "demise",
    "denial",
    "dentist",
    "deny",
    "depart",
    "depend",
    "deposit",
    "depth",
    "deputy",
    "derive",
    "describe",
    "desert",
    "design",
    "desk",
    "despair",
    "destroy",
    "detail",
    "detect",
    "develop",
    "device",
    "devote",
    "diagram",
    "dial",
    "diamond",
    "diary",
    "dice",
    "diesel",
    "diet",
    "differ",
    "digital",
    "dignity",
    "dilemma",
    "dinner",
    "dinosaur",
    "direct",
    "dirt",
    "disagree",
    "discover",
    "disease",
    "dish",
    "dismiss",
    "disorder",
    "display",
    "distance",
    "divert",
    "divide",
    "divorce",
    "dizzy",
    "doctor",
    "document",
    "dog",
    "doll",
    "dolphin",
    "domain",
    "donate",
    "donkey",
    "donor",
    "door",
    "dose",
    "double",
    "dove",
    "draft",
    "dragon",
    "drama",
    "drastic",
    "draw",
    "dream",
    "dress",
    "drift",
    "drill",
    "drink",
    "drip",
    "drive",
    "drop",
    "drum",
    "dry",
    "duck",
    "dumb",
    "dune",
    "during",
    "dust",
    "dutch",
    "duty",
    "dwarf",
    "dynamic",
    "eager",
    "eagle",
    "early",
    "earn",
    "earth",
    "easily",
    "east",
    "easy",
    "echo",
    "ecology",
    "economy",
    "edge",
    "edit",
    "educate",
    "effort",
    "egg",
    "eight",
    "either",
    "elbow",
    "elder",
    "electric",
    "elegant",
    "element",
    "elephant",
    "elevator",
    "elite",
    "else",
    "embark",
    "embody",
    "embrace",
    "emerge",
    "emotion",
    "employ",
    "empower",
    "empty",
    "enable",
    "enact",
    "end",
    "endless",
    "endorse",
    "enemy",
    "energy",
    "enforce",
    "engage",
    "engine",
    "enhance",
    "enjoy",
    "enlist",
    "enough",
    "enrich",
    "enroll",
    "ensure",
    "enter",
    "entire",
    "entry",
    "envelope",
    "episode",
    "equal",
    "equip",
    "era",
    "erase",
    "erode",
    "erosion",
    "error",
    "erupt",
    "escape",
    "essay",
    "essence",
    "estate",
    "eternal",
    "ethics",
    "evidence",
    "evil",
    "evoke",
    "evolve",
    "exact",
    "example",
    "excess",
    "exchange",
    "excite",
    "exclude",
    "excuse",
    "execute",
    "exercise",
    "exhaust",
    "exhibit",
    "exile",
    "exist",
    "exit",
    "exotic",
    "expand",
    "expect",
    "expire",
    "explain",
    "expose",
    "express",
    "extend",
    "extra",
    "eye",
    "eyebrow",
    "fabric",
    "face",
    "faculty",
    "fade",
    "faint",
    "faith",
    "fall",
    "false",
    "fame",
    "family",
    "famous",
    "fan",
    "fancy",
    "fantasy",
    "farm",
    "fashion",
    "fat",
    "fatal",
    "father",
    "fatigue",
    "fault",
    "favorite",
    "feature",
    "february",
    "federal",
    "fee",
    "feed",
    "feel",
    "female",
    "fence",
    "festival",
    "fetch",
    "fever",
    "few",
    "fiber",
    "fiction",
    "field",
    "figure",
    "file",
    "film",
    "filter",
    "final",
    "find",
    "fine",
    "finger",
    "finish",
    "fire",
    "firm",
    "first",
    "fiscal",
    "fish",
    "fit",
    "fitness",
    "fix",
    "flag",
    "flame",
    "flash",
    "flat",
    "flavor",
    "flee",
    "flight",
    "flip",
    "float",
    "flock",
    "floor",
    "flower",
    "fluid",
    "flush",
    "fly",
    "foam",
    "focus",
    "fog",
    "foil",
    "fold",
    "follow",
    "food",
    "foot",
    "force",
    "forest",
    "forget",
    "fork",
    "fortune",
    "forum",
    "forward",
    "fossil",
    "foster",
    "found",
    "fox",
    "fragile",
    "frame",
    "frequent",
    "fresh",
    "friend",
    "fringe",
    "frog",
    "front",
    "frost",
    "frown",
    "frozen",
    "fruit",
    "fuel",
    "fun",
    "funny",
    "furnace",
    "fury",
    "future",
    "gadget",
    "gain",
    "galaxy",
    "gallery",
    "game",
    "gap",
    "garage",
    "garbage",
    "garden",
    "garlic",
    "garment",
    "gas",
    "gasp",
    "gate",
    "gather",
    "gauge",
    "gaze",
    "general",
    "genius",
    "genre",
    "gentle",
    "genuine",
    "gesture",
    "ghost",
    "giant",
    "gift",
    "giggle",
    "ginger",
    "giraffe",
    "girl",
    "give",
    "glad",
    "glance",
    "glare",
    "glass",
    "glide",
    "glimpse",
    "globe",
    "gloom",
    "glory",
    "glove",
    "glow",
    "glue",
    "goat",
    "goddess",
    "gold",
    "good",
    "goose",
    "gorilla",
    "gospel",
    "gossip",
    "govern",
    "gown",
    "grab",
    "grace",
    "grain",
    "grant",
    "grape",
    "grass",
    "gravity",
    "great",
    "green",
    "grid",
    "grief",
    "grit",
    "grocery",
    "group",
    "grow",
    "grunt",
    "guard",
    "guess",
    "guide",
    "guilt",
    "guitar",
    "gun",
    "gym",
    "habit",
    "hair",
    "half",
    "hammer",
    "hamster",
    "hand",
    "happy",
    "harbor",
    "hard",
    "harsh",
    "harvest",
    "hat",
    "have",
    "hawk",
    "hazard",
    "head",
    "health",
    "heart",
    "heavy",
    "hedgehog",
    "height",
    "hello",
    "helmet",
    "help",
    "hen",
    "hero",
    "hidden",
    "high",
    "hill",
    "hint",
    "hip",
    "hire",
    "history",
    "hobby",
    "hockey",
    "hold",
    "hole",
    "holiday",
    "hollow",
    "home",
    "honey",
    "hood",
    "hope",
    "horn",
    "horror",
    "horse",
    "hospital",
    "host",
    "hotel",
    "hour",
    "hover",
    "hub",
    "huge",
    "human",
    "humble",
    "humor",
    "hundred",
    "hungry",
    "hunt",
    "hurdle",
    "hurry",
    "hurt",
    "husband",
    "hybrid",
    "ice",
    "icon",
    "idea",
    "identify",
    "idle",
    "ignore",
    "ill",
    "illegal",
    "illness",
    "image",
    "imitate",
    "immense",
    "immune",
    "impact",
    "impose",
    "improve",
    "impulse",
    "inch",
    "include",
    "income",
    "increase",
    "index",
    "indicate",
    "indoor",
    "industry",
    "infant",
    "inflict",
    "inform",
    "inhale",
    "inherit",
    "initial",
    "inject",
    "injury",
    "inmate",
    "inner",
    "innocent",
    "input",
    "inquiry",
    "insane",
    "insect",
    "inside",
    "inspire",
    "install",
    "intact",
    "interest",
    "into",
    "invest",
    "invite",
    "involve",
    "iron",
    "island",
    "isolate",
    "issue",
    "item",
    "ivory",
    "jacket",
    "jaguar",
    "jar",
    "jazz",
    "jealous",
    "jeans",
    "jelly",
    "jewel",
    "job",
    "join",
    "joke",
    "journey",
    "joy",
    "judge",
    "juice",
    "jump",
    "jungle",
    "junior",
    "junk",
    "just",
    "kangaroo",
    "keen",
    "keep",
    "ketchup",
    "key",
    "kick",
    "kid",
    "kidney",
    "kind",
    "kingdom",
    "kiss",
    "kit",
    "kitchen",
    "kite",
    "kitten",
    "kiwi",
    "knee",
    "knife",
    "knock",
    "know",
    "lab",
    "label",
    "labor",
    "ladder",
    "lady",
    "lake",
    "lamp",
    "language",
    "laptop",
    "large",
    "later",
    "latin",
    "laugh",
    "laundry",
    "lava",
    "law",
    "lawn",
    "lawsuit",
    "layer",
    "lazy",
    "leader",
    "leaf",
    "learn",
    "leave",
    "lecture",
    "left",
    "leg",
    "legal",
    "legend",
    "leisure",
    "lemon",
    "lend",
    "length",
    "lens",
    "leopard",
    "lesson",
    "letter",
    "level",
    "liar",
    "liberty",
    "library",
    "license",
    "life",
    "lift",
    "light",
    "like",
    "limb",
    "limit",
    "link",
    "lion",
    "liquid",
    "list",
    "little",
    "live",
    "lizard",
    "load",
    "loan",
    "lobster",
    "local",
    "lock",
    "logic",
    "lonely",
    "long",
    "loop",
    "lottery",
    "loud",
    "lounge",
    "love",
    "loyal",
    "lucky",
    "luggage",
    "lumber",
    "lunar",
    "lunch",
    "luxury",
    "lyrics",
    "machine",
    "mad",
    "magic",
    "magnet",
    "maid",
    "mail",
    "main",
    "major",
    "make",
    "mammal",
    "man",
    "manage",
    "mandate",
    "mango",
    "mansion",
    "manual",
    "maple",
    "marble",
    "march",
    "margin",
    "marine",
    "market",
    "marriage",
    "mask",
    "mass",
    "master",
    "match",
    "material",
    "math",
    "matrix",
    "matter",
    "maximum",
    "maze",
    "meadow",
    "mean",
    "measure",
    "meat",
    "mechanic",
    "medal",
    "media",
    "melody",
    "melt",
    "member",
    "memory",
    "mention",
    "menu",
    "mercy",
    "merge",
    "merit",
    "merry",
    "mesh",
    "message",
    "metal",
    "method",
    "middle",
    "midnight",
    "milk",
    "million",
    "mimic",
    "mind",
    "minimum",
    "minor",
    "minute",
    "miracle",
    "mirror",
    "misery",
    "miss",
    "mistake",
    "mix",
    "mixed",
    "mixture",
    "mobile",
    "model",
    "modify",
    "mom",
    "moment",
    "monitor",
    "monkey",
    "monster",
    "month",
    "moon",
    "moral",
    "more",
    "morning",
    "mosquito",
    "mother",
    "motion",
    "motor",
    "mountain",
    "mouse",
    "move",
    "movie",
    "much",
    "muffin",
    "mule",
    "multiply",
    "muscle",
    "museum",
    "mushroom",
    "music",
    "must",
    "mutual",
    "myself",
    "mystery",
    "myth",
    "naive",
    "name",
    "napkin",
    "narrow",
    "nasty",
    "nation",
    "nature",
    "near",
    "neck",
    "need",
    "negative",
    "neglect",
    "neither",
    "nephew",
    "nerve",
    "nest",
    "net",
    "network",
    "neutral",
    "never",
    "news",
    "next",
    "nice",
    "night",
    "noble",
    "noise",
    "nominee",
    "noodle",
    "normal",
    "north",
    "nose",
    "notable",
    "note",
    "nothing",
    "notice",
    "novel",
    "now",
    "nuclear",
    "number",
    "nurse",
    "nut",
    "oak",
    "obey",
    "object",
    "oblige",
    "obscure",
    "observe",
    "obtain",
    "obvious",
    "occur",
    "ocean",
    "october",
    "odor",
    "off",
    "offer",
    "office",
    "often",
    "oil",
    "okay",
    "old",
    "olive",
    "olympic",
    "omit",
    "once",
    "one",
    "onion",
    "online",
    "only",
    "open",
    "opera",
    "opinion",
    "oppose",
    "option",
    "orange",
    "orbit",
    "orchard",
    "order",
    "ordinary",
    "organ",
    "orient",
    "original",
    "orphan",
    "ostrich",
    "other",
    "outdoor",
    "outer",
    "output",
    "outside",
    "oval",
    "oven",
    "over",
    "own",
    "owner",
    "oxygen",
    "oyster",
    "ozone",
    "pact",
    "paddle",
    "page",
    "pair",
    "palace",
    "palm",
    "panda",
    "panel",
    "panic",
    "panther",
    "paper",
    "parade",
    "parent",
    "park",
    "parrot",
    "party",
    "pass",
    "patch",
    "path",
    "patient",
    "patrol",
    "pattern",
    "pause",
    "pave",
    "payment",
    "peace",
    "peanut",
    "pear",
    "peasant",
    "pelican",
    "pen",
    "penalty",
    "pencil",
    "people",
    "pepper",
    "perfect",
    "permit",
    "person",
    "pet",
    "phone",
    "photo",
    "phrase",
    "physical",
    "piano",
    "picnic",
    "picture",
    "piece",
    "pig",
    "pigeon",
    "pill",
    "pilot",
    "pink",
    "pioneer",
    "pipe",
    "pistol",
    "pitch",
    "pizza",
    "place",
    "planet",
    "plastic",
    "plate",
    "play",
    "please",
    "pledge",
    "pluck",
    "plug",
    "plunge",
    "poem",
    "poet",
    "point",
    "polar",
    "pole",
    "police",
    "pond",
    "pony",
    "pool",
    "popular",
    "portion",
    "position",
    "possible",
    "post",
    "potato",
    "pottery",
    "poverty",
    "powder",
    "power",
    "practice",
    "praise",
    "predict",
    "prefer",
    "prepare",
    "present",
    "pretty",
    "prevent",
    "price",
    "pride",
    "primary",
    "print",
    "priority",
    "prison",
    "private",
    "prize",
    "problem",
    "process",
    "produce",
    "profit",
    "program",
    "project",
    "promote",
    "proof",
    "property",
    "prosper",
    "protect",
    "proud",
    "provide",
    "public",
    "pudding",
    "pull",
    "pulp",
    "pulse",
    "pumpkin",
    "punch",
    "pupil",
    "puppy",
    "purchase",
    "purity",
    "purpose",
    "purse",
    "push",
    "put",
    "puzzle",
    "pyramid",
    "quality",
    "quantum",
    "quarter",
    "question",
    "quick",
    "quit",
    "quiz",
    "quote",
    "rabbit",
    "raccoon",
    "race",
    "rack",
    "radar",
    "radio",
    "rail",
    "rain",
    "raise",
    "rally",
    "ramp",
    "ranch",
    "random",
    "range",
    "rapid",
    "rare",
    "rate",
    "rather",
    "raven",
    "raw",
    "razor",
    "ready",
    "real",
    "reason",
    "rebel",
    "rebuild",
    "recall",
    "receive",
    "recipe",
    "record",
    "recycle",
    "reduce",
    "reflect",
    "reform",
    "refuse",
    "region",
    "regret",
    "regular",
    "reject",
    "relax",
    "release",
    "relief",
    "rely",
    "remain",
    "remember",
    "remind",
    "remove",
    "render",
    "renew",
    "rent",
    "reopen",
    "repair",
    "repeat",
    "replace",
    "report",
    "require",
    "rescue",
    "resemble",
    "resist",
    "resource",
    "response",
    "result",
    "retire",
    "retreat",
    "return",
    "reunion",
    "reveal",
    "review",
    "reward",
    "rhythm",
    "rib",
    "ribbon",
    "rice",
    "rich",
    "ride",
    "ridge",
    "rifle",
    "right",
    "rigid",
    "ring",
    "riot",
    "ripple",
    "risk",
    "ritual",
    "rival",
    "river",
    "road",
    "roast",
    "robot",
    "robust",
    "rocket",
    "romance",
    "roof",
    "rookie",
    "room",
    "rose",
    "rotate",
    "rough",
    "round",
    "route",
    "royal",
    "rubber",
    "rude",
    "rug",
    "rule",
    "run",
    "runway",
    "rural",
    "sad",
    "saddle",
    "sadness",
    "safe",
    "sail",
    "salad",
    "salmon",
    "salon",
    "salt",
    "salute",
    "same",
    "sample",
    "sand",
    "satisfy",
    "satoshi",
    "sauce",
    "sausage",
    "save",
    "say",
    "scale",
    "scan",
    "scare",
    "scatter",
    "scene",
    "scheme",
    "school",
    "science",
    "scissors",
    "scorpion",
    "scout",
    "scrap",
    "screen",
    "script",
    "scrub",
    "sea",
    "search",
    "season",
    "seat",
    "second",
    "secret",
    "section",
    "security",
    "seed",
    "seek",
    "segment",
    "select",
    "sell",
    "seminar",
    "senior",
    "sense",
    "sentence",
    "series",
    "service",
    "session",
    "settle",
    "setup",
    "seven",
    "shadow",
    "shaft",
    "shallow",
    "share",
    "shed",
    "shell",
    "sheriff",
    "shield",
    "shift",
    "shine",
    "ship",
    "shiver",
    "shock",
    "shoe",
    "shoot",
    "shop",
    "short",
    "shoulder",
    "shove",
    "shrimp",
    "shrug",
    "shuffle",
    "shy",
    "sibling",
    "sick",
    "side",
    "siege",
    "sight",
    "sign",
    "silent",
    "silk",
    "silly",
    "silver",
    "similar",
    "simple",
    "since",
    "sing",
    "siren",
    "sister",
    "situate",
    "six",
    "size",
    "skate",
    "sketch",
    "ski",
    "skill",
    "skin",
    "skirt",
    "skull",
    "slab",
    "slam",
    "sleep",
    "slender",
    "slice",
    "slide",
    "slight",
    "slim",
    "slogan",
    "slot",
    "slow",
    "slush",
    "small",
    "smart",
    "smile",
    "smoke",
    "smooth",
    "snack",
    "snake",
    "snap",
    "sniff",
    "snow",
    "soap",
    "soccer",
    "social",
    "sock",
    "soda",
    "soft",
    "solar",
    "soldier",
    "solid",
    "solution",
    "solve",
    "someone",
    "song",
    "soon",
    "sorry",
    "sort",
    "soul",
    "sound",
    "soup",
    "source",
    "south",
    "space",
    "spare",
    "spatial",
    "spawn",
    "speak",
    "special",
    "speed",
    "spell",
    "spend",
    "sphere",
    "spice",
    "spider",
    "spike",
    "spin",
    "spirit",
    "split",
    "spoil",
    "sponsor",
    "spoon",
    "sport",
    "spot",
    "spray",
    "spread",
    "spring",
    "spy",
    "square",
    "squeeze",
    "squirrel",
    "stable",
    "stadium",
    "staff",
    "stage",
    "stairs",
    "stamp",
    "stand",
    "start",
    "state",
    "stay",
    "steak",
    "steel",
    "stem",
    "step",
    "stereo",
    "stick",
    "still",
    "sting",
    "stock",
    "stomach",
    "stone",
    "stool",
    "story",
    "stove",
    "strategy",
    "street",
    "strike",
    "strong",
    "struggle",
    "student",
    "stuff",
    "stumble",
    "style",
    "subject",
    "submit",
    "subway",
    "success",
    "such",
    "sudden",
    "suffer",
    "sugar",
    "suggest",
    "suit",
    "summer",
    "sun",
    "sunny",
    "sunset",
    "super",
    "supply",
    "supreme",
    "sure",
    "surface",
    "surge",
    "surprise",
    "surround",
    "survey",
    "suspect",
    "sustain",
    "swallow",
    "swamp",
    "swap",
    "swarm",
    "swear",
    "sweet",
    "swift",
    "swim",
    "swing",
    "switch",
    "sword",
    "symbol",
    "symptom",
    "syrup",
    "system",
    "table",
    "tackle",
    "tag",
    "tail",
    "talent",
    "talk",
    "tank",
    "tape",
    "target",
    "task",
    "taste",
    "tattoo",
    "taxi",
    "teach",
    "team",
    "tell",
    "ten",
    "tenant",
    "tennis",
    "tent",
    "term",
    "test",
    "text",
    "thank",
    "that",
    "theme",
    "then",
    "theory",
    "there",
    "they",
    "thing",
    "this",
    "thought",
    "three",
    "thrive",
    "throw",
    "thumb",
    "thunder",
    "ticket",
    "tide",
    "tiger",
    "tilt",
    "timber",
    "time",
    "tiny",
    "tip",
    "tired",
    "tissue",
    "title",
    "toast",
    "tobacco",
    "today",
    "toddler",
    "toe",
    "together",
    "toilet",
    "token",
    "tomato",
    "tomorrow",
    "tone",
    "tongue",
    "tonight",
    "tool",
    "tooth",
    "top",
    "topic",
    "topple",
    "torch",
    "tornado",
    "tortoise",
    "toss",
    "total",
    "tourist",
    "toward",
    "tower",
    "town",
    "toy",
    "track",
    "trade",
    "traffic",
    "tragic",
    "train",
    "transfer",
    "trap",
    "trash",
    "travel",
    "tray",
    "treat",
    "tree",
    "trend",
    "trial",
    "tribe",
    "trick",
    "trigger",
    "trim",
    "trip",
    "trophy",
    "trouble",
    "truck",
    "true",
    "truly",
    "trumpet",
    "trust",
    "truth",
    "try",
    "tube",
    "tuition",
    "tumble",
    "tuna",
    "tunnel",
    "turkey",
    "turn",
    "turtle",
    "twelve",
    "twenty",
    "twice",
    "twin",
    "twist",
    "two",
    "type",
    "typical",
    "ugly",
    "umbrella",
    "unable",
    "unaware",
    "uncle",
    "uncover",
    "under",
    "undo",
    "unfair",
    "unfold",
    "unhappy",
    "uniform",
    "unique",
    "unit",
    "universe",
    "unknown",
    "unlock",
    "until",
    "unusual",
    "unveil",
    "update",
    "upgrade",
    "uphold",
    "upon",
    "upper",
    "upset",
    "urban",
    "urge",
    "usage",
    "use",
    "used",
    "useful",
    "useless",
    "usual",
    "utility",
    "vacant",
    "vacuum",
    "vague",
    "valid",
    "valley",
    "valve",
    "van",
    "vanish",
    "vapor",
    "various",
    "vast",
    "vault",
    "vehicle",
    "velvet",
    "vendor",
    "venture",
    "venue",
    "verb",
    "verify",
    "version",
    "very",
    "vessel",
    "veteran",
    "viable",
    "vibrant",
    "vicious",
    "victory",
    "video",
    "view",
    "village",
    "vintage",
    "violin",
    "virtual",
    "virus",
    "visa",
    "visit",
    "visual",
    "vital",
    "vivid",
    "vocal",
    "voice",
    "void",
    "volcano",
    "volume",
    "vote",
    "voyage",
    "wage",
    "wagon",
    "wait",
    "walk",
    "wall",
    "walnut",
    "want",
    "warfare",
    "warm",
    "warrior",
    "wash",
    "wasp",
    "waste",
    "water",
    "wave",
    "way",
    "wealth",
    "weapon",
    "wear",
    "weasel",
    "weather",
    "web",
    "wedding",
    "weekend",
    "weird",
    "welcome",
    "west",
    "wet",
    "whale",
    "what",
    "wheat",
    "wheel",
    "when",
    "where",
    "whip",
    "whisper",
    "wide",
    "width",
    "wife",
    "wild",
    "will",
    "win",
    "window",
    "wine",
    "wing",
    "wink",
    "winner",
    "winter",
    "wire",
    "wisdom",
    "wise",
    "wish",
    "witness",
    "wolf",
    "woman",
    "wonder",
    "wood",
    "wool",
    "word",
    "work",
    "world",
    "worry",
    "worth",
    "wrap",
    "wreck",
    "wrestle",
    "wrist",
    "write",
    "wrong",
    "yard",
    "year",
    "yellow",
    "you",
    "young",
    "youth",
    "zebra",
    "zero",
    "zone",
    "zoo"
];
module.exports = $f49b43a161e3aae6$var$english;

});

parcelRegister("gLqNu", function(module, exports) {
"use string";
var $c345d281b6eda4a5$var$french = [
    "abaisser",
    "abandon",
    "abdiquer",
    "abeille",
    "abolir",
    "aborder",
    "aboutir",
    "aboyer",
    "abrasif",
    "abreuver",
    "abriter",
    "abroger",
    "abrupt",
    "absence",
    "absolu",
    "absurde",
    "abusif",
    "abyssal",
    "acade\u0301mie",
    "acajou",
    "acarien",
    "accabler",
    "accepter",
    "acclamer",
    "accolade",
    "accroche",
    "accuser",
    "acerbe",
    "achat",
    "acheter",
    "aciduler",
    "acier",
    "acompte",
    "acque\u0301rir",
    "acronyme",
    "acteur",
    "actif",
    "actuel",
    "adepte",
    "ade\u0301quat",
    "adhe\u0301sif",
    "adjectif",
    "adjuger",
    "admettre",
    "admirer",
    "adopter",
    "adorer",
    "adoucir",
    "adresse",
    "adroit",
    "adulte",
    "adverbe",
    "ae\u0301rer",
    "ae\u0301ronef",
    "affaire",
    "affecter",
    "affiche",
    "affreux",
    "affubler",
    "agacer",
    "agencer",
    "agile",
    "agiter",
    "agrafer",
    "agre\u0301able",
    "agrume",
    "aider",
    "aiguille",
    "ailier",
    "aimable",
    "aisance",
    "ajouter",
    "ajuster",
    "alarmer",
    "alchimie",
    "alerte",
    "alge\u0300bre",
    "algue",
    "alie\u0301ner",
    "aliment",
    "alle\u0301ger",
    "alliage",
    "allouer",
    "allumer",
    "alourdir",
    "alpaga",
    "altesse",
    "alve\u0301ole",
    "amateur",
    "ambigu",
    "ambre",
    "ame\u0301nager",
    "amertume",
    "amidon",
    "amiral",
    "amorcer",
    "amour",
    "amovible",
    "amphibie",
    "ampleur",
    "amusant",
    "analyse",
    "anaphore",
    "anarchie",
    "anatomie",
    "ancien",
    "ane\u0301antir",
    "angle",
    "angoisse",
    "anguleux",
    "animal",
    "annexer",
    "annonce",
    "annuel",
    "anodin",
    "anomalie",
    "anonyme",
    "anormal",
    "antenne",
    "antidote",
    "anxieux",
    "apaiser",
    "ape\u0301ritif",
    "aplanir",
    "apologie",
    "appareil",
    "appeler",
    "apporter",
    "appuyer",
    "aquarium",
    "aqueduc",
    "arbitre",
    "arbuste",
    "ardeur",
    "ardoise",
    "argent",
    "arlequin",
    "armature",
    "armement",
    "armoire",
    "armure",
    "arpenter",
    "arracher",
    "arriver",
    "arroser",
    "arsenic",
    "arte\u0301riel",
    "article",
    "aspect",
    "asphalte",
    "aspirer",
    "assaut",
    "asservir",
    "assiette",
    "associer",
    "assurer",
    "asticot",
    "astre",
    "astuce",
    "atelier",
    "atome",
    "atrium",
    "atroce",
    "attaque",
    "attentif",
    "attirer",
    "attraper",
    "aubaine",
    "auberge",
    "audace",
    "audible",
    "augurer",
    "aurore",
    "automne",
    "autruche",
    "avaler",
    "avancer",
    "avarice",
    "avenir",
    "averse",
    "aveugle",
    "aviateur",
    "avide",
    "avion",
    "aviser",
    "avoine",
    "avouer",
    "avril",
    "axial",
    "axiome",
    "badge",
    "bafouer",
    "bagage",
    "baguette",
    "baignade",
    "balancer",
    "balcon",
    "baleine",
    "balisage",
    "bambin",
    "bancaire",
    "bandage",
    "banlieue",
    "bannie\u0300re",
    "banquier",
    "barbier",
    "baril",
    "baron",
    "barque",
    "barrage",
    "bassin",
    "bastion",
    "bataille",
    "bateau",
    "batterie",
    "baudrier",
    "bavarder",
    "belette",
    "be\u0301lier",
    "belote",
    "be\u0301ne\u0301fice",
    "berceau",
    "berger",
    "berline",
    "bermuda",
    "besace",
    "besogne",
    "be\u0301tail",
    "beurre",
    "biberon",
    "bicycle",
    "bidule",
    "bijou",
    "bilan",
    "bilingue",
    "billard",
    "binaire",
    "biologie",
    "biopsie",
    "biotype",
    "biscuit",
    "bison",
    "bistouri",
    "bitume",
    "bizarre",
    "blafard",
    "blague",
    "blanchir",
    "blessant",
    "blinder",
    "blond",
    "bloquer",
    "blouson",
    "bobard",
    "bobine",
    "boire",
    "boiser",
    "bolide",
    "bonbon",
    "bondir",
    "bonheur",
    "bonifier",
    "bonus",
    "bordure",
    "borne",
    "botte",
    "boucle",
    "boueux",
    "bougie",
    "boulon",
    "bouquin",
    "bourse",
    "boussole",
    "boutique",
    "boxeur",
    "branche",
    "brasier",
    "brave",
    "brebis",
    "bre\u0300che",
    "breuvage",
    "bricoler",
    "brigade",
    "brillant",
    "brioche",
    "brique",
    "brochure",
    "broder",
    "bronzer",
    "brousse",
    "broyeur",
    "brume",
    "brusque",
    "brutal",
    "bruyant",
    "buffle",
    "buisson",
    "bulletin",
    "bureau",
    "burin",
    "bustier",
    "butiner",
    "butoir",
    "buvable",
    "buvette",
    "cabanon",
    "cabine",
    "cachette",
    "cadeau",
    "cadre",
    "cafe\u0301ine",
    "caillou",
    "caisson",
    "calculer",
    "calepin",
    "calibre",
    "calmer",
    "calomnie",
    "calvaire",
    "camarade",
    "came\u0301ra",
    "camion",
    "campagne",
    "canal",
    "caneton",
    "canon",
    "cantine",
    "canular",
    "capable",
    "caporal",
    "caprice",
    "capsule",
    "capter",
    "capuche",
    "carabine",
    "carbone",
    "caresser",
    "caribou",
    "carnage",
    "carotte",
    "carreau",
    "carton",
    "cascade",
    "casier",
    "casque",
    "cassure",
    "causer",
    "caution",
    "cavalier",
    "caverne",
    "caviar",
    "ce\u0301dille",
    "ceinture",
    "ce\u0301leste",
    "cellule",
    "cendrier",
    "censurer",
    "central",
    "cercle",
    "ce\u0301re\u0301bral",
    "cerise",
    "cerner",
    "cerveau",
    "cesser",
    "chagrin",
    "chaise",
    "chaleur",
    "chambre",
    "chance",
    "chapitre",
    "charbon",
    "chasseur",
    "chaton",
    "chausson",
    "chavirer",
    "chemise",
    "chenille",
    "che\u0301quier",
    "chercher",
    "cheval",
    "chien",
    "chiffre",
    "chignon",
    "chime\u0300re",
    "chiot",
    "chlorure",
    "chocolat",
    "choisir",
    "chose",
    "chouette",
    "chrome",
    "chute",
    "cigare",
    "cigogne",
    "cimenter",
    "cine\u0301ma",
    "cintrer",
    "circuler",
    "cirer",
    "cirque",
    "citerne",
    "citoyen",
    "citron",
    "civil",
    "clairon",
    "clameur",
    "claquer",
    "classe",
    "clavier",
    "client",
    "cligner",
    "climat",
    "clivage",
    "cloche",
    "clonage",
    "cloporte",
    "cobalt",
    "cobra",
    "cocasse",
    "cocotier",
    "coder",
    "codifier",
    "coffre",
    "cogner",
    "cohe\u0301sion",
    "coiffer",
    "coincer",
    "cole\u0300re",
    "colibri",
    "colline",
    "colmater",
    "colonel",
    "combat",
    "come\u0301die",
    "commande",
    "compact",
    "concert",
    "conduire",
    "confier",
    "congeler",
    "connoter",
    "consonne",
    "contact",
    "convexe",
    "copain",
    "copie",
    "corail",
    "corbeau",
    "cordage",
    "corniche",
    "corpus",
    "correct",
    "corte\u0300ge",
    "cosmique",
    "costume",
    "coton",
    "coude",
    "coupure",
    "courage",
    "couteau",
    "couvrir",
    "coyote",
    "crabe",
    "crainte",
    "cravate",
    "crayon",
    "cre\u0301ature",
    "cre\u0301diter",
    "cre\u0301meux",
    "creuser",
    "crevette",
    "cribler",
    "crier",
    "cristal",
    "crite\u0300re",
    "croire",
    "croquer",
    "crotale",
    "crucial",
    "cruel",
    "crypter",
    "cubique",
    "cueillir",
    "cuille\u0300re",
    "cuisine",
    "cuivre",
    "culminer",
    "cultiver",
    "cumuler",
    "cupide",
    "curatif",
    "curseur",
    "cyanure",
    "cycle",
    "cylindre",
    "cynique",
    "daigner",
    "damier",
    "danger",
    "danseur",
    "dauphin",
    "de\u0301battre",
    "de\u0301biter",
    "de\u0301border",
    "de\u0301brider",
    "de\u0301butant",
    "de\u0301caler",
    "de\u0301cembre",
    "de\u0301chirer",
    "de\u0301cider",
    "de\u0301clarer",
    "de\u0301corer",
    "de\u0301crire",
    "de\u0301cupler",
    "de\u0301dale",
    "de\u0301ductif",
    "de\u0301esse",
    "de\u0301fensif",
    "de\u0301filer",
    "de\u0301frayer",
    "de\u0301gager",
    "de\u0301givrer",
    "de\u0301glutir",
    "de\u0301grafer",
    "de\u0301jeuner",
    "de\u0301lice",
    "de\u0301loger",
    "demander",
    "demeurer",
    "de\u0301molir",
    "de\u0301nicher",
    "de\u0301nouer",
    "dentelle",
    "de\u0301nuder",
    "de\u0301part",
    "de\u0301penser",
    "de\u0301phaser",
    "de\u0301placer",
    "de\u0301poser",
    "de\u0301ranger",
    "de\u0301rober",
    "de\u0301sastre",
    "descente",
    "de\u0301sert",
    "de\u0301signer",
    "de\u0301sobe\u0301ir",
    "dessiner",
    "destrier",
    "de\u0301tacher",
    "de\u0301tester",
    "de\u0301tourer",
    "de\u0301tresse",
    "devancer",
    "devenir",
    "deviner",
    "devoir",
    "diable",
    "dialogue",
    "diamant",
    "dicter",
    "diffe\u0301rer",
    "dige\u0301rer",
    "digital",
    "digne",
    "diluer",
    "dimanche",
    "diminuer",
    "dioxyde",
    "directif",
    "diriger",
    "discuter",
    "disposer",
    "dissiper",
    "distance",
    "divertir",
    "diviser",
    "docile",
    "docteur",
    "dogme",
    "doigt",
    "domaine",
    "domicile",
    "dompter",
    "donateur",
    "donjon",
    "donner",
    "dopamine",
    "dortoir",
    "dorure",
    "dosage",
    "doseur",
    "dossier",
    "dotation",
    "douanier",
    "double",
    "douceur",
    "douter",
    "doyen",
    "dragon",
    "draper",
    "dresser",
    "dribbler",
    "droiture",
    "duperie",
    "duplexe",
    "durable",
    "durcir",
    "dynastie",
    "e\u0301blouir",
    "e\u0301carter",
    "e\u0301charpe",
    "e\u0301chelle",
    "e\u0301clairer",
    "e\u0301clipse",
    "e\u0301clore",
    "e\u0301cluse",
    "e\u0301cole",
    "e\u0301conomie",
    "e\u0301corce",
    "e\u0301couter",
    "e\u0301craser",
    "e\u0301cre\u0301mer",
    "e\u0301crivain",
    "e\u0301crou",
    "e\u0301cume",
    "e\u0301cureuil",
    "e\u0301difier",
    "e\u0301duquer",
    "effacer",
    "effectif",
    "effigie",
    "effort",
    "effrayer",
    "effusion",
    "e\u0301galiser",
    "e\u0301garer",
    "e\u0301jecter",
    "e\u0301laborer",
    "e\u0301largir",
    "e\u0301lectron",
    "e\u0301le\u0301gant",
    "e\u0301le\u0301phant",
    "e\u0301le\u0300ve",
    "e\u0301ligible",
    "e\u0301litisme",
    "e\u0301loge",
    "e\u0301lucider",
    "e\u0301luder",
    "emballer",
    "embellir",
    "embryon",
    "e\u0301meraude",
    "e\u0301mission",
    "emmener",
    "e\u0301motion",
    "e\u0301mouvoir",
    "empereur",
    "employer",
    "emporter",
    "emprise",
    "e\u0301mulsion",
    "encadrer",
    "enche\u0300re",
    "enclave",
    "encoche",
    "endiguer",
    "endosser",
    "endroit",
    "enduire",
    "e\u0301nergie",
    "enfance",
    "enfermer",
    "enfouir",
    "engager",
    "engin",
    "englober",
    "e\u0301nigme",
    "enjamber",
    "enjeu",
    "enlever",
    "ennemi",
    "ennuyeux",
    "enrichir",
    "enrobage",
    "enseigne",
    "entasser",
    "entendre",
    "entier",
    "entourer",
    "entraver",
    "e\u0301nume\u0301rer",
    "envahir",
    "enviable",
    "envoyer",
    "enzyme",
    "e\u0301olien",
    "e\u0301paissir",
    "e\u0301pargne",
    "e\u0301patant",
    "e\u0301paule",
    "e\u0301picerie",
    "e\u0301pide\u0301mie",
    "e\u0301pier",
    "e\u0301pilogue",
    "e\u0301pine",
    "e\u0301pisode",
    "e\u0301pitaphe",
    "e\u0301poque",
    "e\u0301preuve",
    "e\u0301prouver",
    "e\u0301puisant",
    "e\u0301querre",
    "e\u0301quipe",
    "e\u0301riger",
    "e\u0301rosion",
    "erreur",
    "e\u0301ruption",
    "escalier",
    "espadon",
    "espe\u0300ce",
    "espie\u0300gle",
    "espoir",
    "esprit",
    "esquiver",
    "essayer",
    "essence",
    "essieu",
    "essorer",
    "estime",
    "estomac",
    "estrade",
    "e\u0301tage\u0300re",
    "e\u0301taler",
    "e\u0301tanche",
    "e\u0301tatique",
    "e\u0301teindre",
    "e\u0301tendoir",
    "e\u0301ternel",
    "e\u0301thanol",
    "e\u0301thique",
    "ethnie",
    "e\u0301tirer",
    "e\u0301toffer",
    "e\u0301toile",
    "e\u0301tonnant",
    "e\u0301tourdir",
    "e\u0301trange",
    "e\u0301troit",
    "e\u0301tude",
    "euphorie",
    "e\u0301valuer",
    "e\u0301vasion",
    "e\u0301ventail",
    "e\u0301vidence",
    "e\u0301viter",
    "e\u0301volutif",
    "e\u0301voquer",
    "exact",
    "exage\u0301rer",
    "exaucer",
    "exceller",
    "excitant",
    "exclusif",
    "excuse",
    "exe\u0301cuter",
    "exemple",
    "exercer",
    "exhaler",
    "exhorter",
    "exigence",
    "exiler",
    "exister",
    "exotique",
    "expe\u0301dier",
    "explorer",
    "exposer",
    "exprimer",
    "exquis",
    "extensif",
    "extraire",
    "exulter",
    "fable",
    "fabuleux",
    "facette",
    "facile",
    "facture",
    "faiblir",
    "falaise",
    "fameux",
    "famille",
    "farceur",
    "farfelu",
    "farine",
    "farouche",
    "fasciner",
    "fatal",
    "fatigue",
    "faucon",
    "fautif",
    "faveur",
    "favori",
    "fe\u0301brile",
    "fe\u0301conder",
    "fe\u0301de\u0301rer",
    "fe\u0301lin",
    "femme",
    "fe\u0301mur",
    "fendoir",
    "fe\u0301odal",
    "fermer",
    "fe\u0301roce",
    "ferveur",
    "festival",
    "feuille",
    "feutre",
    "fe\u0301vrier",
    "fiasco",
    "ficeler",
    "fictif",
    "fide\u0300le",
    "figure",
    "filature",
    "filetage",
    "filie\u0300re",
    "filleul",
    "filmer",
    "filou",
    "filtrer",
    "financer",
    "finir",
    "fiole",
    "firme",
    "fissure",
    "fixer",
    "flairer",
    "flamme",
    "flasque",
    "flatteur",
    "fle\u0301au",
    "fle\u0300che",
    "fleur",
    "flexion",
    "flocon",
    "flore",
    "fluctuer",
    "fluide",
    "fluvial",
    "folie",
    "fonderie",
    "fongible",
    "fontaine",
    "forcer",
    "forgeron",
    "formuler",
    "fortune",
    "fossile",
    "foudre",
    "fouge\u0300re",
    "fouiller",
    "foulure",
    "fourmi",
    "fragile",
    "fraise",
    "franchir",
    "frapper",
    "frayeur",
    "fre\u0301gate",
    "freiner",
    "frelon",
    "fre\u0301mir",
    "fre\u0301ne\u0301sie",
    "fre\u0300re",
    "friable",
    "friction",
    "frisson",
    "frivole",
    "froid",
    "fromage",
    "frontal",
    "frotter",
    "fruit",
    "fugitif",
    "fuite",
    "fureur",
    "furieux",
    "furtif",
    "fusion",
    "futur",
    "gagner",
    "galaxie",
    "galerie",
    "gambader",
    "garantir",
    "gardien",
    "garnir",
    "garrigue",
    "gazelle",
    "gazon",
    "ge\u0301ant",
    "ge\u0301latine",
    "ge\u0301lule",
    "gendarme",
    "ge\u0301ne\u0301ral",
    "ge\u0301nie",
    "genou",
    "gentil",
    "ge\u0301ologie",
    "ge\u0301ome\u0300tre",
    "ge\u0301ranium",
    "germe",
    "gestuel",
    "geyser",
    "gibier",
    "gicler",
    "girafe",
    "givre",
    "glace",
    "glaive",
    "glisser",
    "globe",
    "gloire",
    "glorieux",
    "golfeur",
    "gomme",
    "gonfler",
    "gorge",
    "gorille",
    "goudron",
    "gouffre",
    "goulot",
    "goupille",
    "gourmand",
    "goutte",
    "graduel",
    "graffiti",
    "graine",
    "grand",
    "grappin",
    "gratuit",
    "gravir",
    "grenat",
    "griffure",
    "griller",
    "grimper",
    "grogner",
    "gronder",
    "grotte",
    "groupe",
    "gruger",
    "grutier",
    "gruye\u0300re",
    "gue\u0301pard",
    "guerrier",
    "guide",
    "guimauve",
    "guitare",
    "gustatif",
    "gymnaste",
    "gyrostat",
    "habitude",
    "hachoir",
    "halte",
    "hameau",
    "hangar",
    "hanneton",
    "haricot",
    "harmonie",
    "harpon",
    "hasard",
    "he\u0301lium",
    "he\u0301matome",
    "herbe",
    "he\u0301risson",
    "hermine",
    "he\u0301ron",
    "he\u0301siter",
    "heureux",
    "hiberner",
    "hibou",
    "hilarant",
    "histoire",
    "hiver",
    "homard",
    "hommage",
    "homoge\u0300ne",
    "honneur",
    "honorer",
    "honteux",
    "horde",
    "horizon",
    "horloge",
    "hormone",
    "horrible",
    "houleux",
    "housse",
    "hublot",
    "huileux",
    "humain",
    "humble",
    "humide",
    "humour",
    "hurler",
    "hydromel",
    "hygie\u0300ne",
    "hymne",
    "hypnose",
    "idylle",
    "ignorer",
    "iguane",
    "illicite",
    "illusion",
    "image",
    "imbiber",
    "imiter",
    "immense",
    "immobile",
    "immuable",
    "impact",
    "impe\u0301rial",
    "implorer",
    "imposer",
    "imprimer",
    "imputer",
    "incarner",
    "incendie",
    "incident",
    "incliner",
    "incolore",
    "indexer",
    "indice",
    "inductif",
    "ine\u0301dit",
    "ineptie",
    "inexact",
    "infini",
    "infliger",
    "informer",
    "infusion",
    "inge\u0301rer",
    "inhaler",
    "inhiber",
    "injecter",
    "injure",
    "innocent",
    "inoculer",
    "inonder",
    "inscrire",
    "insecte",
    "insigne",
    "insolite",
    "inspirer",
    "instinct",
    "insulter",
    "intact",
    "intense",
    "intime",
    "intrigue",
    "intuitif",
    "inutile",
    "invasion",
    "inventer",
    "inviter",
    "invoquer",
    "ironique",
    "irradier",
    "irre\u0301el",
    "irriter",
    "isoler",
    "ivoire",
    "ivresse",
    "jaguar",
    "jaillir",
    "jambe",
    "janvier",
    "jardin",
    "jauger",
    "jaune",
    "javelot",
    "jetable",
    "jeton",
    "jeudi",
    "jeunesse",
    "joindre",
    "joncher",
    "jongler",
    "joueur",
    "jouissif",
    "journal",
    "jovial",
    "joyau",
    "joyeux",
    "jubiler",
    "jugement",
    "junior",
    "jupon",
    "juriste",
    "justice",
    "juteux",
    "juve\u0301nile",
    "kayak",
    "kimono",
    "kiosque",
    "label",
    "labial",
    "labourer",
    "lace\u0301rer",
    "lactose",
    "lagune",
    "laine",
    "laisser",
    "laitier",
    "lambeau",
    "lamelle",
    "lampe",
    "lanceur",
    "langage",
    "lanterne",
    "lapin",
    "largeur",
    "larme",
    "laurier",
    "lavabo",
    "lavoir",
    "lecture",
    "le\u0301gal",
    "le\u0301ger",
    "le\u0301gume",
    "lessive",
    "lettre",
    "levier",
    "lexique",
    "le\u0301zard",
    "liasse",
    "libe\u0301rer",
    "libre",
    "licence",
    "licorne",
    "lie\u0300ge",
    "lie\u0300vre",
    "ligature",
    "ligoter",
    "ligue",
    "limer",
    "limite",
    "limonade",
    "limpide",
    "line\u0301aire",
    "lingot",
    "lionceau",
    "liquide",
    "lisie\u0300re",
    "lister",
    "lithium",
    "litige",
    "littoral",
    "livreur",
    "logique",
    "lointain",
    "loisir",
    "lombric",
    "loterie",
    "louer",
    "lourd",
    "loutre",
    "louve",
    "loyal",
    "lubie",
    "lucide",
    "lucratif",
    "lueur",
    "lugubre",
    "luisant",
    "lumie\u0300re",
    "lunaire",
    "lundi",
    "luron",
    "lutter",
    "luxueux",
    "machine",
    "magasin",
    "magenta",
    "magique",
    "maigre",
    "maillon",
    "maintien",
    "mairie",
    "maison",
    "majorer",
    "malaxer",
    "male\u0301fice",
    "malheur",
    "malice",
    "mallette",
    "mammouth",
    "mandater",
    "maniable",
    "manquant",
    "manteau",
    "manuel",
    "marathon",
    "marbre",
    "marchand",
    "mardi",
    "maritime",
    "marqueur",
    "marron",
    "marteler",
    "mascotte",
    "massif",
    "mate\u0301riel",
    "matie\u0300re",
    "matraque",
    "maudire",
    "maussade",
    "mauve",
    "maximal",
    "me\u0301chant",
    "me\u0301connu",
    "me\u0301daille",
    "me\u0301decin",
    "me\u0301diter",
    "me\u0301duse",
    "meilleur",
    "me\u0301lange",
    "me\u0301lodie",
    "membre",
    "me\u0301moire",
    "menacer",
    "mener",
    "menhir",
    "mensonge",
    "mentor",
    "mercredi",
    "me\u0301rite",
    "merle",
    "messager",
    "mesure",
    "me\u0301tal",
    "me\u0301te\u0301ore",
    "me\u0301thode",
    "me\u0301tier",
    "meuble",
    "miauler",
    "microbe",
    "miette",
    "mignon",
    "migrer",
    "milieu",
    "million",
    "mimique",
    "mince",
    "mine\u0301ral",
    "minimal",
    "minorer",
    "minute",
    "miracle",
    "miroiter",
    "missile",
    "mixte",
    "mobile",
    "moderne",
    "moelleux",
    "mondial",
    "moniteur",
    "monnaie",
    "monotone",
    "monstre",
    "montagne",
    "monument",
    "moqueur",
    "morceau",
    "morsure",
    "mortier",
    "moteur",
    "motif",
    "mouche",
    "moufle",
    "moulin",
    "mousson",
    "mouton",
    "mouvant",
    "multiple",
    "munition",
    "muraille",
    "mure\u0300ne",
    "murmure",
    "muscle",
    "muse\u0301um",
    "musicien",
    "mutation",
    "muter",
    "mutuel",
    "myriade",
    "myrtille",
    "myste\u0300re",
    "mythique",
    "nageur",
    "nappe",
    "narquois",
    "narrer",
    "natation",
    "nation",
    "nature",
    "naufrage",
    "nautique",
    "navire",
    "ne\u0301buleux",
    "nectar",
    "ne\u0301faste",
    "ne\u0301gation",
    "ne\u0301gliger",
    "ne\u0301gocier",
    "neige",
    "nerveux",
    "nettoyer",
    "neurone",
    "neutron",
    "neveu",
    "niche",
    "nickel",
    "nitrate",
    "niveau",
    "noble",
    "nocif",
    "nocturne",
    "noirceur",
    "noisette",
    "nomade",
    "nombreux",
    "nommer",
    "normatif",
    "notable",
    "notifier",
    "notoire",
    "nourrir",
    "nouveau",
    "novateur",
    "novembre",
    "novice",
    "nuage",
    "nuancer",
    "nuire",
    "nuisible",
    "nume\u0301ro",
    "nuptial",
    "nuque",
    "nutritif",
    "obe\u0301ir",
    "objectif",
    "obliger",
    "obscur",
    "observer",
    "obstacle",
    "obtenir",
    "obturer",
    "occasion",
    "occuper",
    "oce\u0301an",
    "octobre",
    "octroyer",
    "octupler",
    "oculaire",
    "odeur",
    "odorant",
    "offenser",
    "officier",
    "offrir",
    "ogive",
    "oiseau",
    "oisillon",
    "olfactif",
    "olivier",
    "ombrage",
    "omettre",
    "onctueux",
    "onduler",
    "one\u0301reux",
    "onirique",
    "opale",
    "opaque",
    "ope\u0301rer",
    "opinion",
    "opportun",
    "opprimer",
    "opter",
    "optique",
    "orageux",
    "orange",
    "orbite",
    "ordonner",
    "oreille",
    "organe",
    "orgueil",
    "orifice",
    "ornement",
    "orque",
    "ortie",
    "osciller",
    "osmose",
    "ossature",
    "otarie",
    "ouragan",
    "ourson",
    "outil",
    "outrager",
    "ouvrage",
    "ovation",
    "oxyde",
    "oxyge\u0300ne",
    "ozone",
    "paisible",
    "palace",
    "palmare\u0300s",
    "palourde",
    "palper",
    "panache",
    "panda",
    "pangolin",
    "paniquer",
    "panneau",
    "panorama",
    "pantalon",
    "papaye",
    "papier",
    "papoter",
    "papyrus",
    "paradoxe",
    "parcelle",
    "paresse",
    "parfumer",
    "parler",
    "parole",
    "parrain",
    "parsemer",
    "partager",
    "parure",
    "parvenir",
    "passion",
    "paste\u0300que",
    "paternel",
    "patience",
    "patron",
    "pavillon",
    "pavoiser",
    "payer",
    "paysage",
    "peigne",
    "peintre",
    "pelage",
    "pe\u0301lican",
    "pelle",
    "pelouse",
    "peluche",
    "pendule",
    "pe\u0301ne\u0301trer",
    "pe\u0301nible",
    "pensif",
    "pe\u0301nurie",
    "pe\u0301pite",
    "pe\u0301plum",
    "perdrix",
    "perforer",
    "pe\u0301riode",
    "permuter",
    "perplexe",
    "persil",
    "perte",
    "peser",
    "pe\u0301tale",
    "petit",
    "pe\u0301trir",
    "peuple",
    "pharaon",
    "phobie",
    "phoque",
    "photon",
    "phrase",
    "physique",
    "piano",
    "pictural",
    "pie\u0300ce",
    "pierre",
    "pieuvre",
    "pilote",
    "pinceau",
    "pipette",
    "piquer",
    "pirogue",
    "piscine",
    "piston",
    "pivoter",
    "pixel",
    "pizza",
    "placard",
    "plafond",
    "plaisir",
    "planer",
    "plaque",
    "plastron",
    "plateau",
    "pleurer",
    "plexus",
    "pliage",
    "plomb",
    "plonger",
    "pluie",
    "plumage",
    "pochette",
    "poe\u0301sie",
    "poe\u0300te",
    "pointe",
    "poirier",
    "poisson",
    "poivre",
    "polaire",
    "policier",
    "pollen",
    "polygone",
    "pommade",
    "pompier",
    "ponctuel",
    "ponde\u0301rer",
    "poney",
    "portique",
    "position",
    "posse\u0301der",
    "posture",
    "potager",
    "poteau",
    "potion",
    "pouce",
    "poulain",
    "poumon",
    "pourpre",
    "poussin",
    "pouvoir",
    "prairie",
    "pratique",
    "pre\u0301cieux",
    "pre\u0301dire",
    "pre\u0301fixe",
    "pre\u0301lude",
    "pre\u0301nom",
    "pre\u0301sence",
    "pre\u0301texte",
    "pre\u0301voir",
    "primitif",
    "prince",
    "prison",
    "priver",
    "proble\u0300me",
    "proce\u0301der",
    "prodige",
    "profond",
    "progre\u0300s",
    "proie",
    "projeter",
    "prologue",
    "promener",
    "propre",
    "prospe\u0300re",
    "prote\u0301ger",
    "prouesse",
    "proverbe",
    "prudence",
    "pruneau",
    "psychose",
    "public",
    "puceron",
    "puiser",
    "pulpe",
    "pulsar",
    "punaise",
    "punitif",
    "pupitre",
    "purifier",
    "puzzle",
    "pyramide",
    "quasar",
    "querelle",
    "question",
    "quie\u0301tude",
    "quitter",
    "quotient",
    "racine",
    "raconter",
    "radieux",
    "ragondin",
    "raideur",
    "raisin",
    "ralentir",
    "rallonge",
    "ramasser",
    "rapide",
    "rasage",
    "ratisser",
    "ravager",
    "ravin",
    "rayonner",
    "re\u0301actif",
    "re\u0301agir",
    "re\u0301aliser",
    "re\u0301animer",
    "recevoir",
    "re\u0301citer",
    "re\u0301clamer",
    "re\u0301colter",
    "recruter",
    "reculer",
    "recycler",
    "re\u0301diger",
    "redouter",
    "refaire",
    "re\u0301flexe",
    "re\u0301former",
    "refrain",
    "refuge",
    "re\u0301galien",
    "re\u0301gion",
    "re\u0301glage",
    "re\u0301gulier",
    "re\u0301ite\u0301rer",
    "rejeter",
    "rejouer",
    "relatif",
    "relever",
    "relief",
    "remarque",
    "reme\u0300de",
    "remise",
    "remonter",
    "remplir",
    "remuer",
    "renard",
    "renfort",
    "renifler",
    "renoncer",
    "rentrer",
    "renvoi",
    "replier",
    "reporter",
    "reprise",
    "reptile",
    "requin",
    "re\u0301serve",
    "re\u0301sineux",
    "re\u0301soudre",
    "respect",
    "rester",
    "re\u0301sultat",
    "re\u0301tablir",
    "retenir",
    "re\u0301ticule",
    "retomber",
    "retracer",
    "re\u0301union",
    "re\u0301ussir",
    "revanche",
    "revivre",
    "re\u0301volte",
    "re\u0301vulsif",
    "richesse",
    "rideau",
    "rieur",
    "rigide",
    "rigoler",
    "rincer",
    "riposter",
    "risible",
    "risque",
    "rituel",
    "rival",
    "rivie\u0300re",
    "rocheux",
    "romance",
    "rompre",
    "ronce",
    "rondin",
    "roseau",
    "rosier",
    "rotatif",
    "rotor",
    "rotule",
    "rouge",
    "rouille",
    "rouleau",
    "routine",
    "royaume",
    "ruban",
    "rubis",
    "ruche",
    "ruelle",
    "rugueux",
    "ruiner",
    "ruisseau",
    "ruser",
    "rustique",
    "rythme",
    "sabler",
    "saboter",
    "sabre",
    "sacoche",
    "safari",
    "sagesse",
    "saisir",
    "salade",
    "salive",
    "salon",
    "saluer",
    "samedi",
    "sanction",
    "sanglier",
    "sarcasme",
    "sardine",
    "saturer",
    "saugrenu",
    "saumon",
    "sauter",
    "sauvage",
    "savant",
    "savonner",
    "scalpel",
    "scandale",
    "sce\u0301le\u0301rat",
    "sce\u0301nario",
    "sceptre",
    "sche\u0301ma",
    "science",
    "scinder",
    "score",
    "scrutin",
    "sculpter",
    "se\u0301ance",
    "se\u0301cable",
    "se\u0301cher",
    "secouer",
    "se\u0301cre\u0301ter",
    "se\u0301datif",
    "se\u0301duire",
    "seigneur",
    "se\u0301jour",
    "se\u0301lectif",
    "semaine",
    "sembler",
    "semence",
    "se\u0301minal",
    "se\u0301nateur",
    "sensible",
    "sentence",
    "se\u0301parer",
    "se\u0301quence",
    "serein",
    "sergent",
    "se\u0301rieux",
    "serrure",
    "se\u0301rum",
    "service",
    "se\u0301same",
    "se\u0301vir",
    "sevrage",
    "sextuple",
    "side\u0301ral",
    "sie\u0300cle",
    "sie\u0301ger",
    "siffler",
    "sigle",
    "signal",
    "silence",
    "silicium",
    "simple",
    "since\u0300re",
    "sinistre",
    "siphon",
    "sirop",
    "sismique",
    "situer",
    "skier",
    "social",
    "socle",
    "sodium",
    "soigneux",
    "soldat",
    "soleil",
    "solitude",
    "soluble",
    "sombre",
    "sommeil",
    "somnoler",
    "sonde",
    "songeur",
    "sonnette",
    "sonore",
    "sorcier",
    "sortir",
    "sosie",
    "sottise",
    "soucieux",
    "soudure",
    "souffle",
    "soulever",
    "soupape",
    "source",
    "soutirer",
    "souvenir",
    "spacieux",
    "spatial",
    "spe\u0301cial",
    "sphe\u0300re",
    "spiral",
    "stable",
    "station",
    "sternum",
    "stimulus",
    "stipuler",
    "strict",
    "studieux",
    "stupeur",
    "styliste",
    "sublime",
    "substrat",
    "subtil",
    "subvenir",
    "succe\u0300s",
    "sucre",
    "suffixe",
    "sugge\u0301rer",
    "suiveur",
    "sulfate",
    "superbe",
    "supplier",
    "surface",
    "suricate",
    "surmener",
    "surprise",
    "sursaut",
    "survie",
    "suspect",
    "syllabe",
    "symbole",
    "syme\u0301trie",
    "synapse",
    "syntaxe",
    "syste\u0300me",
    "tabac",
    "tablier",
    "tactile",
    "tailler",
    "talent",
    "talisman",
    "talonner",
    "tambour",
    "tamiser",
    "tangible",
    "tapis",
    "taquiner",
    "tarder",
    "tarif",
    "tartine",
    "tasse",
    "tatami",
    "tatouage",
    "taupe",
    "taureau",
    "taxer",
    "te\u0301moin",
    "temporel",
    "tenaille",
    "tendre",
    "teneur",
    "tenir",
    "tension",
    "terminer",
    "terne",
    "terrible",
    "te\u0301tine",
    "texte",
    "the\u0300me",
    "the\u0301orie",
    "the\u0301rapie",
    "thorax",
    "tibia",
    "tie\u0300de",
    "timide",
    "tirelire",
    "tiroir",
    "tissu",
    "titane",
    "titre",
    "tituber",
    "toboggan",
    "tole\u0301rant",
    "tomate",
    "tonique",
    "tonneau",
    "toponyme",
    "torche",
    "tordre",
    "tornade",
    "torpille",
    "torrent",
    "torse",
    "tortue",
    "totem",
    "toucher",
    "tournage",
    "tousser",
    "toxine",
    "traction",
    "trafic",
    "tragique",
    "trahir",
    "train",
    "trancher",
    "travail",
    "tre\u0300fle",
    "tremper",
    "tre\u0301sor",
    "treuil",
    "triage",
    "tribunal",
    "tricoter",
    "trilogie",
    "triomphe",
    "tripler",
    "triturer",
    "trivial",
    "trombone",
    "tronc",
    "tropical",
    "troupeau",
    "tuile",
    "tulipe",
    "tumulte",
    "tunnel",
    "turbine",
    "tuteur",
    "tutoyer",
    "tuyau",
    "tympan",
    "typhon",
    "typique",
    "tyran",
    "ubuesque",
    "ultime",
    "ultrason",
    "unanime",
    "unifier",
    "union",
    "unique",
    "unitaire",
    "univers",
    "uranium",
    "urbain",
    "urticant",
    "usage",
    "usine",
    "usuel",
    "usure",
    "utile",
    "utopie",
    "vacarme",
    "vaccin",
    "vagabond",
    "vague",
    "vaillant",
    "vaincre",
    "vaisseau",
    "valable",
    "valise",
    "vallon",
    "valve",
    "vampire",
    "vanille",
    "vapeur",
    "varier",
    "vaseux",
    "vassal",
    "vaste",
    "vecteur",
    "vedette",
    "ve\u0301ge\u0301tal",
    "ve\u0301hicule",
    "veinard",
    "ve\u0301loce",
    "vendredi",
    "ve\u0301ne\u0301rer",
    "venger",
    "venimeux",
    "ventouse",
    "verdure",
    "ve\u0301rin",
    "vernir",
    "verrou",
    "verser",
    "vertu",
    "veston",
    "ve\u0301te\u0301ran",
    "ve\u0301tuste",
    "vexant",
    "vexer",
    "viaduc",
    "viande",
    "victoire",
    "vidange",
    "vide\u0301o",
    "vignette",
    "vigueur",
    "vilain",
    "village",
    "vinaigre",
    "violon",
    "vipe\u0300re",
    "virement",
    "virtuose",
    "virus",
    "visage",
    "viseur",
    "vision",
    "visqueux",
    "visuel",
    "vital",
    "vitesse",
    "viticole",
    "vitrine",
    "vivace",
    "vivipare",
    "vocation",
    "voguer",
    "voile",
    "voisin",
    "voiture",
    "volaille",
    "volcan",
    "voltiger",
    "volume",
    "vorace",
    "vortex",
    "voter",
    "vouloir",
    "voyage",
    "voyelle",
    "wagon",
    "xe\u0301non",
    "yacht",
    "ze\u0300bre",
    "ze\u0301nith",
    "zeste",
    "zoologie"
];
module.exports = $c345d281b6eda4a5$var$french;

});

parcelRegister("2OnXB", function(module, exports) {
"use strict";
var $20c2d651e9e3cd93$var$italian = [
    "abaco",
    "abbaglio",
    "abbinato",
    "abete",
    "abisso",
    "abolire",
    "abrasivo",
    "abrogato",
    "accadere",
    "accenno",
    "accusato",
    "acetone",
    "achille",
    "acido",
    "acqua",
    "acre",
    "acrilico",
    "acrobata",
    "acuto",
    "adagio",
    "addebito",
    "addome",
    "adeguato",
    "aderire",
    "adipe",
    "adottare",
    "adulare",
    "affabile",
    "affetto",
    "affisso",
    "affranto",
    "aforisma",
    "afoso",
    "africano",
    "agave",
    "agente",
    "agevole",
    "aggancio",
    "agire",
    "agitare",
    "agonismo",
    "agricolo",
    "agrumeto",
    "aguzzo",
    "alabarda",
    "alato",
    "albatro",
    "alberato",
    "albo",
    "albume",
    "alce",
    "alcolico",
    "alettone",
    "alfa",
    "algebra",
    "aliante",
    "alibi",
    "alimento",
    "allagato",
    "allegro",
    "allievo",
    "allodola",
    "allusivo",
    "almeno",
    "alogeno",
    "alpaca",
    "alpestre",
    "altalena",
    "alterno",
    "alticcio",
    "altrove",
    "alunno",
    "alveolo",
    "alzare",
    "amalgama",
    "amanita",
    "amarena",
    "ambito",
    "ambrato",
    "ameba",
    "america",
    "ametista",
    "amico",
    "ammasso",
    "ammenda",
    "ammirare",
    "ammonito",
    "amore",
    "ampio",
    "ampliare",
    "amuleto",
    "anacardo",
    "anagrafe",
    "analista",
    "anarchia",
    "anatra",
    "anca",
    "ancella",
    "ancora",
    "andare",
    "andrea",
    "anello",
    "angelo",
    "angolare",
    "angusto",
    "anima",
    "annegare",
    "annidato",
    "anno",
    "annuncio",
    "anonimo",
    "anticipo",
    "anzi",
    "apatico",
    "apertura",
    "apode",
    "apparire",
    "appetito",
    "appoggio",
    "approdo",
    "appunto",
    "aprile",
    "arabica",
    "arachide",
    "aragosta",
    "araldica",
    "arancio",
    "aratura",
    "arazzo",
    "arbitro",
    "archivio",
    "ardito",
    "arenile",
    "argento",
    "argine",
    "arguto",
    "aria",
    "armonia",
    "arnese",
    "arredato",
    "arringa",
    "arrosto",
    "arsenico",
    "arso",
    "artefice",
    "arzillo",
    "asciutto",
    "ascolto",
    "asepsi",
    "asettico",
    "asfalto",
    "asino",
    "asola",
    "aspirato",
    "aspro",
    "assaggio",
    "asse",
    "assoluto",
    "assurdo",
    "asta",
    "astenuto",
    "astice",
    "astratto",
    "atavico",
    "ateismo",
    "atomico",
    "atono",
    "attesa",
    "attivare",
    "attorno",
    "attrito",
    "attuale",
    "ausilio",
    "austria",
    "autista",
    "autonomo",
    "autunno",
    "avanzato",
    "avere",
    "avvenire",
    "avviso",
    "avvolgere",
    "azione",
    "azoto",
    "azzimo",
    "azzurro",
    "babele",
    "baccano",
    "bacino",
    "baco",
    "badessa",
    "badilata",
    "bagnato",
    "baita",
    "balcone",
    "baldo",
    "balena",
    "ballata",
    "balzano",
    "bambino",
    "bandire",
    "baraonda",
    "barbaro",
    "barca",
    "baritono",
    "barlume",
    "barocco",
    "basilico",
    "basso",
    "batosta",
    "battuto",
    "baule",
    "bava",
    "bavosa",
    "becco",
    "beffa",
    "belgio",
    "belva",
    "benda",
    "benevole",
    "benigno",
    "benzina",
    "bere",
    "berlina",
    "beta",
    "bibita",
    "bici",
    "bidone",
    "bifido",
    "biga",
    "bilancia",
    "bimbo",
    "binocolo",
    "biologo",
    "bipede",
    "bipolare",
    "birbante",
    "birra",
    "biscotto",
    "bisesto",
    "bisnonno",
    "bisonte",
    "bisturi",
    "bizzarro",
    "blando",
    "blatta",
    "bollito",
    "bonifico",
    "bordo",
    "bosco",
    "botanico",
    "bottino",
    "bozzolo",
    "braccio",
    "bradipo",
    "brama",
    "branca",
    "bravura",
    "bretella",
    "brevetto",
    "brezza",
    "briglia",
    "brillante",
    "brindare",
    "broccolo",
    "brodo",
    "bronzina",
    "brullo",
    "bruno",
    "bubbone",
    "buca",
    "budino",
    "buffone",
    "buio",
    "bulbo",
    "buono",
    "burlone",
    "burrasca",
    "bussola",
    "busta",
    "cadetto",
    "caduco",
    "calamaro",
    "calcolo",
    "calesse",
    "calibro",
    "calmo",
    "caloria",
    "cambusa",
    "camerata",
    "camicia",
    "cammino",
    "camola",
    "campale",
    "canapa",
    "candela",
    "cane",
    "canino",
    "canotto",
    "cantina",
    "capace",
    "capello",
    "capitolo",
    "capogiro",
    "cappero",
    "capra",
    "capsula",
    "carapace",
    "carcassa",
    "cardo",
    "carisma",
    "carovana",
    "carretto",
    "cartolina",
    "casaccio",
    "cascata",
    "caserma",
    "caso",
    "cassone",
    "castello",
    "casuale",
    "catasta",
    "catena",
    "catrame",
    "cauto",
    "cavillo",
    "cedibile",
    "cedrata",
    "cefalo",
    "celebre",
    "cellulare",
    "cena",
    "cenone",
    "centesimo",
    "ceramica",
    "cercare",
    "certo",
    "cerume",
    "cervello",
    "cesoia",
    "cespo",
    "ceto",
    "chela",
    "chiaro",
    "chicca",
    "chiedere",
    "chimera",
    "china",
    "chirurgo",
    "chitarra",
    "ciao",
    "ciclismo",
    "cifrare",
    "cigno",
    "cilindro",
    "ciottolo",
    "circa",
    "cirrosi",
    "citrico",
    "cittadino",
    "ciuffo",
    "civetta",
    "civile",
    "classico",
    "clinica",
    "cloro",
    "cocco",
    "codardo",
    "codice",
    "coerente",
    "cognome",
    "collare",
    "colmato",
    "colore",
    "colposo",
    "coltivato",
    "colza",
    "coma",
    "cometa",
    "commando",
    "comodo",
    "computer",
    "comune",
    "conciso",
    "condurre",
    "conferma",
    "congelare",
    "coniuge",
    "connesso",
    "conoscere",
    "consumo",
    "continuo",
    "convegno",
    "coperto",
    "copione",
    "coppia",
    "copricapo",
    "corazza",
    "cordata",
    "coricato",
    "cornice",
    "corolla",
    "corpo",
    "corredo",
    "corsia",
    "cortese",
    "cosmico",
    "costante",
    "cottura",
    "covato",
    "cratere",
    "cravatta",
    "creato",
    "credere",
    "cremoso",
    "crescita",
    "creta",
    "criceto",
    "crinale",
    "crisi",
    "critico",
    "croce",
    "cronaca",
    "crostata",
    "cruciale",
    "crusca",
    "cucire",
    "cuculo",
    "cugino",
    "cullato",
    "cupola",
    "curatore",
    "cursore",
    "curvo",
    "cuscino",
    "custode",
    "dado",
    "daino",
    "dalmata",
    "damerino",
    "daniela",
    "dannoso",
    "danzare",
    "datato",
    "davanti",
    "davvero",
    "debutto",
    "decennio",
    "deciso",
    "declino",
    "decollo",
    "decreto",
    "dedicato",
    "definito",
    "deforme",
    "degno",
    "delegare",
    "delfino",
    "delirio",
    "delta",
    "demenza",
    "denotato",
    "dentro",
    "deposito",
    "derapata",
    "derivare",
    "deroga",
    "descritto",
    "deserto",
    "desiderio",
    "desumere",
    "detersivo",
    "devoto",
    "diametro",
    "dicembre",
    "diedro",
    "difeso",
    "diffuso",
    "digerire",
    "digitale",
    "diluvio",
    "dinamico",
    "dinnanzi",
    "dipinto",
    "diploma",
    "dipolo",
    "diradare",
    "dire",
    "dirotto",
    "dirupo",
    "disagio",
    "discreto",
    "disfare",
    "disgelo",
    "disposto",
    "distanza",
    "disumano",
    "dito",
    "divano",
    "divelto",
    "dividere",
    "divorato",
    "doblone",
    "docente",
    "doganale",
    "dogma",
    "dolce",
    "domato",
    "domenica",
    "dominare",
    "dondolo",
    "dono",
    "dormire",
    "dote",
    "dottore",
    "dovuto",
    "dozzina",
    "drago",
    "druido",
    "dubbio",
    "dubitare",
    "ducale",
    "duna",
    "duomo",
    "duplice",
    "duraturo",
    "ebano",
    "eccesso",
    "ecco",
    "eclissi",
    "economia",
    "edera",
    "edicola",
    "edile",
    "editoria",
    "educare",
    "egemonia",
    "egli",
    "egoismo",
    "egregio",
    "elaborato",
    "elargire",
    "elegante",
    "elencato",
    "eletto",
    "elevare",
    "elfico",
    "elica",
    "elmo",
    "elsa",
    "eluso",
    "emanato",
    "emblema",
    "emesso",
    "emiro",
    "emotivo",
    "emozione",
    "empirico",
    "emulo",
    "endemico",
    "enduro",
    "energia",
    "enfasi",
    "enoteca",
    "entrare",
    "enzima",
    "epatite",
    "epilogo",
    "episodio",
    "epocale",
    "eppure",
    "equatore",
    "erario",
    "erba",
    "erboso",
    "erede",
    "eremita",
    "erigere",
    "ermetico",
    "eroe",
    "erosivo",
    "errante",
    "esagono",
    "esame",
    "esanime",
    "esaudire",
    "esca",
    "esempio",
    "esercito",
    "esibito",
    "esigente",
    "esistere",
    "esito",
    "esofago",
    "esortato",
    "esoso",
    "espanso",
    "espresso",
    "essenza",
    "esso",
    "esteso",
    "estimare",
    "estonia",
    "estroso",
    "esultare",
    "etilico",
    "etnico",
    "etrusco",
    "etto",
    "euclideo",
    "europa",
    "evaso",
    "evidenza",
    "evitato",
    "evoluto",
    "evviva",
    "fabbrica",
    "faccenda",
    "fachiro",
    "falco",
    "famiglia",
    "fanale",
    "fanfara",
    "fango",
    "fantasma",
    "fare",
    "farfalla",
    "farinoso",
    "farmaco",
    "fascia",
    "fastoso",
    "fasullo",
    "faticare",
    "fato",
    "favoloso",
    "febbre",
    "fecola",
    "fede",
    "fegato",
    "felpa",
    "feltro",
    "femmina",
    "fendere",
    "fenomeno",
    "fermento",
    "ferro",
    "fertile",
    "fessura",
    "festivo",
    "fetta",
    "feudo",
    "fiaba",
    "fiducia",
    "fifa",
    "figurato",
    "filo",
    "finanza",
    "finestra",
    "finire",
    "fiore",
    "fiscale",
    "fisico",
    "fiume",
    "flacone",
    "flamenco",
    "flebo",
    "flemma",
    "florido",
    "fluente",
    "fluoro",
    "fobico",
    "focaccia",
    "focoso",
    "foderato",
    "foglio",
    "folata",
    "folclore",
    "folgore",
    "fondente",
    "fonetico",
    "fonia",
    "fontana",
    "forbito",
    "forchetta",
    "foresta",
    "formica",
    "fornaio",
    "foro",
    "fortezza",
    "forzare",
    "fosfato",
    "fosso",
    "fracasso",
    "frana",
    "frassino",
    "fratello",
    "freccetta",
    "frenata",
    "fresco",
    "frigo",
    "frollino",
    "fronde",
    "frugale",
    "frutta",
    "fucilata",
    "fucsia",
    "fuggente",
    "fulmine",
    "fulvo",
    "fumante",
    "fumetto",
    "fumoso",
    "fune",
    "funzione",
    "fuoco",
    "furbo",
    "furgone",
    "furore",
    "fuso",
    "futile",
    "gabbiano",
    "gaffe",
    "galateo",
    "gallina",
    "galoppo",
    "gambero",
    "gamma",
    "garanzia",
    "garbo",
    "garofano",
    "garzone",
    "gasdotto",
    "gasolio",
    "gastrico",
    "gatto",
    "gaudio",
    "gazebo",
    "gazzella",
    "geco",
    "gelatina",
    "gelso",
    "gemello",
    "gemmato",
    "gene",
    "genitore",
    "gennaio",
    "genotipo",
    "gergo",
    "ghepardo",
    "ghiaccio",
    "ghisa",
    "giallo",
    "gilda",
    "ginepro",
    "giocare",
    "gioiello",
    "giorno",
    "giove",
    "girato",
    "girone",
    "gittata",
    "giudizio",
    "giurato",
    "giusto",
    "globulo",
    "glutine",
    "gnomo",
    "gobba",
    "golf",
    "gomito",
    "gommone",
    "gonfio",
    "gonna",
    "governo",
    "gracile",
    "grado",
    "grafico",
    "grammo",
    "grande",
    "grattare",
    "gravoso",
    "grazia",
    "greca",
    "gregge",
    "grifone",
    "grigio",
    "grinza",
    "grotta",
    "gruppo",
    "guadagno",
    "guaio",
    "guanto",
    "guardare",
    "gufo",
    "guidare",
    "ibernato",
    "icona",
    "identico",
    "idillio",
    "idolo",
    "idra",
    "idrico",
    "idrogeno",
    "igiene",
    "ignaro",
    "ignorato",
    "ilare",
    "illeso",
    "illogico",
    "illudere",
    "imballo",
    "imbevuto",
    "imbocco",
    "imbuto",
    "immane",
    "immerso",
    "immolato",
    "impacco",
    "impeto",
    "impiego",
    "importo",
    "impronta",
    "inalare",
    "inarcare",
    "inattivo",
    "incanto",
    "incendio",
    "inchino",
    "incisivo",
    "incluso",
    "incontro",
    "incrocio",
    "incubo",
    "indagine",
    "india",
    "indole",
    "inedito",
    "infatti",
    "infilare",
    "inflitto",
    "ingaggio",
    "ingegno",
    "inglese",
    "ingordo",
    "ingrosso",
    "innesco",
    "inodore",
    "inoltrare",
    "inondato",
    "insano",
    "insetto",
    "insieme",
    "insonnia",
    "insulina",
    "intasato",
    "intero",
    "intonaco",
    "intuito",
    "inumidire",
    "invalido",
    "invece",
    "invito",
    "iperbole",
    "ipnotico",
    "ipotesi",
    "ippica",
    "iride",
    "irlanda",
    "ironico",
    "irrigato",
    "irrorare",
    "isolato",
    "isotopo",
    "isterico",
    "istituto",
    "istrice",
    "italia",
    "iterare",
    "labbro",
    "labirinto",
    "lacca",
    "lacerato",
    "lacrima",
    "lacuna",
    "laddove",
    "lago",
    "lampo",
    "lancetta",
    "lanterna",
    "lardoso",
    "larga",
    "laringe",
    "lastra",
    "latenza",
    "latino",
    "lattuga",
    "lavagna",
    "lavoro",
    "legale",
    "leggero",
    "lembo",
    "lentezza",
    "lenza",
    "leone",
    "lepre",
    "lesivo",
    "lessato",
    "lesto",
    "letterale",
    "leva",
    "levigato",
    "libero",
    "lido",
    "lievito",
    "lilla",
    "limatura",
    "limitare",
    "limpido",
    "lineare",
    "lingua",
    "liquido",
    "lira",
    "lirica",
    "lisca",
    "lite",
    "litigio",
    "livrea",
    "locanda",
    "lode",
    "logica",
    "lombare",
    "londra",
    "longevo",
    "loquace",
    "lorenzo",
    "loto",
    "lotteria",
    "luce",
    "lucidato",
    "lumaca",
    "luminoso",
    "lungo",
    "lupo",
    "luppolo",
    "lusinga",
    "lusso",
    "lutto",
    "macabro",
    "macchina",
    "macero",
    "macinato",
    "madama",
    "magico",
    "maglia",
    "magnete",
    "magro",
    "maiolica",
    "malafede",
    "malgrado",
    "malinteso",
    "malsano",
    "malto",
    "malumore",
    "mana",
    "mancia",
    "mandorla",
    "mangiare",
    "manifesto",
    "mannaro",
    "manovra",
    "mansarda",
    "mantide",
    "manubrio",
    "mappa",
    "maratona",
    "marcire",
    "maretta",
    "marmo",
    "marsupio",
    "maschera",
    "massaia",
    "mastino",
    "materasso",
    "matricola",
    "mattone",
    "maturo",
    "mazurca",
    "meandro",
    "meccanico",
    "mecenate",
    "medesimo",
    "meditare",
    "mega",
    "melassa",
    "melis",
    "melodia",
    "meninge",
    "meno",
    "mensola",
    "mercurio",
    "merenda",
    "merlo",
    "meschino",
    "mese",
    "messere",
    "mestolo",
    "metallo",
    "metodo",
    "mettere",
    "miagolare",
    "mica",
    "micelio",
    "michele",
    "microbo",
    "midollo",
    "miele",
    "migliore",
    "milano",
    "milite",
    "mimosa",
    "minerale",
    "mini",
    "minore",
    "mirino",
    "mirtillo",
    "miscela",
    "missiva",
    "misto",
    "misurare",
    "mitezza",
    "mitigare",
    "mitra",
    "mittente",
    "mnemonico",
    "modello",
    "modifica",
    "modulo",
    "mogano",
    "mogio",
    "mole",
    "molosso",
    "monastero",
    "monco",
    "mondina",
    "monetario",
    "monile",
    "monotono",
    "monsone",
    "montato",
    "monviso",
    "mora",
    "mordere",
    "morsicato",
    "mostro",
    "motivato",
    "motosega",
    "motto",
    "movenza",
    "movimento",
    "mozzo",
    "mucca",
    "mucosa",
    "muffa",
    "mughetto",
    "mugnaio",
    "mulatto",
    "mulinello",
    "multiplo",
    "mummia",
    "munto",
    "muovere",
    "murale",
    "musa",
    "muscolo",
    "musica",
    "mutevole",
    "muto",
    "nababbo",
    "nafta",
    "nanometro",
    "narciso",
    "narice",
    "narrato",
    "nascere",
    "nastrare",
    "naturale",
    "nautica",
    "naviglio",
    "nebulosa",
    "necrosi",
    "negativo",
    "negozio",
    "nemmeno",
    "neofita",
    "neretto",
    "nervo",
    "nessuno",
    "nettuno",
    "neutrale",
    "neve",
    "nevrotico",
    "nicchia",
    "ninfa",
    "nitido",
    "nobile",
    "nocivo",
    "nodo",
    "nome",
    "nomina",
    "nordico",
    "normale",
    "norvegese",
    "nostrano",
    "notare",
    "notizia",
    "notturno",
    "novella",
    "nucleo",
    "nulla",
    "numero",
    "nuovo",
    "nutrire",
    "nuvola",
    "nuziale",
    "oasi",
    "obbedire",
    "obbligo",
    "obelisco",
    "oblio",
    "obolo",
    "obsoleto",
    "occasione",
    "occhio",
    "occidente",
    "occorrere",
    "occultare",
    "ocra",
    "oculato",
    "odierno",
    "odorare",
    "offerta",
    "offrire",
    "offuscato",
    "oggetto",
    "oggi",
    "ognuno",
    "olandese",
    "olfatto",
    "oliato",
    "oliva",
    "ologramma",
    "oltre",
    "omaggio",
    "ombelico",
    "ombra",
    "omega",
    "omissione",
    "ondoso",
    "onere",
    "onice",
    "onnivoro",
    "onorevole",
    "onta",
    "operato",
    "opinione",
    "opposto",
    "oracolo",
    "orafo",
    "ordine",
    "orecchino",
    "orefice",
    "orfano",
    "organico",
    "origine",
    "orizzonte",
    "orma",
    "ormeggio",
    "ornativo",
    "orologio",
    "orrendo",
    "orribile",
    "ortensia",
    "ortica",
    "orzata",
    "orzo",
    "osare",
    "oscurare",
    "osmosi",
    "ospedale",
    "ospite",
    "ossa",
    "ossidare",
    "ostacolo",
    "oste",
    "otite",
    "otre",
    "ottagono",
    "ottimo",
    "ottobre",
    "ovale",
    "ovest",
    "ovino",
    "oviparo",
    "ovocito",
    "ovunque",
    "ovviare",
    "ozio",
    "pacchetto",
    "pace",
    "pacifico",
    "padella",
    "padrone",
    "paese",
    "paga",
    "pagina",
    "palazzina",
    "palesare",
    "pallido",
    "palo",
    "palude",
    "pandoro",
    "pannello",
    "paolo",
    "paonazzo",
    "paprica",
    "parabola",
    "parcella",
    "parere",
    "pargolo",
    "pari",
    "parlato",
    "parola",
    "partire",
    "parvenza",
    "parziale",
    "passivo",
    "pasticca",
    "patacca",
    "patologia",
    "pattume",
    "pavone",
    "peccato",
    "pedalare",
    "pedonale",
    "peggio",
    "peloso",
    "penare",
    "pendice",
    "penisola",
    "pennuto",
    "penombra",
    "pensare",
    "pentola",
    "pepe",
    "pepita",
    "perbene",
    "percorso",
    "perdonato",
    "perforare",
    "pergamena",
    "periodo",
    "permesso",
    "perno",
    "perplesso",
    "persuaso",
    "pertugio",
    "pervaso",
    "pesatore",
    "pesista",
    "peso",
    "pestifero",
    "petalo",
    "pettine",
    "petulante",
    "pezzo",
    "piacere",
    "pianta",
    "piattino",
    "piccino",
    "picozza",
    "piega",
    "pietra",
    "piffero",
    "pigiama",
    "pigolio",
    "pigro",
    "pila",
    "pilifero",
    "pillola",
    "pilota",
    "pimpante",
    "pineta",
    "pinna",
    "pinolo",
    "pioggia",
    "piombo",
    "piramide",
    "piretico",
    "pirite",
    "pirolisi",
    "pitone",
    "pizzico",
    "placebo",
    "planare",
    "plasma",
    "platano",
    "plenario",
    "pochezza",
    "poderoso",
    "podismo",
    "poesia",
    "poggiare",
    "polenta",
    "poligono",
    "pollice",
    "polmonite",
    "polpetta",
    "polso",
    "poltrona",
    "polvere",
    "pomice",
    "pomodoro",
    "ponte",
    "popoloso",
    "porfido",
    "poroso",
    "porpora",
    "porre",
    "portata",
    "posa",
    "positivo",
    "possesso",
    "postulato",
    "potassio",
    "potere",
    "pranzo",
    "prassi",
    "pratica",
    "precluso",
    "predica",
    "prefisso",
    "pregiato",
    "prelievo",
    "premere",
    "prenotare",
    "preparato",
    "presenza",
    "pretesto",
    "prevalso",
    "prima",
    "principe",
    "privato",
    "problema",
    "procura",
    "produrre",
    "profumo",
    "progetto",
    "prolunga",
    "promessa",
    "pronome",
    "proposta",
    "proroga",
    "proteso",
    "prova",
    "prudente",
    "prugna",
    "prurito",
    "psiche",
    "pubblico",
    "pudica",
    "pugilato",
    "pugno",
    "pulce",
    "pulito",
    "pulsante",
    "puntare",
    "pupazzo",
    "pupilla",
    "puro",
    "quadro",
    "qualcosa",
    "quasi",
    "querela",
    "quota",
    "raccolto",
    "raddoppio",
    "radicale",
    "radunato",
    "raffica",
    "ragazzo",
    "ragione",
    "ragno",
    "ramarro",
    "ramingo",
    "ramo",
    "randagio",
    "rantolare",
    "rapato",
    "rapina",
    "rappreso",
    "rasatura",
    "raschiato",
    "rasente",
    "rassegna",
    "rastrello",
    "rata",
    "ravveduto",
    "reale",
    "recepire",
    "recinto",
    "recluta",
    "recondito",
    "recupero",
    "reddito",
    "redimere",
    "regalato",
    "registro",
    "regola",
    "regresso",
    "relazione",
    "remare",
    "remoto",
    "renna",
    "replica",
    "reprimere",
    "reputare",
    "resa",
    "residente",
    "responso",
    "restauro",
    "rete",
    "retina",
    "retorica",
    "rettifica",
    "revocato",
    "riassunto",
    "ribadire",
    "ribelle",
    "ribrezzo",
    "ricarica",
    "ricco",
    "ricevere",
    "riciclato",
    "ricordo",
    "ricreduto",
    "ridicolo",
    "ridurre",
    "rifasare",
    "riflesso",
    "riforma",
    "rifugio",
    "rigare",
    "rigettato",
    "righello",
    "rilassato",
    "rilevato",
    "rimanere",
    "rimbalzo",
    "rimedio",
    "rimorchio",
    "rinascita",
    "rincaro",
    "rinforzo",
    "rinnovo",
    "rinomato",
    "rinsavito",
    "rintocco",
    "rinuncia",
    "rinvenire",
    "riparato",
    "ripetuto",
    "ripieno",
    "riportare",
    "ripresa",
    "ripulire",
    "risata",
    "rischio",
    "riserva",
    "risibile",
    "riso",
    "rispetto",
    "ristoro",
    "risultato",
    "risvolto",
    "ritardo",
    "ritegno",
    "ritmico",
    "ritrovo",
    "riunione",
    "riva",
    "riverso",
    "rivincita",
    "rivolto",
    "rizoma",
    "roba",
    "robotico",
    "robusto",
    "roccia",
    "roco",
    "rodaggio",
    "rodere",
    "roditore",
    "rogito",
    "rollio",
    "romantico",
    "rompere",
    "ronzio",
    "rosolare",
    "rospo",
    "rotante",
    "rotondo",
    "rotula",
    "rovescio",
    "rubizzo",
    "rubrica",
    "ruga",
    "rullino",
    "rumine",
    "rumoroso",
    "ruolo",
    "rupe",
    "russare",
    "rustico",
    "sabato",
    "sabbiare",
    "sabotato",
    "sagoma",
    "salasso",
    "saldatura",
    "salgemma",
    "salivare",
    "salmone",
    "salone",
    "saltare",
    "saluto",
    "salvo",
    "sapere",
    "sapido",
    "saporito",
    "saraceno",
    "sarcasmo",
    "sarto",
    "sassoso",
    "satellite",
    "satira",
    "satollo",
    "saturno",
    "savana",
    "savio",
    "saziato",
    "sbadiglio",
    "sbalzo",
    "sbancato",
    "sbarra",
    "sbattere",
    "sbavare",
    "sbendare",
    "sbirciare",
    "sbloccato",
    "sbocciato",
    "sbrinare",
    "sbruffone",
    "sbuffare",
    "scabroso",
    "scadenza",
    "scala",
    "scambiare",
    "scandalo",
    "scapola",
    "scarso",
    "scatenare",
    "scavato",
    "scelto",
    "scenico",
    "scettro",
    "scheda",
    "schiena",
    "sciarpa",
    "scienza",
    "scindere",
    "scippo",
    "sciroppo",
    "scivolo",
    "sclerare",
    "scodella",
    "scolpito",
    "scomparto",
    "sconforto",
    "scoprire",
    "scorta",
    "scossone",
    "scozzese",
    "scriba",
    "scrollare",
    "scrutinio",
    "scuderia",
    "scultore",
    "scuola",
    "scuro",
    "scusare",
    "sdebitare",
    "sdoganare",
    "seccatura",
    "secondo",
    "sedano",
    "seggiola",
    "segnalato",
    "segregato",
    "seguito",
    "selciato",
    "selettivo",
    "sella",
    "selvaggio",
    "semaforo",
    "sembrare",
    "seme",
    "seminato",
    "sempre",
    "senso",
    "sentire",
    "sepolto",
    "sequenza",
    "serata",
    "serbato",
    "sereno",
    "serio",
    "serpente",
    "serraglio",
    "servire",
    "sestina",
    "setola",
    "settimana",
    "sfacelo",
    "sfaldare",
    "sfamato",
    "sfarzoso",
    "sfaticato",
    "sfera",
    "sfida",
    "sfilato",
    "sfinge",
    "sfocato",
    "sfoderare",
    "sfogo",
    "sfoltire",
    "sforzato",
    "sfratto",
    "sfruttato",
    "sfuggito",
    "sfumare",
    "sfuso",
    "sgabello",
    "sgarbato",
    "sgonfiare",
    "sgorbio",
    "sgrassato",
    "sguardo",
    "sibilo",
    "siccome",
    "sierra",
    "sigla",
    "signore",
    "silenzio",
    "sillaba",
    "simbolo",
    "simpatico",
    "simulato",
    "sinfonia",
    "singolo",
    "sinistro",
    "sino",
    "sintesi",
    "sinusoide",
    "sipario",
    "sisma",
    "sistole",
    "situato",
    "slitta",
    "slogatura",
    "sloveno",
    "smarrito",
    "smemorato",
    "smentito",
    "smeraldo",
    "smilzo",
    "smontare",
    "smottato",
    "smussato",
    "snellire",
    "snervato",
    "snodo",
    "sobbalzo",
    "sobrio",
    "soccorso",
    "sociale",
    "sodale",
    "soffitto",
    "sogno",
    "soldato",
    "solenne",
    "solido",
    "sollazzo",
    "solo",
    "solubile",
    "solvente",
    "somatico",
    "somma",
    "sonda",
    "sonetto",
    "sonnifero",
    "sopire",
    "soppeso",
    "sopra",
    "sorgere",
    "sorpasso",
    "sorriso",
    "sorso",
    "sorteggio",
    "sorvolato",
    "sospiro",
    "sosta",
    "sottile",
    "spada",
    "spalla",
    "spargere",
    "spatola",
    "spavento",
    "spazzola",
    "specie",
    "spedire",
    "spegnere",
    "spelatura",
    "speranza",
    "spessore",
    "spettrale",
    "spezzato",
    "spia",
    "spigoloso",
    "spillato",
    "spinoso",
    "spirale",
    "splendido",
    "sportivo",
    "sposo",
    "spranga",
    "sprecare",
    "spronato",
    "spruzzo",
    "spuntino",
    "squillo",
    "sradicare",
    "srotolato",
    "stabile",
    "stacco",
    "staffa",
    "stagnare",
    "stampato",
    "stantio",
    "starnuto",
    "stasera",
    "statuto",
    "stelo",
    "steppa",
    "sterzo",
    "stiletto",
    "stima",
    "stirpe",
    "stivale",
    "stizzoso",
    "stonato",
    "storico",
    "strappo",
    "stregato",
    "stridulo",
    "strozzare",
    "strutto",
    "stuccare",
    "stufo",
    "stupendo",
    "subentro",
    "succoso",
    "sudore",
    "suggerito",
    "sugo",
    "sultano",
    "suonare",
    "superbo",
    "supporto",
    "surgelato",
    "surrogato",
    "sussurro",
    "sutura",
    "svagare",
    "svedese",
    "sveglio",
    "svelare",
    "svenuto",
    "svezia",
    "sviluppo",
    "svista",
    "svizzera",
    "svolta",
    "svuotare",
    "tabacco",
    "tabulato",
    "tacciare",
    "taciturno",
    "tale",
    "talismano",
    "tampone",
    "tannino",
    "tara",
    "tardivo",
    "targato",
    "tariffa",
    "tarpare",
    "tartaruga",
    "tasto",
    "tattico",
    "taverna",
    "tavolata",
    "tazza",
    "teca",
    "tecnico",
    "telefono",
    "temerario",
    "tempo",
    "temuto",
    "tendone",
    "tenero",
    "tensione",
    "tentacolo",
    "teorema",
    "terme",
    "terrazzo",
    "terzetto",
    "tesi",
    "tesserato",
    "testato",
    "tetro",
    "tettoia",
    "tifare",
    "tigella",
    "timbro",
    "tinto",
    "tipico",
    "tipografo",
    "tiraggio",
    "tiro",
    "titanio",
    "titolo",
    "titubante",
    "tizio",
    "tizzone",
    "toccare",
    "tollerare",
    "tolto",
    "tombola",
    "tomo",
    "tonfo",
    "tonsilla",
    "topazio",
    "topologia",
    "toppa",
    "torba",
    "tornare",
    "torrone",
    "tortora",
    "toscano",
    "tossire",
    "tostatura",
    "totano",
    "trabocco",
    "trachea",
    "trafila",
    "tragedia",
    "tralcio",
    "tramonto",
    "transito",
    "trapano",
    "trarre",
    "trasloco",
    "trattato",
    "trave",
    "treccia",
    "tremolio",
    "trespolo",
    "tributo",
    "tricheco",
    "trifoglio",
    "trillo",
    "trincea",
    "trio",
    "tristezza",
    "triturato",
    "trivella",
    "tromba",
    "trono",
    "troppo",
    "trottola",
    "trovare",
    "truccato",
    "tubatura",
    "tuffato",
    "tulipano",
    "tumulto",
    "tunisia",
    "turbare",
    "turchino",
    "tuta",
    "tutela",
    "ubicato",
    "uccello",
    "uccisore",
    "udire",
    "uditivo",
    "uffa",
    "ufficio",
    "uguale",
    "ulisse",
    "ultimato",
    "umano",
    "umile",
    "umorismo",
    "uncinetto",
    "ungere",
    "ungherese",
    "unicorno",
    "unificato",
    "unisono",
    "unitario",
    "unte",
    "uovo",
    "upupa",
    "uragano",
    "urgenza",
    "urlo",
    "usanza",
    "usato",
    "uscito",
    "usignolo",
    "usuraio",
    "utensile",
    "utilizzo",
    "utopia",
    "vacante",
    "vaccinato",
    "vagabondo",
    "vagliato",
    "valanga",
    "valgo",
    "valico",
    "valletta",
    "valoroso",
    "valutare",
    "valvola",
    "vampata",
    "vangare",
    "vanitoso",
    "vano",
    "vantaggio",
    "vanvera",
    "vapore",
    "varano",
    "varcato",
    "variante",
    "vasca",
    "vedetta",
    "vedova",
    "veduto",
    "vegetale",
    "veicolo",
    "velcro",
    "velina",
    "velluto",
    "veloce",
    "venato",
    "vendemmia",
    "vento",
    "verace",
    "verbale",
    "vergogna",
    "verifica",
    "vero",
    "verruca",
    "verticale",
    "vescica",
    "vessillo",
    "vestale",
    "veterano",
    "vetrina",
    "vetusto",
    "viandante",
    "vibrante",
    "vicenda",
    "vichingo",
    "vicinanza",
    "vidimare",
    "vigilia",
    "vigneto",
    "vigore",
    "vile",
    "villano",
    "vimini",
    "vincitore",
    "viola",
    "vipera",
    "virgola",
    "virologo",
    "virulento",
    "viscoso",
    "visione",
    "vispo",
    "vissuto",
    "visura",
    "vita",
    "vitello",
    "vittima",
    "vivanda",
    "vivido",
    "viziare",
    "voce",
    "voga",
    "volatile",
    "volere",
    "volpe",
    "voragine",
    "vulcano",
    "zampogna",
    "zanna",
    "zappato",
    "zattera",
    "zavorra",
    "zefiro",
    "zelante",
    "zelo",
    "zenzero",
    "zerbino",
    "zibetto",
    "zinco",
    "zircone",
    "zitto",
    "zolla",
    "zotico",
    "zucchero",
    "zufolo",
    "zulu",
    "zuppa"
];
module.exports = $20c2d651e9e3cd93$var$italian;

});

parcelRegister("ivIla", function(module, exports) {
"use strict";
var $d79d8455c602e66b$var$japanese = [
    "\u3042\u3044\u3053\u304F\u3057\u3093",
    "\u3042\u3044\u3055\u3064",
    "\u3042\u3044\u305F\u3099",
    "\u3042\u304A\u305D\u3099\u3089",
    "\u3042\u304B\u3061\u3083\u3093",
    "\u3042\u304D\u308B",
    "\u3042\u3051\u304B\u3099\u305F",
    "\u3042\u3051\u308B",
    "\u3042\u3053\u304B\u3099\u308C\u308B",
    "\u3042\u3055\u3044",
    "\u3042\u3055\u3072",
    "\u3042\u3057\u3042\u3068",
    "\u3042\u3057\u3099\u308F\u3046",
    "\u3042\u3059\u3099\u304B\u308B",
    "\u3042\u3059\u3099\u304D",
    "\u3042\u305D\u3075\u3099",
    "\u3042\u305F\u3048\u308B",
    "\u3042\u305F\u305F\u3081\u308B",
    "\u3042\u305F\u308A\u307E\u3048",
    "\u3042\u305F\u308B",
    "\u3042\u3064\u3044",
    "\u3042\u3064\u304B\u3046",
    "\u3042\u3063\u3057\u3085\u304F",
    "\u3042\u3064\u307E\u308A",
    "\u3042\u3064\u3081\u308B",
    "\u3042\u3066\u306A",
    "\u3042\u3066\u306F\u307E\u308B",
    "\u3042\u3072\u308B",
    "\u3042\u3075\u3099\u3089",
    "\u3042\u3075\u3099\u308B",
    "\u3042\u3075\u308C\u308B",
    "\u3042\u307E\u3044",
    "\u3042\u307E\u3068\u3099",
    "\u3042\u307E\u3084\u304B\u3059",
    "\u3042\u307E\u308A",
    "\u3042\u307F\u3082\u306E",
    "\u3042\u3081\u308A\u304B",
    "\u3042\u3084\u307E\u308B",
    "\u3042\u3086\u3080",
    "\u3042\u3089\u3044\u304F\u3099\u307E",
    "\u3042\u3089\u3057",
    "\u3042\u3089\u3059\u3057\u3099",
    "\u3042\u3089\u305F\u3081\u308B",
    "\u3042\u3089\u3086\u308B",
    "\u3042\u3089\u308F\u3059",
    "\u3042\u308A\u304B\u3099\u3068\u3046",
    "\u3042\u308F\u305B\u308B",
    "\u3042\u308F\u3066\u308B",
    "\u3042\u3093\u3044",
    "\u3042\u3093\u304B\u3099\u3044",
    "\u3042\u3093\u3053",
    "\u3042\u3093\u305B\u3099\u3093",
    "\u3042\u3093\u3066\u3044",
    "\u3042\u3093\u306A\u3044",
    "\u3042\u3093\u307E\u308A",
    "\u3044\u3044\u305F\u3099\u3059",
    "\u3044\u304A\u3093",
    "\u3044\u304B\u3099\u3044",
    "\u3044\u304B\u3099\u304F",
    "\u3044\u304D\u304A\u3044",
    "\u3044\u304D\u306A\u308A",
    "\u3044\u304D\u3082\u306E",
    "\u3044\u304D\u308B",
    "\u3044\u304F\u3057\u3099",
    "\u3044\u304F\u3075\u3099\u3093",
    "\u3044\u3051\u306F\u3099\u306A",
    "\u3044\u3051\u3093",
    "\u3044\u3053\u3046",
    "\u3044\u3053\u304F",
    "\u3044\u3053\u3064",
    "\u3044\u3055\u307E\u3057\u3044",
    "\u3044\u3055\u3093",
    "\u3044\u3057\u304D",
    "\u3044\u3057\u3099\u3085\u3046",
    "\u3044\u3057\u3099\u3087\u3046",
    "\u3044\u3057\u3099\u308F\u308B",
    "\u3044\u3059\u3099\u307F",
    "\u3044\u3059\u3099\u308C",
    "\u3044\u305B\u3044",
    "\u3044\u305B\u3048\u3072\u3099",
    "\u3044\u305B\u304B\u3044",
    "\u3044\u305B\u304D",
    "\u3044\u305B\u3099\u3093",
    "\u3044\u305D\u3046\u308D\u3046",
    "\u3044\u305D\u304B\u3099\u3057\u3044",
    "\u3044\u305F\u3099\u3044",
    "\u3044\u305F\u3099\u304F",
    "\u3044\u305F\u3059\u3099\u3089",
    "\u3044\u305F\u307F",
    "\u3044\u305F\u308A\u3042",
    "\u3044\u3061\u304A\u3046",
    "\u3044\u3061\u3057\u3099",
    "\u3044\u3061\u3068\u3099",
    "\u3044\u3061\u306F\u3099",
    "\u3044\u3061\u3075\u3099",
    "\u3044\u3061\u308A\u3085\u3046",
    "\u3044\u3064\u304B",
    "\u3044\u3063\u3057\u3085\u3093",
    "\u3044\u3063\u305B\u3044",
    "\u3044\u3063\u305D\u3046",
    "\u3044\u3063\u305F\u3093",
    "\u3044\u3063\u3061",
    "\u3044\u3063\u3066\u3044",
    "\u3044\u3063\u307B\u309A\u3046",
    "\u3044\u3066\u3055\u3099",
    "\u3044\u3066\u3093",
    "\u3044\u3068\u3099\u3046",
    "\u3044\u3068\u3053",
    "\u3044\u306A\u3044",
    "\u3044\u306A\u304B",
    "\u3044\u306D\u3080\u308A",
    "\u3044\u306E\u3061",
    "\u3044\u306E\u308B",
    "\u3044\u306F\u3064",
    "\u3044\u306F\u3099\u308B",
    "\u3044\u306F\u3093",
    "\u3044\u3072\u3099\u304D",
    "\u3044\u3072\u3093",
    "\u3044\u3075\u304F",
    "\u3044\u3078\u3093",
    "\u3044\u307B\u3046",
    "\u3044\u307F\u3093",
    "\u3044\u3082\u3046\u3068",
    "\u3044\u3082\u305F\u308C",
    "\u3044\u3082\u308A",
    "\u3044\u3084\u304B\u3099\u308B",
    "\u3044\u3084\u3059",
    "\u3044\u3088\u304B\u3093",
    "\u3044\u3088\u304F",
    "\u3044\u3089\u3044",
    "\u3044\u3089\u3059\u3068",
    "\u3044\u308A\u304F\u3099\u3061",
    "\u3044\u308A\u3087\u3046",
    "\u3044\u308C\u3044",
    "\u3044\u308C\u3082\u306E",
    "\u3044\u308C\u308B",
    "\u3044\u308D\u3048\u3093\u3072\u309A\u3064",
    "\u3044\u308F\u3044",
    "\u3044\u308F\u3046",
    "\u3044\u308F\u304B\u3093",
    "\u3044\u308F\u306F\u3099",
    "\u3044\u308F\u3086\u308B",
    "\u3044\u3093\u3051\u3099\u3093\u307E\u3081",
    "\u3044\u3093\u3055\u3064",
    "\u3044\u3093\u3057\u3087\u3046",
    "\u3044\u3093\u3088\u3046",
    "\u3046\u3048\u304D",
    "\u3046\u3048\u308B",
    "\u3046\u304A\u3055\u3099",
    "\u3046\u304B\u3099\u3044",
    "\u3046\u304B\u3075\u3099",
    "\u3046\u304B\u3078\u3099\u308B",
    "\u3046\u304D\u308F",
    "\u3046\u304F\u3089\u3044\u306A",
    "\u3046\u304F\u308C\u308C",
    "\u3046\u3051\u305F\u307E\u308F\u308B",
    "\u3046\u3051\u3064\u3051",
    "\u3046\u3051\u3068\u308B",
    "\u3046\u3051\u3082\u3064",
    "\u3046\u3051\u308B",
    "\u3046\u3053\u3099\u304B\u3059",
    "\u3046\u3053\u3099\u304F",
    "\u3046\u3053\u3093",
    "\u3046\u3055\u304D\u3099",
    "\u3046\u3057\u306A\u3046",
    "\u3046\u3057\u308D\u304B\u3099\u307F",
    "\u3046\u3059\u3044",
    "\u3046\u3059\u304D\u3099",
    "\u3046\u3059\u304F\u3099\u3089\u3044",
    "\u3046\u3059\u3081\u308B",
    "\u3046\u305B\u3064",
    "\u3046\u3061\u3042\u308F\u305B",
    "\u3046\u3061\u304B\u3099\u308F",
    "\u3046\u3061\u304D",
    "\u3046\u3061\u3085\u3046",
    "\u3046\u3063\u304B\u308A",
    "\u3046\u3064\u304F\u3057\u3044",
    "\u3046\u3063\u305F\u3048\u308B",
    "\u3046\u3064\u308B",
    "\u3046\u3068\u3099\u3093",
    "\u3046\u306A\u304D\u3099",
    "\u3046\u306A\u3057\u3099",
    "\u3046\u306A\u3059\u3099\u304F",
    "\u3046\u306A\u308B",
    "\u3046\u306D\u308B",
    "\u3046\u306E\u3046",
    "\u3046\u3075\u3099\u3051\u3099",
    "\u3046\u3075\u3099\u3053\u3099\u3048",
    "\u3046\u307E\u308C\u308B",
    "\u3046\u3081\u308B",
    "\u3046\u3082\u3046",
    "\u3046\u3084\u307E\u3046",
    "\u3046\u3088\u304F",
    "\u3046\u3089\u304B\u3099\u3048\u3059",
    "\u3046\u3089\u304F\u3099\u3061",
    "\u3046\u3089\u306A\u3044",
    "\u3046\u308A\u3042\u3051\u3099",
    "\u3046\u308A\u304D\u308C",
    "\u3046\u308B\u3055\u3044",
    "\u3046\u308C\u3057\u3044",
    "\u3046\u308C\u3086\u304D",
    "\u3046\u308C\u308B",
    "\u3046\u308D\u3053",
    "\u3046\u308F\u304D",
    "\u3046\u308F\u3055",
    "\u3046\u3093\u3053\u3046",
    "\u3046\u3093\u3061\u3093",
    "\u3046\u3093\u3066\u3093",
    "\u3046\u3093\u3068\u3099\u3046",
    "\u3048\u3044\u3048\u3093",
    "\u3048\u3044\u304B\u3099",
    "\u3048\u3044\u304D\u3087\u3046",
    "\u3048\u3044\u3053\u3099",
    "\u3048\u3044\u305B\u3044",
    "\u3048\u3044\u3075\u3099\u3093",
    "\u3048\u3044\u3088\u3046",
    "\u3048\u3044\u308F",
    "\u3048\u304A\u308A",
    "\u3048\u304B\u3099\u304A",
    "\u3048\u304B\u3099\u304F",
    "\u3048\u304D\u305F\u3044",
    "\u3048\u304F\u305B\u308B",
    "\u3048\u3057\u3083\u304F",
    "\u3048\u3059\u3066",
    "\u3048\u3064\u3089\u3093",
    "\u3048\u306E\u304F\u3099",
    "\u3048\u307B\u3046\u307E\u304D",
    "\u3048\u307B\u3093",
    "\u3048\u307E\u304D",
    "\u3048\u3082\u3057\u3099",
    "\u3048\u3082\u306E",
    "\u3048\u3089\u3044",
    "\u3048\u3089\u3075\u3099",
    "\u3048\u308A\u3042",
    "\u3048\u3093\u3048\u3093",
    "\u3048\u3093\u304B\u3044",
    "\u3048\u3093\u304D\u3099",
    "\u3048\u3093\u3051\u3099\u304D",
    "\u3048\u3093\u3057\u3085\u3046",
    "\u3048\u3093\u305B\u3099\u3064",
    "\u3048\u3093\u305D\u304F",
    "\u3048\u3093\u3061\u3087\u3046",
    "\u3048\u3093\u3068\u3064",
    "\u304A\u3044\u304B\u3051\u308B",
    "\u304A\u3044\u3053\u3059",
    "\u304A\u3044\u3057\u3044",
    "\u304A\u3044\u3064\u304F",
    "\u304A\u3046\u3048\u3093",
    "\u304A\u3046\u3055\u307E",
    "\u304A\u3046\u3057\u3099",
    "\u304A\u3046\u305B\u3064",
    "\u304A\u3046\u305F\u3044",
    "\u304A\u3046\u3075\u304F",
    "\u304A\u3046\u3078\u3099\u3044",
    "\u304A\u3046\u3088\u3046",
    "\u304A\u3048\u308B",
    "\u304A\u304A\u3044",
    "\u304A\u304A\u3046",
    "\u304A\u304A\u3068\u3099\u304A\u308A",
    "\u304A\u304A\u3084",
    "\u304A\u304A\u3088\u305D",
    "\u304A\u304B\u3048\u308A",
    "\u304A\u304B\u3059\u3099",
    "\u304A\u304B\u3099\u3080",
    "\u304A\u304B\u308F\u308A",
    "\u304A\u304D\u3099\u306A\u3046",
    "\u304A\u304D\u308B",
    "\u304A\u304F\u3055\u307E",
    "\u304A\u304F\u3057\u3099\u3087\u3046",
    "\u304A\u304F\u308A\u304B\u3099\u306A",
    "\u304A\u304F\u308B",
    "\u304A\u304F\u308C\u308B",
    "\u304A\u3053\u3059",
    "\u304A\u3053\u306A\u3046",
    "\u304A\u3053\u308B",
    "\u304A\u3055\u3048\u308B",
    "\u304A\u3055\u306A\u3044",
    "\u304A\u3055\u3081\u308B",
    "\u304A\u3057\u3044\u308C",
    "\u304A\u3057\u3048\u308B",
    "\u304A\u3057\u3099\u304D\u3099",
    "\u304A\u3057\u3099\u3055\u3093",
    "\u304A\u3057\u3083\u308C",
    "\u304A\u305D\u3089\u304F",
    "\u304A\u305D\u308F\u308B",
    "\u304A\u305F\u304B\u3099\u3044",
    "\u304A\u305F\u304F",
    "\u304A\u305F\u3099\u3084\u304B",
    "\u304A\u3061\u3064\u304F",
    "\u304A\u3063\u3068",
    "\u304A\u3064\u308A",
    "\u304A\u3066\u3099\u304B\u3051",
    "\u304A\u3068\u3057\u3082\u306E",
    "\u304A\u3068\u306A\u3057\u3044",
    "\u304A\u3068\u3099\u308A",
    "\u304A\u3068\u3099\u308D\u304B\u3059",
    "\u304A\u306F\u3099\u3055\u3093",
    "\u304A\u307E\u3044\u308A",
    "\u304A\u3081\u3066\u3099\u3068\u3046",
    "\u304A\u3082\u3044\u3066\u3099",
    "\u304A\u3082\u3046",
    "\u304A\u3082\u305F\u3044",
    "\u304A\u3082\u3061\u3083",
    "\u304A\u3084\u3064",
    "\u304A\u3084\u3086\u3072\u3099",
    "\u304A\u3088\u307B\u3099\u3059",
    "\u304A\u3089\u3093\u305F\u3099",
    "\u304A\u308D\u3059",
    "\u304A\u3093\u304B\u3099\u304F",
    "\u304A\u3093\u3051\u3044",
    "\u304A\u3093\u3057\u3083",
    "\u304A\u3093\u305B\u3093",
    "\u304A\u3093\u305F\u3099\u3093",
    "\u304A\u3093\u3061\u3085\u3046",
    "\u304A\u3093\u3068\u3099\u3051\u3044",
    "\u304B\u3042\u3064",
    "\u304B\u3044\u304B\u3099",
    "\u304B\u3099\u3044\u304D",
    "\u304B\u3099\u3044\u3051\u3093",
    "\u304B\u3099\u3044\u3053\u3046",
    "\u304B\u3044\u3055\u3064",
    "\u304B\u3044\u3057\u3083",
    "\u304B\u3044\u3059\u3044\u3088\u304F",
    "\u304B\u3044\u305B\u3099\u3093",
    "\u304B\u3044\u305D\u3099\u3046\u3068\u3099",
    "\u304B\u3044\u3064\u3046",
    "\u304B\u3044\u3066\u3093",
    "\u304B\u3044\u3068\u3046",
    "\u304B\u3044\u3075\u304F",
    "\u304B\u3099\u3044\u3078\u304D",
    "\u304B\u3044\u307B\u3046",
    "\u304B\u3044\u3088\u3046",
    "\u304B\u3099\u3044\u3089\u3044",
    "\u304B\u3044\u308F",
    "\u304B\u3048\u308B",
    "\u304B\u304A\u308A",
    "\u304B\u304B\u3048\u308B",
    "\u304B\u304B\u3099\u304F",
    "\u304B\u304B\u3099\u3057",
    "\u304B\u304B\u3099\u307F",
    "\u304B\u304F\u3053\u3099",
    "\u304B\u304F\u3068\u304F",
    "\u304B\u3055\u3099\u308B",
    "\u304B\u3099\u305D\u3099\u3046",
    "\u304B\u305F\u3044",
    "\u304B\u305F\u3061",
    "\u304B\u3099\u3061\u3087\u3046",
    "\u304B\u3099\u3063\u304D\u3085\u3046",
    "\u304B\u3099\u3063\u3053\u3046",
    "\u304B\u3099\u3063\u3055\u3093",
    "\u304B\u3099\u3063\u3057\u3087\u3046",
    "\u304B\u306A\u3055\u3099\u308F\u3057",
    "\u304B\u306E\u3046",
    "\u304B\u3099\u306F\u304F",
    "\u304B\u3075\u3099\u304B",
    "\u304B\u307B\u3046",
    "\u304B\u307B\u3053\u3099",
    "\u304B\u307E\u3046",
    "\u304B\u307E\u307B\u3099\u3053",
    "\u304B\u3081\u308C\u304A\u3093",
    "\u304B\u3086\u3044",
    "\u304B\u3088\u3046\u3072\u3099",
    "\u304B\u3089\u3044",
    "\u304B\u308B\u3044",
    "\u304B\u308D\u3046",
    "\u304B\u308F\u304F",
    "\u304B\u308F\u3089",
    "\u304B\u3099\u3093\u304B",
    "\u304B\u3093\u3051\u3044",
    "\u304B\u3093\u3053\u3046",
    "\u304B\u3093\u3057\u3083",
    "\u304B\u3093\u305D\u3046",
    "\u304B\u3093\u305F\u3093",
    "\u304B\u3093\u3061",
    "\u304B\u3099\u3093\u306F\u3099\u308B",
    "\u304D\u3042\u3044",
    "\u304D\u3042\u3064",
    "\u304D\u3044\u308D",
    "\u304D\u3099\u3044\u3093",
    "\u304D\u3046\u3044",
    "\u304D\u3046\u3093",
    "\u304D\u3048\u308B",
    "\u304D\u304A\u3046",
    "\u304D\u304A\u304F",
    "\u304D\u304A\u3061",
    "\u304D\u304A\u3093",
    "\u304D\u304B\u3044",
    "\u304D\u304B\u304F",
    "\u304D\u304B\u3093\u3057\u3083",
    "\u304D\u304D\u3066",
    "\u304D\u304F\u306F\u3099\u308A",
    "\u304D\u304F\u3089\u3051\u3099",
    "\u304D\u3051\u3093\u305B\u3044",
    "\u304D\u3053\u3046",
    "\u304D\u3053\u3048\u308B",
    "\u304D\u3053\u304F",
    "\u304D\u3055\u3044",
    "\u304D\u3055\u304F",
    "\u304D\u3055\u307E",
    "\u304D\u3055\u3089\u304D\u3099",
    "\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F",
    "\u304D\u3099\u3057\u304D",
    "\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093",
    "\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044",
    "\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083",
    "\u304D\u3059\u3046",
    "\u304D\u305B\u3044",
    "\u304D\u305B\u304D",
    "\u304D\u305B\u3064",
    "\u304D\u305D\u3046",
    "\u304D\u305D\u3099\u304F",
    "\u304D\u305D\u3099\u3093",
    "\u304D\u305F\u3048\u308B",
    "\u304D\u3061\u3087\u3046",
    "\u304D\u3064\u3048\u3093",
    "\u304D\u3099\u3063\u3061\u308A",
    "\u304D\u3064\u3064\u304D",
    "\u304D\u3064\u306D",
    "\u304D\u3066\u3044",
    "\u304D\u3068\u3099\u3046",
    "\u304D\u3068\u3099\u304F",
    "\u304D\u306A\u3044",
    "\u304D\u306A\u304B\u3099",
    "\u304D\u306A\u3053",
    "\u304D\u306C\u3053\u3099\u3057",
    "\u304D\u306D\u3093",
    "\u304D\u306E\u3046",
    "\u304D\u306E\u3057\u305F",
    "\u304D\u306F\u304F",
    "\u304D\u3072\u3099\u3057\u3044",
    "\u304D\u3072\u3093",
    "\u304D\u3075\u304F",
    "\u304D\u3075\u3099\u3093",
    "\u304D\u307B\u3099\u3046",
    "\u304D\u307B\u3093",
    "\u304D\u307E\u308B",
    "\u304D\u307F\u3064",
    "\u304D\u3080\u3059\u3099\u304B\u3057\u3044",
    "\u304D\u3081\u308B",
    "\u304D\u3082\u305F\u3099\u3081\u3057",
    "\u304D\u3082\u3061",
    "\u304D\u3082\u306E",
    "\u304D\u3083\u304F",
    "\u304D\u3084\u304F",
    "\u304D\u3099\u3085\u3046\u306B\u304F",
    "\u304D\u3088\u3046",
    "\u304D\u3087\u3046\u308A\u3085\u3046",
    "\u304D\u3089\u3044",
    "\u304D\u3089\u304F",
    "\u304D\u308A\u3093",
    "\u304D\u308C\u3044",
    "\u304D\u308C\u3064",
    "\u304D\u308D\u304F",
    "\u304D\u3099\u308D\u3093",
    "\u304D\u308F\u3081\u308B",
    "\u304D\u3099\u3093\u3044\u308D",
    "\u304D\u3093\u304B\u304F\u3057\u3099",
    "\u304D\u3093\u3057\u3099\u3087",
    "\u304D\u3093\u3088\u3046\u3072\u3099",
    "\u304F\u3099\u3042\u3044",
    "\u304F\u3044\u3059\u3099",
    "\u304F\u3046\u304B\u3093",
    "\u304F\u3046\u304D",
    "\u304F\u3046\u304F\u3099\u3093",
    "\u304F\u3046\u3053\u3046",
    "\u304F\u3099\u3046\u305B\u3044",
    "\u304F\u3046\u305D\u3046",
    "\u304F\u3099\u3046\u305F\u3089",
    "\u304F\u3046\u3075\u304F",
    "\u304F\u3046\u307B\u3099",
    "\u304F\u304B\u3093",
    "\u304F\u304D\u3087\u3046",
    "\u304F\u3051\u3099\u3093",
    "\u304F\u3099\u3053\u3046",
    "\u304F\u3055\u3044",
    "\u304F\u3055\u304D",
    "\u304F\u3055\u306F\u3099\u306A",
    "\u304F\u3055\u308B",
    "\u304F\u3057\u3083\u307F",
    "\u304F\u3057\u3087\u3046",
    "\u304F\u3059\u306E\u304D",
    "\u304F\u3059\u308A\u3086\u3072\u3099",
    "\u304F\u305B\u3051\u3099",
    "\u304F\u305B\u3093",
    "\u304F\u3099\u305F\u3044\u3066\u304D",
    "\u304F\u305F\u3099\u3055\u308B",
    "\u304F\u305F\u3072\u3099\u308C\u308B",
    "\u304F\u3061\u3053\u307F",
    "\u304F\u3061\u3055\u304D",
    "\u304F\u3064\u3057\u305F",
    "\u304F\u3099\u3063\u3059\u308A",
    "\u304F\u3064\u308D\u304F\u3099",
    "\u304F\u3068\u3046\u3066\u3093",
    "\u304F\u3068\u3099\u304F",
    "\u304F\u306A\u3093",
    "\u304F\u306D\u304F\u306D",
    "\u304F\u306E\u3046",
    "\u304F\u3075\u3046",
    "\u304F\u307F\u3042\u308F\u305B",
    "\u304F\u307F\u305F\u3066\u308B",
    "\u304F\u3081\u308B",
    "\u304F\u3084\u304F\u3057\u3087",
    "\u304F\u3089\u3059",
    "\u304F\u3089\u3078\u3099\u308B",
    "\u304F\u308B\u307E",
    "\u304F\u308C\u308B",
    "\u304F\u308D\u3046",
    "\u304F\u308F\u3057\u3044",
    "\u304F\u3099\u3093\u304B\u3093",
    "\u304F\u3099\u3093\u3057\u3087\u304F",
    "\u304F\u3099\u3093\u305F\u3044",
    "\u304F\u3099\u3093\u3066",
    "\u3051\u3042\u306A",
    "\u3051\u3044\u304B\u304F",
    "\u3051\u3044\u3051\u3093",
    "\u3051\u3044\u3053",
    "\u3051\u3044\u3055\u3064",
    "\u3051\u3099\u3044\u3057\u3099\u3085\u3064",
    "\u3051\u3044\u305F\u3044",
    "\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093",
    "\u3051\u3044\u308C\u304D",
    "\u3051\u3044\u308D",
    "\u3051\u304A\u3068\u3059",
    "\u3051\u304A\u308A\u3082\u306E",
    "\u3051\u3099\u304D\u304B",
    "\u3051\u3099\u304D\u3051\u3099\u3093",
    "\u3051\u3099\u304D\u305F\u3099\u3093",
    "\u3051\u3099\u304D\u3061\u3093",
    "\u3051\u3099\u304D\u3068\u3064",
    "\u3051\u3099\u304D\u306F",
    "\u3051\u3099\u304D\u3084\u304F",
    "\u3051\u3099\u3053\u3046",
    "\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046",
    "\u3051\u3099\u3055\u3099\u3044",
    "\u3051\u3055\u304D",
    "\u3051\u3099\u3055\u3099\u3093",
    "\u3051\u3057\u304D",
    "\u3051\u3057\u3053\u3099\u3080",
    "\u3051\u3057\u3087\u3046",
    "\u3051\u3099\u3059\u3068",
    "\u3051\u305F\u306F\u3099",
    "\u3051\u3061\u3083\u3063\u3075\u309A",
    "\u3051\u3061\u3089\u3059",
    "\u3051\u3064\u3042\u3064",
    "\u3051\u3064\u3044",
    "\u3051\u3064\u3048\u304D",
    "\u3051\u3063\u3053\u3093",
    "\u3051\u3064\u3057\u3099\u3087",
    "\u3051\u3063\u305B\u304D",
    "\u3051\u3063\u3066\u3044",
    "\u3051\u3064\u307E\u3064",
    "\u3051\u3099\u3064\u3088\u3046\u3072\u3099",
    "\u3051\u3099\u3064\u308C\u3044",
    "\u3051\u3064\u308D\u3093",
    "\u3051\u3099\u3068\u3099\u304F",
    "\u3051\u3068\u306F\u3099\u3059",
    "\u3051\u3068\u308B",
    "\u3051\u306A\u3051\u3099",
    "\u3051\u306A\u3059",
    "\u3051\u306A\u307F",
    "\u3051\u306C\u304D",
    "\u3051\u3099\u306D\u3064",
    "\u3051\u306D\u3093",
    "\u3051\u306F\u3044",
    "\u3051\u3099\u3072\u3093",
    "\u3051\u3075\u3099\u304B\u3044",
    "\u3051\u3099\u307B\u3099\u304F",
    "\u3051\u307E\u308A",
    "\u3051\u307F\u304B\u308B",
    "\u3051\u3080\u3057",
    "\u3051\u3080\u308A",
    "\u3051\u3082\u306E",
    "\u3051\u3089\u3044",
    "\u3051\u308D\u3051\u308D",
    "\u3051\u308F\u3057\u3044",
    "\u3051\u3093\u3044",
    "\u3051\u3093\u3048\u3064",
    "\u3051\u3093\u304A",
    "\u3051\u3093\u304B",
    "\u3051\u3099\u3093\u304D",
    "\u3051\u3093\u3051\u3099\u3093",
    "\u3051\u3093\u3053\u3046",
    "\u3051\u3093\u3055\u304F",
    "\u3051\u3093\u3057\u3085\u3046",
    "\u3051\u3093\u3059\u3046",
    "\u3051\u3099\u3093\u305D\u3046",
    "\u3051\u3093\u3061\u304F",
    "\u3051\u3093\u3066\u3044",
    "\u3051\u3093\u3068\u3046",
    "\u3051\u3093\u306A\u3044",
    "\u3051\u3093\u306B\u3093",
    "\u3051\u3099\u3093\u3075\u3099\u3064",
    "\u3051\u3093\u307E",
    "\u3051\u3093\u307F\u3093",
    "\u3051\u3093\u3081\u3044",
    "\u3051\u3093\u3089\u3093",
    "\u3051\u3093\u308A",
    "\u3053\u3042\u304F\u307E",
    "\u3053\u3044\u306C",
    "\u3053\u3044\u3072\u3099\u3068",
    "\u3053\u3099\u3046\u3044",
    "\u3053\u3046\u3048\u3093",
    "\u3053\u3046\u304A\u3093",
    "\u3053\u3046\u304B\u3093",
    "\u3053\u3099\u3046\u304D\u3085\u3046",
    "\u3053\u3099\u3046\u3051\u3044",
    "\u3053\u3046\u3053\u3046",
    "\u3053\u3046\u3055\u3044",
    "\u3053\u3046\u3057\u3099",
    "\u3053\u3046\u3059\u3044",
    "\u3053\u3099\u3046\u305B\u3044",
    "\u3053\u3046\u305D\u304F",
    "\u3053\u3046\u305F\u3044",
    "\u3053\u3046\u3061\u3083",
    "\u3053\u3046\u3064\u3046",
    "\u3053\u3046\u3066\u3044",
    "\u3053\u3046\u3068\u3099\u3046",
    "\u3053\u3046\u306A\u3044",
    "\u3053\u3046\u306F\u3044",
    "\u3053\u3099\u3046\u307B\u3046",
    "\u3053\u3099\u3046\u307E\u3093",
    "\u3053\u3046\u3082\u304F",
    "\u3053\u3046\u308A\u3064",
    "\u3053\u3048\u308B",
    "\u3053\u304A\u308A",
    "\u3053\u3099\u304B\u3044",
    "\u3053\u3099\u304B\u3099\u3064",
    "\u3053\u3099\u304B\u3093",
    "\u3053\u304F\u3053\u3099",
    "\u3053\u304F\u3055\u3044",
    "\u3053\u304F\u3068\u3046",
    "\u3053\u304F\u306A\u3044",
    "\u3053\u304F\u306F\u304F",
    "\u3053\u304F\u3099\u307E",
    "\u3053\u3051\u3044",
    "\u3053\u3051\u308B",
    "\u3053\u3053\u306E\u304B",
    "\u3053\u3053\u308D",
    "\u3053\u3055\u3081",
    "\u3053\u3057\u3064",
    "\u3053\u3059\u3046",
    "\u3053\u305B\u3044",
    "\u3053\u305B\u304D",
    "\u3053\u305B\u3099\u3093",
    "\u3053\u305D\u305F\u3099\u3066",
    "\u3053\u305F\u3044",
    "\u3053\u305F\u3048\u308B",
    "\u3053\u305F\u3064",
    "\u3053\u3061\u3087\u3046",
    "\u3053\u3063\u304B",
    "\u3053\u3064\u3053\u3064",
    "\u3053\u3064\u306F\u3099\u3093",
    "\u3053\u3064\u3075\u3099",
    "\u3053\u3066\u3044",
    "\u3053\u3066\u3093",
    "\u3053\u3068\u304B\u3099\u3089",
    "\u3053\u3068\u3057",
    "\u3053\u3068\u306F\u3099",
    "\u3053\u3068\u308A",
    "\u3053\u306A\u3053\u3099\u306A",
    "\u3053\u306D\u3053\u306D",
    "\u3053\u306E\u307E\u307E",
    "\u3053\u306E\u307F",
    "\u3053\u306E\u3088",
    "\u3053\u3099\u306F\u3093",
    "\u3053\u3072\u3064\u3057\u3099",
    "\u3053\u3075\u3046",
    "\u3053\u3075\u3093",
    "\u3053\u307B\u3099\u308C\u308B",
    "\u3053\u3099\u307E\u3042\u3075\u3099\u3089",
    "\u3053\u307E\u304B\u3044",
    "\u3053\u3099\u307E\u3059\u308A",
    "\u3053\u307E\u3064\u306A",
    "\u3053\u307E\u308B",
    "\u3053\u3080\u304D\u3099\u3053",
    "\u3053\u3082\u3057\u3099",
    "\u3053\u3082\u3061",
    "\u3053\u3082\u306E",
    "\u3053\u3082\u3093",
    "\u3053\u3084\u304F",
    "\u3053\u3084\u307E",
    "\u3053\u3086\u3046",
    "\u3053\u3086\u3072\u3099",
    "\u3053\u3088\u3044",
    "\u3053\u3088\u3046",
    "\u3053\u308A\u308B",
    "\u3053\u308C\u304F\u3057\u3087\u3093",
    "\u3053\u308D\u3063\u3051",
    "\u3053\u308F\u3082\u3066",
    "\u3053\u308F\u308C\u308B",
    "\u3053\u3093\u3044\u3093",
    "\u3053\u3093\u304B\u3044",
    "\u3053\u3093\u304D",
    "\u3053\u3093\u3057\u3085\u3046",
    "\u3053\u3093\u3059\u3044",
    "\u3053\u3093\u305F\u3099\u3066",
    "\u3053\u3093\u3068\u3093",
    "\u3053\u3093\u306A\u3093",
    "\u3053\u3093\u3072\u3099\u306B",
    "\u3053\u3093\u307B\u309A\u3093",
    "\u3053\u3093\u307E\u3051",
    "\u3053\u3093\u3084",
    "\u3053\u3093\u308C\u3044",
    "\u3053\u3093\u308F\u304F",
    "\u3055\u3099\u3044\u3048\u304D",
    "\u3055\u3044\u304B\u3044",
    "\u3055\u3044\u304D\u3093",
    "\u3055\u3099\u3044\u3051\u3099\u3093",
    "\u3055\u3099\u3044\u3053",
    "\u3055\u3044\u3057\u3087",
    "\u3055\u3044\u305B\u3044",
    "\u3055\u3099\u3044\u305F\u304F",
    "\u3055\u3099\u3044\u3061\u3085\u3046",
    "\u3055\u3044\u3066\u304D",
    "\u3055\u3099\u3044\u308A\u3087\u3046",
    "\u3055\u3046\u306A",
    "\u3055\u304B\u3044\u3057",
    "\u3055\u304B\u3099\u3059",
    "\u3055\u304B\u306A",
    "\u3055\u304B\u307F\u3061",
    "\u3055\u304B\u3099\u308B",
    "\u3055\u304D\u3099\u3087\u3046",
    "\u3055\u304F\u3057",
    "\u3055\u304F\u3072\u3093",
    "\u3055\u304F\u3089",
    "\u3055\u3053\u304F",
    "\u3055\u3053\u3064",
    "\u3055\u3059\u3099\u304B\u308B",
    "\u3055\u3099\u305B\u304D",
    "\u3055\u305F\u3093",
    "\u3055\u3064\u3048\u3044",
    "\u3055\u3099\u3064\u304A\u3093",
    "\u3055\u3099\u3063\u304B",
    "\u3055\u3099\u3064\u304B\u3099\u304F",
    "\u3055\u3063\u304D\u3087\u304F",
    "\u3055\u3099\u3063\u3057",
    "\u3055\u3064\u3057\u3099\u3093",
    "\u3055\u3099\u3063\u305D\u3046",
    "\u3055\u3064\u305F\u306F\u3099",
    "\u3055\u3064\u307E\u3044\u3082",
    "\u3055\u3066\u3044",
    "\u3055\u3068\u3044\u3082",
    "\u3055\u3068\u3046",
    "\u3055\u3068\u304A\u3084",
    "\u3055\u3068\u3057",
    "\u3055\u3068\u308B",
    "\u3055\u306E\u3046",
    "\u3055\u306F\u3099\u304F",
    "\u3055\u3072\u3099\u3057\u3044",
    "\u3055\u3078\u3099\u3064",
    "\u3055\u307B\u3046",
    "\u3055\u307B\u3068\u3099",
    "\u3055\u307E\u3059",
    "\u3055\u307F\u3057\u3044",
    "\u3055\u307F\u305F\u3099\u308C",
    "\u3055\u3080\u3051",
    "\u3055\u3081\u308B",
    "\u3055\u3084\u3048\u3093\u3068\u3099\u3046",
    "\u3055\u3086\u3046",
    "\u3055\u3088\u3046",
    "\u3055\u3088\u304F",
    "\u3055\u3089\u305F\u3099",
    "\u3055\u3099\u308B\u305D\u306F\u3099",
    "\u3055\u308F\u3084\u304B",
    "\u3055\u308F\u308B",
    "\u3055\u3093\u3044\u3093",
    "\u3055\u3093\u304B",
    "\u3055\u3093\u304D\u3083\u304F",
    "\u3055\u3093\u3053\u3046",
    "\u3055\u3093\u3055\u3044",
    "\u3055\u3099\u3093\u3057\u3087",
    "\u3055\u3093\u3059\u3046",
    "\u3055\u3093\u305B\u3044",
    "\u3055\u3093\u305D",
    "\u3055\u3093\u3061",
    "\u3055\u3093\u307E",
    "\u3055\u3093\u307F",
    "\u3055\u3093\u3089\u3093",
    "\u3057\u3042\u3044",
    "\u3057\u3042\u3051\u3099",
    "\u3057\u3042\u3055\u3063\u3066",
    "\u3057\u3042\u308F\u305B",
    "\u3057\u3044\u304F",
    "\u3057\u3044\u3093",
    "\u3057\u3046\u3061",
    "\u3057\u3048\u3044",
    "\u3057\u304A\u3051",
    "\u3057\u304B\u3044",
    "\u3057\u304B\u304F",
    "\u3057\u3099\u304B\u3093",
    "\u3057\u3053\u3099\u3068",
    "\u3057\u3059\u3046",
    "\u3057\u3099\u305F\u3099\u3044",
    "\u3057\u305F\u3046\u3051",
    "\u3057\u305F\u304D\u3099",
    "\u3057\u305F\u3066",
    "\u3057\u305F\u307F",
    "\u3057\u3061\u3087\u3046",
    "\u3057\u3061\u308A\u3093",
    "\u3057\u3063\u304B\u308A",
    "\u3057\u3064\u3057\u3099",
    "\u3057\u3064\u3082\u3093",
    "\u3057\u3066\u3044",
    "\u3057\u3066\u304D",
    "\u3057\u3066\u3064",
    "\u3057\u3099\u3066\u3093",
    "\u3057\u3099\u3068\u3099\u3046",
    "\u3057\u306A\u304D\u3099\u308C",
    "\u3057\u306A\u3082\u306E",
    "\u3057\u306A\u3093",
    "\u3057\u306D\u307E",
    "\u3057\u306D\u3093",
    "\u3057\u306E\u304F\u3099",
    "\u3057\u306E\u3075\u3099",
    "\u3057\u306F\u3044",
    "\u3057\u306F\u3099\u304B\u308A",
    "\u3057\u306F\u3064",
    "\u3057\u306F\u3089\u3044",
    "\u3057\u306F\u3093",
    "\u3057\u3072\u3087\u3046",
    "\u3057\u3075\u304F",
    "\u3057\u3099\u3075\u3099\u3093",
    "\u3057\u3078\u3044",
    "\u3057\u307B\u3046",
    "\u3057\u307B\u3093",
    "\u3057\u307E\u3046",
    "\u3057\u307E\u308B",
    "\u3057\u307F\u3093",
    "\u3057\u3080\u3051\u308B",
    "\u3057\u3099\u3080\u3057\u3087",
    "\u3057\u3081\u3044",
    "\u3057\u3081\u308B",
    "\u3057\u3082\u3093",
    "\u3057\u3083\u3044\u3093",
    "\u3057\u3083\u3046\u3093",
    "\u3057\u3083\u304A\u3093",
    "\u3057\u3099\u3083\u304B\u3099\u3044\u3082",
    "\u3057\u3084\u304F\u3057\u3087",
    "\u3057\u3083\u304F\u307B\u3046",
    "\u3057\u3083\u3051\u3093",
    "\u3057\u3083\u3053",
    "\u3057\u3083\u3055\u3099\u3044",
    "\u3057\u3083\u3057\u3093",
    "\u3057\u3083\u305B\u3093",
    "\u3057\u3083\u305D\u3046",
    "\u3057\u3083\u305F\u3044",
    "\u3057\u3083\u3061\u3087\u3046",
    "\u3057\u3083\u3063\u304D\u3093",
    "\u3057\u3099\u3083\u307E",
    "\u3057\u3083\u308A\u3093",
    "\u3057\u3083\u308C\u3044",
    "\u3057\u3099\u3086\u3046",
    "\u3057\u3099\u3085\u3046\u3057\u3087",
    "\u3057\u3085\u304F\u306F\u304F",
    "\u3057\u3099\u3085\u3057\u3093",
    "\u3057\u3085\u3063\u305B\u304D",
    "\u3057\u3085\u307F",
    "\u3057\u3085\u3089\u306F\u3099",
    "\u3057\u3099\u3085\u3093\u306F\u3099\u3093",
    "\u3057\u3087\u3046\u304B\u3044",
    "\u3057\u3087\u304F\u305F\u304F",
    "\u3057\u3087\u3063\u3051\u3093",
    "\u3057\u3087\u3068\u3099\u3046",
    "\u3057\u3087\u3082\u3064",
    "\u3057\u3089\u305B\u308B",
    "\u3057\u3089\u3078\u3099\u308B",
    "\u3057\u3093\u304B",
    "\u3057\u3093\u3053\u3046",
    "\u3057\u3099\u3093\u3057\u3099\u3083",
    "\u3057\u3093\u305B\u3044\u3057\u3099",
    "\u3057\u3093\u3061\u304F",
    "\u3057\u3093\u308A\u3093",
    "\u3059\u3042\u3051\u3099",
    "\u3059\u3042\u3057",
    "\u3059\u3042\u306A",
    "\u3059\u3099\u3042\u3093",
    "\u3059\u3044\u3048\u3044",
    "\u3059\u3044\u304B",
    "\u3059\u3044\u3068\u3046",
    "\u3059\u3099\u3044\u3075\u3099\u3093",
    "\u3059\u3044\u3088\u3046\u3072\u3099",
    "\u3059\u3046\u304B\u3099\u304F",
    "\u3059\u3046\u3057\u3099\u3064",
    "\u3059\u3046\u305B\u3093",
    "\u3059\u304A\u3068\u3099\u308A",
    "\u3059\u304D\u307E",
    "\u3059\u304F\u3046",
    "\u3059\u304F\u306A\u3044",
    "\u3059\u3051\u308B",
    "\u3059\u3053\u3099\u3044",
    "\u3059\u3053\u3057",
    "\u3059\u3099\u3055\u3093",
    "\u3059\u3059\u3099\u3057\u3044",
    "\u3059\u3059\u3080",
    "\u3059\u3059\u3081\u308B",
    "\u3059\u3063\u304B\u308A",
    "\u3059\u3099\u3063\u3057\u308A",
    "\u3059\u3099\u3063\u3068",
    "\u3059\u3066\u304D",
    "\u3059\u3066\u308B",
    "\u3059\u306D\u308B",
    "\u3059\u306E\u3053",
    "\u3059\u306F\u305F\u3099",
    "\u3059\u306F\u3099\u3089\u3057\u3044",
    "\u3059\u3099\u3072\u3087\u3046",
    "\u3059\u3099\u3075\u3099\u306C\u308C",
    "\u3059\u3075\u3099\u308A",
    "\u3059\u3075\u308C",
    "\u3059\u3078\u3099\u3066",
    "\u3059\u3078\u3099\u308B",
    "\u3059\u3099\u307B\u3046",
    "\u3059\u307B\u3099\u3093",
    "\u3059\u307E\u3044",
    "\u3059\u3081\u3057",
    "\u3059\u3082\u3046",
    "\u3059\u3084\u304D",
    "\u3059\u3089\u3059\u3089",
    "\u3059\u308B\u3081",
    "\u3059\u308C\u3061\u304B\u3099\u3046",
    "\u3059\u308D\u3063\u3068",
    "\u3059\u308F\u308B",
    "\u3059\u3093\u305B\u3099\u3093",
    "\u3059\u3093\u307B\u309A\u3046",
    "\u305B\u3042\u3075\u3099\u3089",
    "\u305B\u3044\u304B\u3064",
    "\u305B\u3044\u3051\u3099\u3093",
    "\u305B\u3044\u3057\u3099",
    "\u305B\u3044\u3088\u3046",
    "\u305B\u304A\u3046",
    "\u305B\u304B\u3044\u304B\u3093",
    "\u305B\u304D\u306B\u3093",
    "\u305B\u304D\u3080",
    "\u305B\u304D\u3086",
    "\u305B\u304D\u3089\u3093\u3046\u3093",
    "\u305B\u3051\u3093",
    "\u305B\u3053\u3046",
    "\u305B\u3059\u3057\u3099",
    "\u305B\u305F\u3044",
    "\u305B\u305F\u3051",
    "\u305B\u3063\u304B\u304F",
    "\u305B\u3063\u304D\u3083\u304F",
    "\u305B\u3099\u3063\u304F",
    "\u305B\u3063\u3051\u3093",
    "\u305B\u3063\u3053\u3064",
    "\u305B\u3063\u3055\u305F\u304F\u307E",
    "\u305B\u3064\u305D\u3099\u304F",
    "\u305B\u3064\u305F\u3099\u3093",
    "\u305B\u3064\u3066\u3099\u3093",
    "\u305B\u3063\u306F\u309A\u3093",
    "\u305B\u3064\u3072\u3099",
    "\u305B\u3064\u3075\u3099\u3093",
    "\u305B\u3064\u3081\u3044",
    "\u305B\u3064\u308A\u3064",
    "\u305B\u306A\u304B",
    "\u305B\u306E\u3072\u3099",
    "\u305B\u306F\u306F\u3099",
    "\u305B\u3072\u3099\u308D",
    "\u305B\u307B\u3099\u306D",
    "\u305B\u307E\u3044",
    "\u305B\u307E\u308B",
    "\u305B\u3081\u308B",
    "\u305B\u3082\u305F\u308C",
    "\u305B\u308A\u3075",
    "\u305B\u3099\u3093\u3042\u304F",
    "\u305B\u3093\u3044",
    "\u305B\u3093\u3048\u3044",
    "\u305B\u3093\u304B",
    "\u305B\u3093\u304D\u3087",
    "\u305B\u3093\u304F",
    "\u305B\u3093\u3051\u3099\u3093",
    "\u305B\u3099\u3093\u3053\u3099",
    "\u305B\u3093\u3055\u3044",
    "\u305B\u3093\u3057\u3085",
    "\u305B\u3093\u3059\u3044",
    "\u305B\u3093\u305B\u3044",
    "\u305B\u3093\u305D\u3099",
    "\u305B\u3093\u305F\u304F",
    "\u305B\u3093\u3061\u3087\u3046",
    "\u305B\u3093\u3066\u3044",
    "\u305B\u3093\u3068\u3046",
    "\u305B\u3093\u306C\u304D",
    "\u305B\u3093\u306D\u3093",
    "\u305B\u3093\u306F\u309A\u3044",
    "\u305B\u3099\u3093\u3075\u3099",
    "\u305B\u3099\u3093\u307B\u309A\u3046",
    "\u305B\u3093\u3080",
    "\u305B\u3093\u3081\u3093\u3057\u3099\u3087",
    "\u305B\u3093\u3082\u3093",
    "\u305B\u3093\u3084\u304F",
    "\u305B\u3093\u3086\u3046",
    "\u305B\u3093\u3088\u3046",
    "\u305B\u3099\u3093\u3089",
    "\u305B\u3099\u3093\u308A\u3083\u304F",
    "\u305B\u3093\u308C\u3044",
    "\u305B\u3093\u308D",
    "\u305D\u3042\u304F",
    "\u305D\u3044\u3068\u3051\u3099\u308B",
    "\u305D\u3044\u306D",
    "\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046",
    "\u305D\u3046\u304D",
    "\u305D\u3046\u3053\u3099",
    "\u305D\u3046\u3057\u3093",
    "\u305D\u3046\u305F\u3099\u3093",
    "\u305D\u3046\u306A\u3093",
    "\u305D\u3046\u3072\u3099",
    "\u305D\u3046\u3081\u3093",
    "\u305D\u3046\u308A",
    "\u305D\u3048\u3082\u306E",
    "\u305D\u3048\u3093",
    "\u305D\u304B\u3099\u3044",
    "\u305D\u3051\u3099\u304D",
    "\u305D\u3053\u3046",
    "\u305D\u3053\u305D\u3053",
    "\u305D\u3055\u3099\u3044",
    "\u305D\u3057\u306A",
    "\u305D\u305B\u3044",
    "\u305D\u305B\u3093",
    "\u305D\u305D\u304F\u3099",
    "\u305D\u305F\u3099\u3066\u308B",
    "\u305D\u3064\u3046",
    "\u305D\u3064\u3048\u3093",
    "\u305D\u3063\u304B\u3093",
    "\u305D\u3064\u304D\u3099\u3087\u3046",
    "\u305D\u3063\u3051\u3064",
    "\u305D\u3063\u3053\u3046",
    "\u305D\u3063\u305B\u3093",
    "\u305D\u3063\u3068",
    "\u305D\u3068\u304B\u3099\u308F",
    "\u305D\u3068\u3064\u3099\u3089",
    "\u305D\u306A\u3048\u308B",
    "\u305D\u306A\u305F",
    "\u305D\u3075\u307B\u3099",
    "\u305D\u307B\u3099\u304F",
    "\u305D\u307B\u3099\u308D",
    "\u305D\u307E\u3064",
    "\u305D\u307E\u308B",
    "\u305D\u3080\u304F",
    "\u305D\u3080\u308A\u3048",
    "\u305D\u3081\u308B",
    "\u305D\u3082\u305D\u3082",
    "\u305D\u3088\u304B\u305B\u3099",
    "\u305D\u3089\u307E\u3081",
    "\u305D\u308D\u3046",
    "\u305D\u3093\u304B\u3044",
    "\u305D\u3093\u3051\u3044",
    "\u305D\u3093\u3055\u3099\u3044",
    "\u305D\u3093\u3057\u3064",
    "\u305D\u3093\u305D\u3099\u304F",
    "\u305D\u3093\u3061\u3087\u3046",
    "\u305D\u3099\u3093\u3072\u3099",
    "\u305D\u3099\u3093\u3075\u3099\u3093",
    "\u305D\u3093\u307F\u3093",
    "\u305F\u3042\u3044",
    "\u305F\u3044\u3044\u3093",
    "\u305F\u3044\u3046\u3093",
    "\u305F\u3044\u3048\u304D",
    "\u305F\u3044\u304A\u3046",
    "\u305F\u3099\u3044\u304B\u3099\u304F",
    "\u305F\u3044\u304D",
    "\u305F\u3044\u304F\u3099\u3046",
    "\u305F\u3044\u3051\u3093",
    "\u305F\u3044\u3053",
    "\u305F\u3044\u3055\u3099\u3044",
    "\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099",
    "\u305F\u3099\u3044\u3059\u304D",
    "\u305F\u3044\u305B\u3064",
    "\u305F\u3044\u305D\u3046",
    "\u305F\u3099\u3044\u305F\u3044",
    "\u305F\u3044\u3061\u3087\u3046",
    "\u305F\u3044\u3066\u3044",
    "\u305F\u3099\u3044\u3068\u3099\u3053\u308D",
    "\u305F\u3044\u306A\u3044",
    "\u305F\u3044\u306D\u3064",
    "\u305F\u3044\u306E\u3046",
    "\u305F\u3044\u306F\u3093",
    "\u305F\u3099\u3044\u3072\u3087\u3046",
    "\u305F\u3044\u3075\u3046",
    "\u305F\u3044\u3078\u3093",
    "\u305F\u3044\u307B",
    "\u305F\u3044\u307E\u3064\u306F\u3099\u306A",
    "\u305F\u3044\u307F\u3093\u304F\u3099",
    "\u305F\u3044\u3080",
    "\u305F\u3044\u3081\u3093",
    "\u305F\u3044\u3084\u304D",
    "\u305F\u3044\u3088\u3046",
    "\u305F\u3044\u3089",
    "\u305F\u3044\u308A\u3087\u304F",
    "\u305F\u3044\u308B",
    "\u305F\u3044\u308F\u3093",
    "\u305F\u3046\u3048",
    "\u305F\u3048\u308B",
    "\u305F\u304A\u3059",
    "\u305F\u304A\u308B",
    "\u305F\u304A\u308C\u308B",
    "\u305F\u304B\u3044",
    "\u305F\u304B\u306D",
    "\u305F\u304D\u3072\u3099",
    "\u305F\u304F\u3055\u3093",
    "\u305F\u3053\u304F",
    "\u305F\u3053\u3084\u304D",
    "\u305F\u3055\u3044",
    "\u305F\u3057\u3055\u3099\u3093",
    "\u305F\u3099\u3057\u3099\u3083\u308C",
    "\u305F\u3059\u3051\u308B",
    "\u305F\u3059\u3099\u3055\u308F\u308B",
    "\u305F\u305D\u304B\u3099\u308C",
    "\u305F\u305F\u304B\u3046",
    "\u305F\u305F\u304F",
    "\u305F\u305F\u3099\u3057\u3044",
    "\u305F\u305F\u307F",
    "\u305F\u3061\u306F\u3099\u306A",
    "\u305F\u3099\u3063\u304B\u3044",
    "\u305F\u3099\u3063\u304D\u3083\u304F",
    "\u305F\u3099\u3063\u3053",
    "\u305F\u3099\u3063\u3057\u3085\u3064",
    "\u305F\u3099\u3063\u305F\u3044",
    "\u305F\u3066\u308B",
    "\u305F\u3068\u3048\u308B",
    "\u305F\u306A\u306F\u3099\u305F",
    "\u305F\u306B\u3093",
    "\u305F\u306C\u304D",
    "\u305F\u306E\u3057\u307F",
    "\u305F\u306F\u3064",
    "\u305F\u3075\u3099\u3093",
    "\u305F\u3078\u3099\u308B",
    "\u305F\u307B\u3099\u3046",
    "\u305F\u307E\u3053\u3099",
    "\u305F\u307E\u308B",
    "\u305F\u3099\u3080\u308B",
    "\u305F\u3081\u3044\u304D",
    "\u305F\u3081\u3059",
    "\u305F\u3081\u308B",
    "\u305F\u3082\u3064",
    "\u305F\u3084\u3059\u3044",
    "\u305F\u3088\u308B",
    "\u305F\u3089\u3059",
    "\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093",
    "\u305F\u308A\u3087\u3046",
    "\u305F\u308A\u308B",
    "\u305F\u308B\u3068",
    "\u305F\u308C\u308B",
    "\u305F\u308C\u3093\u3068",
    "\u305F\u308D\u3063\u3068",
    "\u305F\u308F\u3080\u308C\u308B",
    "\u305F\u3099\u3093\u3042\u3064",
    "\u305F\u3093\u3044",
    "\u305F\u3093\u304A\u3093",
    "\u305F\u3093\u304B",
    "\u305F\u3093\u304D",
    "\u305F\u3093\u3051\u3093",
    "\u305F\u3093\u3053\u3099",
    "\u305F\u3093\u3055\u3093",
    "\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099",
    "\u305F\u3099\u3093\u305B\u3044",
    "\u305F\u3093\u305D\u304F",
    "\u305F\u3093\u305F\u3044",
    "\u305F\u3099\u3093\u3061",
    "\u305F\u3093\u3066\u3044",
    "\u305F\u3093\u3068\u3046",
    "\u305F\u3099\u3093\u306A",
    "\u305F\u3093\u306B\u3093",
    "\u305F\u3099\u3093\u306D\u3064",
    "\u305F\u3093\u306E\u3046",
    "\u305F\u3093\u3072\u309A\u3093",
    "\u305F\u3099\u3093\u307B\u3099\u3046",
    "\u305F\u3093\u307E\u3064",
    "\u305F\u3093\u3081\u3044",
    "\u305F\u3099\u3093\u308C\u3064",
    "\u305F\u3099\u3093\u308D",
    "\u305F\u3099\u3093\u308F",
    "\u3061\u3042\u3044",
    "\u3061\u3042\u3093",
    "\u3061\u3044\u304D",
    "\u3061\u3044\u3055\u3044",
    "\u3061\u3048\u3093",
    "\u3061\u304B\u3044",
    "\u3061\u304B\u3089",
    "\u3061\u304D\u3085\u3046",
    "\u3061\u304D\u3093",
    "\u3061\u3051\u3044\u3059\u3099",
    "\u3061\u3051\u3093",
    "\u3061\u3053\u304F",
    "\u3061\u3055\u3044",
    "\u3061\u3057\u304D",
    "\u3061\u3057\u308A\u3087\u3046",
    "\u3061\u305B\u3044",
    "\u3061\u305D\u3046",
    "\u3061\u305F\u3044",
    "\u3061\u305F\u3093",
    "\u3061\u3061\u304A\u3084",
    "\u3061\u3064\u3057\u3099\u3087",
    "\u3061\u3066\u304D",
    "\u3061\u3066\u3093",
    "\u3061\u306C\u304D",
    "\u3061\u306C\u308A",
    "\u3061\u306E\u3046",
    "\u3061\u3072\u3087\u3046",
    "\u3061\u3078\u3044\u305B\u3093",
    "\u3061\u307B\u3046",
    "\u3061\u307E\u305F",
    "\u3061\u307F\u3064",
    "\u3061\u307F\u3068\u3099\u308D",
    "\u3061\u3081\u3044\u3068\u3099",
    "\u3061\u3083\u3093\u3053\u306A\u3078\u3099",
    "\u3061\u3085\u3046\u3044",
    "\u3061\u3086\u308A\u3087\u304F",
    "\u3061\u3087\u3046\u3057",
    "\u3061\u3087\u3055\u304F\u3051\u3093",
    "\u3061\u3089\u3057",
    "\u3061\u3089\u307F",
    "\u3061\u308A\u304B\u3099\u307F",
    "\u3061\u308A\u3087\u3046",
    "\u3061\u308B\u3068\u3099",
    "\u3061\u308F\u308F",
    "\u3061\u3093\u305F\u3044",
    "\u3061\u3093\u3082\u304F",
    "\u3064\u3044\u304B",
    "\u3064\u3044\u305F\u3061",
    "\u3064\u3046\u304B",
    "\u3064\u3046\u3057\u3099\u3087\u3046",
    "\u3064\u3046\u306F\u3093",
    "\u3064\u3046\u308F",
    "\u3064\u304B\u3046",
    "\u3064\u304B\u308C\u308B",
    "\u3064\u304F\u306D",
    "\u3064\u304F\u308B",
    "\u3064\u3051\u306D",
    "\u3064\u3051\u308B",
    "\u3064\u3053\u3099\u3046",
    "\u3064\u305F\u3048\u308B",
    "\u3064\u3064\u3099\u304F",
    "\u3064\u3064\u3057\u3099",
    "\u3064\u3064\u3080",
    "\u3064\u3068\u3081\u308B",
    "\u3064\u306A\u304B\u3099\u308B",
    "\u3064\u306A\u307F",
    "\u3064\u306D\u3064\u3099\u306D",
    "\u3064\u306E\u308B",
    "\u3064\u3075\u3099\u3059",
    "\u3064\u307E\u3089\u306A\u3044",
    "\u3064\u307E\u308B",
    "\u3064\u307F\u304D",
    "\u3064\u3081\u305F\u3044",
    "\u3064\u3082\u308A",
    "\u3064\u3082\u308B",
    "\u3064\u3088\u3044",
    "\u3064\u308B\u307B\u3099",
    "\u3064\u308B\u307F\u304F",
    "\u3064\u308F\u3082\u306E",
    "\u3064\u308F\u308A",
    "\u3066\u3042\u3057",
    "\u3066\u3042\u3066",
    "\u3066\u3042\u307F",
    "\u3066\u3044\u304A\u3093",
    "\u3066\u3044\u304B",
    "\u3066\u3044\u304D",
    "\u3066\u3044\u3051\u3044",
    "\u3066\u3044\u3053\u304F",
    "\u3066\u3044\u3055\u3064",
    "\u3066\u3044\u3057",
    "\u3066\u3044\u305B\u3044",
    "\u3066\u3044\u305F\u3044",
    "\u3066\u3044\u3068\u3099",
    "\u3066\u3044\u306D\u3044",
    "\u3066\u3044\u3072\u3087\u3046",
    "\u3066\u3044\u3078\u3093",
    "\u3066\u3044\u307B\u3099\u3046",
    "\u3066\u3046\u3061",
    "\u3066\u304A\u304F\u308C",
    "\u3066\u304D\u3068\u3046",
    "\u3066\u304F\u3072\u3099",
    "\u3066\u3099\u3053\u307B\u3099\u3053",
    "\u3066\u3055\u304D\u3099\u3087\u3046",
    "\u3066\u3055\u3051\u3099",
    "\u3066\u3059\u308A",
    "\u3066\u305D\u3046",
    "\u3066\u3061\u304B\u3099\u3044",
    "\u3066\u3061\u3087\u3046",
    "\u3066\u3064\u304B\u3099\u304F",
    "\u3066\u3064\u3064\u3099\u304D",
    "\u3066\u3099\u3063\u306F\u309A",
    "\u3066\u3064\u307B\u3099\u3046",
    "\u3066\u3064\u3084",
    "\u3066\u3099\u306C\u304B\u3048",
    "\u3066\u306C\u304D",
    "\u3066\u306C\u304F\u3099\u3044",
    "\u3066\u306E\u3072\u3089",
    "\u3066\u306F\u3044",
    "\u3066\u3075\u3099\u304F\u308D",
    "\u3066\u3075\u305F\u3099",
    "\u3066\u307B\u3068\u3099\u304D",
    "\u3066\u307B\u3093",
    "\u3066\u307E\u3048",
    "\u3066\u307E\u304D\u3059\u3099\u3057",
    "\u3066\u307F\u3057\u3099\u304B",
    "\u3066\u307F\u3084\u3051\u3099",
    "\u3066\u3089\u3059",
    "\u3066\u308C\u3072\u3099",
    "\u3066\u308F\u3051",
    "\u3066\u308F\u305F\u3057",
    "\u3066\u3099\u3093\u3042\u3064",
    "\u3066\u3093\u3044\u3093",
    "\u3066\u3093\u304B\u3044",
    "\u3066\u3093\u304D",
    "\u3066\u3093\u304F\u3099",
    "\u3066\u3093\u3051\u3093",
    "\u3066\u3093\u3053\u3099\u304F",
    "\u3066\u3093\u3055\u3044",
    "\u3066\u3093\u3057",
    "\u3066\u3093\u3059\u3046",
    "\u3066\u3099\u3093\u3061",
    "\u3066\u3093\u3066\u304D",
    "\u3066\u3093\u3068\u3046",
    "\u3066\u3093\u306A\u3044",
    "\u3066\u3093\u3075\u309A\u3089",
    "\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044",
    "\u3066\u3093\u3081\u3064",
    "\u3066\u3093\u3089\u3093\u304B\u3044",
    "\u3066\u3099\u3093\u308A\u3087\u304F",
    "\u3066\u3099\u3093\u308F",
    "\u3068\u3099\u3042\u3044",
    "\u3068\u3044\u308C",
    "\u3068\u3099\u3046\u304B\u3093",
    "\u3068\u3046\u304D\u3085\u3046",
    "\u3068\u3099\u3046\u304F\u3099",
    "\u3068\u3046\u3057",
    "\u3068\u3046\u3080\u304D\u3099",
    "\u3068\u304A\u3044",
    "\u3068\u304A\u304B",
    "\u3068\u304A\u304F",
    "\u3068\u304A\u3059",
    "\u3068\u304A\u308B",
    "\u3068\u304B\u3044",
    "\u3068\u304B\u3059",
    "\u3068\u304D\u304A\u308A",
    "\u3068\u304D\u3068\u3099\u304D",
    "\u3068\u304F\u3044",
    "\u3068\u304F\u3057\u3085\u3046",
    "\u3068\u304F\u3066\u3093",
    "\u3068\u304F\u306B",
    "\u3068\u304F\u3078\u3099\u3064",
    "\u3068\u3051\u3044",
    "\u3068\u3051\u308B",
    "\u3068\u3053\u3084",
    "\u3068\u3055\u304B",
    "\u3068\u3057\u3087\u304B\u3093",
    "\u3068\u305D\u3046",
    "\u3068\u305F\u3093",
    "\u3068\u3061\u3085\u3046",
    "\u3068\u3063\u304D\u3085\u3046",
    "\u3068\u3063\u304F\u3093",
    "\u3068\u3064\u305B\u3099\u3093",
    "\u3068\u3064\u306B\u3085\u3046",
    "\u3068\u3068\u3099\u3051\u308B",
    "\u3068\u3068\u306E\u3048\u308B",
    "\u3068\u306A\u3044",
    "\u3068\u306A\u3048\u308B",
    "\u3068\u306A\u308A",
    "\u3068\u306E\u3055\u307E",
    "\u3068\u306F\u3099\u3059",
    "\u3068\u3099\u3075\u3099\u304B\u3099\u308F",
    "\u3068\u307B\u3046",
    "\u3068\u307E\u308B",
    "\u3068\u3081\u308B",
    "\u3068\u3082\u305F\u3099\u3061",
    "\u3068\u3082\u308B",
    "\u3068\u3099\u3088\u3046\u3072\u3099",
    "\u3068\u3089\u3048\u308B",
    "\u3068\u3093\u304B\u3064",
    "\u3068\u3099\u3093\u3075\u3099\u308A",
    "\u306A\u3044\u304B\u304F",
    "\u306A\u3044\u3053\u3046",
    "\u306A\u3044\u3057\u3087",
    "\u306A\u3044\u3059",
    "\u306A\u3044\u305B\u3093",
    "\u306A\u3044\u305D\u3046",
    "\u306A\u304A\u3059",
    "\u306A\u304B\u3099\u3044",
    "\u306A\u304F\u3059",
    "\u306A\u3051\u3099\u308B",
    "\u306A\u3053\u3046\u3068\u3099",
    "\u306A\u3055\u3051",
    "\u306A\u305F\u3066\u3099\u3053\u3053",
    "\u306A\u3063\u3068\u3046",
    "\u306A\u3064\u3084\u3059\u307F",
    "\u306A\u306A\u304A\u3057",
    "\u306A\u306B\u3053\u3099\u3068",
    "\u306A\u306B\u3082\u306E",
    "\u306A\u306B\u308F",
    "\u306A\u306E\u304B",
    "\u306A\u3075\u305F\u3099",
    "\u306A\u307E\u3044\u304D",
    "\u306A\u307E\u3048",
    "\u306A\u307E\u307F",
    "\u306A\u307F\u305F\u3099",
    "\u306A\u3081\u3089\u304B",
    "\u306A\u3081\u308B",
    "\u306A\u3084\u3080",
    "\u306A\u3089\u3046",
    "\u306A\u3089\u3072\u3099",
    "\u306A\u3089\u3075\u3099",
    "\u306A\u308C\u308B",
    "\u306A\u308F\u3068\u3072\u3099",
    "\u306A\u308F\u306F\u3099\u308A",
    "\u306B\u3042\u3046",
    "\u306B\u3044\u304B\u3099\u305F",
    "\u306B\u3046\u3051",
    "\u306B\u304A\u3044",
    "\u306B\u304B\u3044",
    "\u306B\u304B\u3099\u3066",
    "\u306B\u304D\u3072\u3099",
    "\u306B\u304F\u3057\u307F",
    "\u306B\u304F\u307E\u3093",
    "\u306B\u3051\u3099\u308B",
    "\u306B\u3055\u3093\u304B\u305F\u3093\u305D",
    "\u306B\u3057\u304D",
    "\u306B\u305B\u3082\u306E",
    "\u306B\u3061\u3057\u3099\u3087\u3046",
    "\u306B\u3061\u3088\u3046\u3072\u3099",
    "\u306B\u3063\u304B",
    "\u306B\u3063\u304D",
    "\u306B\u3063\u3051\u3044",
    "\u306B\u3063\u3053\u3046",
    "\u306B\u3063\u3055\u3093",
    "\u306B\u3063\u3057\u3087\u304F",
    "\u306B\u3063\u3059\u3046",
    "\u306B\u3063\u305B\u304D",
    "\u306B\u3063\u3066\u3044",
    "\u306B\u306A\u3046",
    "\u306B\u307B\u3093",
    "\u306B\u307E\u3081",
    "\u306B\u3082\u3064",
    "\u306B\u3084\u308A",
    "\u306B\u3085\u3046\u3044\u3093",
    "\u306B\u308A\u3093\u3057\u3083",
    "\u306B\u308F\u3068\u308A",
    "\u306B\u3093\u3044",
    "\u306B\u3093\u304B",
    "\u306B\u3093\u304D",
    "\u306B\u3093\u3051\u3099\u3093",
    "\u306B\u3093\u3057\u304D",
    "\u306B\u3093\u3059\u3099\u3046",
    "\u306B\u3093\u305D\u3046",
    "\u306B\u3093\u305F\u3044",
    "\u306B\u3093\u3061",
    "\u306B\u3093\u3066\u3044",
    "\u306B\u3093\u306B\u304F",
    "\u306B\u3093\u3075\u309A",
    "\u306B\u3093\u307E\u308A",
    "\u306B\u3093\u3080",
    "\u306B\u3093\u3081\u3044",
    "\u306B\u3093\u3088\u3046",
    "\u306C\u3044\u304F\u304D\u3099",
    "\u306C\u304B\u3059",
    "\u306C\u304F\u3099\u3044\u3068\u308B",
    "\u306C\u304F\u3099\u3046",
    "\u306C\u304F\u3082\u308A",
    "\u306C\u3059\u3080",
    "\u306C\u307E\u3048\u3072\u3099",
    "\u306C\u3081\u308A",
    "\u306C\u3089\u3059",
    "\u306C\u3093\u3061\u3083\u304F",
    "\u306D\u3042\u3051\u3099",
    "\u306D\u3044\u304D",
    "\u306D\u3044\u308B",
    "\u306D\u3044\u308D",
    "\u306D\u304F\u3099\u305B",
    "\u306D\u304F\u305F\u3044",
    "\u306D\u304F\u3089",
    "\u306D\u3053\u305B\u3099",
    "\u306D\u3053\u3080",
    "\u306D\u3055\u3051\u3099",
    "\u306D\u3059\u3053\u3099\u3059",
    "\u306D\u305D\u3078\u3099\u308B",
    "\u306D\u305F\u3099\u3093",
    "\u306D\u3064\u3044",
    "\u306D\u3063\u3057\u3093",
    "\u306D\u3064\u305D\u3099\u3046",
    "\u306D\u3063\u305F\u3044\u304D\u3099\u3087",
    "\u306D\u3075\u3099\u305D\u304F",
    "\u306D\u3075\u305F\u3099",
    "\u306D\u307B\u3099\u3046",
    "\u306D\u307B\u308A\u306F\u307B\u308A",
    "\u306D\u307E\u304D",
    "\u306D\u307E\u308F\u3057",
    "\u306D\u307F\u307F",
    "\u306D\u3080\u3044",
    "\u306D\u3080\u305F\u3044",
    "\u306D\u3082\u3068",
    "\u306D\u3089\u3046",
    "\u306D\u308F\u3055\u3099",
    "\u306D\u3093\u3044\u308A",
    "\u306D\u3093\u304A\u3057",
    "\u306D\u3093\u304B\u3093",
    "\u306D\u3093\u304D\u3093",
    "\u306D\u3093\u304F\u3099",
    "\u306D\u3093\u3055\u3099",
    "\u306D\u3093\u3057",
    "\u306D\u3093\u3061\u3083\u304F",
    "\u306D\u3093\u3068\u3099",
    "\u306D\u3093\u3072\u309A",
    "\u306D\u3093\u3075\u3099\u3064",
    "\u306D\u3093\u307E\u3064",
    "\u306D\u3093\u308A\u3087\u3046",
    "\u306D\u3093\u308C\u3044",
    "\u306E\u3044\u3059\u3099",
    "\u306E\u304A\u3064\u3099\u307E",
    "\u306E\u304B\u3099\u3059",
    "\u306E\u304D\u306A\u307F",
    "\u306E\u3053\u304D\u3099\u308A",
    "\u306E\u3053\u3059",
    "\u306E\u3053\u308B",
    "\u306E\u305B\u308B",
    "\u306E\u305D\u3099\u304F",
    "\u306E\u305D\u3099\u3080",
    "\u306E\u305F\u307E\u3046",
    "\u306E\u3061\u307B\u3068\u3099",
    "\u306E\u3063\u304F",
    "\u306E\u306F\u3099\u3059",
    "\u306E\u306F\u3089",
    "\u306E\u3078\u3099\u308B",
    "\u306E\u307B\u3099\u308B",
    "\u306E\u307F\u3082\u306E",
    "\u306E\u3084\u307E",
    "\u306E\u3089\u3044\u306C",
    "\u306E\u3089\u306D\u3053",
    "\u306E\u308A\u3082\u306E",
    "\u306E\u308A\u3086\u304D",
    "\u306E\u308C\u3093",
    "\u306E\u3093\u304D",
    "\u306F\u3099\u3042\u3044",
    "\u306F\u3042\u304F",
    "\u306F\u3099\u3042\u3055\u3093",
    "\u306F\u3099\u3044\u304B",
    "\u306F\u3099\u3044\u304F",
    "\u306F\u3044\u3051\u3093",
    "\u306F\u3044\u3053\u3099",
    "\u306F\u3044\u3057\u3093",
    "\u306F\u3044\u3059\u3044",
    "\u306F\u3044\u305B\u3093",
    "\u306F\u3044\u305D\u3046",
    "\u306F\u3044\u3061",
    "\u306F\u3099\u3044\u306F\u3099\u3044",
    "\u306F\u3044\u308C\u3064",
    "\u306F\u3048\u308B",
    "\u306F\u304A\u308B",
    "\u306F\u304B\u3044",
    "\u306F\u3099\u304B\u308A",
    "\u306F\u304B\u308B",
    "\u306F\u304F\u3057\u3085",
    "\u306F\u3051\u3093",
    "\u306F\u3053\u3075\u3099",
    "\u306F\u3055\u307F",
    "\u306F\u3055\u3093",
    "\u306F\u3057\u3053\u3099",
    "\u306F\u3099\u3057\u3087",
    "\u306F\u3057\u308B",
    "\u306F\u305B\u308B",
    "\u306F\u309A\u305D\u3053\u3093",
    "\u306F\u305D\u3093",
    "\u306F\u305F\u3093",
    "\u306F\u3061\u307F\u3064",
    "\u306F\u3064\u304A\u3093",
    "\u306F\u3063\u304B\u304F",
    "\u306F\u3064\u3099\u304D",
    "\u306F\u3063\u304D\u308A",
    "\u306F\u3063\u304F\u3064",
    "\u306F\u3063\u3051\u3093",
    "\u306F\u3063\u3053\u3046",
    "\u306F\u3063\u3055\u3093",
    "\u306F\u3063\u3057\u3093",
    "\u306F\u3063\u305F\u3064",
    "\u306F\u3063\u3061\u3085\u3046",
    "\u306F\u3063\u3066\u3093",
    "\u306F\u3063\u3072\u309A\u3087\u3046",
    "\u306F\u3063\u307B\u309A\u3046",
    "\u306F\u306A\u3059",
    "\u306F\u306A\u3072\u3099",
    "\u306F\u306B\u304B\u3080",
    "\u306F\u3075\u3099\u3089\u3057",
    "\u306F\u307F\u304B\u3099\u304D",
    "\u306F\u3080\u304B\u3046",
    "\u306F\u3081\u3064",
    "\u306F\u3084\u3044",
    "\u306F\u3084\u3057",
    "\u306F\u3089\u3046",
    "\u306F\u308D\u3046\u3043\u3093",
    "\u306F\u308F\u3044",
    "\u306F\u3093\u3044",
    "\u306F\u3093\u3048\u3044",
    "\u306F\u3093\u304A\u3093",
    "\u306F\u3093\u304B\u304F",
    "\u306F\u3093\u304D\u3087\u3046",
    "\u306F\u3099\u3093\u304F\u3099\u307F",
    "\u306F\u3093\u3053",
    "\u306F\u3093\u3057\u3083",
    "\u306F\u3093\u3059\u3046",
    "\u306F\u3093\u305F\u3099\u3093",
    "\u306F\u309A\u3093\u3061",
    "\u306F\u309A\u3093\u3064",
    "\u306F\u3093\u3066\u3044",
    "\u306F\u3093\u3068\u3057",
    "\u306F\u3093\u306E\u3046",
    "\u306F\u3093\u306F\u309A",
    "\u306F\u3093\u3075\u3099\u3093",
    "\u306F\u3093\u3078\u309A\u3093",
    "\u306F\u3093\u307B\u3099\u3046\u304D",
    "\u306F\u3093\u3081\u3044",
    "\u306F\u3093\u3089\u3093",
    "\u306F\u3093\u308D\u3093",
    "\u3072\u3044\u304D",
    "\u3072\u3046\u3093",
    "\u3072\u3048\u308B",
    "\u3072\u304B\u304F",
    "\u3072\u304B\u308A",
    "\u3072\u304B\u308B",
    "\u3072\u304B\u3093",
    "\u3072\u304F\u3044",
    "\u3072\u3051\u3064",
    "\u3072\u3053\u3046\u304D",
    "\u3072\u3053\u304F",
    "\u3072\u3055\u3044",
    "\u3072\u3055\u3057\u3075\u3099\u308A",
    "\u3072\u3055\u3093",
    "\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093",
    "\u3072\u3057\u3087",
    "\u3072\u305D\u304B",
    "\u3072\u305D\u3080",
    "\u3072\u305F\u3080\u304D",
    "\u3072\u305F\u3099\u308A",
    "\u3072\u305F\u308B",
    "\u3072\u3064\u304D\u3099",
    "\u3072\u3063\u3053\u3057",
    "\u3072\u3063\u3057",
    "\u3072\u3064\u3057\u3099\u3085\u3072\u3093",
    "\u3072\u3063\u3059",
    "\u3072\u3064\u305B\u3099\u3093",
    "\u3072\u309A\u3063\u305F\u308A",
    "\u3072\u309A\u3063\u3061\u308A",
    "\u3072\u3064\u3088\u3046",
    "\u3072\u3066\u3044",
    "\u3072\u3068\u3053\u3099\u307F",
    "\u3072\u306A\u307E\u3064\u308A",
    "\u3072\u306A\u3093",
    "\u3072\u306D\u308B",
    "\u3072\u306F\u3093",
    "\u3072\u3072\u3099\u304F",
    "\u3072\u3072\u3087\u3046",
    "\u3072\u307B\u3046",
    "\u3072\u307E\u308F\u308A",
    "\u3072\u307E\u3093",
    "\u3072\u307F\u3064",
    "\u3072\u3081\u3044",
    "\u3072\u3081\u3057\u3099\u3057",
    "\u3072\u3084\u3051",
    "\u3072\u3084\u3059",
    "\u3072\u3088\u3046",
    "\u3072\u3099\u3087\u3046\u304D",
    "\u3072\u3089\u304B\u3099\u306A",
    "\u3072\u3089\u304F",
    "\u3072\u308A\u3064",
    "\u3072\u308A\u3087\u3046",
    "\u3072\u308B\u307E",
    "\u3072\u308B\u3084\u3059\u307F",
    "\u3072\u308C\u3044",
    "\u3072\u308D\u3044",
    "\u3072\u308D\u3046",
    "\u3072\u308D\u304D",
    "\u3072\u308D\u3086\u304D",
    "\u3072\u3093\u304B\u304F",
    "\u3072\u3093\u3051\u3064",
    "\u3072\u3093\u3053\u3093",
    "\u3072\u3093\u3057\u3085",
    "\u3072\u3093\u305D\u3046",
    "\u3072\u309A\u3093\u3061",
    "\u3072\u3093\u306F\u309A\u3093",
    "\u3072\u3099\u3093\u307B\u3099\u3046",
    "\u3075\u3042\u3093",
    "\u3075\u3044\u3046\u3061",
    "\u3075\u3046\u3051\u3044",
    "\u3075\u3046\u305B\u3093",
    "\u3075\u309A\u3046\u305F\u308D\u3046",
    "\u3075\u3046\u3068\u3046",
    "\u3075\u3046\u3075",
    "\u3075\u3048\u308B",
    "\u3075\u304A\u3093",
    "\u3075\u304B\u3044",
    "\u3075\u304D\u3093",
    "\u3075\u304F\u3055\u3099\u3064",
    "\u3075\u304F\u3075\u3099\u304F\u308D",
    "\u3075\u3053\u3046",
    "\u3075\u3055\u3044",
    "\u3075\u3057\u304D\u3099",
    "\u3075\u3057\u3099\u307F",
    "\u3075\u3059\u307E",
    "\u3075\u305B\u3044",
    "\u3075\u305B\u304F\u3099",
    "\u3075\u305D\u304F",
    "\u3075\u3099\u305F\u306B\u304F",
    "\u3075\u305F\u3093",
    "\u3075\u3061\u3087\u3046",
    "\u3075\u3064\u3046",
    "\u3075\u3064\u304B",
    "\u3075\u3063\u304B\u3064",
    "\u3075\u3063\u304D",
    "\u3075\u3063\u3053\u304F",
    "\u3075\u3099\u3068\u3099\u3046",
    "\u3075\u3068\u308B",
    "\u3075\u3068\u3093",
    "\u3075\u306E\u3046",
    "\u3075\u306F\u3044",
    "\u3075\u3072\u3087\u3046",
    "\u3075\u3078\u3093",
    "\u3075\u307E\u3093",
    "\u3075\u307F\u3093",
    "\u3075\u3081\u3064",
    "\u3075\u3081\u3093",
    "\u3075\u3088\u3046",
    "\u3075\u308A\u3053",
    "\u3075\u308A\u308B",
    "\u3075\u308B\u3044",
    "\u3075\u3093\u3044\u304D",
    "\u3075\u3099\u3093\u304B\u3099\u304F",
    "\u3075\u3099\u3093\u304F\u3099",
    "\u3075\u3093\u3057\u3064",
    "\u3075\u3099\u3093\u305B\u304D",
    "\u3075\u3093\u305D\u3046",
    "\u3075\u3099\u3093\u307B\u309A\u3046",
    "\u3078\u3044\u3042\u3093",
    "\u3078\u3044\u304A\u3093",
    "\u3078\u3044\u304B\u3099\u3044",
    "\u3078\u3044\u304D",
    "\u3078\u3044\u3051\u3099\u3093",
    "\u3078\u3044\u3053\u3046",
    "\u3078\u3044\u3055",
    "\u3078\u3044\u3057\u3083",
    "\u3078\u3044\u305B\u3064",
    "\u3078\u3044\u305D",
    "\u3078\u3044\u305F\u304F",
    "\u3078\u3044\u3066\u3093",
    "\u3078\u3044\u306D\u3064",
    "\u3078\u3044\u308F",
    "\u3078\u304D\u304B\u3099",
    "\u3078\u3053\u3080",
    "\u3078\u3099\u306B\u3044\u308D",
    "\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099",
    "\u3078\u3089\u3059",
    "\u3078\u3093\u304B\u3093",
    "\u3078\u3099\u3093\u304D\u3087\u3046",
    "\u3078\u3099\u3093\u3053\u3099\u3057",
    "\u3078\u3093\u3055\u3044",
    "\u3078\u3093\u305F\u3044",
    "\u3078\u3099\u3093\u308A",
    "\u307B\u3042\u3093",
    "\u307B\u3044\u304F",
    "\u307B\u3099\u3046\u304D\u3099\u3087",
    "\u307B\u3046\u3053\u304F",
    "\u307B\u3046\u305D\u3046",
    "\u307B\u3046\u307B\u3046",
    "\u307B\u3046\u3082\u3093",
    "\u307B\u3046\u308A\u3064",
    "\u307B\u3048\u308B",
    "\u307B\u304A\u3093",
    "\u307B\u304B\u3093",
    "\u307B\u304D\u3087\u3046",
    "\u307B\u3099\u304D\u3093",
    "\u307B\u304F\u308D",
    "\u307B\u3051\u3064",
    "\u307B\u3051\u3093",
    "\u307B\u3053\u3046",
    "\u307B\u3053\u308B",
    "\u307B\u3057\u3044",
    "\u307B\u3057\u3064",
    "\u307B\u3057\u3085",
    "\u307B\u3057\u3087\u3046",
    "\u307B\u305B\u3044",
    "\u307B\u305D\u3044",
    "\u307B\u305D\u304F",
    "\u307B\u305F\u3066",
    "\u307B\u305F\u308B",
    "\u307B\u309A\u3061\u3075\u3099\u304F\u308D",
    "\u307B\u3063\u304D\u3087\u304F",
    "\u307B\u3063\u3055",
    "\u307B\u3063\u305F\u3093",
    "\u307B\u3068\u3093\u3068\u3099",
    "\u307B\u3081\u308B",
    "\u307B\u3093\u3044",
    "\u307B\u3093\u304D",
    "\u307B\u3093\u3051",
    "\u307B\u3093\u3057\u3064",
    "\u307B\u3093\u3084\u304F",
    "\u307E\u3044\u306B\u3061",
    "\u307E\u304B\u3044",
    "\u307E\u304B\u305B\u308B",
    "\u307E\u304B\u3099\u308B",
    "\u307E\u3051\u308B",
    "\u307E\u3053\u3068",
    "\u307E\u3055\u3064",
    "\u307E\u3057\u3099\u3081",
    "\u307E\u3059\u304F",
    "\u307E\u305B\u3099\u308B",
    "\u307E\u3064\u308A",
    "\u307E\u3068\u3081",
    "\u307E\u306A\u3075\u3099",
    "\u307E\u306C\u3051",
    "\u307E\u306D\u304F",
    "\u307E\u307B\u3046",
    "\u307E\u3082\u308B",
    "\u307E\u3086\u3051\u3099",
    "\u307E\u3088\u3046",
    "\u307E\u308D\u3084\u304B",
    "\u307E\u308F\u3059",
    "\u307E\u308F\u308A",
    "\u307E\u308F\u308B",
    "\u307E\u3093\u304B\u3099",
    "\u307E\u3093\u304D\u3064",
    "\u307E\u3093\u305D\u3099\u304F",
    "\u307E\u3093\u306A\u304B",
    "\u307F\u3044\u3089",
    "\u307F\u3046\u3061",
    "\u307F\u3048\u308B",
    "\u307F\u304B\u3099\u304F",
    "\u307F\u304B\u305F",
    "\u307F\u304B\u3093",
    "\u307F\u3051\u3093",
    "\u307F\u3053\u3093",
    "\u307F\u3057\u3099\u304B\u3044",
    "\u307F\u3059\u3044",
    "\u307F\u3059\u3048\u308B",
    "\u307F\u305B\u308B",
    "\u307F\u3063\u304B",
    "\u307F\u3064\u304B\u308B",
    "\u307F\u3064\u3051\u308B",
    "\u307F\u3066\u3044",
    "\u307F\u3068\u3081\u308B",
    "\u307F\u306A\u3068",
    "\u307F\u306A\u307F\u304B\u3055\u3044",
    "\u307F\u306D\u3089\u308B",
    "\u307F\u306E\u3046",
    "\u307F\u306E\u304B\u3099\u3059",
    "\u307F\u307B\u3093",
    "\u307F\u3082\u3068",
    "\u307F\u3084\u3051\u3099",
    "\u307F\u3089\u3044",
    "\u307F\u308A\u3087\u304F",
    "\u307F\u308F\u304F",
    "\u307F\u3093\u304B",
    "\u307F\u3093\u305D\u3099\u304F",
    "\u3080\u3044\u304B",
    "\u3080\u3048\u304D",
    "\u3080\u3048\u3093",
    "\u3080\u304B\u3044",
    "\u3080\u304B\u3046",
    "\u3080\u304B\u3048",
    "\u3080\u304B\u3057",
    "\u3080\u304D\u3099\u3061\u3083",
    "\u3080\u3051\u308B",
    "\u3080\u3051\u3099\u3093",
    "\u3080\u3055\u307B\u3099\u308B",
    "\u3080\u3057\u3042\u3064\u3044",
    "\u3080\u3057\u306F\u3099",
    "\u3080\u3057\u3099\u3085\u3093",
    "\u3080\u3057\u308D",
    "\u3080\u3059\u3046",
    "\u3080\u3059\u3053",
    "\u3080\u3059\u3075\u3099",
    "\u3080\u3059\u3081",
    "\u3080\u305B\u308B",
    "\u3080\u305B\u3093",
    "\u3080\u3061\u3085\u3046",
    "\u3080\u306A\u3057\u3044",
    "\u3080\u306E\u3046",
    "\u3080\u3084\u307F",
    "\u3080\u3088\u3046",
    "\u3080\u3089\u3055\u304D",
    "\u3080\u308A\u3087\u3046",
    "\u3080\u308D\u3093",
    "\u3081\u3044\u3042\u3093",
    "\u3081\u3044\u3046\u3093",
    "\u3081\u3044\u3048\u3093",
    "\u3081\u3044\u304B\u304F",
    "\u3081\u3044\u304D\u3087\u304F",
    "\u3081\u3044\u3055\u3044",
    "\u3081\u3044\u3057",
    "\u3081\u3044\u305D\u3046",
    "\u3081\u3044\u3075\u3099\u3064",
    "\u3081\u3044\u308C\u3044",
    "\u3081\u3044\u308F\u304F",
    "\u3081\u304F\u3099\u307E\u308C\u308B",
    "\u3081\u3055\u3099\u3059",
    "\u3081\u3057\u305F",
    "\u3081\u3059\u3099\u3089\u3057\u3044",
    "\u3081\u305F\u3099\u3064",
    "\u3081\u307E\u3044",
    "\u3081\u3084\u3059",
    "\u3081\u3093\u304D\u3087",
    "\u3081\u3093\u305B\u304D",
    "\u3081\u3093\u3068\u3099\u3046",
    "\u3082\u3046\u3057\u3042\u3051\u3099\u308B",
    "\u3082\u3046\u3068\u3099\u3046\u3051\u3093",
    "\u3082\u3048\u308B",
    "\u3082\u304F\u3057",
    "\u3082\u304F\u3066\u304D",
    "\u3082\u304F\u3088\u3046\u3072\u3099",
    "\u3082\u3061\u308D\u3093",
    "\u3082\u3068\u3099\u308B",
    "\u3082\u3089\u3046",
    "\u3082\u3093\u304F",
    "\u3082\u3093\u305F\u3099\u3044",
    "\u3084\u304A\u3084",
    "\u3084\u3051\u308B",
    "\u3084\u3055\u3044",
    "\u3084\u3055\u3057\u3044",
    "\u3084\u3059\u3044",
    "\u3084\u3059\u305F\u308D\u3046",
    "\u3084\u3059\u307F",
    "\u3084\u305B\u308B",
    "\u3084\u305D\u3046",
    "\u3084\u305F\u3044",
    "\u3084\u3061\u3093",
    "\u3084\u3063\u3068",
    "\u3084\u3063\u306F\u309A\u308A",
    "\u3084\u3075\u3099\u308B",
    "\u3084\u3081\u308B",
    "\u3084\u3084\u3053\u3057\u3044",
    "\u3084\u3088\u3044",
    "\u3084\u308F\u3089\u304B\u3044",
    "\u3086\u3046\u304D",
    "\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F",
    "\u3086\u3046\u3078\u3099",
    "\u3086\u3046\u3081\u3044",
    "\u3086\u3051\u3064",
    "\u3086\u3057\u3085\u3064",
    "\u3086\u305B\u3093",
    "\u3086\u305D\u3046",
    "\u3086\u305F\u304B",
    "\u3086\u3061\u3083\u304F",
    "\u3086\u3066\u3099\u308B",
    "\u3086\u306B\u3085\u3046",
    "\u3086\u3072\u3099\u308F",
    "\u3086\u3089\u3044",
    "\u3086\u308C\u308B",
    "\u3088\u3046\u3044",
    "\u3088\u3046\u304B",
    "\u3088\u3046\u304D\u3085\u3046",
    "\u3088\u3046\u3057\u3099",
    "\u3088\u3046\u3059",
    "\u3088\u3046\u3061\u3048\u3093",
    "\u3088\u304B\u305B\u3099",
    "\u3088\u304B\u3093",
    "\u3088\u304D\u3093",
    "\u3088\u304F\u305B\u3044",
    "\u3088\u304F\u307B\u3099\u3046",
    "\u3088\u3051\u3044",
    "\u3088\u3053\u3099\u308C\u308B",
    "\u3088\u3055\u3093",
    "\u3088\u3057\u3085\u3046",
    "\u3088\u305D\u3046",
    "\u3088\u305D\u304F",
    "\u3088\u3063\u304B",
    "\u3088\u3066\u3044",
    "\u3088\u3068\u3099\u304B\u3099\u308F\u304F",
    "\u3088\u306D\u3064",
    "\u3088\u3084\u304F",
    "\u3088\u3086\u3046",
    "\u3088\u308D\u3053\u3075\u3099",
    "\u3088\u308D\u3057\u3044",
    "\u3089\u3044\u3046",
    "\u3089\u304F\u304B\u3099\u304D",
    "\u3089\u304F\u3053\u3099",
    "\u3089\u304F\u3055\u3064",
    "\u3089\u304F\u305F\u3099",
    "\u3089\u3057\u3093\u306F\u3099\u3093",
    "\u3089\u305B\u3093",
    "\u3089\u305D\u3099\u304F",
    "\u3089\u305F\u3044",
    "\u3089\u3063\u304B",
    "\u3089\u308C\u3064",
    "\u308A\u3048\u304D",
    "\u308A\u304B\u3044",
    "\u308A\u304D\u3055\u304F",
    "\u308A\u304D\u305B\u3064",
    "\u308A\u304F\u304F\u3099\u3093",
    "\u308A\u304F\u3064",
    "\u308A\u3051\u3093",
    "\u308A\u3053\u3046",
    "\u308A\u305B\u3044",
    "\u308A\u305D\u3046",
    "\u308A\u305D\u304F",
    "\u308A\u3066\u3093",
    "\u308A\u306D\u3093",
    "\u308A\u3086\u3046",
    "\u308A\u3085\u3046\u304B\u3099\u304F",
    "\u308A\u3088\u3046",
    "\u308A\u3087\u3046\u308A",
    "\u308A\u3087\u304B\u3093",
    "\u308A\u3087\u304F\u3061\u3083",
    "\u308A\u3087\u3053\u3046",
    "\u308A\u308A\u304F",
    "\u308A\u308C\u304D",
    "\u308A\u308D\u3093",
    "\u308A\u3093\u3053\u3099",
    "\u308B\u3044\u3051\u3044",
    "\u308B\u3044\u3055\u3044",
    "\u308B\u3044\u3057\u3099",
    "\u308B\u3044\u305B\u304D",
    "\u308B\u3059\u306F\u3099\u3093",
    "\u308B\u308A\u304B\u3099\u308F\u3089",
    "\u308C\u3044\u304B\u3093",
    "\u308C\u3044\u304D\u3099",
    "\u308C\u3044\u305B\u3044",
    "\u308C\u3044\u305D\u3099\u3046\u3053",
    "\u308C\u3044\u3068\u3046",
    "\u308C\u3044\u307B\u3099\u3046",
    "\u308C\u304D\u3057",
    "\u308C\u304D\u305F\u3099\u3044",
    "\u308C\u3093\u3042\u3044",
    "\u308C\u3093\u3051\u3044",
    "\u308C\u3093\u3053\u3093",
    "\u308C\u3093\u3055\u3044",
    "\u308C\u3093\u3057\u3085\u3046",
    "\u308C\u3093\u305D\u3099\u304F",
    "\u308C\u3093\u3089\u304F",
    "\u308D\u3046\u304B",
    "\u308D\u3046\u3053\u3099",
    "\u308D\u3046\u3057\u3099\u3093",
    "\u308D\u3046\u305D\u304F",
    "\u308D\u304F\u304B\u3099",
    "\u308D\u3053\u3064",
    "\u308D\u3057\u3099\u3046\u3089",
    "\u308D\u3057\u3085\u3064",
    "\u308D\u305B\u3093",
    "\u308D\u3066\u3093",
    "\u308D\u3081\u3093",
    "\u308D\u308C\u3064",
    "\u308D\u3093\u304D\u3099",
    "\u308D\u3093\u306F\u309A",
    "\u308D\u3093\u3075\u3099\u3093",
    "\u308D\u3093\u308A",
    "\u308F\u304B\u3059",
    "\u308F\u304B\u3081",
    "\u308F\u304B\u3084\u307E",
    "\u308F\u304B\u308C\u308B",
    "\u308F\u3057\u3064",
    "\u308F\u3057\u3099\u307E\u3057",
    "\u308F\u3059\u308C\u3082\u306E",
    "\u308F\u3089\u3046",
    "\u308F\u308C\u308B"
];
module.exports = $d79d8455c602e66b$var$japanese;

});

parcelRegister("fRsoT", function(module, exports) {
"use strict";
var $b8c1d603229df54c$var$spanish = [
    "a\u0301baco",
    "abdomen",
    "abeja",
    "abierto",
    "abogado",
    "abono",
    "aborto",
    "abrazo",
    "abrir",
    "abuelo",
    "abuso",
    "acabar",
    "academia",
    "acceso",
    "accio\u0301n",
    "aceite",
    "acelga",
    "acento",
    "aceptar",
    "a\u0301cido",
    "aclarar",
    "acne\u0301",
    "acoger",
    "acoso",
    "activo",
    "acto",
    "actriz",
    "actuar",
    "acudir",
    "acuerdo",
    "acusar",
    "adicto",
    "admitir",
    "adoptar",
    "adorno",
    "aduana",
    "adulto",
    "ae\u0301reo",
    "afectar",
    "aficio\u0301n",
    "afinar",
    "afirmar",
    "a\u0301gil",
    "agitar",
    "agoni\u0301a",
    "agosto",
    "agotar",
    "agregar",
    "agrio",
    "agua",
    "agudo",
    "a\u0301guila",
    "aguja",
    "ahogo",
    "ahorro",
    "aire",
    "aislar",
    "ajedrez",
    "ajeno",
    "ajuste",
    "alacra\u0301n",
    "alambre",
    "alarma",
    "alba",
    "a\u0301lbum",
    "alcalde",
    "aldea",
    "alegre",
    "alejar",
    "alerta",
    "aleta",
    "alfiler",
    "alga",
    "algodo\u0301n",
    "aliado",
    "aliento",
    "alivio",
    "alma",
    "almeja",
    "almi\u0301bar",
    "altar",
    "alteza",
    "altivo",
    "alto",
    "altura",
    "alumno",
    "alzar",
    "amable",
    "amante",
    "amapola",
    "amargo",
    "amasar",
    "a\u0301mbar",
    "a\u0301mbito",
    "ameno",
    "amigo",
    "amistad",
    "amor",
    "amparo",
    "amplio",
    "ancho",
    "anciano",
    "ancla",
    "andar",
    "ande\u0301n",
    "anemia",
    "a\u0301ngulo",
    "anillo",
    "a\u0301nimo",
    "ani\u0301s",
    "anotar",
    "antena",
    "antiguo",
    "antojo",
    "anual",
    "anular",
    "anuncio",
    "an\u0303adir",
    "an\u0303ejo",
    "an\u0303o",
    "apagar",
    "aparato",
    "apetito",
    "apio",
    "aplicar",
    "apodo",
    "aporte",
    "apoyo",
    "aprender",
    "aprobar",
    "apuesta",
    "apuro",
    "arado",
    "aran\u0303a",
    "arar",
    "a\u0301rbitro",
    "a\u0301rbol",
    "arbusto",
    "archivo",
    "arco",
    "arder",
    "ardilla",
    "arduo",
    "a\u0301rea",
    "a\u0301rido",
    "aries",
    "armoni\u0301a",
    "arne\u0301s",
    "aroma",
    "arpa",
    "arpo\u0301n",
    "arreglo",
    "arroz",
    "arruga",
    "arte",
    "artista",
    "asa",
    "asado",
    "asalto",
    "ascenso",
    "asegurar",
    "aseo",
    "asesor",
    "asiento",
    "asilo",
    "asistir",
    "asno",
    "asombro",
    "a\u0301spero",
    "astilla",
    "astro",
    "astuto",
    "asumir",
    "asunto",
    "atajo",
    "ataque",
    "atar",
    "atento",
    "ateo",
    "a\u0301tico",
    "atleta",
    "a\u0301tomo",
    "atraer",
    "atroz",
    "atu\u0301n",
    "audaz",
    "audio",
    "auge",
    "aula",
    "aumento",
    "ausente",
    "autor",
    "aval",
    "avance",
    "avaro",
    "ave",
    "avellana",
    "avena",
    "avestruz",
    "avio\u0301n",
    "aviso",
    "ayer",
    "ayuda",
    "ayuno",
    "azafra\u0301n",
    "azar",
    "azote",
    "azu\u0301car",
    "azufre",
    "azul",
    "baba",
    "babor",
    "bache",
    "bahi\u0301a",
    "baile",
    "bajar",
    "balanza",
    "balco\u0301n",
    "balde",
    "bambu\u0301",
    "banco",
    "banda",
    "ban\u0303o",
    "barba",
    "barco",
    "barniz",
    "barro",
    "ba\u0301scula",
    "basto\u0301n",
    "basura",
    "batalla",
    "bateri\u0301a",
    "batir",
    "batuta",
    "bau\u0301l",
    "bazar",
    "bebe\u0301",
    "bebida",
    "bello",
    "besar",
    "beso",
    "bestia",
    "bicho",
    "bien",
    "bingo",
    "blanco",
    "bloque",
    "blusa",
    "boa",
    "bobina",
    "bobo",
    "boca",
    "bocina",
    "boda",
    "bodega",
    "boina",
    "bola",
    "bolero",
    "bolsa",
    "bomba",
    "bondad",
    "bonito",
    "bono",
    "bonsa\u0301i",
    "borde",
    "borrar",
    "bosque",
    "bote",
    "boti\u0301n",
    "bo\u0301veda",
    "bozal",
    "bravo",
    "brazo",
    "brecha",
    "breve",
    "brillo",
    "brinco",
    "brisa",
    "broca",
    "broma",
    "bronce",
    "brote",
    "bruja",
    "brusco",
    "bruto",
    "buceo",
    "bucle",
    "bueno",
    "buey",
    "bufanda",
    "bufo\u0301n",
    "bu\u0301ho",
    "buitre",
    "bulto",
    "burbuja",
    "burla",
    "burro",
    "buscar",
    "butaca",
    "buzo\u0301n",
    "caballo",
    "cabeza",
    "cabina",
    "cabra",
    "cacao",
    "cada\u0301ver",
    "cadena",
    "caer",
    "cafe\u0301",
    "cai\u0301da",
    "caima\u0301n",
    "caja",
    "cajo\u0301n",
    "cal",
    "calamar",
    "calcio",
    "caldo",
    "calidad",
    "calle",
    "calma",
    "calor",
    "calvo",
    "cama",
    "cambio",
    "camello",
    "camino",
    "campo",
    "ca\u0301ncer",
    "candil",
    "canela",
    "canguro",
    "canica",
    "canto",
    "can\u0303a",
    "can\u0303o\u0301n",
    "caoba",
    "caos",
    "capaz",
    "capita\u0301n",
    "capote",
    "captar",
    "capucha",
    "cara",
    "carbo\u0301n",
    "ca\u0301rcel",
    "careta",
    "carga",
    "carin\u0303o",
    "carne",
    "carpeta",
    "carro",
    "carta",
    "casa",
    "casco",
    "casero",
    "caspa",
    "castor",
    "catorce",
    "catre",
    "caudal",
    "causa",
    "cazo",
    "cebolla",
    "ceder",
    "cedro",
    "celda",
    "ce\u0301lebre",
    "celoso",
    "ce\u0301lula",
    "cemento",
    "ceniza",
    "centro",
    "cerca",
    "cerdo",
    "cereza",
    "cero",
    "cerrar",
    "certeza",
    "ce\u0301sped",
    "cetro",
    "chacal",
    "chaleco",
    "champu\u0301",
    "chancla",
    "chapa",
    "charla",
    "chico",
    "chiste",
    "chivo",
    "choque",
    "choza",
    "chuleta",
    "chupar",
    "ciclo\u0301n",
    "ciego",
    "cielo",
    "cien",
    "cierto",
    "cifra",
    "cigarro",
    "cima",
    "cinco",
    "cine",
    "cinta",
    "cipre\u0301s",
    "circo",
    "ciruela",
    "cisne",
    "cita",
    "ciudad",
    "clamor",
    "clan",
    "claro",
    "clase",
    "clave",
    "cliente",
    "clima",
    "cli\u0301nica",
    "cobre",
    "coccio\u0301n",
    "cochino",
    "cocina",
    "coco",
    "co\u0301digo",
    "codo",
    "cofre",
    "coger",
    "cohete",
    "coji\u0301n",
    "cojo",
    "cola",
    "colcha",
    "colegio",
    "colgar",
    "colina",
    "collar",
    "colmo",
    "columna",
    "combate",
    "comer",
    "comida",
    "co\u0301modo",
    "compra",
    "conde",
    "conejo",
    "conga",
    "conocer",
    "consejo",
    "contar",
    "copa",
    "copia",
    "corazo\u0301n",
    "corbata",
    "corcho",
    "cordo\u0301n",
    "corona",
    "correr",
    "coser",
    "cosmos",
    "costa",
    "cra\u0301neo",
    "cra\u0301ter",
    "crear",
    "crecer",
    "crei\u0301do",
    "crema",
    "cri\u0301a",
    "crimen",
    "cripta",
    "crisis",
    "cromo",
    "cro\u0301nica",
    "croqueta",
    "crudo",
    "cruz",
    "cuadro",
    "cuarto",
    "cuatro",
    "cubo",
    "cubrir",
    "cuchara",
    "cuello",
    "cuento",
    "cuerda",
    "cuesta",
    "cueva",
    "cuidar",
    "culebra",
    "culpa",
    "culto",
    "cumbre",
    "cumplir",
    "cuna",
    "cuneta",
    "cuota",
    "cupo\u0301n",
    "cu\u0301pula",
    "curar",
    "curioso",
    "curso",
    "curva",
    "cutis",
    "dama",
    "danza",
    "dar",
    "dardo",
    "da\u0301til",
    "deber",
    "de\u0301bil",
    "de\u0301cada",
    "decir",
    "dedo",
    "defensa",
    "definir",
    "dejar",
    "delfi\u0301n",
    "delgado",
    "delito",
    "demora",
    "denso",
    "dental",
    "deporte",
    "derecho",
    "derrota",
    "desayuno",
    "deseo",
    "desfile",
    "desnudo",
    "destino",
    "desvi\u0301o",
    "detalle",
    "detener",
    "deuda",
    "di\u0301a",
    "diablo",
    "diadema",
    "diamante",
    "diana",
    "diario",
    "dibujo",
    "dictar",
    "diente",
    "dieta",
    "diez",
    "difi\u0301cil",
    "digno",
    "dilema",
    "diluir",
    "dinero",
    "directo",
    "dirigir",
    "disco",
    "disen\u0303o",
    "disfraz",
    "diva",
    "divino",
    "doble",
    "doce",
    "dolor",
    "domingo",
    "don",
    "donar",
    "dorado",
    "dormir",
    "dorso",
    "dos",
    "dosis",
    "drago\u0301n",
    "droga",
    "ducha",
    "duda",
    "duelo",
    "duen\u0303o",
    "dulce",
    "du\u0301o",
    "duque",
    "durar",
    "dureza",
    "duro",
    "e\u0301bano",
    "ebrio",
    "echar",
    "eco",
    "ecuador",
    "edad",
    "edicio\u0301n",
    "edificio",
    "editor",
    "educar",
    "efecto",
    "eficaz",
    "eje",
    "ejemplo",
    "elefante",
    "elegir",
    "elemento",
    "elevar",
    "elipse",
    "e\u0301lite",
    "elixir",
    "elogio",
    "eludir",
    "embudo",
    "emitir",
    "emocio\u0301n",
    "empate",
    "empen\u0303o",
    "empleo",
    "empresa",
    "enano",
    "encargo",
    "enchufe",
    "enci\u0301a",
    "enemigo",
    "enero",
    "enfado",
    "enfermo",
    "engan\u0303o",
    "enigma",
    "enlace",
    "enorme",
    "enredo",
    "ensayo",
    "ensen\u0303ar",
    "entero",
    "entrar",
    "envase",
    "envi\u0301o",
    "e\u0301poca",
    "equipo",
    "erizo",
    "escala",
    "escena",
    "escolar",
    "escribir",
    "escudo",
    "esencia",
    "esfera",
    "esfuerzo",
    "espada",
    "espejo",
    "espi\u0301a",
    "esposa",
    "espuma",
    "esqui\u0301",
    "estar",
    "este",
    "estilo",
    "estufa",
    "etapa",
    "eterno",
    "e\u0301tica",
    "etnia",
    "evadir",
    "evaluar",
    "evento",
    "evitar",
    "exacto",
    "examen",
    "exceso",
    "excusa",
    "exento",
    "exigir",
    "exilio",
    "existir",
    "e\u0301xito",
    "experto",
    "explicar",
    "exponer",
    "extremo",
    "fa\u0301brica",
    "fa\u0301bula",
    "fachada",
    "fa\u0301cil",
    "factor",
    "faena",
    "faja",
    "falda",
    "fallo",
    "falso",
    "faltar",
    "fama",
    "familia",
    "famoso",
    "farao\u0301n",
    "farmacia",
    "farol",
    "farsa",
    "fase",
    "fatiga",
    "fauna",
    "favor",
    "fax",
    "febrero",
    "fecha",
    "feliz",
    "feo",
    "feria",
    "feroz",
    "fe\u0301rtil",
    "fervor",
    "festi\u0301n",
    "fiable",
    "fianza",
    "fiar",
    "fibra",
    "ficcio\u0301n",
    "ficha",
    "fideo",
    "fiebre",
    "fiel",
    "fiera",
    "fiesta",
    "figura",
    "fijar",
    "fijo",
    "fila",
    "filete",
    "filial",
    "filtro",
    "fin",
    "finca",
    "fingir",
    "finito",
    "firma",
    "flaco",
    "flauta",
    "flecha",
    "flor",
    "flota",
    "fluir",
    "flujo",
    "flu\u0301or",
    "fobia",
    "foca",
    "fogata",
    "fogo\u0301n",
    "folio",
    "folleto",
    "fondo",
    "forma",
    "forro",
    "fortuna",
    "forzar",
    "fosa",
    "foto",
    "fracaso",
    "fra\u0301gil",
    "franja",
    "frase",
    "fraude",
    "frei\u0301r",
    "freno",
    "fresa",
    "fri\u0301o",
    "frito",
    "fruta",
    "fuego",
    "fuente",
    "fuerza",
    "fuga",
    "fumar",
    "funcio\u0301n",
    "funda",
    "furgo\u0301n",
    "furia",
    "fusil",
    "fu\u0301tbol",
    "futuro",
    "gacela",
    "gafas",
    "gaita",
    "gajo",
    "gala",
    "galeri\u0301a",
    "gallo",
    "gamba",
    "ganar",
    "gancho",
    "ganga",
    "ganso",
    "garaje",
    "garza",
    "gasolina",
    "gastar",
    "gato",
    "gavila\u0301n",
    "gemelo",
    "gemir",
    "gen",
    "ge\u0301nero",
    "genio",
    "gente",
    "geranio",
    "gerente",
    "germen",
    "gesto",
    "gigante",
    "gimnasio",
    "girar",
    "giro",
    "glaciar",
    "globo",
    "gloria",
    "gol",
    "golfo",
    "goloso",
    "golpe",
    "goma",
    "gordo",
    "gorila",
    "gorra",
    "gota",
    "goteo",
    "gozar",
    "grada",
    "gra\u0301fico",
    "grano",
    "grasa",
    "gratis",
    "grave",
    "grieta",
    "grillo",
    "gripe",
    "gris",
    "grito",
    "grosor",
    "gru\u0301a",
    "grueso",
    "grumo",
    "grupo",
    "guante",
    "guapo",
    "guardia",
    "guerra",
    "gui\u0301a",
    "guin\u0303o",
    "guion",
    "guiso",
    "guitarra",
    "gusano",
    "gustar",
    "haber",
    "ha\u0301bil",
    "hablar",
    "hacer",
    "hacha",
    "hada",
    "hallar",
    "hamaca",
    "harina",
    "haz",
    "hazan\u0303a",
    "hebilla",
    "hebra",
    "hecho",
    "helado",
    "helio",
    "hembra",
    "herir",
    "hermano",
    "he\u0301roe",
    "hervir",
    "hielo",
    "hierro",
    "hi\u0301gado",
    "higiene",
    "hijo",
    "himno",
    "historia",
    "hocico",
    "hogar",
    "hoguera",
    "hoja",
    "hombre",
    "hongo",
    "honor",
    "honra",
    "hora",
    "hormiga",
    "horno",
    "hostil",
    "hoyo",
    "hueco",
    "huelga",
    "huerta",
    "hueso",
    "huevo",
    "huida",
    "huir",
    "humano",
    "hu\u0301medo",
    "humilde",
    "humo",
    "hundir",
    "huraca\u0301n",
    "hurto",
    "icono",
    "ideal",
    "idioma",
    "i\u0301dolo",
    "iglesia",
    "iglu\u0301",
    "igual",
    "ilegal",
    "ilusio\u0301n",
    "imagen",
    "ima\u0301n",
    "imitar",
    "impar",
    "imperio",
    "imponer",
    "impulso",
    "incapaz",
    "i\u0301ndice",
    "inerte",
    "infiel",
    "informe",
    "ingenio",
    "inicio",
    "inmenso",
    "inmune",
    "innato",
    "insecto",
    "instante",
    "intere\u0301s",
    "i\u0301ntimo",
    "intuir",
    "inu\u0301til",
    "invierno",
    "ira",
    "iris",
    "ironi\u0301a",
    "isla",
    "islote",
    "jabali\u0301",
    "jabo\u0301n",
    "jamo\u0301n",
    "jarabe",
    "jardi\u0301n",
    "jarra",
    "jaula",
    "jazmi\u0301n",
    "jefe",
    "jeringa",
    "jinete",
    "jornada",
    "joroba",
    "joven",
    "joya",
    "juerga",
    "jueves",
    "juez",
    "jugador",
    "jugo",
    "juguete",
    "juicio",
    "junco",
    "jungla",
    "junio",
    "juntar",
    "ju\u0301piter",
    "jurar",
    "justo",
    "juvenil",
    "juzgar",
    "kilo",
    "koala",
    "labio",
    "lacio",
    "lacra",
    "lado",
    "ladro\u0301n",
    "lagarto",
    "la\u0301grima",
    "laguna",
    "laico",
    "lamer",
    "la\u0301mina",
    "la\u0301mpara",
    "lana",
    "lancha",
    "langosta",
    "lanza",
    "la\u0301piz",
    "largo",
    "larva",
    "la\u0301stima",
    "lata",
    "la\u0301tex",
    "latir",
    "laurel",
    "lavar",
    "lazo",
    "leal",
    "leccio\u0301n",
    "leche",
    "lector",
    "leer",
    "legio\u0301n",
    "legumbre",
    "lejano",
    "lengua",
    "lento",
    "len\u0303a",
    "leo\u0301n",
    "leopardo",
    "lesio\u0301n",
    "letal",
    "letra",
    "leve",
    "leyenda",
    "libertad",
    "libro",
    "licor",
    "li\u0301der",
    "lidiar",
    "lienzo",
    "liga",
    "ligero",
    "lima",
    "li\u0301mite",
    "limo\u0301n",
    "limpio",
    "lince",
    "lindo",
    "li\u0301nea",
    "lingote",
    "lino",
    "linterna",
    "li\u0301quido",
    "liso",
    "lista",
    "litera",
    "litio",
    "litro",
    "llaga",
    "llama",
    "llanto",
    "llave",
    "llegar",
    "llenar",
    "llevar",
    "llorar",
    "llover",
    "lluvia",
    "lobo",
    "locio\u0301n",
    "loco",
    "locura",
    "lo\u0301gica",
    "logro",
    "lombriz",
    "lomo",
    "lonja",
    "lote",
    "lucha",
    "lucir",
    "lugar",
    "lujo",
    "luna",
    "lunes",
    "lupa",
    "lustro",
    "luto",
    "luz",
    "maceta",
    "macho",
    "madera",
    "madre",
    "maduro",
    "maestro",
    "mafia",
    "magia",
    "mago",
    "mai\u0301z",
    "maldad",
    "maleta",
    "malla",
    "malo",
    "mama\u0301",
    "mambo",
    "mamut",
    "manco",
    "mando",
    "manejar",
    "manga",
    "maniqui\u0301",
    "manjar",
    "mano",
    "manso",
    "manta",
    "man\u0303ana",
    "mapa",
    "ma\u0301quina",
    "mar",
    "marco",
    "marea",
    "marfil",
    "margen",
    "marido",
    "ma\u0301rmol",
    "marro\u0301n",
    "martes",
    "marzo",
    "masa",
    "ma\u0301scara",
    "masivo",
    "matar",
    "materia",
    "matiz",
    "matriz",
    "ma\u0301ximo",
    "mayor",
    "mazorca",
    "mecha",
    "medalla",
    "medio",
    "me\u0301dula",
    "mejilla",
    "mejor",
    "melena",
    "melo\u0301n",
    "memoria",
    "menor",
    "mensaje",
    "mente",
    "menu\u0301",
    "mercado",
    "merengue",
    "me\u0301rito",
    "mes",
    "meso\u0301n",
    "meta",
    "meter",
    "me\u0301todo",
    "metro",
    "mezcla",
    "miedo",
    "miel",
    "miembro",
    "miga",
    "mil",
    "milagro",
    "militar",
    "millo\u0301n",
    "mimo",
    "mina",
    "minero",
    "mi\u0301nimo",
    "minuto",
    "miope",
    "mirar",
    "misa",
    "miseria",
    "misil",
    "mismo",
    "mitad",
    "mito",
    "mochila",
    "mocio\u0301n",
    "moda",
    "modelo",
    "moho",
    "mojar",
    "molde",
    "moler",
    "molino",
    "momento",
    "momia",
    "monarca",
    "moneda",
    "monja",
    "monto",
    "mon\u0303o",
    "morada",
    "morder",
    "moreno",
    "morir",
    "morro",
    "morsa",
    "mortal",
    "mosca",
    "mostrar",
    "motivo",
    "mover",
    "mo\u0301vil",
    "mozo",
    "mucho",
    "mudar",
    "mueble",
    "muela",
    "muerte",
    "muestra",
    "mugre",
    "mujer",
    "mula",
    "muleta",
    "multa",
    "mundo",
    "mun\u0303eca",
    "mural",
    "muro",
    "mu\u0301sculo",
    "museo",
    "musgo",
    "mu\u0301sica",
    "muslo",
    "na\u0301car",
    "nacio\u0301n",
    "nadar",
    "naipe",
    "naranja",
    "nariz",
    "narrar",
    "nasal",
    "natal",
    "nativo",
    "natural",
    "na\u0301usea",
    "naval",
    "nave",
    "navidad",
    "necio",
    "ne\u0301ctar",
    "negar",
    "negocio",
    "negro",
    "neo\u0301n",
    "nervio",
    "neto",
    "neutro",
    "nevar",
    "nevera",
    "nicho",
    "nido",
    "niebla",
    "nieto",
    "nin\u0303ez",
    "nin\u0303o",
    "ni\u0301tido",
    "nivel",
    "nobleza",
    "noche",
    "no\u0301mina",
    "noria",
    "norma",
    "norte",
    "nota",
    "noticia",
    "novato",
    "novela",
    "novio",
    "nube",
    "nuca",
    "nu\u0301cleo",
    "nudillo",
    "nudo",
    "nuera",
    "nueve",
    "nuez",
    "nulo",
    "nu\u0301mero",
    "nutria",
    "oasis",
    "obeso",
    "obispo",
    "objeto",
    "obra",
    "obrero",
    "observar",
    "obtener",
    "obvio",
    "oca",
    "ocaso",
    "oce\u0301ano",
    "ochenta",
    "ocho",
    "ocio",
    "ocre",
    "octavo",
    "octubre",
    "oculto",
    "ocupar",
    "ocurrir",
    "odiar",
    "odio",
    "odisea",
    "oeste",
    "ofensa",
    "oferta",
    "oficio",
    "ofrecer",
    "ogro",
    "oi\u0301do",
    "oi\u0301r",
    "ojo",
    "ola",
    "oleada",
    "olfato",
    "olivo",
    "olla",
    "olmo",
    "olor",
    "olvido",
    "ombligo",
    "onda",
    "onza",
    "opaco",
    "opcio\u0301n",
    "o\u0301pera",
    "opinar",
    "oponer",
    "optar",
    "o\u0301ptica",
    "opuesto",
    "oracio\u0301n",
    "orador",
    "oral",
    "o\u0301rbita",
    "orca",
    "orden",
    "oreja",
    "o\u0301rgano",
    "orgi\u0301a",
    "orgullo",
    "oriente",
    "origen",
    "orilla",
    "oro",
    "orquesta",
    "oruga",
    "osadi\u0301a",
    "oscuro",
    "osezno",
    "oso",
    "ostra",
    "oton\u0303o",
    "otro",
    "oveja",
    "o\u0301vulo",
    "o\u0301xido",
    "oxi\u0301geno",
    "oyente",
    "ozono",
    "pacto",
    "padre",
    "paella",
    "pa\u0301gina",
    "pago",
    "pai\u0301s",
    "pa\u0301jaro",
    "palabra",
    "palco",
    "paleta",
    "pa\u0301lido",
    "palma",
    "paloma",
    "palpar",
    "pan",
    "panal",
    "pa\u0301nico",
    "pantera",
    "pan\u0303uelo",
    "papa\u0301",
    "papel",
    "papilla",
    "paquete",
    "parar",
    "parcela",
    "pared",
    "parir",
    "paro",
    "pa\u0301rpado",
    "parque",
    "pa\u0301rrafo",
    "parte",
    "pasar",
    "paseo",
    "pasio\u0301n",
    "paso",
    "pasta",
    "pata",
    "patio",
    "patria",
    "pausa",
    "pauta",
    "pavo",
    "payaso",
    "peato\u0301n",
    "pecado",
    "pecera",
    "pecho",
    "pedal",
    "pedir",
    "pegar",
    "peine",
    "pelar",
    "peldan\u0303o",
    "pelea",
    "peligro",
    "pellejo",
    "pelo",
    "peluca",
    "pena",
    "pensar",
    "pen\u0303o\u0301n",
    "peo\u0301n",
    "peor",
    "pepino",
    "pequen\u0303o",
    "pera",
    "percha",
    "perder",
    "pereza",
    "perfil",
    "perico",
    "perla",
    "permiso",
    "perro",
    "persona",
    "pesa",
    "pesca",
    "pe\u0301simo",
    "pestan\u0303a",
    "pe\u0301talo",
    "petro\u0301leo",
    "pez",
    "pezun\u0303a",
    "picar",
    "picho\u0301n",
    "pie",
    "piedra",
    "pierna",
    "pieza",
    "pijama",
    "pilar",
    "piloto",
    "pimienta",
    "pino",
    "pintor",
    "pinza",
    "pin\u0303a",
    "piojo",
    "pipa",
    "pirata",
    "pisar",
    "piscina",
    "piso",
    "pista",
    "pito\u0301n",
    "pizca",
    "placa",
    "plan",
    "plata",
    "playa",
    "plaza",
    "pleito",
    "pleno",
    "plomo",
    "pluma",
    "plural",
    "pobre",
    "poco",
    "poder",
    "podio",
    "poema",
    "poesi\u0301a",
    "poeta",
    "polen",
    "polici\u0301a",
    "pollo",
    "polvo",
    "pomada",
    "pomelo",
    "pomo",
    "pompa",
    "poner",
    "porcio\u0301n",
    "portal",
    "posada",
    "poseer",
    "posible",
    "poste",
    "potencia",
    "potro",
    "pozo",
    "prado",
    "precoz",
    "pregunta",
    "premio",
    "prensa",
    "preso",
    "previo",
    "primo",
    "pri\u0301ncipe",
    "prisio\u0301n",
    "privar",
    "proa",
    "probar",
    "proceso",
    "producto",
    "proeza",
    "profesor",
    "programa",
    "prole",
    "promesa",
    "pronto",
    "propio",
    "pro\u0301ximo",
    "prueba",
    "pu\u0301blico",
    "puchero",
    "pudor",
    "pueblo",
    "puerta",
    "puesto",
    "pulga",
    "pulir",
    "pulmo\u0301n",
    "pulpo",
    "pulso",
    "puma",
    "punto",
    "pun\u0303al",
    "pun\u0303o",
    "pupa",
    "pupila",
    "pure\u0301",
    "quedar",
    "queja",
    "quemar",
    "querer",
    "queso",
    "quieto",
    "qui\u0301mica",
    "quince",
    "quitar",
    "ra\u0301bano",
    "rabia",
    "rabo",
    "racio\u0301n",
    "radical",
    "rai\u0301z",
    "rama",
    "rampa",
    "rancho",
    "rango",
    "rapaz",
    "ra\u0301pido",
    "rapto",
    "rasgo",
    "raspa",
    "rato",
    "rayo",
    "raza",
    "razo\u0301n",
    "reaccio\u0301n",
    "realidad",
    "reban\u0303o",
    "rebote",
    "recaer",
    "receta",
    "rechazo",
    "recoger",
    "recreo",
    "recto",
    "recurso",
    "red",
    "redondo",
    "reducir",
    "reflejo",
    "reforma",
    "refra\u0301n",
    "refugio",
    "regalo",
    "regir",
    "regla",
    "regreso",
    "rehe\u0301n",
    "reino",
    "rei\u0301r",
    "reja",
    "relato",
    "relevo",
    "relieve",
    "relleno",
    "reloj",
    "remar",
    "remedio",
    "remo",
    "rencor",
    "rendir",
    "renta",
    "reparto",
    "repetir",
    "reposo",
    "reptil",
    "res",
    "rescate",
    "resina",
    "respeto",
    "resto",
    "resumen",
    "retiro",
    "retorno",
    "retrato",
    "reunir",
    "reve\u0301s",
    "revista",
    "rey",
    "rezar",
    "rico",
    "riego",
    "rienda",
    "riesgo",
    "rifa",
    "ri\u0301gido",
    "rigor",
    "rinco\u0301n",
    "rin\u0303o\u0301n",
    "ri\u0301o",
    "riqueza",
    "risa",
    "ritmo",
    "rito",
    "rizo",
    "roble",
    "roce",
    "rociar",
    "rodar",
    "rodeo",
    "rodilla",
    "roer",
    "rojizo",
    "rojo",
    "romero",
    "romper",
    "ron",
    "ronco",
    "ronda",
    "ropa",
    "ropero",
    "rosa",
    "rosca",
    "rostro",
    "rotar",
    "rubi\u0301",
    "rubor",
    "rudo",
    "rueda",
    "rugir",
    "ruido",
    "ruina",
    "ruleta",
    "rulo",
    "rumbo",
    "rumor",
    "ruptura",
    "ruta",
    "rutina",
    "sa\u0301bado",
    "saber",
    "sabio",
    "sable",
    "sacar",
    "sagaz",
    "sagrado",
    "sala",
    "saldo",
    "salero",
    "salir",
    "salmo\u0301n",
    "salo\u0301n",
    "salsa",
    "salto",
    "salud",
    "salvar",
    "samba",
    "sancio\u0301n",
    "sandi\u0301a",
    "sanear",
    "sangre",
    "sanidad",
    "sano",
    "santo",
    "sapo",
    "saque",
    "sardina",
    "sarte\u0301n",
    "sastre",
    "sata\u0301n",
    "sauna",
    "saxofo\u0301n",
    "seccio\u0301n",
    "seco",
    "secreto",
    "secta",
    "sed",
    "seguir",
    "seis",
    "sello",
    "selva",
    "semana",
    "semilla",
    "senda",
    "sensor",
    "sen\u0303al",
    "sen\u0303or",
    "separar",
    "sepia",
    "sequi\u0301a",
    "ser",
    "serie",
    "sermo\u0301n",
    "servir",
    "sesenta",
    "sesio\u0301n",
    "seta",
    "setenta",
    "severo",
    "sexo",
    "sexto",
    "sidra",
    "siesta",
    "siete",
    "siglo",
    "signo",
    "si\u0301laba",
    "silbar",
    "silencio",
    "silla",
    "si\u0301mbolo",
    "simio",
    "sirena",
    "sistema",
    "sitio",
    "situar",
    "sobre",
    "socio",
    "sodio",
    "sol",
    "solapa",
    "soldado",
    "soledad",
    "so\u0301lido",
    "soltar",
    "solucio\u0301n",
    "sombra",
    "sondeo",
    "sonido",
    "sonoro",
    "sonrisa",
    "sopa",
    "soplar",
    "soporte",
    "sordo",
    "sorpresa",
    "sorteo",
    "soste\u0301n",
    "so\u0301tano",
    "suave",
    "subir",
    "suceso",
    "sudor",
    "suegra",
    "suelo",
    "suen\u0303o",
    "suerte",
    "sufrir",
    "sujeto",
    "sulta\u0301n",
    "sumar",
    "superar",
    "suplir",
    "suponer",
    "supremo",
    "sur",
    "surco",
    "suren\u0303o",
    "surgir",
    "susto",
    "sutil",
    "tabaco",
    "tabique",
    "tabla",
    "tabu\u0301",
    "taco",
    "tacto",
    "tajo",
    "talar",
    "talco",
    "talento",
    "talla",
    "talo\u0301n",
    "taman\u0303o",
    "tambor",
    "tango",
    "tanque",
    "tapa",
    "tapete",
    "tapia",
    "tapo\u0301n",
    "taquilla",
    "tarde",
    "tarea",
    "tarifa",
    "tarjeta",
    "tarot",
    "tarro",
    "tarta",
    "tatuaje",
    "tauro",
    "taza",
    "tazo\u0301n",
    "teatro",
    "techo",
    "tecla",
    "te\u0301cnica",
    "tejado",
    "tejer",
    "tejido",
    "tela",
    "tele\u0301fono",
    "tema",
    "temor",
    "templo",
    "tenaz",
    "tender",
    "tener",
    "tenis",
    "tenso",
    "teori\u0301a",
    "terapia",
    "terco",
    "te\u0301rmino",
    "ternura",
    "terror",
    "tesis",
    "tesoro",
    "testigo",
    "tetera",
    "texto",
    "tez",
    "tibio",
    "tiburo\u0301n",
    "tiempo",
    "tienda",
    "tierra",
    "tieso",
    "tigre",
    "tijera",
    "tilde",
    "timbre",
    "ti\u0301mido",
    "timo",
    "tinta",
    "ti\u0301o",
    "ti\u0301pico",
    "tipo",
    "tira",
    "tiro\u0301n",
    "tita\u0301n",
    "ti\u0301tere",
    "ti\u0301tulo",
    "tiza",
    "toalla",
    "tobillo",
    "tocar",
    "tocino",
    "todo",
    "toga",
    "toldo",
    "tomar",
    "tono",
    "tonto",
    "topar",
    "tope",
    "toque",
    "to\u0301rax",
    "torero",
    "tormenta",
    "torneo",
    "toro",
    "torpedo",
    "torre",
    "torso",
    "tortuga",
    "tos",
    "tosco",
    "toser",
    "to\u0301xico",
    "trabajo",
    "tractor",
    "traer",
    "tra\u0301fico",
    "trago",
    "traje",
    "tramo",
    "trance",
    "trato",
    "trauma",
    "trazar",
    "tre\u0301bol",
    "tregua",
    "treinta",
    "tren",
    "trepar",
    "tres",
    "tribu",
    "trigo",
    "tripa",
    "triste",
    "triunfo",
    "trofeo",
    "trompa",
    "tronco",
    "tropa",
    "trote",
    "trozo",
    "truco",
    "trueno",
    "trufa",
    "tuberi\u0301a",
    "tubo",
    "tuerto",
    "tumba",
    "tumor",
    "tu\u0301nel",
    "tu\u0301nica",
    "turbina",
    "turismo",
    "turno",
    "tutor",
    "ubicar",
    "u\u0301lcera",
    "umbral",
    "unidad",
    "unir",
    "universo",
    "uno",
    "untar",
    "un\u0303a",
    "urbano",
    "urbe",
    "urgente",
    "urna",
    "usar",
    "usuario",
    "u\u0301til",
    "utopi\u0301a",
    "uva",
    "vaca",
    "vaci\u0301o",
    "vacuna",
    "vagar",
    "vago",
    "vaina",
    "vajilla",
    "vale",
    "va\u0301lido",
    "valle",
    "valor",
    "va\u0301lvula",
    "vampiro",
    "vara",
    "variar",
    "varo\u0301n",
    "vaso",
    "vecino",
    "vector",
    "vehi\u0301culo",
    "veinte",
    "vejez",
    "vela",
    "velero",
    "veloz",
    "vena",
    "vencer",
    "venda",
    "veneno",
    "vengar",
    "venir",
    "venta",
    "venus",
    "ver",
    "verano",
    "verbo",
    "verde",
    "vereda",
    "verja",
    "verso",
    "verter",
    "vi\u0301a",
    "viaje",
    "vibrar",
    "vicio",
    "vi\u0301ctima",
    "vida",
    "vi\u0301deo",
    "vidrio",
    "viejo",
    "viernes",
    "vigor",
    "vil",
    "villa",
    "vinagre",
    "vino",
    "vin\u0303edo",
    "violi\u0301n",
    "viral",
    "virgo",
    "virtud",
    "visor",
    "vi\u0301spera",
    "vista",
    "vitamina",
    "viudo",
    "vivaz",
    "vivero",
    "vivir",
    "vivo",
    "volca\u0301n",
    "volumen",
    "volver",
    "voraz",
    "votar",
    "voto",
    "voz",
    "vuelo",
    "vulgar",
    "yacer",
    "yate",
    "yegua",
    "yema",
    "yerno",
    "yeso",
    "yodo",
    "yoga",
    "yogur",
    "zafiro",
    "zanja",
    "zapato",
    "zarza",
    "zona",
    "zorro",
    "zumo",
    "zurdo"
];
module.exports = $b8c1d603229df54c$var$spanish;

});




$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $d2410e1a25d3e3b4$export$2e2bcd8739ae039);
"use strict";
var $d2410e1a25d3e3b4$var$bsv = {};

// module information
$d2410e1a25d3e3b4$var$bsv.version = "v" + (parcelRequire("e1FbD")).version;
$d2410e1a25d3e3b4$var$bsv.versionGuard = function(version) {
    if (version !== undefined) {
        var message = `
      More than one instance of bsv found.
      Please make sure to require bsv and check that submodules do
      not also include their own bsv dependency.`;
        console.warn(message);
    }
};
$d2410e1a25d3e3b4$var$bsv.versionGuard($parcel$global._scrypt_bsv);
$parcel$global._scrypt_bsv = $d2410e1a25d3e3b4$var$bsv.version;
// crypto
$d2410e1a25d3e3b4$var$bsv.crypto = {};

$d2410e1a25d3e3b4$var$bsv.crypto.BN = (parcelRequire("lM2TS"));

$d2410e1a25d3e3b4$var$bsv.crypto.ECDSA = (parcelRequire("2p5rz"));

$d2410e1a25d3e3b4$var$bsv.crypto.Hash = (parcelRequire("aScoK"));

$d2410e1a25d3e3b4$var$bsv.crypto.Random = (parcelRequire("b3rcQ"));

$d2410e1a25d3e3b4$var$bsv.crypto.Point = (parcelRequire("japbZ"));

$d2410e1a25d3e3b4$var$bsv.crypto.Signature = (parcelRequire("km2cb"));
// encoding
$d2410e1a25d3e3b4$var$bsv.encoding = {};

$d2410e1a25d3e3b4$var$bsv.encoding.Base58 = (parcelRequire("6BAsE"));

$d2410e1a25d3e3b4$var$bsv.encoding.Base58Check = (parcelRequire("9AjNa"));

$d2410e1a25d3e3b4$var$bsv.encoding.BufferReader = (parcelRequire("eKoSX"));

$d2410e1a25d3e3b4$var$bsv.encoding.BufferWriter = (parcelRequire("fvPTe"));

$d2410e1a25d3e3b4$var$bsv.encoding.Varint = (parcelRequire("kWg93"));
// utilities
$d2410e1a25d3e3b4$var$bsv.util = {};

$d2410e1a25d3e3b4$var$bsv.util.js = (parcelRequire("bbk3w"));

$d2410e1a25d3e3b4$var$bsv.util.preconditions = (parcelRequire("e34gf"));

// errors thrown by the library
$d2410e1a25d3e3b4$var$bsv.errors = (parcelRequire("lOQ1c"));

// main bitcoin library
$d2410e1a25d3e3b4$var$bsv.Address = (parcelRequire("dOZs9"));

$d2410e1a25d3e3b4$var$bsv.Block = (parcelRequire("clspB"));

$d2410e1a25d3e3b4$var$bsv.MerkleBlock = (parcelRequire("goS54"));

$d2410e1a25d3e3b4$var$bsv.BlockHeader = (parcelRequire("lrDO8"));

$d2410e1a25d3e3b4$var$bsv.HDPrivateKey = (parcelRequire("Nv8ZS"));

$d2410e1a25d3e3b4$var$bsv.HDPublicKey = (parcelRequire("iFSyP"));

$d2410e1a25d3e3b4$var$bsv.Networks = (parcelRequire("92x2d"));

$d2410e1a25d3e3b4$var$bsv.Opcode = (parcelRequire("5pTcb"));

$d2410e1a25d3e3b4$var$bsv.PrivateKey = (parcelRequire("eB3ON"));

$d2410e1a25d3e3b4$var$bsv.PublicKey = (parcelRequire("hbQdz"));

$d2410e1a25d3e3b4$var$bsv.Script = (parcelRequire("3LdBG"));

$d2410e1a25d3e3b4$var$bsv.Transaction = (parcelRequire("67vNY"));

$d2410e1a25d3e3b4$var$bsv.ECIES = (parcelRequire("891M9"));

$d2410e1a25d3e3b4$var$bsv.HashCache = (parcelRequire("318hy"));
// dependencies, subject to change
$d2410e1a25d3e3b4$var$bsv.deps = {};

$d2410e1a25d3e3b4$var$bsv.deps.bnjs = $fxX3C$bnjs;

$d2410e1a25d3e3b4$var$bsv.deps.bs58 = $fxX3C$bs58;
$d2410e1a25d3e3b4$var$bsv.deps.Buffer = Buffer;

$d2410e1a25d3e3b4$var$bsv.deps.elliptic = $fxX3C$elliptic;

$d2410e1a25d3e3b4$var$bsv.deps._ = (parcelRequire("iUxHD"));

// Internal usage, exposed for testing/advanced tweaking
$d2410e1a25d3e3b4$var$bsv.Transaction.sighash = (parcelRequire("aTWNt"));

$d2410e1a25d3e3b4$var$bsv.Message = (parcelRequire("hVM3U"));

$d2410e1a25d3e3b4$var$bsv.Mnemonic = (parcelRequire("8a4Lk"));
var //module.exports = bsv
$d2410e1a25d3e3b4$export$2e2bcd8739ae039 = $d2410e1a25d3e3b4$var$bsv;


//# sourceMappingURL=main.js.map
