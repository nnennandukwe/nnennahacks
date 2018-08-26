// utils / string

import {
  isObject,
  isArray,
  isString,
  isNumber,
  isInteger,
  hasProperty,
} from './detection';

import {random} from './random';

const MAX_STRING = 1 << 28; // eslint-disable-line no-bitwise

const toString = (input) => {
  let s = isNumber(input) ? String(input) : input;
  if (!isString(s)) {
    throw new Error('InvalidInput: String required.');
  }
  return s;
};

export const encode = (s) => {
  let x = toString(s);
  return encodeURIComponent(x);
};

export const decode = (s) => {
  let x = toString(s);
  return decodeURIComponent(x.replace(/\+/g, ' '));
};

export const trim = (s, all = false) => {
  let x = toString(s);
  x = x.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
  if (x && all) {
    x = x.replace(/\r?\n|\r/g, ' ').replace(/\s\s+|\r/g, ' ');
  }
  return x;
};

export const truncate = (s, l) => {
  let o = toString(s);
  let t = l || 140;
  if (o.length <= t) {
    return o;
  }
  let x = o.substring(0, t);
  let a = x.split(' ');
  let b = a.length;
  let r = '';
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

export const stripTags = (s) => {
  let x = toString(s);
  return trim(x.replace(/<.*?>/gi, ' ').replace(/\s\s+/g, ' '));
};

export const escapeHTML = (s) => {
  let x = toString(s);
  return x.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const unescapeHTML = (s) => {
  let x = toString(s);
  return x.replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};

export const ucfirst = (s) => {
  let x = toString(s);
  if (x.length === 1) {
    return x.toUpperCase();
  }
  x = x.toLowerCase();
  return x.charAt(0).toUpperCase() + x.slice(1);
};

export const ucwords = (s) => {
  let x = toString(s);
  let c = x.split(' ');
  let a = [];
  c.forEach((w) => {
    a.push(ucfirst(w));
  });
  return a.join(' ');
};

export const leftPad = (s, size = 2, pad = '0') => {
  let x = toString(s);
  return x.length >= size ? x : new Array(size - x.length + 1).join(pad) + x;
};

export const rightPad = (s, size = 2, pad = '0') => {
  let x = toString(s);
  return x.length >= size ? x : x + new Array(size - x.length + 1).join(pad);
};

export const repeat = (s, m) => {
  let x = toString(s);
  if (!isInteger(m) || m < 1) {
    return x;
  }
  if (x.length * m >= MAX_STRING) {
    throw new RangeError(`Repeat count must not overflow maximum string size.`);
  }
  let a = [];
  a.length = m;
  return a.fill(x, 0, m).join('');
};

export const replaceAll = (s, a, b) => {
  let x = toString(s);

  if (isNumber(a)) {
    a = String(a);
  }
  if (isNumber(b)) {
    b = String(b);
  }

  if (isString(a) && isString(b)) {
    let aa = x.split(a);
    x = aa.join(b);
  } else if (isArray(a) && isString(b)) {
    a.forEach((v) => {
      x = replaceAll(x, v, b);
    });
  } else if (isArray(a) && isArray(b) && a.length === b.length) {
    let k = a.length;
    if (k > 0) {
      for (let i = 0; i < k; i++) {
        let aaa = a[i];
        let bb = b[i];
        x = replaceAll(x, aaa, bb);
      }
    }
  }
  return x;
};

export const stripAccent = (s) => {
  let x = toString(s);

  let map = {
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
    Y: 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
  };

  let updateS = (ai, key) => {
    x = replaceAll(x, ai, key);
  };

  for (let key in map) {
    if (hasProperty(map, key)) {
      let a = map[key].split('|');
      a.forEach((item) => {
        return updateS(item, key);
      });
    }
  }
  return x;
};

export const createId = (leng, prefix = '') => {
  let lc = 'abcdefghijklmnopqrstuvwxyz';
  let uc = lc.toUpperCase();
  let nb = '0123456789';
  let cand = [
    lc,
    uc,
    nb,
  ].join('').split('').sort(() => {
    return Math.random() > 0.5;
  }).join('');

  let t = cand.length;
  let ln = Math.max(leng || 32, prefix.length);
  let s = prefix;
  while (s.length < ln) {
    let k = random(0, t);
    s += cand.charAt(k) || '';
  }
  return s;
};

export const createAlias = (s, delimiter) => {
  let x = trim(stripAccent(s));
  let d = delimiter || '-';
  return x.toLowerCase()
    .replace(/\W+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s/g, d);
};

// Define bella.template
const compile = (tpl, data) => {
  let ns = [];
  let c = (s, ctx, namespace) => {
    if (namespace) {
      ns.push(namespace);
    }
    let a = [];
    for (let k in ctx) {
      if (hasProperty(ctx, k)) {
        let v = ctx[k];
        if (isNumber(v)) {
          v = String(v);
        }
        if (isObject(v) || isArray(v)) {
          a.push({
            key: k,
            data: v,
          });
        } else if (isString(v)) {
          v = replaceAll(v, [
            '{',
            '}',
          ], [
            '&#123;',
            '&#125;',
          ]);
          let cns = ns.concat([k]);
          let r = new RegExp('{' + cns.join('.') + '}', 'gi');
          s = s.replace(r, v);
        }
      }
    }
    if (a.length > 0) {
      a.forEach((item) => {
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

export const template = (tpl) => {
  return {
    compile: (data) => {
      return compile(tpl, data);
    },
  };
};
