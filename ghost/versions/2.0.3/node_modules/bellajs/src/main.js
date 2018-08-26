/**
 * bellajs
 * @ndaidong
**/

import {
  isObject,
  isArray,
  isDate,
  hasProperty,
} from './utils/detection';

export const curry = (fn) => {
  let totalArguments = fn.length;
  let next = (argumentLength, rest) => {
    if (argumentLength > 0) {
      return (...args) => {
        return next(argumentLength - args.length, [...rest, ...args]);
      };
    }
    return fn(...rest);
  };
  return next(totalArguments, []);
};

export const compose = (...fns) => {
  return fns.reduce((f, g) => (x) => f(g(x)));
};

export const pipe = (...fns) => {
  return fns.reduce((f, g) => (x) => g(f(x)));
};


export const clone = (val) => {
  if (isDate(val)) {
    return new Date(val.valueOf());
  }

  let copyObject = (o) => {
    let oo = Object.create({});
    for (let k in o) {
      if (hasProperty(o, k)) {
        oo[k] = clone(o[k]);
      }
    }
    return oo;
  };

  let copyArray = (a) => {
    return [...a].map((e) => {
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


export const copies = (source, dest, matched = false, excepts = []) => {
  for (let k in source) {
    if (excepts.length > 0 && excepts.includes(k)) {
      continue; // eslint-disable-line no-continue
    }
    if (!matched || matched && dest.hasOwnProperty(k)) {
      let oa = source[k];
      let ob = dest[k];
      if (isObject(ob) && isObject(oa) || isArray(ob) && isArray(oa)) {
        dest[k] = copies(oa, dest[k], matched, excepts);
      } else {
        dest[k] = clone(oa);
      }
    }
  }
  return dest;
};

export const unique = (arr = []) => {
  return [...new Set(arr)];
};

export * from './utils/detection';
export * from './utils/equals';
export * from './utils/string';
export * from './utils/random';
export * from './utils/date';
export * from './utils/md5';
