/**
 * bellajs@7.2.2
 * built on: Wed, 16 May 2018 02:37:57 GMT
 * repository: https://github.com/ndaidong/bellajs
 * maintainer: @ndaidong
 * License: MIT
**/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.bella = {})));
}(this, (function (exports) { 'use strict';
  var ob2Str = function ob2Str(val) {
    return {}.toString.call(val);
  };
  var isNull = function isNull(val) {
    return ob2Str(val) === '[object Null]';
  };
  var isUndefined = function isUndefined(val) {
    return ob2Str(val) === '[object Undefined]';
  };
  var isFunction = function isFunction(val) {
    return ob2Str(val) === '[object Function]';
  };
  var isString = function isString(val) {
    return ob2Str(val) === '[object String]';
  };
  var isNumber = function isNumber(val) {
    return ob2Str(val) === '[object Number]';
  };
  var isInteger = function isInteger(val) {
    return Number.isInteger(val);
  };
  var isArray = function isArray(val) {
    return Array.isArray(val);
  };
  var isObject = function isObject(val) {
    return ob2Str(val) === '[object Object]' && !isArray(val);
  };
  var isBoolean = function isBoolean(val) {
    return val === true || val === false;
  };
  var isDate = function isDate(val) {
    return val instanceof Date && !isNaN(val.valueOf());
  };
  var isElement = function isElement(v) {
    return ob2Str(v).match(/^\[object HTML\w*Element]$/);
  };
  var isLetter = function isLetter(val) {
    var re = /^[a-z]+$/i;
    return isString(val) && re.test(val);
  };
  var isEmail = function isEmail(val) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return isString(val) && re.test(val);
  };
  var isEmpty = function isEmpty(val) {
    return !val || isUndefined(val) || isNull(val) || isString(val) && val === '' || isArray(val) && JSON.stringify(val) === '[]' || isObject(val) && JSON.stringify(val) === '{}';
  };
  var hasProperty = function hasProperty(ob, k) {
    if (!ob || !k) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(ob, k);
  };
  var equals = function equals(a, b) {
    var re = true;
    if (isEmpty(a) && isEmpty(b)) {
      return true;
    }
    if (isDate(a) && isDate(b)) {
      return a.getTime() === b.getTime();
    }
    if (isNumber(a) && isNumber(b) || isString(a) && isString(b)) {
      return a === b;
    }
    if (isArray(a) && isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }
      if (a.length > 0) {
        for (var i = 0, l = a.length; i < l; i++) {
          if (!equals(a[i], b[i])) {
            re = false;
            break;
          }
        }
      }
    } else if (isObject(a) && isObject(b)) {
      var as = [];
      var bs = [];
      for (var k1 in a) {
        if (hasProperty(a, k1)) {
          as.push(k1);
        }
      }
      for (var k2 in b) {
        if (hasProperty(b, k2)) {
          bs.push(k2);
        }
      }
      if (as.length !== bs.length) {
        return false;
      }
      for (var k in a) {
        if (!hasProperty(b, k) || !equals(a[k], b[k])) {
          re = false;
          break;
        }
      }
    }
    return re;
  };
  var MAX_NUMBER = Number.MAX_SAFE_INTEGER;
  var random = function random(min, max) {
    if (!min || min < 0) {
      min = 0;
    }
    if (!max) {
      max = MAX_NUMBER;
    }
    if (min === max) {
      return max;
    }
    if (min > max) {
      min = Math.min(min, max);
      max = Math.max(min, max);
    }
    var offset = min;
    var range = max - min + 1;
    return Math.floor(Math.random() * range) + offset;
  };
  var MAX_STRING = 1 << 28;
  var toString = function toString(input) {
    var s = isNumber(input) ? String(input) : input;
    if (!isString(s)) {
      throw new Error('InvalidInput: String required.');
    }
    return s;
  };
  var encode = function encode(s) {
    var x = toString(s);
    return encodeURIComponent(x);
  };
  var decode = function decode(s) {
    var x = toString(s);
    return decodeURIComponent(x.replace(/\+/g, ' '));
  };
  var trim = function trim(s) {
    var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var x = toString(s);
    x = x.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    if (x && all) {
      x = x.replace(/\r?\n|\r/g, ' ').replace(/\s\s+|\r/g, ' ');
    }
    return x;
  };
  var truncate = function truncate(s, l) {
    var o = toString(s);
    var t = l || 140;
    if (o.length <= t) {
      return o;
    }
    var x = o.substring(0, t);
    var a = x.split(' ');
    var b = a.length;
    var r = '';
    if (b > 1) {
      a.pop();
      r += a.join(' ');
      if (r.length < o.length) {
        r += '...';
      }
    } else {
      x = x.substring(0, t - 3);
      r = x + '...';
    }
    return r;
  };
  var stripTags = function stripTags(s) {
    var x = toString(s);
    return trim(x.replace(/<.*?>/gi, ' ').replace(/\s\s+/g, ' '));
  };
  var escapeHTML = function escapeHTML(s) {
    var x = toString(s);
    return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var unescapeHTML = function unescapeHTML(s) {
    var x = toString(s);
    return x.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  };
  var ucfirst = function ucfirst(s) {
    var x = toString(s);
    if (x.length === 1) {
      return x.toUpperCase();
    }
    x = x.toLowerCase();
    return x.charAt(0).toUpperCase() + x.slice(1);
  };
  var ucwords = function ucwords(s) {
    var x = toString(s);
    var c = x.split(' ');
    var a = [];
    c.forEach(function (w) {
      a.push(ucfirst(w));
    });
    return a.join(' ');
  };
  var leftPad = function leftPad(s) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
    var x = toString(s);
    return x.length >= size ? x : new Array(size - x.length + 1).join(pad) + x;
  };
  var rightPad = function rightPad(s) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
    var x = toString(s);
    return x.length >= size ? x : x + new Array(size - x.length + 1).join(pad);
  };
  var repeat = function repeat(s, m) {
    var x = toString(s);
    if (!isInteger(m) || m < 1) {
      return x;
    }
    if (x.length * m >= MAX_STRING) {
      throw new RangeError('Repeat count must not overflow maximum string size.');
    }
    var a = [];
    a.length = m;
    return a.fill(x, 0, m).join('');
  };
  var replaceAll = function replaceAll(s, a, b) {
    var x = toString(s);
    if (isNumber(a)) {
      a = String(a);
    }
    if (isNumber(b)) {
      b = String(b);
    }
    if (isString(a) && isString(b)) {
      var aa = x.split(a);
      x = aa.join(b);
    } else if (isArray(a) && isString(b)) {
      a.forEach(function (v) {
        x = replaceAll(x, v, b);
      });
    } else if (isArray(a) && isArray(b) && a.length === b.length) {
      var k = a.length;
      if (k > 0) {
        for (var i = 0; i < k; i++) {
          var aaa = a[i];
          var bb = b[i];
          x = replaceAll(x, aaa, bb);
        }
      }
    }
    return x;
  };
  var stripAccent = function stripAccent(s) {
    var x = toString(s);
    var map = {
      a: 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|ä',
      A: 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|Ä',
      c: 'ç',
      C: 'Ç',
      d: 'đ',
      D: 'Đ',
      e: 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë',
      E: 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ|Ë',
      i: 'í|ì|ỉ|ĩ|ị|ï|î',
      I: 'Í|Ì|Ỉ|Ĩ|Ị|Ï|Î',
      o: 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö',
      O: 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ô|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ö',
      u: 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|û',
      U: 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Û',
      y: 'ý|ỳ|ỷ|ỹ|ỵ',
      Y: 'Ý|Ỳ|Ỷ|Ỹ|Ỵ'
    };
    var updateS = function updateS(ai, key) {
      x = replaceAll(x, ai, key);
    };
    var _loop = function _loop(key) {
      if (hasProperty(map, key)) {
        var a = map[key].split('|');
        a.forEach(function (item) {
          return updateS(item, key);
        });
      }
    };
    for (var key in map) {
      _loop(key);
    }
    return x;
  };
  var createId = function createId(leng) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var lc = 'abcdefghijklmnopqrstuvwxyz';
    var uc = lc.toUpperCase();
    var nb = '0123456789';
    var cand = [lc, uc, nb].join('').split('').sort(function () {
      return Math.random() > 0.5;
    }).join('');
    var t = cand.length;
    var ln = Math.max(leng || 32, prefix.length);
    var s = prefix;
    while (s.length < ln) {
      var k = random(0, t);
      s += cand.charAt(k) || '';
    }
    return s;
  };
  var createAlias = function createAlias(s, delimiter) {
    var x = trim(stripAccent(s));
    var d = delimiter || '-';
    return x.toLowerCase().replace(/\W+/g, ' ').replace(/\s+/g, ' ').replace(/\s/g, d);
  };
  var _compile = function _compile(tpl, data) {
    var ns = [];
    var c = function c(s, ctx, namespace) {
      if (namespace) {
        ns.push(namespace);
      }
      var a = [];
      for (var k in ctx) {
        if (hasProperty(ctx, k)) {
          var v = ctx[k];
          if (isNumber(v)) {
            v = String(v);
          }
          if (isObject(v) || isArray(v)) {
            a.push({
              key: k,
              data: v
            });
          } else if (isString(v)) {
            v = replaceAll(v, ['{', '}'], ['&#123;', '&#125;']);
            var cns = ns.concat([k]);
            var r = new RegExp('{' + cns.join('.') + '}', 'gi');
            s = s.replace(r, v);
          }
        }
      }
      if (a.length > 0) {
        a.forEach(function (item) {
          s = c(s, item.data, item.key);
        });
      }
      return trim(s, true);
    };
    if (data && (isString(data) || isObject(data) || isArray(data))) {
      return c(tpl, data);
    }
    return tpl;
  };
  var template = function template(tpl) {
    return {
      compile: function compile(data) {
        return _compile(tpl, data);
      }
    };
  };
  var PATTERN = 'D, M d, Y  h:i:s A';
  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var now = function now() {
    return new Date();
  };
  var time = function time() {
    return Date.now();
  };
  var tzone = now().getTimezoneOffset();
  var tz = function () {
    var z = Math.abs(tzone / 60);
    var sign = tzone < 0 ? '+' : '-';
    return ['GMT', sign, leftPad(z, 4)].join('');
  }();
  var _num = function _num(n) {
    return String(n < 10 ? '0' + n : n);
  };
  var _ord = function _ord(day) {
    var s = day + ' ';
    var x = s.charAt(s.length - 2);
    if (x === '1') {
      s = 'st';
    } else if (x === '2') {
      s = 'nd';
    } else if (x === '3') {
      s = 'rd';
    } else {
      s = 'th';
    }
    return s;
  };
  var format = function format(input) {
    var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PATTERN;
    var d = isDate(input) ? input : new Date(input);
    if (!isDate(d)) {
      throw new Error('InvalidInput: Number or Date required.');
    }
    if (!isString(output)) {
      throw new Error('Invalid output pattern.');
    }
    var vchar = /\.*\\?([a-z])/gi;
    var meridiem = output.match(/(\.*)a{1}(\.*)*/i);
    var wn = WEEKDAYS;
    var mn = MONTHS;
    var f = {
      Y: function Y() {
        return d.getFullYear();
      },
      y: function y() {
        return (f.Y() + '').slice(-2);
      },
      F: function F() {
        return mn[f.n() - 1];
      },
      M: function M() {
        return (f.F() + '').slice(0, 3);
      },
      m: function m() {
        return _num(f.n());
      },
      n: function n() {
        return d.getMonth() + 1;
      },
      S: function S() {
        return _ord(f.j());
      },
      j: function j() {
        return d.getDate();
      },
      d: function d() {
        return _num(f.j());
      },
      t: function t() {
        return new Date(f.Y(), f.n(), 0).getDate();
      },
      w: function w() {
        return d.getDay();
      },
      l: function l() {
        return wn[f.w()];
      },
      D: function D() {
        return (f.l() + '').slice(0, 3);
      },
      G: function G() {
        return d.getHours();
      },
      g: function g() {
        return f.G() % 12 || 12;
      },
      h: function h() {
        return _num(meridiem ? f.g() : f.G());
      },
      i: function i() {
        return _num(d.getMinutes());
      },
      s: function s() {
        return _num(d.getSeconds());
      },
      a: function a() {
        return f.G() > 11 ? 'pm' : 'am';
      },
      A: function A() {
        return f.a().toUpperCase();
      },
      O: function O() {
        return tz;
      }
    };
    var _term = function _term(t, s) {
      return f[t] ? f[t]() : s;
    };
    return output.replace(vchar, _term);
  };
  var relativize = function relativize() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : time();
    var d = isDate(input) ? input : new Date(input);
    if (!isDate(d)) {
      throw new Error('InvalidInput: Number or Date required.');
    }
    var delta = now() - d;
    var nowThreshold = parseInt(d, 10);
    if (isNaN(nowThreshold)) {
      nowThreshold = 0;
    }
    if (delta <= nowThreshold) {
      return 'Just now';
    }
    var units = null;
    var conversions = {
      millisecond: 1,
      second: 1000,
      minute: 60,
      hour: 60,
      day: 24,
      month: 30,
      year: 12
    };
    for (var key in conversions) {
      if (delta < conversions[key]) {
        break;
      } else {
        units = key;
        delta /= conversions[key];
      }
    }
    delta = Math.floor(delta);
    if (delta !== 1) {
      units += 's';
    }
    return [delta, units].join(' ') + ' ago';
  };
  var utc = function utc() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : time();
    var d = isDate(input) ? input : new Date(input);
    if (!isDate(d)) {
      throw new Error('InvalidInput: Number or Date required.');
    }
    var dMinutes = d.getMinutes();
    var dClone = new Date(d);
    dClone.setMinutes(dMinutes + tzone);
    return format(dClone, 'D, j M Y h:i:s') + ' GMT+0000';
  };
  var local = function local() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : time();
    var d = isDate(input) ? input : new Date(input);
    if (!isDate(d)) {
      throw new Error('InvalidInput: Number or Date required.');
    }
    return format(d, 'D, j M Y h:i:s O');
  };
  var md5 = function md5(str) {
    var k = [],
        i = 0;
    for (; i < 64;) {
      k[i] = 0 | Math.abs(Math.sin(++i)) * 4294967296;
    }
    var b,
        c,
        d,
        j,
        x = [],
        str2 = unescape(encodeURI(str)),
        a = str2.length,
        h = [b = 1732584193, c = -271733879, ~b, ~c],
        i = 0;
    for (; i <= a;) {
      x[i >> 2] |= (str2.charCodeAt(i) || 128) << 8 * (i++ % 4);
    }x[str = (a + 8 >> 6) * 16 + 14] = a * 8;
    i = 0;
    for (; i < str; i += 16) {
      a = h;j = 0;
      for (; j < 64;) {
        a = [d = a[3], (b = a[1] | 0) + ((d = a[0] + [b & (c = a[2]) | ~b & d, d & b | ~d & c, b ^ c ^ d, c ^ (b | ~d)][a = j >> 4] + (k[j] + (x[[j, 5 * j + 1, 3 * j + 5, 7 * j][a] % 16 + i] | 0))) << (a = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * a + j++ % 4]) | d >>> 32 - a), b, c];
      }
      for (j = 4; j;) {
        h[--j] = h[j] + a[j];
      }
    }
    str = '';
    for (; j < 32;) {
      str += (h[j >> 3] >> (1 ^ j++ & 7) * 4 & 15).toString(16);
    }return str;
  };
  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
      return arr2;
    } else {
      return Array.from(arr);
    }
  };
  var curry = function curry(fn) {
    var totalArguments = fn.length;
    var next = function next(argumentLength, rest) {
      if (argumentLength > 0) {
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return next(argumentLength - args.length, [].concat(toConsumableArray(rest), args));
        };
      }
      return fn.apply(undefined, toConsumableArray(rest));
    };
    return next(totalArguments, []);
  };
  var compose = function compose() {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }
    return fns.reduce(function (f, g) {
      return function (x) {
        return f(g(x));
      };
    });
  };
  var pipe = function pipe() {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fns[_key3] = arguments[_key3];
    }
    return fns.reduce(function (f, g) {
      return function (x) {
        return g(f(x));
      };
    });
  };
  var clone = function clone(val) {
    if (isDate(val)) {
      return new Date(val.valueOf());
    }
    var copyObject = function copyObject(o) {
      var oo = Object.create({});
      for (var k in o) {
        if (hasProperty(o, k)) {
          oo[k] = clone(o[k]);
        }
      }
      return oo;
    };
    var copyArray = function copyArray(a) {
      return [].concat(toConsumableArray(a)).map(function (e) {
        if (isArray(e)) {
          return copyArray(e);
        } else if (isObject(e)) {
          return copyObject(e);
        }
        return clone(e);
      });
    };
    if (isArray(val)) {
      return copyArray(val);
    }
    if (isObject(val)) {
      return copyObject(val);
    }
    return val;
  };
  var copies = function copies(source, dest) {
    var matched = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var excepts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    for (var k in source) {
      if (excepts.length > 0 && excepts.includes(k)) {
        continue;
      }
      if (!matched || matched && dest.hasOwnProperty(k)) {
        var oa = source[k];
        var ob = dest[k];
        if (isObject(ob) && isObject(oa) || isArray(ob) && isArray(oa)) {
          dest[k] = copies(oa, dest[k], matched, excepts);
        } else {
          dest[k] = clone(oa);
        }
      }
    }
    return dest;
  };
  var unique = function unique() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return [].concat(toConsumableArray(new Set(arr)));
  };
  exports.curry = curry;
  exports.compose = compose;
  exports.pipe = pipe;
  exports.clone = clone;
  exports.copies = copies;
  exports.unique = unique;
  exports.isNull = isNull;
  exports.isUndefined = isUndefined;
  exports.isFunction = isFunction;
  exports.isString = isString;
  exports.isNumber = isNumber;
  exports.isInteger = isInteger;
  exports.isArray = isArray;
  exports.isObject = isObject;
  exports.isBoolean = isBoolean;
  exports.isDate = isDate;
  exports.isElement = isElement;
  exports.isLetter = isLetter;
  exports.isEmail = isEmail;
  exports.isEmpty = isEmpty;
  exports.hasProperty = hasProperty;
  exports.equals = equals;
  exports.encode = encode;
  exports.decode = decode;
  exports.trim = trim;
  exports.truncate = truncate;
  exports.stripTags = stripTags;
  exports.escapeHTML = escapeHTML;
  exports.unescapeHTML = unescapeHTML;
  exports.ucfirst = ucfirst;
  exports.ucwords = ucwords;
  exports.leftPad = leftPad;
  exports.rightPad = rightPad;
  exports.repeat = repeat;
  exports.replaceAll = replaceAll;
  exports.stripAccent = stripAccent;
  exports.createId = createId;
  exports.createAlias = createAlias;
  exports.template = template;
  exports.random = random;
  exports.now = now;
  exports.time = time;
  exports.format = format;
  exports.relativize = relativize;
  exports.utc = utc;
  exports.local = local;
  exports.md5 = md5;
  Object.defineProperty(exports, '__esModule', { value: true });
})));
